// ==UserScript==
// @name         FengCheDMP Patch
// @namespace    http://tampermonkey.net/
// @version      25.02.07.01
// @description  try to take over the world!
// @author       Rocy
// @match        https://fengchedmp.com/index.php/vod/play/id/*
// @match        https://basket.fengchedmp.com/player/ec.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fengchedmp.com
// @grant        none
// ==/UserScript==

(async function () {
  "use strict";

  const log = console.log.bind(console, "[FengCheDMP Patch]");

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

  const find_player_pip_button = async () => {
    return new Promise((resolve, reject) => {
      let interval = setInterval(() => {
        log("Detecting pip button...");

        let pip_button = document.querySelector(
          ".plyr__controls__item.plyr__control[data-plyr=pip]"
        );
        if (pip_button) {
          log("Pip button found!");

          clearInterval(interval);
          resolve(pip_button);
        }
      }, 250);
    });
  };

  const find_player = async () => {
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

  const iframe_main = async () => {
    log("Patching in iframe...");

    log("Full screen in browser button patching...");

    let pip_button = await find_player_pip_button();

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
      "plyr__controls__item plyr__control",
      cl("span", "yzmplayer-icon-content", svg)
    );
    full_screen_in_browser_button.setAttribute("type", "button");
    full_screen_in_browser_button.setAttribute("data-plyr", "fullscreen");
    full_screen_in_browser_button.setAttribute("aria-pressed", "false");

    full_screen_in_browser_button.addEventListener("click", () => {
      window.top.postMessage("bwsr-fscr", "https://fengchedmp.com");
    });

    pip_button.after(full_screen_in_browser_button);

    log("Full screen in browser button patching done.");

    log("Patching in iframe done.");
  };

  let is_fullscreen = false;

  const message_events = {
    "bwsr-fscr": (event) => {
      let outter_body = document.body;
      let player_iframe = document.querySelector("#playleft > iframe");
      let player_side = document.querySelector(".module-player-side");
      let header = document.querySelector(".header");
      let fixed_group = document.querySelector(".fixedGroup");

      if (is_fullscreen) {
        player_iframe.style.position = "";
        player_iframe.style.top = "";
        player_iframe.style.left = "";
        player_iframe.style.width = "";
        player_iframe.style.height = "";
        player_iframe.style.zIndex = "";

        outter_body.style.overflow = "";

        player_side.style.display = "";

        header.style.display = "";

        fixed_group.style.display = "";
      } else {
        player_iframe.style.position = "fixed";
        player_iframe.style.top = "0";
        player_iframe.style.left = "0";
        player_iframe.style.width = "100%";
        player_iframe.style.height = "100%";
        player_iframe.style.zIndex = "9999";

        outter_body.style.overflow = "hidden";

        player_side.style.display = "none";

        header.style.display = "none";

        fixed_group.style.display = "none";
      }

      is_fullscreen = !is_fullscreen;
    },
  };

  const page_main = async () => {
    log("Patching in main page...");

    log("Regist message event listener...");

    window.addEventListener("message", (event) => {
      log("Message event received:", event.data);

      let event_handler = message_events[event.data];
      if (!event_handler) {
        log(`Unknown event: ${event.data}`);
        return;
      }

      log("Routing event.");

      event_handler(event);
    });

    log("Regist message event listener done.");

    log("Patching in main page done.");
  };

  log("Start patching...");

  log("Detecting is in iframe...");

  if (window.self !== window.top) {
    log("In iframe, patching...");

    iframe_main();
  } else {
    log("In main page, patching...");

    page_main();
  }

  log("Patching done.");
})();
