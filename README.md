# NAVER vaccine macro
NAVER vaccine macro는 네이버 우리동네 백신 예약시도를 자동으로 수행해주는 크롬 확장 프로그램입니다.

본 프로그램은 KTX Macro
[KTX Macro github page](https://github.com/youngjin-k/ktx-macro) 
에서 Fork되어 제작되었습니다.

- [크롬 웹스토어](https://chrome.google.com/webstore/detail/alfhbmpnlhcpcjjaacapcdnggegicepl?hl=ko)

### 사용 방법
1. 크롬 확장프로그램(네이버 웨일 스토어에서도 설치 가능)을 설치합니다.
1. 네이버에 로그인 합니다.
1. NAVER 톡톡으로 이동합니다.
1. 네이버 우리 동네 백신 알림 대화방에서 원하는 접종 기관에서 온 메시지에 있는 [지금 신청 하기] 링크를 눌러 이동합니다. (https://v-search.nid.naver.com/reservation/standby?orgCd=XXXX 형태)
1. https://v-search.nid.naver.com/reservation/info?key=XXXX 형태의 url, 예약 신청 페이지가 정상적으로 노출되는지 확인 합니다.
1. '자동 예약 시작' 버튼을 누르면 시작됩니다.
1. 페이지를 계속 새로고침 하며 잔여 수량이 있을경우 예약을 시도합니다.
1. 예약이 시도시 트럼펫 소리와 함께 결과 화면으로 이동합니다.

### 주의 사항
1. 예약 완료 시 사운드가 재생되므로 스피커를 켜두세요.
1. 예약 시도 후에는 사용 방법에 있는 신청하기 링크를 눌러 이동 하는 스텝 부터 다시 수행해야합니다.

### License
MIT License
