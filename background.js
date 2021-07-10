const playSound = () => {
    if (typeof (audio) != "undefined" && audio) {
        audio.pause();
        document.body.removeChild(audio);
        audio = null;
    }
    audio = document.createElement('audio');
    document.body.appendChild(audio);
    audio.autoplay = true;
    audio.src = chrome.extension.getURL('tada.mp3');
    audio.play();
};

const sendTelegramMessage = (key, param) => {
    const botToken = localStorage.getItem('NAVER_VACCINE_MACRO::bot-token');
    const chatId = localStorage.getItem('NAVER_VACCINE_MACRO::chat-id');

    if (!botToken || !chatId) {
        return;
    }

    let msg = "";
    if (key == "fail")
        msg = encodeURI('예약 시도 했으나 실패한 것으로 판단됩니다.');
    else if (key == "success")
        msg = encodeURI('예약 성공 가능성이 높습니다. 네이버 백신 예약 페이지에서 확인 해보세요.');
    else if (key == "test")
        msg = encodeURIComponent('예약 가능 시 보내지는 테스트 메시지입니다. 테스트 모드가 아니였다면 예약 결과가 왔습니다. 시도 url : ' + param);
    else if (key == "try_error")
        msg = encodeURI('예약 시도 성공했습니다. 결과를 장담할 수 없습니다. (질병 관리청 응답 지연). 에러 페이지 내용을 확인해주세요.');

    const url = `https://api.telegram.org/bot${botToken}/sendmessage?chat_id=${chatId}&text=${msg}`;

    fetch(url);
}

chrome.extension.onMessage.addListener((message, sender, sendResponse) => {
    if (message) {
        playSound();
        if (message.type == 'successTicketing') {
            sendTelegramMessage("success");
        } else if (message.type == 'testTicketing') {
            sendTelegramMessage("test", message.url);
        } else if (message.type == 'failTicketing') {
            sendTelegramMessage("fail");
        }
        sendResponse(true);
    }
});
