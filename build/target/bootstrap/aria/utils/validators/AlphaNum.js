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
var Aria = require("../../Aria");
var ariaUtilsValidatorsRegExp = require("./RegExp");


/**
 * Validates Alpha Numeric characters only.
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.utils.validators.AlphaNum",
    $extends : ariaUtilsValidatorsRegExp,
    $constructor : function (message) {
        this.$RegExp.constructor.call(this, this.ALPHANUM_REGEXP, message);
    },
    $statics : {
        ALPHANUM_REGEXP : /^[A-Za-z0-9]+$/,
        DEFAULT_LOCALIZED_MESSAGE : "Invalid ALPHANUM string."
    },
    $prototype : {}
});
