# NAVER vaccine macro [![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fchangdoc%2Fnaver-vaccine-macro&count_bg=%233CC2AD&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false)](https://hits.seeyoufarm.com)

NAVER vaccine macro는 네이버 우리 동네 백신 예약 시도를 자동으로 수행해 주는 크롬 확장 프로그램입니다.

- github 이용 정책 위반으로 프로젝트가 제거되었고 복구가 안된다고 하네요.
## 질문은 [GitLab issue](https://gitlab.com/naver-vaccine-macro/chrome-extensions/-/issues)를 이용해 주세요.

함께 이겨냅시다 코로나가 종식되는 그날까지!

- 잔여 백신 관련 질병관리청 설명 페이지 [코로나19 예방접종 잔여 백신 당일예약 기능 Q&A](http://kdca.go.kr/gallery.es?mid=a20503010000&bid=0002&act=view&list_no=145144)

- 쉬운 설치 [크롬 웹 스토어](https://chrome.google.com/webstore/detail/naver-vaccine-macro/alfhbmpnlhcpcjjaacapcdnggegicepl?hl=ko)

### 사용 방법
1. 크롬 확장 프로그램에서 [NAVER Vaccine MACRO] 설치를 진행합니다.
   - 네이버 웨일 브라우저나 최신 버전을 바로 적용하기 위해서는 개발자 모드로 코드를 받으시고 직접 설치하시면 됩니다.
      - (크롬 개발자 모드 관련 설명 블로그) https://trend21c.tistory.com/1030
1. https://v-search.nid.naver.com/home 네이버 우리 동네 백신 알림 페이지에 접속하여 네이버 인증서를 미리 발급받도록 합니다.
1. 백신 접종을 희망하는 병원을 검색하여 알림 신청을 해둡니다.
1. 잔여 백신이 발생되어 알림을 받게 되면 네이버 톡톡에 [네이버 우리 동네 백신 알림]을 통해 접종기관 알림 전달됩니다. 
1. [네이버 우리 동네 백신 알림] 대화방에서 원하는 접종 기관에서 온 메시지에 있는 [지금 신청하기] 링크를 눌러 이동합니다. (https://v-search.nid.naver.com/reservation/standby?orgCd=XXXX&sid=XXXXX 형태)
   - 알림을 받기 전에 원하는 병원 예약 신청 페이지 url 알아내는 방법은 별도로 작성해두었습니다. 
      - [병원 orgCd, sid 추출 및 예약 신청 페이지 url 추출 방법](https://gitlab.com/naver-vaccine-macro/chrome-extensions/-/wikis/%EB%B3%91%EC%9B%90-orgCd,-sid-%EC%B6%94%EC%B6%9C-%EB%B0%8F-%EC%98%88%EC%95%BD-%EC%8B%A0%EC%B2%AD-%ED%8E%98%EC%9D%B4%EC%A7%80-url-%EC%B6%94%EC%B6%9C-%EB%B0%A9%EB%B2%95))
   - 병원 예약 신청 페이지 url 목록 생성 방법도 작성해두었습니다.
      - [예약 신청 페이지 이동 목록 생성 방법](https://gitlab.com/naver-vaccine-macro/chrome-extensions/-/wikis/%EC%98%88%EC%95%BD-%EC%8B%A0%EC%B2%AD-%ED%8E%98%EC%9D%B4%EC%A7%80-%EC%9D%B4%EB%8F%99-%EB%AA%A9%EB%A1%9D-%EC%83%9D%EC%84%B1-%EB%B0%A9%EB%B2%95)
1. https://v-search.nid.naver.com/reservation/info?key=XXXX 형태의 url, 예약 신청 페이지가 정상적으로 노출되는지 확인합니다.
   - '서비스 이용을 위해 본인인증을 진행해주세요'라는 안내 메시지가 보인다면 본인 인증부터 진행해야 합니다. 
1. 예약 신청 페이지 내에 생성된 '자동 예약 시작' 버튼을 누르면 동작이 시작됩니다.
   - 여러 페이지를 띄워놓고 수행한다면 한 곳에서만 '자동 예약 시작' 버튼을 누르고 나머지 페이지에서는 브라우저에서 새로 고침 하면 동작됩니다.
   - 2021-07-20 부터 네이버 측에서 짧은 시간에 반복해서 새로 고침을 하는 경우 1시간 동안 신청 페이지 접근을 차단 시키므로 한 병원에서만 동작시키시거나 새로 고침 주기를 늘려서 사용하셔야 합니다. (예를 들어 2개 병원 신청 페이지, 새로 고침 주기 5000ms)
     - [관련 내용](https://gitlab.com/naver-vaccine-macro/chrome-extensions/-/wikis/%EC%9E%A0%EC%8B%9C-%ED%9B%84-%EB%8B%A4%EC%8B%9C-%EC%8B%9C%EB%8F%84%ED%95%98%EC%84%B8%EC%9A%94.-(%EC%98%88%EC%95%BD-%EC%8B%A0%EC%B2%AD-%ED%8E%98%EC%9D%B4%EC%A7%80-%EC%B0%A8%EB%8B%A8)-%EA%B4%80%EB%A0%A8)
1. 페이지를 계속 새로 고침 하며 잔여 수량이 있을 경우 예약을 시도합니다. (test mode 체크된 상태에서는 실제로 시도하지 않습니다.)
1. 예약이 시도 시 소리와 함께 결과 화면으로 이동합니다.
1. 네이버 맵, 카카오 맵 에서 동작하는 매크로 기능은 가이드 문서에서 확인해주세요.
      - [네이버 맵](https://gitlab.com/naver-vaccine-macro/chrome-extensions/-/wikis/%EB%84%A4%EC%9D%B4%EB%B2%84-%EB%A7%B5%EC%97%90%EC%84%9C-%EB%A7%A4%ED%81%AC%EB%A1%9C-%EB%8F%99%EC%9E%91-%EB%B0%A9%EB%B2%95)
      - [카카오 맵](https://gitlab.com/naver-vaccine-macro/chrome-extensions/-/wikis/%EC%B9%B4%EC%B9%B4%EC%98%A4-%EB%A7%B5%EC%97%90%EC%84%9C-%EB%A7%A4%ED%81%AC%EB%A1%9C-%EB%8F%99%EC%9E%91-%EB%B0%A9%EB%B2%95)

### 주의 사항
1. 예약 시도 시 사운드가 재생되므로 스피커를 켜 두는게 좋습니다.
1. 예약 시도 후에는 자동 예약 프로그램은 정지됩니다.
1. 예약 시도가 반드시 성공한다는 보장이 없습니다.
1. 예약 시도 후에는 다시 시도할 경우 사용 방법 5번째 항목에 있는 [지금 신청하기] 링크를 눌러 이동하는 스텝부터 다시 수행해야 합니다.

### Version History
https://gitlab.com/naver-vaccine-macro/chrome-extensions/-/blob/main/CHANGELOG.md

### 
본 프로그램은 KTX Macro
[KTX Macro github page](https://github.com/youngjin-k/ktx-macro) 
에서 Fork되어 제작되었습니다.

### License
MIT License
