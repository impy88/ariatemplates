/*
 * Aria Templates 1.7.20 - 29 Jun 2018
 *
 * Copyright 2009-2018 Amadeus s.a.s.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Aria = require("../Aria");
var ariaUtilsJsonJsonSerializer = require("../utils/json/JsonSerializer");
var ariaCoreBrowser = require("../core/Browser");
var ariaStorageIStorage = require("./IStorage");
var ariaStorageAbstractStorage = require("./AbstractStorage");


(function () {
    var storage, privateSerializer, allKeyMap = {}, _UNIQUE_ID = 4;

    /**
     * IE throws an error when you try to set an attribute with invalid characters such as an empty space, $ % and
     * others, or even if it starts with a number. For this reason we generate a new safe key and keep a map of the
     * association between the original key and the generated one. This map is stored in user data as well, in order to
     * be reused when you close and reopen the tab. <br />
     * <br />
     * Get all the keys in the map
     * @return {Object} a map of user key - generated key
     */
    function getAllKeys () {
        if (!privateSerializer) {
            privateSerializer = new ariaUtilsJsonJsonSerializer(true);
        }

        var storedMap = storage.getAttribute("kMap");
        return storedMap ? privateSerializer.parse(storedMap) : {};
    }

    /**
     * Store the newly generated key in the map of keys
     * @type {String} generated Key generated by the framework, safe to be used with setAttribute. If null, removes the
     * original key from the map
     * @type {String} original User defined key, it might contain unsafe characters
     */
    function setMappedKey (generated, original) {
        if (generated) {
            allKeyMap[original] = generated;
        } else {
            delete allKeyMap[original];
        }

        storage.setAttribute("kMap", privateSerializer.serialize(allKeyMap));
        storage.save("JSONPersist");
    }

    /**
     * Return the generated key corresponding to the user defined key, and optionally creates one if missing.
     * @param {String} key User defined key
     * @param {Boolean} create create it if missing, default false
     * @return {String} framework generated key
     */
    function getMappedKey (key, create) {
        allKeyMap = getAllKeys();

        if (create && !(key in allKeyMap)) {
            var newKey = ("uD" + _UNIQUE_ID++);
            setMappedKey(newKey, key);

            return newKey;
        } else {
            return allKeyMap[key];
        }
    }

    /**
     * Define the API to interact with userData, the IE implementation of localStorage. This class should only be used
     * in IE7 as a fallback for localStorage.<br />
     * This class is used transparently by aria.storage.LocalStorage so you don't need to create an instance of it
     * unless you know what you're doing.
     */
    module.exports = Aria.classDefinition({
        $classpath : "aria.storage.UserData",
        $implements : [ariaStorageIStorage],
        $extends : ariaStorageAbstractStorage,
        $onload : function () {
            if (ariaCoreBrowser.isOldIE) {
                try {
                    var form = Aria.$frameworkWindow.document.createElement("form");
                    form.innerHTML = "<input type='hidden' id='__aria_storage_UserData__' style='behavior:url(#default#userData)'>";

                    Aria.$frameworkWindow.document.body.appendChild(form);

                    storage = form.firstChild;
                    storage.load("JSONPersist");
                    getAllKeys();
                } catch (ex) {
                    // This IE browser doesn't support userData, too bad!
                }
            }
        },
        $onunload : function () {
            if (ariaCoreBrowser.isOldIE) {
                if (storage) {
                    storage.parentNode.removeChild(storage);
                }

                storage = null;
            }

            if (privateSerializer) {
                privateSerializer.$dispose();
            }
            privateSerializer = null;

        },
        $prototype : {
            /**
             * Internal method to get the current value associated with the given key. If the given key does not exist
             * in the list associated with the object then this method returns null.
             * @param {String} key identifier of a value
             * @return {String} Value stored as is
             */
            _get : function (key) {
                var mappedKey = getMappedKey(key);
                return mappedKey ? storage.getAttribute(mappedKey) : null;
            },

            /**
             * Internal method to Add a key/value pair in the list.
             * @param {String} key identifier of a value
             * @param {String} value value to be stored after serialization
             */
            _set : function (key, value) {
                var mappedKey = getMappedKey(key, true);

                storage.setAttribute(mappedKey, value);
                storage.save("JSONPersist");
            },

            /**
             * Internal method to remove the value associated to key from the list.
             * @param {String} key identifier of the value to be removed
             */
            _remove : function (key) {
                storage.removeAttribute(getMappedKey(key));
                setMappedKey(null, key);
                storage.save("JSONPersist");
            },

            /**
             * Internal methof to empty the list of all key/value pairs, if any.
             */
            _clear : function () {
                var keys = getAllKeys();

                allKeyMap = {};
                storage.removeAttribute("kMap");

                for (var key in keys) {
                    if (keys.hasOwnProperty(key)) {
                        storage.removeAttribute(keys[key]);
                    }
                }
                storage.save("JSONPersist");
            }
        }
    });
})();
