const chrome_v2 = chrome.extension;
const chrome_v3 = chrome.runtime; /// manifest v3

const MAIN_URI = "https://v-search.nid.naver.com/reservation";
const PROGRESS_PATH = "/progress";
const RELOAD_INTERVAL_MILLISECONDS = 2000;
let _tick;
let sButtonText = "";
let sCurrentName = "";
const _className = "_" + Math.random().toString(36).substring(2,7);
const _buttonStyle = "width: 175px;height: 38px;line-height: 38px;text-align: center;background: linear-gradient(to bottom, #17e677, #19d1d1);color: #ffffff;font-size: 13px;border: 1px solid #149393;cursor: pointer;";

const setEscapeEvent = () => {
    window.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            macroStop();
        }
    });
};

const macroStart = () => {
    alert(
        "자동 예약을 시작합니다.\n" +
        "예약 시도 후에는 자동 예약이 멈춥니다.\n" +
        "자동 예약 종료는 '자동 예약 정지' 혹은 esc키를 눌러주세요.\n" +
        "여러 창이 열려 있다면 브라우저에서 새로고침 해주세요."
    );

    chrome.storage.local.set({macro: "on"}, function () {
        reload();
    });
    // localStorage.setItem("macro", "on");
};

const onMacroClick = () => {
    chrome.storage.local.get(function (data) {
        const isStarted = (data.macro === "on");
        if (isStarted)
            macroStop();
        else
            macroStart();
    });

    // const isStarted = localStorage.getItem("macro") === "on";
    // if (isStarted)
    //     macroStop();
    // else macroStart();
};

const macroStop = (result) => {
    if (!result)
        alert("자동 예약을 종료합니다.");

    chrome.storage.local.set({macro: ""});

    clearTimeout(_tick);

    let button = document.querySelector(`.${_className}`);
    if (button) {
        button.innerText = "자동 예약 시작";
    }
};

const _reload = (data) => {
    let settingInterval = parseInt(data.interval);
    if (!Number.isInteger(settingInterval))
        settingInterval = RELOAD_INTERVAL_MILLISECONDS;

    let modify = ((new Date().getTime()) % 20);

    console.log("setting interval:" + settingInterval + ", modify:" + modify);

    if (settingInterval > modify)
        settingInterval -= modify;

    console.log("curr interval:" + settingInterval);

    _tick = setTimeout(reload, settingInterval);
};

const injectButton = () => {
    document.querySelector(".process_list").insertAdjacentHTML(
        "beforeend",
        `
        <li class="process_item"><button type="button" class="${_className}" style="${_buttonStyle}">${sButtonText}</button></li>
    `
    );

    document
        .querySelector(`.${_className}`)
        .addEventListener("click", onMacroClick);
}

const macro = (data) => {

    if (location.href.includes("error")) {
        console.log("예약 시도했지만 결과페이지는 에러, 질병 관리청 응답 지연");
        chrome_v2.sendMessage({type: "tryButErrorTicketing", name: sCurrentName});
        macroStop("try_error");
        return;
    }

    if (location.href.includes("failure")) {
        console.log("예약 실패쓰");
        chrome_v2.sendMessage({type: "failTicketing", name: sCurrentName});
        macroStop("fail");
        return;
    }

    if (location.href.includes("success")) {
        console.log("예약 성공쓰");
        chrome_v2.sendMessage({type: "successTicketing", name: sCurrentName});
        macroStop("success");
        return;
    }

    let $row;
    const $rows = document.querySelectorAll(".radio_list > li");
    const len = $rows.length;

    // for TEST force Click
    // const phoneLink = document.querySelector(".apply_area .info_box .info_list .desc .link.phone");
    // console.log(phoneLink);
    // phoneLink.click();

    const confirmButton = document.getElementById('reservation_confirm');
    // console.log(confirmButton);
    // confirmButton.click();

    const orgName = document.querySelector(".h_title .accent");
    if (orgName && orgName.innerHTML.length > 0) {
        sCurrentName = orgName.innerHTML;
    }
    // console.log('current : ' + sCurrentName);

    if (!len) {

        if (document.querySelector(".error_area")) {
            console.log("error detected. try reload.");
            chrome_v2.sendMessage({type: "errorWhileTicketing", name: sCurrentName});
        }

        _reload(data);
        return;
    }

    let selectedName = null;
    if (data.selected_vaccine != null)
        selectedName = data.selected_vaccine;
    let isTest = data.is_test === 1;

    console.log("current: " + len + ", data:" + data.selected_vaccine + "," + data.interval + ", selectedName:" + selectedName + ", isTest:" + isTest);

    for (let i = 0; i < len; i++) {
        $row = $rows[i];

        let targetNum = $row.querySelector("span.num");
        let targetName = $row.querySelector("span.name");
        let currentVaccineParam = $row.querySelector("input").id;

        // console.log(currentVaccineParam);

        let num = parseInt(targetNum?.innerHTML || 0);
        // console.log(targetName.innerHTML + ", num:" + num);

        let isSelected = selectedName == null || selectedName == "" || selectedName == targetName.innerHTML;
        if (isSelected) {
            let enable = num > 0;
            targetName.style.backgroundColor = enable ? "#3ef03e" : "#f03e3e";
            targetNum.style.backgroundColor = enable ? "#3ef03e" : "#f03e3e";

            if (enable) {
                console.log("is test:" + isTest);
                let url = MAIN_URI + PROGRESS_PATH + document.location.search + "&cd=" + currentVaccineParam;

                if (!isTest) {
                    confirmButton.click();
                    document.location = url;
                    chrome_v2.sendMessage({type: "tryTicketing", name: sCurrentName});
                }
                if (isTest) {
                    console.log("will move to :" + url);
                    chrome_v2.sendMessage({type: "testTicketing", url: url, name: sCurrentName});
                    // setTimeout(() => {
                    //     confirmButton.click();
                    //     document.location = url;
                    // }, 5000);
                }

                return;
            }
        }
    }

    _reload(data);
};

const reload = () => {
    window.location.reload();
};

(() => {
    if (!location.href.startsWith(MAIN_URI)) {
        return;
    }

    if (location.search.includes("due_date")) {
        console.log(location);
        let url = location.href.substr(0, location.href.indexOf('&due_date'));
        console.log("need redirect macro. to : " + url);
        document.location = url;
        return;
    }

    if (localStorage.getItem("macro"))
        localStorage.removeItem("macro");

    if (document.querySelector('.certify_area')) {
        console.log('need certify self.');
        return;
    }

    if (document.querySelector(".agree_all")) {
        let checkList = document.querySelectorAll('.input_check');
        if (checkList != null && checkList.length > 0) {
            for (let i = 0; i < checkList.length; i++) {
                // console.log(checkList[i]);
                checkList[i].checked = true;
            }
        }
    }

    chrome.storage.local.get(function (data) {
        const isStarted = data.macro === "on";

        if (isStarted) {
            macro(data);
            setEscapeEvent();
        }

        if (location.href.includes("error")
            || location.href.includes("failure")
            || location.href.includes("success")) {
            console.log("seems result page. not required button.");
            return;
        }

        const isTest = data.is_test === 1;
        let buttonText = isStarted ? "자동 예약 정지(ESC)" : "자동 예약 시작";
        if (isTest)
            buttonText = "[TEST MODE] " + buttonText;

        if (!document.querySelector(".process_list")) {
            console.log("can't found process list, ignored macro.");
            return;
        }

        sButtonText = buttonText;
        setTimeout(injectButton, 100);
    });
})();
