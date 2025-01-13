// ==UserScript==
// @name         SVG path editor customize patch
// @namespace    http://tampermonkey.net/
// @version      24.11.26.01
// @description  customize patch
// @author       Rocy
// @match        https://yqnn.github.io/svg-path-editor/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  document.body.style = 'user-select: none';

  let first_title = document.querySelector('div.title');
  let first_title_style = first_title.style;
  first_title_style.position = 'absolute';
  first_title_style.width = 'calc(100% - 16px)';
  first_title_style.zIndex = 999;

  let path_editor = first_title.nextElementSibling;
  let path_editor_style = path_editor.style;
  path_editor_style.paddingTop = '28px';
})();