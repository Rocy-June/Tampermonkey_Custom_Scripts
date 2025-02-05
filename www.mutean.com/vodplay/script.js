// ==UserScript==
// @name         MuteFun 增加网页全屏按钮
// @namespace    http://tampermonkey.net/
// @version      25.02.05.02
// @description  try to take over the world!
// @author       Rocy
// @match        https://www.mutean.com/vodplay/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mutean.com
// @grant        none
// ==/UserScript==

(async function () {
  "use strict";

  const log = (...args) => {
    console.log("[MuteFun Patch]", ...args);
  };

  const is_iterable = (obj) => {
    return obj != null && typeof obj[Symbol.iterator] === "function";
  };

  const cl = (tag, class_name, content) => {
    let el = document.createElement(tag);

    cl_set_attr(el, class_name, content);

    return el;
  };

  const cl_ns = (ns, tag, class_name, content) => {
    let el = document.createElementNS(ns, tag);

    cl_set_attr(el, class_name, content);

    return el;
  };

  const cl_set_attr = (el, class_name, content) => {
    if (class_name) {
      el.className = class_name;
    }
    if (content) {
      if (is_iterable(content)) {
        for (let obj of content) {
          el.appendChild(obj);
        }
      } else {
        el.appendChild(content);
      }
    }

    return el;
  };

  const find_player_iframe = async () => {
    let playleft_iframe_promise = new Promise((resolve, reject) => {
      let interval = setInterval(() => {
        log("Detecting playleft iframe...");

        let playleft_iframe = document.querySelector("#playleft > iframe");
        if (playleft_iframe) {
          log("Playleft iframe found!");

          clearInterval(interval);
          resolve(playleft_iframe);
        }
      }, 250);
    });

    return playleft_iframe_promise;
  };

  const find_player_pip_button = async (iframe) => {
    let playleft_iframe_promise = new Promise((resolve, reject) => {
      let interval = setInterval(() => {
        log("Detecting pip button...");

        let pip_button = iframe.contentDocument.querySelector(
          ".yzmplayer-icon.yzmplayer-full-in-icon"
        );
        if (pip_button) {
          log("Pip button found!");

          clearInterval(interval);
          resolve(pip_button);
        }
      }, 250);
    });

    return playleft_iframe_promise;
  };

  log("Start patching...");

  let outter_body = document.body;
  let header = document.querySelector("div.header");

  let player_iframe = await find_player_iframe();
  let pip_button = await find_player_pip_button(player_iframe);

  let svg_ns = "http://www.w3.org/2000/svg";
  let path = cl_ns(svg_ns, "path");
  path.setAttribute(
    "d",
    "m0 204.8C0 81.92 81.92 0 204.8 0h614.4c122.88 0 204.8 81.92 204.8 204.8v512c0 122.88-81.92 204.8-204.8 204.8H204.8C81.92 921.6 0 839.68 0 716.8zm266.24-102.4c-122.88 0-163.84 40.96-163.84 163.84a20.48 20.48 90 0061.44 0c0-81.92 20.48-102.4 102.4-102.4a20.48 20.48 90 000-61.44zm491.52 0a20.48 20.48 90 000 61.44c81.92 0 102.4 20.48 102.4 102.4a20.48 20.48 90 0061.44 0c0-122.88-40.96-163.84-163.84-163.84zm163.84 552.96a20.48 20.48 90 00-61.44 0c0 81.92-20.48 102.4-102.4 102.4a20.48 20.48 90 000 61.44c122.88 0 163.84-40.96 163.84-163.84zM163.84 675.84a20.48 20.48 90 00-61.44 0c0 102.4 40.96 143.36 163.84 143.36a20.48 20.48 90 000-61.44c-81.92 0-102.4-20.48-102.4-81.92z"
  );
  let svg = cl_ns(svg_ns, "svg", null, path);
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("viewBox", "0 0 1024 1024");

  let full_screen_in_browser_button = cl(
    "button",
    "yzmplayer-icon yzmplayer-full-brs-icon",
    cl("span", "yzmplayer-icon-content", svg)
  );
  full_screen_in_browser_button.setAttribute("data-balloon", "网页全屏");
  full_screen_in_browser_button.setAttribute("data-balloon-pos", "up");

  full_screen_in_browser_button.addEventListener("click", () => {
    let is_fullscreen = player_iframe.getAttribute("bs-fullscreen");
    if (is_fullscreen === "true") {
      player_iframe.removeAttribute("bs-fullscreen");
      player_iframe.style.position = "";
      player_iframe.style.top = "";
      player_iframe.style.left = "";
      player_iframe.style.width = "";
      player_iframe.style.height = "";
      player_iframe.style.zIndex = "";

      outter_body.style.overflow = "";
      header.style.display = "";
    } else {
      player_iframe.setAttribute("bs-fullscreen", "true");
      player_iframe.style.position = "fixed";
      player_iframe.style.top = "0";
      player_iframe.style.left = "0";
      player_iframe.style.width = "100%";
      player_iframe.style.height = "100%";
      player_iframe.style.zIndex = "9999";

      outter_body.style.overflow = "hidden";
      header.style.display = "none";
    }
  });

  pip_button.after(full_screen_in_browser_button);
})();
