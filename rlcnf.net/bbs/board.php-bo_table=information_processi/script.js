// ==UserScript==
// @name         기출넷 Customize
// @namespace    http://tampermonkey.net/
// @version      25.02.25.01
// @description  함께 성장하는 기출넷, 당신의 성공을 응원합니다!
// @author       Rocy
// @match        https://rlcnf.net/bbs/board.php?bo_table=information_processi*
// @match        https://rlcnf.net/bbs/board.php?bo_table=info_process_p*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rlcnf.net
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Define functions
  let c_e = (tag, _class, html) => {
    !html && (html = "");

    let element = document.createElement(tag);
    if (_class) element.className = _class;
    if (typeof html === "object" && !(html instanceof Node)) {
      for (let html_element of html) {
        insert_html(element, html_element);
      }
    } else {
      insert_html(element, html);
    }
    return element;
  };
  let insert_html = (element, html) => {
    if (html instanceof Node) element.appendChild(html);
    else element.innerHTML = html;
  };
  let set_style = (element, styles) => {
    for (let style_key in styles) {
      element.style[style_key] = styles[style_key];
    }
  };
  let load_data_obj = () => {
    let tmp_data_str = localStorage.getItem("customize_data");
    let tmp_data = !tmp_data_str ? {} : JSON.parse(tmp_data_str);
    return tmp_data;
  };
  let load_data = (key) => {
    return load_data_obj()[key];
  };
  let save_data = (key, value) => {
    let tmp_data = load_data_obj();
    tmp_data[key] = value;
    localStorage.setItem("customize_data", JSON.stringify(tmp_data));
  };
  let get_query_obj = () => {
    let tmp_str = location.search;
    if (tmp_str[0] != "?") {
      return;
    }
    tmp_str = tmp_str.substring(1);

    let tmp_arr = tmp_str.split("&");
    let tmp_obj = {};
    for (let query_kv_str of tmp_arr) {
      let query_kv_arr = query_kv_str.split("=");
      tmp_obj[query_kv_arr[0]] = query_kv_arr[1];
    }

    return tmp_obj;
  };

  // Deal with query string
  let query_obj = get_query_obj();

  query_obj.wr_id = parseInt(query_obj.wr_id);
  query_obj.page = parseInt(query_obj.page);

  // Set default data
  if (!load_data("answerd_question_sequence")) {
    save_data("answerd_question_sequence", []);
  }
  if (!load_data("answerd_question_sequence_page")) {
    save_data("answerd_question_sequence_page", []);
  }
  if (!load_data("answered_question")) {
    save_data("answered_question", []);
  }
  if (!load_data("exam_time")) {
    save_data("exam_time", new Date().getTime());
    save_data("pause_time", new Date().getTime());
  }
  if (!load_data("pause_delay_time")) {
    save_data("pause_delay_time", 0);
  }
  if (!load_data("question_correct_count")) {
    save_data("question_correct_count", 0);
  }
  if (!load_data("question_incorrect_count")) {
    save_data("question_incorrect_count", 0);
  }

  // Set a test information box
  //   Set exam information box styles
  let exam_styles = c_e(
    "style",
    "",
    `
    .pd-10 {
      padding: 10px;
    }
    .info-title {
      display: inline-block;
      text-align: right;
      min-width: 150px;
      margin-right: 20px;
    }
    .exam_info_box {
      position: fixed;
      user-select: none;
      cursor: default;
      border: 1px solid #ddd;
      box-shadow: 0 0 10px rgba(0,0,0,.1);
      white-space: nowrap;
      z-index: 999;
    }
    .info-data {
      display: inline-block;
      min-width: 100px;
    }
    .paused {
      color: #d9534f;
      animation: 2s linear infinite paused-flash;
    }
    .correct-text {
      color: #5cb85c;
    }
    .incorrect-text {
      color: #d9534f;
    }
    .handle-box {
      text-align: center;
      margin-top: 15px;
    }
    .handle-box>*:not(:last-child) {
      margin-right: 10px;
    }
    @keyframes paused-flash {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
    .statistic_info_box {
      position: absolute;
      max-width: 50vw;
      left: 50%;
      transform: translate(-50%, -100px);
      opacity: 0;
      padding: 10px;
      background-color: #fff;
      border: 1px solid #ddd;
      box-shadow: 0 5px 10px rgba(0, 0, 0, .1);
      overflow-y: auto;
      transition: 0.3s all;
      pointer-events: none;
    }
    .statistic_info_box.enable {
      transform: translate(-50%, 0);
      opacity: 1;
      pointer-events: all;
    }
    .statistic_info_box table {
      border-collapse: collapse;
    }
    .statistic_info_box table th,
    .statistic_info_box table td {
      border: 1px solid #ddd;
      text-align: center;
      padding: .05em .65em;
    }
    `
  );

  //   Set exam information box header
  let exam_info_header = c_e(
    "div",
    "panel-heading",
    c_e("div", "ellipsis text-muted font-12", "Exam Information")
  );

  //   Set exam information box content
  let exam_time = c_e("span", "info-data", "00 : 00 : 00");
  let question_correct_rate = c_e("span", "info-data", "--.-- %");
  let question_correct_count = c_e("span", "correct-text", "00");
  let question_incorrect_count = c_e("span", "incorrect-text", "00");
  let answerd_total_count = c_e("span", "", "00");
  let question_has_been_answered = c_e("span", "correct-text", "No");
  let question_answered_correction = c_e("span", "", "--");
  let pause_button = c_e("button", "btn btn-default", "Pause");
  let clear_button = c_e("button", "btn btn-default", "Clear");

  let statistic_info_thead_tr = c_e("tr");
  let statistic_info_tbody_tr_1 = c_e("tr");
  let statistic_info_tbody_tr_2 = c_e("tr");
  let statistic_info_box = c_e("div", "statistic_info_box", [
    c_e("table", "", [
      c_e("thead", "", statistic_info_thead_tr),
      c_e("tbody", "", [statistic_info_tbody_tr_1, statistic_info_tbody_tr_2]),
    ]),
  ]);

  //   Set exam information box
  let exam_info_box = c_e(
    "div",
    "panel panel-default view-head no-attach exam_info_box",
    [
      exam_styles,
      exam_info_header,
      c_e("div", "pd-10", [
        c_e("div", "", [c_e("span", "info-title", "Exam Time:"), exam_time]),
        c_e("div", "", [
          c_e("span", "info-title", "Correct Rate:"),
          question_correct_rate,
        ]),
        c_e("div", "", [
          c_e("span", "info-title", "Rs / Ws / Total:"),
          c_e("span", "", [
            question_correct_count,
            c_e("span", "", " / "),
            question_incorrect_count,
            c_e("span", "", " / "),
            answerd_total_count,
          ]),
        ]),
        c_e("div", "", [
          c_e("span", "info-title", "Answered / Correction:"),
          c_e("span", "", [
            question_has_been_answered,
            c_e("span", "", " / "),
            question_answered_correction,
          ]),
        ]),
        c_e("div", "handle-box", [pause_button, clear_button]),
      ]),
      statistic_info_box,
    ]
  );
  let position_top = load_data("position_top");
  if (!position_top) {
    position_top = "320px";
    save_data("position_top", position_top);
  }
  let position_left = load_data("position_left");
  if (!position_left) {
    position_left = "20px";
    save_data("position_left", position_left);
  }
  set_style(exam_info_box, {
    top: position_top,
    left: position_left,
  });

  //   Set exam information box header drag event
  let prev_position = {
    x: 0,
    y: 0,
  };
  let exam_info_header_mousemove_event = (e) => {
    let position_top = parseInt(exam_info_box.style.top.replace("px", ""));
    let position_left = parseInt(exam_info_box.style.left.replace("px", ""));

    position_top += e.clientY - prev_position.y;
    position_left += e.clientX - prev_position.x;

    set_style(exam_info_box, {
      top: position_top + "px",
      left: position_left + "px",
    });

    save_data("position_top", position_top + "px");
    save_data("position_left", position_left + "px");

    prev_position.x = e.clientX;
    prev_position.y = e.clientY;
  };
  exam_info_header.addEventListener("mousedown", (e) => {
    prev_position.x = e.clientX;
    prev_position.y = e.clientY;

    document.body.addEventListener(
      "mousemove",
      exam_info_header_mousemove_event
    );
    document.body.addEventListener("mouseup", () => {
      document.body.removeEventListener(
        "mousemove",
        exam_info_header_mousemove_event
      );
    });
  });

  //   Set pause/restart/reset button event
  let refresh_statistic_info = () => {
    let answerd_question_sequence = load_data("answerd_question_sequence");
    let answerd_question_sequence_page = load_data(
      "answerd_question_sequence_page"
    );
    let answered_question = load_data("answered_question");
    statistic_info_thead_tr.innerHTML = "";
    statistic_info_tbody_tr_1.innerHTML = "";
    statistic_info_tbody_tr_2.innerHTML = "";

    if (!answerd_question_sequence.length) {
      statistic_info_thead_tr.appendChild(
        c_e("th", "", "Did not answer any questions now")
      );
      statistic_info_tbody_tr_1.appendChild(
        c_e("td", "", "Check here after answering some questions")
      );
      statistic_info_tbody_tr_2.appendChild(
        c_e("td", "", "We will show your answers here")
      );
    }

    let max_question_number_length = Math.max(
      ...answerd_question_sequence
    ).toString().length;
    max_question_number_length < 2 && (max_question_number_length = 2);

    for (let i = 0, j = 1; i < answerd_question_sequence.length; ++i, ++j) {
      statistic_info_thead_tr.appendChild(
        c_e("th", "", j.toString().padStart(2, "0"))
      );
      statistic_info_tbody_tr_1.appendChild(
        answered_question[answerd_question_sequence[i]]
          ? c_e("td", "correct-text", "o")
          : c_e("td", "incorrect-text", "x")
      );
      let a_link = c_e(
        "a",
        "",
        answerd_question_sequence[i]
          .toString()
          .padStart(max_question_number_length, "0")
      );
      a_link.setAttribute(
        "href",
        `https://rlcnf.net/bbs/board.php?bo_table=${query_obj.bo_table}&wr_id=${answerd_question_sequence[i]}&page=${answerd_question_sequence_page[j]}`
      );
      statistic_info_tbody_tr_2.appendChild(c_e("td", "", a_link));
    }
  };
  let pause_event = () => {
    save_data("pause_time", new Date().getTime());
    exam_time.className = "info-data paused";
    pause_button.innerText = "Restart";

    refresh_statistic_info();
    statistic_info_box.className = "statistic_info_box enable";
  };
  let restart_event = (pause_time) => {
    save_data("pause_time", null);
    save_data(
      "pause_delay_time",
      load_data("pause_delay_time") + new Date().getTime() - pause_time
    );
    exam_time.className = "info-data";
    pause_button.innerText = "Pause";

    statistic_info_box.className = "statistic_info_box";
  };

  pause_button.addEventListener("click", () => {
    let pause_time = load_data("pause_time");
    if (typeof pause_time === "number") {
      restart_event(pause_time);
      return;
    }
    pause_event();
  });
  clear_button.addEventListener("click", () => {
    let now_time = new Date().getTime();
    save_data("exam_time", now_time);
    save_data("question_correct_count", 0);
    save_data("question_incorrect_count", 0);
    save_data("answered_question", []);
    save_data("pause_time", now_time);
    save_data("pause_delay_time", 0);
    save_data("answerd_question_sequence", []);
    save_data("answerd_question_sequence_page", []);

    exam_frame_request_event();
    refresh_statistic_info();

    exam_time.className = "info-data pause";
    pause_button.innerText = "Start";
  });

  //     Reset pause state when refresh the page
  if (load_data("pause_time")) {
    exam_time.className = "info-data paused";
    pause_button.innerText = "Restart";

    refresh_statistic_info();
    statistic_info_box.className = "statistic_info_box enable";
  }

  document.body.appendChild(exam_info_box);

  let exam_frame_request_event = () => {
    let exam_time_start = load_data("exam_time");
    let pause_time = load_data("pause_time");
    !pause_time && (pause_time = new Date().getTime());
    let pause_delay_time = load_data("pause_delay_time");
    let exam_time_date = new Date(
      pause_time - exam_time_start - pause_delay_time
    );

    let correct_count = load_data("question_correct_count");
    let incorrect_count = load_data("question_incorrect_count");
    let correct_rate = "--.-- %";
    if (correct_count + incorrect_count > 0) {
      correct_rate = "";

      let tmp_rate = (correct_count / (correct_count + incorrect_count)) * 100;
      if (tmp_rate < 10) {
        correct_rate = "0";
      }
      correct_rate += tmp_rate.toFixed(2) + " %";
    }

    let prev_answer = load_data("answered_question")[query_obj.wr_id];

    exam_time.innerText = `${exam_time_date
      .getUTCHours()
      .toString()
      .padStart(2, "0")} : ${exam_time_date
      .getUTCMinutes()
      .toString()
      .padStart(2, "0")} : ${exam_time_date
      .getUTCSeconds()
      .toString()
      .padStart(2, "0")}`;
    question_correct_count.innerText = correct_count
      .toString()
      .padStart(2, "0");
    question_incorrect_count.innerText = incorrect_count
      .toString()
      .padStart(2, "0");
    answerd_total_count.innerText = (correct_count + incorrect_count)
      .toString()
      .padStart(2, "0");
    if (typeof prev_answer !== "boolean") {
      question_has_been_answered.innerText = "No";
      question_has_been_answered.className = "correct-text";
      question_answered_correction.innerText = "--";
      question_answered_correction.className = "";
    } else {
      question_has_been_answered.innerText = "Yes";
      question_has_been_answered.className = "incorrect-text";
      if (prev_answer) {
        question_answered_correction.innerText = "Yes";
        question_answered_correction.className = "correct-text";
      } else {
        question_answered_correction.innerText = "No";
        question_answered_correction.className = "incorrect-text";
      }
    }
    question_correct_rate.innerText = correct_rate;

    //requestAnimationFrame(exam_frame_request_event);
  };
  //requestAnimationFrame(exam_frame_request_event);
  setInterval(exam_frame_request_event, 1000);
  exam_frame_request_event();

  // Set min and max page number
  let page_number_min, page_number_max;
  let fboardlist = document.querySelector("#fboardlist");
  let page_number_elements = fboardlist.querySelectorAll(
    "ul li .wr-num.hidden-xs"
  );
  page_number_max = parseInt(page_number_elements[0].innerHTML);
  page_number_min = parseInt(
    page_number_elements[page_number_elements.length - 1].innerHTML
  );

  // Set default visual styles
  let visual_styles = {
    "min-width": "60px",
    padding: "20px",
    "font-weight": "700",
    display: "inline-block",
    "border-radius": "30px",
  };

  // Set prev and next button
  let prev_button = c_e("a", "bg-gray font-16 en");
  set_style(prev_button, visual_styles);
  set_style(prev_button, {
    cursor: "no-drop",
    marginRight: "50px",
  });
  prev_button.innerText = "<";

  let prev_button_allow_to_use = () => {
    if (query_obj.wr_id != 1) {
      prev_button.className = "bg-gray font-16 en trans-bg-crimson can-scoring";
      prev_button.style.cursor = "";
      prev_button.setAttribute(
        "href",
        `https://rlcnf.net/bbs/board.php?bo_table=${query_obj.bo_table}&wr_id=${
          query_obj.wr_id - 1
        }&page=${isNaN(page_number_min) ? query_obj.page + 1 : query_obj.page}`
      );
    }
  };

  let next_button = c_e("a", "bg-gray font-16 en");
  set_style(next_button, visual_styles);
  set_style(next_button, {
    cursor: "no-drop",
    marginLeft: "50px",
  });
  next_button.innerText = ">";

  let next_button_allow_to_use = () => {
    if (!(isNaN(page_number_max) && query_obj.page == 1)) {
      next_button.className = "bg-gray font-16 en trans-bg-crimson can-scoring";
      next_button.style.cursor = "";
      next_button.setAttribute(
        "href",
        `https://rlcnf.net/bbs/board.php?bo_table=${query_obj.bo_table}&wr_id=${
          query_obj.wr_id + 1
        }&page=${isNaN(page_number_max) ? query_obj.page - 1 : query_obj.page}`
      );
    }
  };

  let pager_buttons_allow_to_use = () => {
    prev_button_allow_to_use();
    next_button_allow_to_use();
  };

  /*
   *   Set pager button allow to use when
   *   the question has been answered.
   * * * * * * * * * * * * * * * * * * * * */
  let answered_question = load_data("answered_question");
  if (typeof answered_question[query_obj.wr_id] === "boolean") {
    pager_buttons_allow_to_use();
  }

  // Set and deal with scoring button
  let scoring = document.querySelector("#scoring");
  set_style(scoring, {
    opacity: 1,
  });

  let skip_guard = false;
  scoring.addEventListener("click", () => {
    /*
     * The question pager buttons need a check that
     * if the scoring button has been clicked when
     * the question was not answered then ignore that click event and
     * double click can skip this check.
     * * * * * * * * * * * * * * * * * * * * * * */
    if (scoring.className == "bg-gray font-16 en" && !skip_guard) {
      skip_guard = true;
      return;
    }

    // Skip all record events when clicked on "next question"
    if (scoring.innerText == "다음문제") {
      return;
    }

    pager_buttons_allow_to_use();

    // But the answer check can not be skipped by double click.
    if (scoring.className == "bg-gray font-16 en") {
      return;
    }

    let user_select_answer = document.querySelector(
      ".answer-container .answer.checked"
    );
    if (!user_select_answer) {
      return;
    }

    let answerd_question_sequence = load_data("answerd_question_sequence");
    let answerd_question_sequence_page = load_data(
      "answerd_question_sequence_page"
    );
    answerd_question_sequence.push(query_obj.wr_id);
    answerd_question_sequence_page.push(query_obj.page);
    save_data("answerd_question_sequence", answerd_question_sequence);
    save_data("answerd_question_sequence_page", answerd_question_sequence_page);

    let answered_question = load_data("answered_question");
    let is_correct = user_select_answer.getAttribute("value") == "o";
    answered_question[query_obj.wr_id] = is_correct;
    save_data("answered_question", answered_question);

    if (is_correct) {
      answered_question[query_obj.wr_id] = true;
      save_data(
        "question_correct_count",
        load_data("question_correct_count") + 1
      );
    } else {
      save_data(
        "question_incorrect_count",
        load_data("question_incorrect_count") + 1
      );
    }

    exam_frame_request_event();
    refresh_statistic_info();
  });

  scoring.before(prev_button);
  scoring.after(next_button);
})();
