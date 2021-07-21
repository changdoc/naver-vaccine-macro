# 2021-07-20 PM 17:10 
- 새로고침 주기 2초(2000ms)로 유지하고 1개의 병원 신청 페이지에서만 동작시키면 예약 시도 까지 가능한 것으로 파악됩니다.
- 예약 시도 하는 동안 해당 계정으로 다른 탭, 모바일 등 예약 신청 페이지 접근시 차단 당할 수 있습니다. 
- 신청 페이지 접근 차단이 되면 해제까지 1시간 소요됩니다.
- Release 메뉴에서 1.0.9 버전으로 사용해주세요.

# 질문은 [Discussion 메뉴](https://github.com/changdoc/naver-vaccine-macro/discussions)를 이용해주세요.

# NAVER vaccine macro
NAVER vaccine macro는 네이버 우리동네 백신 예약시도를 자동으로 수행해주는 크롬 확장 프로그램입니다.
함께 이겨냅시다 코로나가 종식되는 그날까지!

- 잔여 백신 관련 질병관리청 설명 페이지 [코로나19 예방접종 잔여백신 당일예약 기능 Q&A](http://kdca.go.kr/gallery.es?mid=a20503010000&bid=0002&act=view&list_no=145144)

- 쉬운설치 [크롬 웹스토어](https://chrome.google.com/webstore/detail/naver-vaccine-macro/alfhbmpnlhcpcjjaacapcdnggegicepl?hl=ko)

### 사용 방법
1. 크롬 확장프로그램에서 [NAVER Vaccine MACRO] 설치를 진행합니다.
   - 네이버 웨일 브라우저나 최신 버전을 바로 적용하기 위해서는 개발자 모드로 코드를 받으시고 직접 설치하시면 됩니다.
      - (최신 버전 다운로드 방법) https://github.com/changdoc/naver-vaccine-macro/issues/29
      - (크롬 개발자 모드 관련 설명 블로그) https://trend21c.tistory.com/1030
3. https://v-search.nid.naver.com/home 네이버 우리 동네 백신알림 페이지에 접속하여 네이버 인증서를 미리 발급 받도록 합니다.
4. 백신 접종을 희망하는 병원을 검색하여 알림 신청을 해둡니다.
5. 잔여 백신이 발생 되어 알림을 받게 되면 네이버 톡톡에 [네이버 우리동네 백신알림]을 통해 접종기관 알림 전달됩니다. 
6. [네이버 우리동네 백신알림] 대화방에서 원하는 접종 기관에서 온 메시지에 있는 [지금 신청 하기] 링크를 눌러 이동합니다. (https://v-search.nid.naver.com/reservation/standby?orgCd=XXXX&sid=XXXXX 형태)
   - 알림을 받기 전에 원하는 병원 예약 신청 페이지 url 알아내는 방법은 별도로 작성해두었습니다. 
      - https://github.com/changdoc/naver-vaccine-macro/issues/4
   - 병원 예약 신청 페이지 url 목록 생성 방법도 작성해두었습니다.
      - https://github.com/changdoc/naver-vaccine-macro/issues/11
7. https://v-search.nid.naver.com/reservation/info?key=XXXX 형태의 url, 예약 신청 페이지가 정상적으로 노출되는지 확인 합니다.
8. '자동 예약 시작' 버튼을 누르면 동작이 시작됩니다.
   - 여러 페이지를 띄워놓고 수행한다면 한곳에서만 '자동 예약 시작' 버튼을 누르고 나머지 페이지에서는 브라우저에서 새로고침 하면 동작됩니다.
9. 페이지를 계속 새로고침 하며 잔여 수량이 있을 경우 예약을 시도합니다. (test mode 체크된 상태에서는 실제로 시도 하지 않습니다.)
10. 예약이 시도시 트럼펫 소리와 함께 결과 화면으로 이동합니다.

### 주의 사항
1. 예약 시도 시 사운드가 재생되므로 스피커를 켜두는게 좋습니다.
1. 예약 시도 후에는 자동 예약 프로그램은 정지됩니다.
1. 예약 시도가 반드시 성공 한다는 보장이 없습니다.
1. 예약 시도 후에는 다시 시도 할 경우 사용 방법 4번째 항목에 있는 [지금 신청 하기] 링크를 눌러 이동 하는 스텝 부터 다시 수행해야합니다.

### Version History
https://github.com/changdoc/naver-vaccine-macro/blob/main/CHANGELOG.md

### 
본 프로그램은 KTX Macro
[KTX Macro github page](https://github.com/youngjin-k/ktx-macro) 
에서 Fork되어 제작되었습니다.

### License
MIT License
