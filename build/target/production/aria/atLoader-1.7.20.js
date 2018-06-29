/*
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
!function(){for(var r=Aria.$window.document,t=function(){if("loading"==r.readyState||"interactive"==r.readyState){var t=r.getElementsByTagName("script");return t[t.length-1]}},e=r.currentScript||t(),a=Aria.eval("return "+aria.utils.String.trim(e.innerHTML)),i={},n=0,c=a.length;c>n;n++){var o=aria.core.DownloadMgr.resolveURL(a[n]);i[o]!==!0&&(r.write('<script type="text/javascript" src="'+o+'"></script>'),i[o]=!0)}}();