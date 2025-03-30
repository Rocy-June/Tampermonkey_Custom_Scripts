// ==UserScript==
// @name         Google Translate Customize
// @namespace    http://tampermonkey.net/
// @version      25.03.30.02
// @description  try to take over the world!
// @author       Rocy
// @match        https://translate.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=translate.google.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  let settings = JSON.parse(localStorage.getItem("settings"));
  if (!settings) {
    settings = {
      fixes: [],
    };
  }

  const source_language_list_box = document.querySelector(
    ".X4DQ0.zWsGpc[jsname=HexNre] .VfPpkd-AznF2e-LUERP-bN97Pc"
  );
  const target_language_list_box = document.querySelector(
    ".X4DQ0.zWsGpc[jsname=ji7Qmb] .VfPpkd-AznF2e-LUERP-bN97Pc"
  );
  const source_language_menu_box = document.querySelector(".OoYv6d");
  const target_language_menu_box = document.querySelector(".ykTHSe");

  const fixed_source_language_list_box = cE(
    "span",
    "VfPpkd-AznF2e-LUERP-bN97Pc",
    {
      jsslot: "",
      jsname: "bN97Pc",
      jsaction: "transitionend:e204de",
    }
  );
  const fixed_target_language_list_box = cE(
    "span",
    "VfPpkd-AznF2e-LUERP-bN97Pc",
    {
      jsslot: "",
      jsname: "bN97Pc",
      jsaction: "transitionend:e204de",
    }
  );

  rebuildFixedLanguageListBox();

  const source_language_box = cE(
    "div",
    "akczyd",
    null,
    cE("div", "X4DQ0 zWsGpc", { jscontroller: "eYJrS", jsname: "HexNre" }, [
      cE("div", "vLsFwd bX0Okd", {
        jsaction: "mouseover:WqKXCe; mouseout:TV5qR",
        jsname: "Av8Jb",
      }),
      cE(
        "div",
        "VfPpkd-AznF2e-ZMv3u",
        {
          jscontroller: "JWUKXe",
          jsaction:
            "wheel:PNXF5; touchstart:PNXF5; pointerdown:PNXF5; mousedown:PNXF5; keydown:PNXF5;",
          jsname: "mAKh3e",
          jsshadow: "",
        },
        cE(
          "div",
          "VfPpkd-AznF2e-LUERP-vJ7A6b VfPpkd-AznF2e-LUERP-vJ7A6b-OWXEXe-XuHpsb",
          { jsname: "vJ7A6b", jsaction: "c0v8t:Y3U6Wb;" },
          fixed_source_language_list_box
        )
      ),
      cE("div", "vLsFwd lyY31c", {
        jsaction: "mouseover:PyaJWe; mouseout:TV5qR",
        jsname: "KfHw0e",
      }),
    ])
  );
  const target_language_box = cE(
    "div",
    "akczyd",
    null,
    cE("div", "X4DQ0 zWsGpc", { jscontroller: "eYJrS", jsname: "ji7Qmb" }, [
      cE("div", "vLsFwd bX0Okd", {
        jsaction: "mouseover:WqKXCe; mouseout:TV5qR",
        jsname: "Av8Jb",
      }),
      cE(
        "div",
        "VfPpkd-AznF2e-ZMv3u",
        {
          jscontroller: "JWUKXe",
          jsaction:
            "wheel:PNXF5; touchstart:PNXF5; pointerdown:PNXF5; mousedown:PNXF5; keydown:PNXF5;",
          jsname: "mAKh3e",
          jsshadow: "",
        },
        cE(
          "div",
          "VfPpkd-AznF2e-LUERP-vJ7A6b VfPpkd-AznF2e-LUERP-vJ7A6b-OWXEXe-XuHpsb",
          { jsname: "vJ7A6b", jsaction: "c0v8t:Y3U6Wb;" },
          fixed_target_language_list_box
        )
      ),
      cE("div", "vLsFwd lyY31c", {
        jsaction: "mouseover:PyaJWe; mouseout:TV5qR",
        jsname: "KfHw0e",
      }),
    ])
  );

  const fixed_language_box = cE(
    "c-wiz",
    "EO28P",
    {
      jsrenderer: "chbWbf",
      jsshadow: "",
      jsdata: "deferred-i10",
      jscontroller: "NLiBIf",
      jsaction:
        "JIbuQc:lgRbif(dnDxad),CkqFq(dnDxad),D8nsr(HexNre),a9yn8b(ji7Qmb),hoB8ef(RCbdJd),PaRmVc(zumM6d);XQ5zsd:yyhDqb,BZpGNb;Em1SXd:ZsO99c,WhA7I;fgP5ge:MFAZs,WL1EGc;PAwimb:Ko7IYc,WL1EGc;dt3Dve:ojEuHd;PHj7Kc:zx3bk,syoa3e,BWttpe;M6QLNc:SedMud,Fy2mfd;mBCIUc:DS5I2;J4Vige:FXtNGc;nGFN1c:OlxlGc;NXKuXb:KfUz5b;wwqcne:wa5ZYc;lUHUO:byY0wd;J7oolf:sCICAe;NmrBO:Czpf3b;XHRxGb:V05N8d;ZyeGg:Ssf3Vd;qE2zJe:AwTVHe,WL1EGc;u5p2od:zx3bk,WL1EGc;iIhkuc:y0XCP,tTBuP,WL1EGc;vUjcQd:y0XCP;CHo1gd:FHAVTe;Abc11:iGfNWd,b7eqz;",
      "data-node-index": "1;0",
      jsmodel: "hc6Ubd kRSUXd;",
      "c-wiz": "",
    },
    [source_language_box, target_language_box]
  );

  const language_box = document.querySelector("c-wiz.EO28P");
  language_box.before(fixed_language_box);

  const observer = new MutationObserver(() => {
    resetDblclickEvent();
  });
  observer.observe(language_box, { childList: true, subtree: true });

  function cE(tag, _class, attr, html) {
    let element = document.createElement(tag);
    if (_class) {
      element.className = _class;
    }
    if (html) {
      if (typeof html === "object" && !(html instanceof Node)) {
        for (let html_element of html) {
          insertHtml(element, html_element);
        }
      } else {
        insertHtml(element, html);
      }
    }
    if (attr) {
      for (let key in attr) {
        if (key.indexOf(".") > 0) {
          const keys = key.split(".");
          let attr_obj = element;
          for (let sub_key of keys) {
            attr_obj = attr_obj[sub_key];
          }

          attr_obj = attr[key];
        } else {
          try {
            element.setAttribute(key, attr[key]);
          } catch (error) {
            console.log(element);
          }
        }
      }
    }

    return element;
  }

  function insertHtml(element, html) {
    if (html instanceof Node) element.appendChild(html);
    else if (typeof html === "string") element.innerText = html;
    else element.innerHTML = html;
  }

  function createLanguageButton(lang_text, lang_code) {
    return cE(
      "button",
      "VfPpkd-AznF2e VfPpkd-AznF2e-OWXEXe-jJNx8e-QBLLGd JJYS0b V0XHEd Ose4Jf LxQvde",
      {
        role: "tab",
        "aria-selected": "false",
        tabindex: "-1",
        jscontroller: "t1sulf",
        jsaction:
          "mouseenter:tfO1Yc; mouseleave:JywGue; touchmove:FwuNnf; touchend:yfqBxc; touchcancel:JMtRjd; focus:AHmuwe; blur:O22p3e;",
        "data-language-code": lang_code,
        "data-disable-idom": "true",
        "data-skip-focus-on-activate": "true",
        jsshadow: "",
      },
      [
        cE(
          "span",
          "VfPpkd-N5Lhkf",
          null,
          cE("span", "VfPpkd-jY41G-V67aGc", { jsname: "V67aGc" }, lang_text)
        ),
        cE(
          "span",
          "VfPpkd-AznF2e-uDEFge PRdtG p4biwf",
          { jscontroller: "JH2zc", jsname: "s3t1lf" },
          cE(
            "span",
            "VfPpkd-AznF2e-wEcVzc VfPpkd-AznF2e-wEcVzc-OWXEXe-NowJzb",
            { jsname: "bN97Pc" }
          )
        ),
        cE("span", "VfPpkd-YVzG2b", { jsname: "ksKsZd" }),
        cE("div", "VfPpkd-wJCpie-LhBDec"),
      ]
    );
  }

  function rebuildFixedLanguageListBox() {
    while (fixed_source_language_list_box.firstChild) {
      fixed_source_language_list_box.removeChild(fixed_source_language_list_box.firstChild);
    }
    while (fixed_target_language_list_box.firstChild) {
      fixed_target_language_list_box.removeChild(fixed_target_language_list_box.firstChild);
    }

    for (let fix_setting of settings.fixes) {
      const fixed_source_button = createLanguageButton(
        fix_setting.name,
        fix_setting.code
      );
      const fixed_target_button = createLanguageButton(
        fix_setting.name,
        fix_setting.code
      );

      fixed_source_button.addEventListener("click", () => {
        source_language_menu_box.querySelector(`[data-language-code=${fix_setting.code}]`).click();
      });
      fixed_source_button.addEventListener("dblclick", removeLanguageFromSettingsDblEvent);
      fixed_target_button.addEventListener("click", () => {
        target_language_menu_box.querySelector(`[data-language-code=${fix_setting.code}]`).click();
      });
      fixed_target_button.addEventListener("dblclick", removeLanguageFromSettingsDblEvent);

      insertHtml(fixed_source_language_list_box, fixed_source_button);
      insertHtml(fixed_target_language_list_box, fixed_target_button);
    }
  }

  function resetDblclickEvent() {
    const buttons = document.querySelectorAll(
      ".VfPpkd-AznF2e-LUERP-bN97Pc button"
    );
    for (let button of buttons) {
      button.removeEventListener("dblclick", addLanguageFromSettingsDblEvent);
      button.addEventListener("dblclick", addLanguageFromSettingsDblEvent);
    }
  }

  function addLanguageFromSettingsDblEvent() {
    const lang_code = this.getAttribute("data-language-code");
    const index = settings.fixes.findIndex((e) => e.code === lang_code);
    if (index >= 0) {
      return;
    }

    const lang_name = this.querySelector(".VfPpkd-jY41G-V67aGc").textContent;
    settings.fixes.push({ code: lang_code, name: lang_name });
    localStorage.setItem("settings", JSON.stringify(settings));

    rebuildFixedLanguageListBox();
  }

  function removeLanguageFromSettingsDblEvent() {
    const lang_code = this.getAttribute("data-language-code");
    const index = settings.fixes.findIndex((e) => e.code === lang_code);
    if (index <= 0) {
      return;
    }

    settings.fixes.splice(index, 1);
    localStorage.setItem("settings", JSON.stringify(settings));

    rebuildFixedLanguageListBox();
  }

})();
