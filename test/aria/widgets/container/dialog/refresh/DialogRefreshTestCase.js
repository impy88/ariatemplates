/*
 * Copyright 2012 Amadeus s.a.s.
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

Aria.classDefinition({
    $classpath : "test.aria.widgets.container.dialog.refresh.DialogRefreshTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies: ["aria.utils.Json"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.data = {
            mymacro: {
                name: "dialogContent"
            },
            counter: 1
        };
        this.setTestEnv({
            template : "test.aria.widgets.container.dialog.refresh.DialogRefresh",
            data : this.data
        });
    },
    $prototype : {
        runTemplateTest : function () {
            aria.utils.Json.setValue(this.data, "counter", 2);
            this.templateCtxt.$refresh();
            this.assertEquals(this.testDocument.getElementById("counter").innerHTML, "2", "The counter inside the template should be %2 instead of %1");

            this.end();
        }
    }
});
