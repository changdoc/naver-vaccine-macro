let sButtonText = "";
let sButtonReload = undefined;
let _tick;
const RELOAD_INTERVAL_MILLISECONDS = 200;
let hospitalList;
let hospitalListStrCache;
const _className = "_" + Math.random().toString(36).substring(2, 7);
const _buttonStyle = "width: 175px;height: 38px;line-height: 38px;text-align: center;background: linear-gradient(to bottom, #17e677, #19d1d1);color: #ffffff;font-size: 13px;border: 1px solid #149393;cursor: pointer;";

let nums = new Array();

const injectButton = () => {
    if (!sButtonReload)
        return;

    sButtonReload.parentNode.insertAdjacentHTML(
        "beforeend",
        `
        <span><button type="button" class="${_className}" style="${_buttonStyle}">${sButtonText}</button></span>
    `
    );

    document
        .querySelector(`.${_className}`)
        .addEventListener("click", onMacroClick);
}

const setEscapeEvent = () => {
    window.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            macroStop();
        }
    });
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

const macroStart = () => {
    alert(
        "자동 새로고침을 시작합니다.\n" +
        "예약 시도 시 예약 신청 페이지로 이동합니다.\n" +
        "탐지할 지역의 graphql result을 입력해두어야 예약 신청 페이지로 이동 가능합니다.\n" +
        "자동 새로고침 종료는 '자동 새로고침 정지' 혹은 esc키를 눌러주세요."
    );

    chrome.storage.local.set({macro: "on"}, function () {
        reload();
    });

    let button = document.querySelector(`.${_className}`);
    if (button) {
        button.innerText = "자동 새로고침 정지(ESC)";
    }
    setEscapeEvent();
    // localStorage.setItem("macro", "on");
};

const macroStop = (result) => {
    if (!result)
        alert("자동 새로고침을 종료합니다.");

    chrome.storage.local.set({macro: ""});

    clearTimeout(_tick);

    let button = document.querySelector(`.${_className}`);
    if (button) {
        button.innerText = "자동 새로고침 다시 시작";
    }
};

const _reload = () => {
    let settingInterval = RELOAD_INTERVAL_MILLISECONDS;

    let modify = ((new Date().getTime()) % 20);

    // console.log("setting interval:" + settingInterval + ", modify:" + modify);

    if (settingInterval > modify)
        settingInterval -= modify;

    // console.log("curr interval:" + settingInterval);

    _tick = setTimeout(reload, settingInterval);
};

const reload = () => {
    // recover numbers color
    if (nums.length > 0) {
        for (let i = 0; i < nums.length; i++) {
            const num = nums[i];
            num.style.backgroundColor = "";
        }
        nums.length = 0;
    }

    // console.log(sButtonReload);
    // console.log(sButtonReload.classList);
    // console.log(sButtonReload.classList.length);
    if (sButtonReload)
        sButtonReload.click();
    else {
        // console.log("will reloading ignore current tick.");
    }
};

const afterReload = () => {
    chrome.storage.local.get(function (value) {
        const isStarted = value.macro === "on";

        if (isStarted) {
            macro(value.hospital_list);
        }

        if (!sButtonReload) {
            console.log("can't found reload button, ignored macro.");
            return;
        }
    });
};

const macro = (hospitalListStr) => {

    // console.log("execute macro." + hospitalListStr);
    if (hospitalListStr && hospitalListStrCache != hospitalListStr) {
        hospitalList = JSON.parse(hospitalListStr);
        hospitalListStrCache = hospitalListStr;
        // console.log("parsed list. hospital list string changed.");
    }

    // console.log(hospitalList);
    if (!hospitalList || hospitalList.length == 0) {
        console.log("hospitalList is empty. cannot macro execute.");
        macroStop('empty');
        alert("병원 목록 데이터가 없습니다. 현재 지도에서 새로고침을 수행한 graphql result를 매크로 페이지에 입력하여 병원 목록을 생성한 뒤 동작 시켜주세요.");
        return;
    }

    let places = document.querySelectorAll(".place_blind");
    // console.log(places);
    let arr = new Array();

    for (let i = 0; i < places.length; i++) {
        // console.log(places[i].parentNode);
        if (places[i].parentNode.querySelectorAll(".place_blind").length >= 3) {
            arr.push(places[i].parentNode);
        }
    }

    if (arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
            // console.log(arr[i]);
            let targetName = arr[i].childNodes[0];
            let targetNum = arr[i].childNodes[arr[i].childNodes.length - 1];
            // console.log(targetNum);
            // console.log(targetNum.innerText);
            const name = targetName.innerText;
            const num = parseInt(targetNum.innerText);

            let info = getHospital(name);

            // console.log(name + ", " + num);
            // console.log(info);

            let enable = num > 0;
            // targetName.style.backgroundColor = enable ? "#3ef03e" : "#f03e3e";
            targetNum.style.backgroundColor = enable ? "#3ef03e" : "#f03e3e";

            nums.push(targetNum);

            if (enable) {
                if (openReservePage(name, info))
                    return;
            }
        }
    }

    // keep going
    _reload();
};

const RESERVE_URL = 'https://v-search.nid.naver.com/reservation?orgCd=';
const RESERVER_URL_ADD_PARM = '&sid=';

const openReservePage = (name, obj) => {
    if (obj.vaccineQuantity && obj.vaccineQuantity.vaccineOrganizationCode) {
        const orgCd = obj.vaccineQuantity.vaccineOrganizationCode;
        const sid = obj.id;
        const url = RESERVE_URL + orgCd + RESERVER_URL_ADD_PARM + sid;
        console.log("try open url : " + url);
        document.location.href = url;
        return true;
    } else {
        console.error('cannot found open url for reserve.' + name);
        return false;
    }
}

const getHospital = (name) => {
    if (!hospitalList)
        return undefined;
    for (let i = 0; i < hospitalList.length; ++i) {
        if (hospitalList[i].name == name) {
            return hospitalList[i];
        }
    }
    return undefined;
};

let reloading = false;
const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.type == "attributes") {
            let prevReloading = reloading;
            if (sButtonReload)
                reloading = sButtonReload.classList.length == 2;

            if (prevReloading && !reloading) {
                // console.log("reload done. try after reload.");
                // setTimeout(afterReload, 0);
                afterReload();
            }
        }
    });
});

const _prepare = () => {
    chrome.storage.local.get(function (value) {

        observer.observe(sButtonReload, {
            attributes: true //configure it to listen to attribute changes
        });

        const isStarted = value.macro === "on";

        if (isStarted) {
            macro(value.hospital_list);
            setEscapeEvent();
        }

        sButtonText = isStarted ? "자동 새로고침 정지(ESC)" : "자동 새로고침 시작";
        setTimeout(injectButton, 100);
    });
};

const _assureReloadButton = () => {
    let places = document.querySelectorAll(".place_blind");
    // console.log(places);
    for (let i = 0; i < places.length; i++) {
        if (!sButtonReload && places[i].innerHTML == "새로고침") {
            sButtonReload = places[i].parentNode;
            break;
        }
    }
};

let tryCount = 0;
const _prepareIf = () => {
    _assureReloadButton();

    if (!sButtonReload) {
        if (++tryCount > 5)
            console.error(`can't found reload button ${tryCount}times, try again after 500ms.`);
        setTimeout(_prepareIf, 500);
        return;
    }

    _prepare();
};

(() => {
    // console.log("map.js loaded.");
    _prepareIf();
})();