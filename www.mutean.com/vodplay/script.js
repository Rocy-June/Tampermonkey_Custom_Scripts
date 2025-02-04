// ==UserScript==
// @name         MuteFun 增加网页全屏按钮
// @namespace    http://tampermonkey.net/
// @version      25.02.05.01
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
    "M0 307.2C0 184.32 81.92 102.4 204.8 102.4h614.4c122.88 0 204.8 81.92 204.8 204.8v307.2c0 122.88-81.92 204.8-204.8 204.8H204.8C81.92 819.2 0 737.28 0 593.92zM204.8 163.84c-81.92 0-143.36 61.44-143.36 143.36a20.48 20.48 90 0040.96 0c0-61.44 40.96-102.4 102.4-102.4a20.48 20.48 90 000-40.96zm614.4 0a20.48 20.48 90 000 40.96c61.44 0 102.4 40.96 102.4 102.4a20.48 20.48 90 0040.96 0c0-81.92-61.44-143.36-143.36-143.36zm143.36 450.56a20.48 20.48 90 00-40.96 0c0 61.44-40.96 102.4-102.4 102.4a20.48 20.48 90 000 40.96c81.92 0 143.36-61.44 143.36-143.36zM102.4 593.92a20.48 20.48 90 00-40.96 0c0 81.92 61.44 163.84 143.36 163.84a20.48 20.48 90 000-40.96c-61.44 0-102.4-61.44-102.4-122.88z"
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
