(() => {
    const MESSAGE_RESET = '초기화 되었습니다.';
    const MESSAGE_CONNECTION_SUCCESS = '연동되었습니다.';
    const MESSAGE_CONNECTION_FAIL = '연동에 실패하였습니다.<br>입력하신 정보를 다시 확인해주세요.';

    const RESERVE_URL = 'https://v-search.nid.naver.com/reservation?orgCd=';

    const init = () => {
        document.getElementById('bot-token').value = localStorage.getItem('NAVER_VACCINE_MACRO::bot-token');
        document.getElementById('chat-id').value = localStorage.getItem('NAVER_VACCINE_MACRO::chat-id');
        document.getElementById('interval').value = localStorage.getItem('NAVER_VACCINE_MACRO::interval') | 1000;
        document.getElementById('reserve_test').checked = localStorage.getItem('NAVER_VACCINE_MACRO::reserve_test') == 1;

        const graphqlResult = document.getElementById('graphql_result');
        graphqlResult.value = localStorage.getItem('NAVER_VACCINE_MACRO::hospital_list');

        if (graphqlResult.value) extract_list();

        let radios = document.querySelectorAll('input[name="select_vaccine"]');
        for (let i = 0; i < radios.length; i++) {
            radios[i].addEventListener('click', function () {
                saveVaccine();
            });
        }

        let intervalText = document.getElementById('interval');
        intervalText.addEventListener('change', function (e) {
            saveVaccine();
        });

        let testCheck = document.getElementById('reserve_test');
        testCheck.addEventListener('click', function (e) {
            saveVaccine();
        });

        let selectedId = localStorage.getItem('NAVER_VACCINE_MACRO::vaccine');
        if (selectedId == null) {
            document.getElementById("target_vaccine_all").checked = true;
            return;
        }
        let target = document.getElementById(selectedId);
        if (target == null)
            return;
        target.checked = true;
    }

    const saveVaccine = () => {
        let selected = document.querySelector('input[name="select_vaccine"]:checked');
        let interval = document.getElementById('interval').value;
        let isReserveTest = document.getElementById('reserve_test').checked ? 1 : 0;

        localStorage.setItem('NAVER_VACCINE_MACRO::vaccine', selected.id);
        localStorage.setItem('NAVER_VACCINE_MACRO::interval', interval);
        localStorage.setItem('NAVER_VACCINE_MACRO::reserve_test', isReserveTest);

        // 크롬 스토리지에 입력 값 저장
        chrome.storage.sync.set({
            selected_vaccine: getSelectedVaccineName(),
            interval: interval,
            is_test: isReserveTest
        });
    }

    const getSelectedVaccineName = () => {
        const selectedId = localStorage.getItem('NAVER_VACCINE_MACRO::vaccine');
        if (selectedId == "target_vaccine_0")
            return "아스트라제네카";
        if (selectedId == "target_vaccine_1")
            return "얀센";
        if (selectedId == "target_vaccine_2")
            return "화이자";
        return "";
    }

    const save = () => {
        const botToken = document.getElementById('bot-token').value;
        const chatId = document.getElementById('chat-id').value;

        const msg = encodeURI('예약 알림이 연동되었습니다.');
        const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${msg}`;

        fetch(url).then(response => {
            if (response.status === 200) {
                localStorage.setItem('NAVER_VACCINE_MACRO::bot-token', botToken);
                localStorage.setItem('NAVER_VACCINE_MACRO::chat-id', chatId);
                setMessage(MESSAGE_CONNECTION_SUCCESS);
            } else {
                setMessage(MESSAGE_CONNECTION_FAIL);
            }
        }).catch(err => {
            setMessage(MESSAGE_CONNECTION_FAIL);
            console.error(err)
        });
    }

    const reset = () => {
        document.getElementById('bot-token').value = '';
        document.getElementById('chat-id').value = '';
        localStorage.removeItem('NAVER_VACCINE_MACRO::bot-token');
        localStorage.removeItem('NAVER_VACCINE_MACRO::chat-id');
        setMessage(MESSAGE_RESET);
    }

    const setMessage = message => {
        document.getElementById('message').innerHTML = message;
    }

    const reload = () => {
        chrome.runtime.reload();
    }

    const extract_list = () => {
        const json = document.getElementById('graphql_result').value;
        console.log(json);
        const object = JSON.parse(json);
        if (!object)
            return;
        const list = object[0].data.rests.businesses.items;
        console.log(list);
        if (!list)
            return;

        localStorage.setItem('NAVER_VACCINE_MACRO::hospital_list', json);

        const desc = document.getElementById('hospital_results_desc');
        const result = document.getElementById('hospital_results');

        if (desc) {
            desc.innerHTML = "";
            desc.innerHTML = "열기 클릭시 해당 병원 예약 신청 페이지로 이동";
        }

        result.innerHTML = "";
        for (let i = 0; i < list.length; i++) {
            const obj = list[i];
            if (!obj)
                continue;
            const name = obj.name;
            const distance = obj.distance;
            let orgCd = '';
            let linkHTML = '';
            if (obj.vaccineQuantity && obj.vaccineQuantity.vaccineOrganizationCode) {
                orgCd = obj.vaccineQuantity.vaccineOrganizationCode;
                const url = RESERVE_URL + orgCd;
                linkHTML = `<a href="${url}" target="_blank">열기</a>`;
            } else {
                linkHTML = '(orgCd 없음)';
            }

            result.insertAdjacentHTML(
                "beforeend",
                `
        <li class="hospital_item">
        <span>${name} ${distance} ${linkHTML}</span>
        </li>
    `
            );
        }
    }

    init();

    document.getElementById('button-save').addEventListener('click', save);
    document.getElementById('button-reset').addEventListener('click', reset);
    document.getElementById('button-reload').addEventListener('click', reload);
    document.getElementById('button-extract').addEventListener('click', extract_list)
})();