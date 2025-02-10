// ==UserScript==
// @name         MuteFun Patch
// @namespace    http://tampermonkey.net/
// @version      25.02.10.01
// @description  try to take over the world!
// @author       Rocy
// @match        https://www.mutean.com/vodplay/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mutean.com
// @grant        none
// ==/UserScript==

(async function () {
  "use strict";

  const log = console.log.bind(console, "[MuteFun Patch]");

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
    return new Promise((resolve, reject) => {
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
  };

  const find_player_pip_button = async (iframe) => {
    return new Promise((resolve, reject) => {
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
  };

  const find_player = async (iframe) => {
    return new Promise((resolve, reject) => {
      let interval = setInterval(() => {
        log("Detecting player...");

        let player = iframe.contentDocument.querySelector("#player");
        if (player) {
          log("Player found!");

          clearInterval(interval);
          resolve(player);
        }
      }, 250);
    });
  };

  const find_danmaku_bar_wrap = async (iframe) => {
    return new Promise((resolve, reject) => {
      let interval = setInterval(() => {
        log("Detecting danmaku bar wrap...");

        let danmaku_bar_wrap = iframe.contentDocument.querySelector(
          ".yzmplayer-danmaku-bar-wrap"
        );
        if (danmaku_bar_wrap) {
          log("Danmaku bar wrap found!");

          clearInterval(interval);
          resolve(danmaku_bar_wrap);
        }
      }, 250);
    });
  };

  log("Start patching...");

  let outter_body = document.body;
  let header = document.querySelector("div.header");

  let player_iframe = await find_player_iframe();

  log("Full screen in browser button patching...");

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

  log("Full screen in browser button patching done.");

  log("Hide UI when mouse leave the video player patching...");

  let player = await find_player(player_iframe);

  player.addEventListener("mouseleave", () => {
    log("Mouse leave the video player...");

    if (player.classList.contains("yzmplayer-playing")) {
      log("Hide UI...");

      player.classList.add("yzmplayer-hide-controller");
    }
  });

  log("Hide UI when mouse leave the video player patching done.");

  log("Danmaku opacity memory function patching...");

  let danmaku_opacity = localStorage.getItem("danmaku_opacity");
  if (!danmaku_opacity) {
    danmaku_opacity = 1;
    localStorage.setItem("danmaku_opacity", danmaku_opacity);
  }

  let yzmplayer_danmaku_bar_wrap = await find_danmaku_bar_wrap(player_iframe);
  let yzmplayer_danmaku_bar = yzmplayer_danmaku_bar_wrap.querySelector(
    ".yzmplayer-danmaku-bar"
  );
  let yzmplayer_danmaku_bar_inner = yzmplayer_danmaku_bar.querySelector(
    ".yzmplayer-danmaku-bar-inner"
  );

  const bar_width = 130;
  let offset_left = ((ele) => {
    var res = 0;
    var e = ele;
    while (true) {
      res += e.offsetLeft;

      if (e.offsetParent == e || !e.offsetParent) break;

      e = e.offsetParent;
    }

    return res;
  })(yzmplayer_danmaku_bar);

  let slide_bar_mouse_down_event = new MouseEvent("mousedown");
  let document_mouse_move_event = new MouseEvent("mousemove", {
    clientX: offset_left + bar_width * danmaku_opacity,
    clientY: 0,
    buttons: 1,
  });
  let document_mouse_up_event = new MouseEvent("mouseup");

  yzmplayer_danmaku_bar_wrap.dispatchEvent(slide_bar_mouse_down_event);
  player_iframe.contentDocument.dispatchEvent(document_mouse_move_event);
  player_iframe.contentDocument.dispatchEvent(document_mouse_up_event);

  window.addEventListener("beforeunload", () => {
    let width_persent_text = yzmplayer_danmaku_bar_inner.style.width;
    let width_number = parseInt(width_persent_text.replace("%", "")) / 100;
    localStorage.setItem("danmaku_opacity", width_number);
  });

  log("Danmaku opacity memory function patching done.");

  log("Patching done.");
})();
