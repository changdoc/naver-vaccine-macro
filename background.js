const playSound = (param) => {
    let url = 'boing.mp3';
    if (param == "tada")
        url = 'tada.mp3';

    // manifest v2
    if (typeof (audio) != "undefined" && audio) {
        audio.pause();
        document.body.removeChild(audio);
        audio = null;
    }
    audio = document.createElement('audio');
    document.body.appendChild(audio);
    audio.autoplay = true;
    audio.src = chrome.runtime.getURL(url);
    audio.play();

    // manifest v3
    // chrome.tabs.create({
    //     url: chrome.runtime.getURL(url)
    // });
};

const sendTelegramMessage = (key, name, url) => {
    chrome.storage.local.get((data) => {
        const botToken = data.botToken;
        const chatId = data.chatId;

        if (!botToken || !chatId) {
            return;
        }

        let msg = "";
        if (key == "fail")
            msg = encodeURI('예약 시도 했으나 실패한 것으로 판단됩니다. [' + name + ']');
        else if (key == "success")
            msg = encodeURI('예약 성공 가능성이 높습니다. 네이버 백신 예약 페이지에서 확인 해보세요. [' + name + ']');
        else if (key == "test")
            msg = encodeURIComponent('예약 가능 시 보내지는 테스트 메시지입니다. 테스트 모드가 아니였다면 예약 결과가 왔습니다. [' + name + '] 시도 url : ' + url);
        else if (key == "try_error")
            msg = encodeURI('예약 시도 성공했습니다. 결과를 장담할 수 없습니다. (예를 들어, 질병 관리청 응답 지연). 에러 페이지 내용을 확인해주세요. [' + name + ']');
        else if (key == "detect_error")
            msg = encodeURI('에러 페이지가 나타난것으로 판단됩니다. 계속해서 정상적으로 동작하고 있는지 확인해주세요. [' + name + ']');
        else if (key == "try")
            msg = encodeURI('예약 시도를 수행했습니다. [' + name + ']');

        const urls = `https://api.telegram.org/bot${botToken}/sendmessage?chat_id=${chatId}&text=${msg}`;

        fetch(urls);
    })
    // const botToken = localStorage.getItem('NAVER_VACCINE_MACRO::bot-token');
    // const chatId = localStorage.getItem('NAVER_VACCINE_MACRO::chat-id');
}

const chrome_v2 = chrome.extension;
const chrome_v3 = chrome.runtime; /// manifest v3

chrome_v2.onMessage.addListener((message, sender, sendResponse) => {
    if (message) {
        let needPlaySound = undefined;

        if (message.type == 'successTicketing') {
            sendTelegramMessage("success", message.name);
            needPlaySound = "tada";
        } else if (message.type == 'testTicketing') {
            sendTelegramMessage("test", message.name, message.url);
            needPlaySound = "boing";
        } else if (message.type == 'failTicketing') {
            sendTelegramMessage("fail", message.name);
            needPlaySound = "boing";
        } else if (message.type == 'tryTicketing') {
            sendTelegramMessage("try", message.name);
        } else if (message.type == 'tryButErrorTicketing') {
            sendTelegramMessage("try_error", message.name);
            needPlaySound = "boing";
        } else if (message.type == 'errorWhileTicketing') {
            sendTelegramMessage("detect_error", message.name);
        }

        if (needPlaySound) playSound(needPlaySound);

        sendResponse(true);
    }
});
