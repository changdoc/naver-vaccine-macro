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

const sendTelegramMessage = (key) => {
    const botToken = localStorage.getItem('NAVER_VACCINE_MACRO::bot-token');
    const chatId = localStorage.getItem('NAVER_VACCINE_MACRO::chat-id');

    if (!botToken || !chatId) {
        return;
    }

    let msg = "";
    if (key == "fail")
        msg = encodeURI('예약 실패!! ㅠㅠ');
    else if (key == "success")
        msg = encodeURI('예약 성공!!!');
    else if (key == "test")
        msg = encodeURI('예약 가능 시 보내지는 테스트 메시지입니다. 테스트 모드가 아니였다면 예약 결과가 왔습니다.');


    const url = `https://api.telegram.org/bot${botToken}/sendmessage?chat_id=${chatId}&text=${msg}`;

    fetch(url);
}

chrome.extension.onMessage.addListener((message, sender, sendResponse) => {
    if (message) {
        playSound();
        if (message.type == 'successTicketing') {
            sendTelegramMessage("success");
        } else if (message.type == 'testTicketing') {
            sendTelegramMessage("test");
        } else if (message.type == 'failTicketing') {
            sendTelegramMessage("fail");
        }
        sendResponse(true);
    }
});
