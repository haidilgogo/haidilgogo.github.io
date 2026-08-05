(() => {
  const CATS = ['전체', '소스', '탕', '히든메뉴'];

  // ── 정식 재료·단위 목록 (하이디라오 소스바 — 지점별 포함 실제로 있는 것만) ──
  // 레시피의 ings/order/단위는 아래 목록 안에서만 써야 이름이 어긋나지 않아요.
  // 진짜 새 재료라면 → 먼저 아래 목록에 추가한 뒤 레시피에 쓰세요.
  // 목록에 없는 이름을 쓰면 사이트 로딩 시 브라우저 콘솔(F12)에 경고가 떠요.
  // SAUCE_BAR 배열 순서 = 재료 "서빙 순서"이기도 함. 레시피 ings는 화면에 렌더될 때
  // 이 순서로 자동 정렬됨(아래 sortIngs). 그러니 새 재료는 알맞은 그룹 위치에 넣을 것.
  // ('(건더기만)' 짝은 원본과 의도적으로 구분된 별개 항목이니 합치지 말 것. (소괄호)=변형·옵션 규칙.)
  const SAUCE_BAR = [                       // 소스바 재료 (레시피의 ings 에 쓰는 이름)
    // 1) 베이스 소스 (참기름은 베이스로 취급 — 사용자 지정)
    '땅콩참깨소스', '스위트칠리소스', '고추귀리소스', '칠리갈릭소스', '라조장', '부추소스', '버섯소스', '사차장', '발효콩장', '발효두부소스', '청유훠궈소스', '참기름',
    // 2) 액체 양념
    '굴소스', '간장소스', '중국식초',
    // 3) 고기·건더기
    '매운소고기소스', '매운소고기소스(건더기만)', '청유훠궈소스(건더기만)', '오향우육/다진 고기', '튀긴대두',
    // 4) 채소·향신
    '다진 마늘', '다진 파', '양파', '방울토마토', '태국고추', '산고추/고추장아찌', '셀러리', '고수', '와사비',
    // 5) 가루류
    '땅콩가루', '마라시즈닝/고춧가루', '참깨',
    // 6) 기름류
    '고추기름', '산초기름',
    // 7) 간·기타
    '설탕', '소금', '미원', '만구향',
  ];
  const ORDER_ITEMS = ['공깃밥', '날계란', '생면', '만두', '팡가시우메기', '새우완자', '유부', '우유/청유 마라훠궈', '토마토탕훠궈', '버섯탕훠궈', '맑은 탕/물'];  // 직원에게 주문하는 항목 (order 에 쓰는 이름)
  const UNITS = ['스푼', '국자', '티스푼', '바퀴', '개', '공기', '그릇', '접시', '인분', '넉넉하게', '적당히', '한 꼬집'];  // 정식 단위 (국자=탕 국물 뜰 때, 그릇=소스바 종지)

  // ── 매장(지점) 목록 ──
  // 출처: 나무위키(2026-07 기준). 누구나 수정하는 곳이라 영업시간 등은 실제와 다를 수 있음 → 이상하면 갱신.
  // region = 지역 그룹(화면 표시 순서). addr = 전체 주소(시/도 포함, 사용자가 준 그대로).
  // 화면 지점명엔 '하이디라오 '가 앞에 붙음(renderStores). 지도 링크도 '하이디라오 {name}'으로 네이버 검색,
  // 전화는 tel: 링크. (soon:true = 오픈 예정 표시 — 지금은 뺐지만 확정 시 필드만 붙이면 렌더가 처리)
  const STORES = [
    { region: '서울', name: '명동점',    addr: '서울 중구 명동3길 36, 마이티빌딩 1/2층',          hours: '10:00 – 03:00', tel: '02-3789-3888' },
    { region: '서울', name: '서초점',    addr: '서울 서초구 서초대로77길 54, 서초W타워 2층',       hours: '10:00 – 07:00', tel: '02-533-8260' },
    { region: '서울', name: '홍대점',    addr: '서울 마포구 양화로 176, 와이즈파크 5층',          hours: '10:00 – 05:00', tel: '02-332-7668' },
    { region: '서울', name: '건대점',    addr: '서울 광진구 능동로 110, 스타시티 영존 A동 1/2층',   hours: '10:00 – 05:00', tel: '02-456-5683' },
    { region: '서울', name: '영등포점',  addr: '서울 영등포구 경인로 870, 2층',                  hours: '10:00 – 03:00', tel: '02-2678-0715' },
    { region: '서울', name: '대학로점',  addr: '서울 종로구 대학로 146, 혜화동씨티밸리 3층',        hours: '10:00 – 05:00', tel: '02-743-6868' },
    { region: '서울', name: '코엑스점',  addr: '서울 강남구 테헤란로87길 58, 컨벤션별관 지하 2층',   hours: '10:00 – 05:00', tel: '02-562-1005' },
    { region: '서울', name: '가산점',    addr: '서울 금천구 디지털로10길 9, 현대아울렛 가산점 6층',  hours: '10:00 – 05:00', tel: '02-2136-9939' },
    { region: '경기', name: '부천점',    addr: '경기 부천시 원미구 부천로 11, 2층',              hours: '10:00 – 03:00', tel: '032-666-0118' },
    { region: '경기', name: '안산점',    addr: '경기 안산시 단원구 당곡로 20, 현대타워랜드 4층',    hours: '10:00 – 05:00', tel: '031-481-8886' },
    { region: '부산', name: '부산역점',  addr: '부산 동구 중앙대로 175',                        hours: '10:00 – 03:00', tel: '051-466-8880' },
    // 오픈 예정(2026-07-24 추가) — 안산점과 같은 방식으로 STORE_CATCH만 'soon'을 둔다(제목 옆 배지는 사용자가 뺐음).
    // 그 값 하나로 매장 탭 '오픈 예정' 버튼 + 스티커 매장 선택 비활성이 동시에 걸린다.
    // 🔴 주소는 도로명까지만 확정 — 건물명은 오픈 확정 후 사용자가 알려주면 채운다. 영업시간·전화도 그때.
    { region: '부산', name: '부산점',    addr: '부산 부산진구 중앙대로 654',                     hours: '미정' },
    { region: '대구', name: '대구점',    addr: '대구 중구 동성로1길 15, 유니온스퀘어 2층',         hours: '10:00 – 05:00', tel: '053-428-7771' },
    { region: '제주', name: '제주점',    addr: '제주 제주시 연동4길 2, 제주볼튼호텔 5층',          hours: '10:00 – 03:00', tel: '064-747-8886' },
  ];

  // 🔴 지점별 네이버 장소번호(2026-08-04). **지금은 아무 데도 안 쓴다** — 그래도 지우지 말 것.
  //    핀 찍힌 지도를 열려고 모았는데, 네이버 모바일 웹이 바깥에서 들어오는 딥링크에는 핀을 안 찍어 줘서
  //    결국 검색 형태로 갔다(아래 지도 버튼 주석에 시도한 주소들이 다 적혀 있다).
  //    네이버가 정책을 바꾸거나 다른 길이 생기면 바로 쓸 수 있고, 14곳을 다시 뽑는 데 시간이 걸린다.
  //    뽑는 법: m.map.naver.com/search?query=하이디라오+<지점>&mapMode=0 을 받아 오면 HTML 안에
  //            "items":[{"id":<번호>,"name":"하이디라오 …"} 로 들어 있다. 14곳을 한 번에 훑어 뽑았다.
  //    ⚠️ 새 지점이 생기면 여기 한 줄 추가할 것. 없으면 핀 없이 검색 결과로 뜬다(동작은 한다).
  //    ⚠️ 코엑스점은 네이버 등록명이 「하이디라오 COEX점」이라 이름이 다르다 — 번호로 걸어 문제없다.
  //    ⚠️ 오픈 예정(안산점·부산점)은 네이버에 아직 없어 번호가 없다. 그 둘은 지도 버튼 자체가 비활성이라
  //       필요 없다. (부산점은 이름으로 검색하면 엉뚱하게 부산역점이 잡히기까지 한다.)
  //    뽑는 법: m.map.naver.com/search?query=하이디라오+<지점>&mapMode=0 을 받아 오면
  //            HTML 안에 "items":[{"id":<번호>,"name":"하이디라오 …"} 로 들어 있다.
  //    ⚠️ 새 지점이 생기면 여기 한 줄 추가할 것. 없으면 핀 없이 검색 결과로 뜬다(동작은 한다).
  //    ⚠️ 코엑스점은 네이버 등록명이 「하이디라오 COEX점」이라 이름이 다르다 — 번호로 걸어 문제없다.
  //    ⚠️ 오픈 예정(안산점·부산점)은 네이버에 아직 없어서 번호가 없다. 그 둘은 지도 버튼 자체가
  //       비활성이라 필요 없다. (부산점은 검색하면 엉뚱하게 부산역점이 잡히기까지 한다.)
  // 🔴 지점별 카카오 장소번호(2026-08-04). 네이버와 **번호 체계가 다르다** — 서로 못 바꿔 쓴다.
  //    뽑는 법: m.map.kakao.com/actions/searchView?q=하이디라오+<지점> 의 HTML 안
  //            <li class="search_item base" data-id="<번호>"> 에 들어 있다.
  //    ⚠️ 카카오 등록명이 우리와 다른 곳이 있다(번호로 걸어서 화면엔 영향 없다):
  //       홍대점→홍대지점 · 코엑스점→COEX점 · 제주점→제주도점
  //    ⚠️ 오픈 예정(안산점·부산점)은 번호가 없다. 지도 버튼 자체가 비활성이라 필요 없다.
  const STORE_KAKAO_ID = {
    '명동점': '1820258951',
    '서초점': '1372079546',
    '홍대점': '1622865435',
    '건대점': '1026281815',
    '영등포점': '1214126801',
    '대학로점': '731469845',
    '코엑스점': '576159166',
    '가산점': '670610672',
    '부천점': '481359274',
    '부산역점': '957408853',
    '대구점': '1203829931',
    '제주점': '1143177072',
  };
  const STORE_NAVER_ID = {
    '명동점': '1501495669',
    '서초점': '38314432',
    '홍대점': '653467130',
    '건대점': '1588990046',
    '영등포점': '1467350015',
    '대학로점': '1583520034',
    '코엑스점': '1950007630',
    '가산점': '1364098721',
    '부천점': '2027810824',
    '부산역점': '1327035832',
    '대구점': '2065069021',
    '제주점': '2024934566',
  };
  // 지점별 캐치테이블 예약·웨이팅 링크(있는 지점만 '예약' 버튼 표시). 키 = STORES의 name.
  // 안산점은 링크가 없어 예약 버튼 안 뜸.
  const STORE_CATCH = {
    '명동점': 'https://app.catchtable.co.kr/ct/shop/haidilao_myungdong?type=WAITING&currentSuggestionType=SHOP_NAME',
    '서초점': 'https://app.catchtable.co.kr/ct/shop/haidilao_seocho?type=WAITING&foodKeywords=%ED%95%98%EC%9D%B4%EB%94%94%EB%9D%BC%EC%98%A4&currentSuggestionType=SHOP_NAME',
    '홍대점': 'https://app.catchtable.co.kr/ct/shop/hidirao_hongdae?type=WAITING&currentSuggestionType=SHOP_NAME',
    '건대점': 'https://app.catchtable.co.kr/ct/shop/hidirao_konkuk?type=WAITING&currentSuggestionType=SHOP_NAME',
    '영등포점': 'https://app.catchtable.co.kr/ct/shop/hidirao_yeongdeungpo?type=WAITING&currentSuggestionType=SHOP_NAME',
    '대학로점': 'https://app.catchtable.co.kr/ct/shop/haidilao_hyehwa?type=WAITING&currentSuggestionType=SHOP_NAME',
    '코엑스점': 'https://app.catchtable.co.kr/ct/shop/hidirao_coex?type=WAITING&currentSuggestionType=SHOP_NAME',
    '가산점': 'https://app.catchtable.co.kr/ct/shop/hidiraohd?type=DINING&currentSuggestionType=SHOP_NAME',
    '부천점': 'https://app.catchtable.co.kr/ct/shop/haidilao_bucheon?type=WAITING&currentSuggestionType=SHOP_NAME',
    '부산역점': 'https://app.catchtable.co.kr/ct/shop/haidilaobusan?type=WAITING&currentSuggestionType=SHOP_NAME',
    '대구점': 'https://app.catchtable.co.kr/ct/shop/haidilao_daegu?type=WAITING&currentSuggestionType=SHOP_NAME',
    '제주점': 'https://app.catchtable.co.kr/ct/shop/haidilao_jeju?type=WAITING&currentSuggestionType=SHOP_NAME',
    '안산점': 'soon', // 2026-07-25 오픈 예정 — 캐치테이블 아직 안 열림. 열리면 'soon'을 실제 URL로 교체.
    '부산점': 'soon', // 오픈 예정(서면) — 이 값이 스티커 매장 선택의 비활성 판정도 겸한다. 열리면 실제 URL로 교체.
  };

  // 재료 표시 순서: SAUCE_BAR 배열 순서를 기준으로 자동 정렬(렌더 시에만 정렬, 원본 데이터는 그대로).
  // 목록에 없는 이름(오타 등)은 맨 뒤로 보내되 서로 간 원래 순서는 유지.
  const ING_ORDER = new Map(SAUCE_BAR.map((n, i) => [n, i]));
  const sortIngs = (ings) => (ings || [])
    .map((it, i) => [it, i])
    .sort((a, b) => {
      const ra = ING_ORDER.has(a[0][0]) ? ING_ORDER.get(a[0][0]) : Infinity;
      const rb = ING_ORDER.has(b[0][0]) ? ING_ORDER.get(b[0][0]) : Infinity;
      return ra - rb || a[1] - b[1];
    })
    .map((x) => x[0]);

  const RECIPES = [
    { id: 's1', date: '2021-12-26', cat: '소스', emoji: '🥣', img: 'assets/cards/건희소스(오리지널)_2021.jpg?v=3', imgFit: 'cover', imgBg: '#A8CCDC', tint: 'linear-gradient(160deg,#FDECD9,#F8D9BE)', name: '건희소스', ver: '오리지널 · 2021', source: '버블 건희', star: true, person: '건희', desc: '<b>원어스</b>의 <b>건희</b>가 즐겨 먹는 콤보 소스 중 단맛 버전으로, 대한민국에서 가장 유명한 국민 소스이다.',
      ings: [['땅콩참깨소스', '1', '스푼'], ['스위트칠리소스', '2.5', '스푼'], ['다진 마늘', '0.5', '스푼'], ['다진 파', '0.5', '스푼'], ['참깨', '1', '티스푼'], ['땅콩가루', '1', '티스푼'], ['마라시즈닝/고춧가루', '0.5', '티스푼'], ['고추기름', '1', '티스푼'], ['설탕', '0.3', '티스푼'], ['매운소고기소스', '0.5', '티스푼']],
      steps: [],
      tip: '너무 달면 설탕과 스위트칠리소스를 취향에 맞게 조절하기' },
    { id: 's16', date: '2021-12-26', cat: '소스', emoji: '🥣', img: 'assets/cards/건희소스(짭짤)_2021.jpg?v=4', imgFit: 'cover', imgBg: '#A8CCDC', tint: 'linear-gradient(160deg,#FDECD9,#F8D9BE)', name: '건희소스', ver: '짭짤 · 2021', source: '버블 건희', star: true, person: '건희', desc: '<b>원어스</b>의 <b>건희</b>가 즐겨 먹는 콤보 소스 중 짠맛 버전으로, 단맛 버전과 번갈아 먹으면 질리지 않고 단짠단짠으로 즐길 수 있다고 한다.',
      ings: [['소금', '3', '티스푼'], ['참기름', '3', '스푼'], ['고추기름', '0.5', '스푼'], ['다진 마늘', '1', '스푼'], ['참깨', '1', '티스푼'], ['마라시즈닝/고춧가루', '1', '티스푼']],
      steps: [],
      tip: '' },
    { id: 's4', date: '2026-01-27', cat: '소스', emoji: '🥣', img: 'assets/cards/화령소스.jpg?v=2', imgFit: 'cover', tint: 'linear-gradient(160deg,#F5E1C8,#E8C79A)', name: '화령소스', source: '네이버블로그 sjsilver23', person: '화령', desc: '하이디라오 부산역점 직원이 네이버 블로거인 <b>지금이네(sjsilver23)</b>에게 가져다준 소스로, 너무 맛있어서 레시피를 손민수했다고 한다.',
      ings: [['땅콩참깨소스', '0.25', '스푼'], ['스위트칠리소스', '3.5~4', '스푼'], ['튀긴대두', '2~3', '스푼'], ['참기름', '0.5', '스푼'], ['고추기름', '0.5', '스푼'], ['양파', '3', '스푼'], ['다진 파', '3', '스푼'], ['다진 마늘', '1', '스푼']],
      steps: [],
      tip: '튀긴대두, 다진 마늘, 다진 파, 양파는 많으면 많을수록 맛있음' },
    { id: 's2', date: '2022-01-22', cat: '소스', emoji: '🥣', img: 'assets/cards/쑨디2호소스_2022.jpg?v=3', imgFit: 'cover', tint: 'linear-gradient(160deg,#FBDCD3,#F5B8A8)', name: '쑨디2호소스', ver: '2022', source: '트위터 @deeplovehalf', person: '쑨디', desc: '트위터리안 <b>쑨디</b>가 트위터에 공개한 소스로, 1호는 없지만 멋있어 보여서 이름을 쑨디2호소스라고 지었다.',
      ings: [['매운소고기소스(건더기만)', '0.5', '스푼'], ['청유훠궈소스(건더기만)', '0.5', '스푼'], ['땅콩가루', '', '넉넉하게'], ['다진 파', '', '넉넉하게'], ['다진 마늘', '0.5', '스푼'], ['스위트칠리소스', '0.5', '스푼'], ['굴소스', '0.5', '스푼'], ['땅콩참깨소스', '0.25', '스푼']],
      steps: [],
      tip: '' },
    { id: 's3', date: '2024-07-28', cat: '소스', emoji: '🥣', img: 'assets/cards/쑨디2호소스_2024.jpg?v=3', imgFit: 'cover', tint: 'linear-gradient(160deg,#FFE0C2,#F8B888)', name: '쑨디2호소스', ver: '2024', source: 'YouTube 쑨디', person: '쑨디', desc: '쑨디2호소스의 개발자인 <b>쑨디</b>가 과거 트위터에 공개한 레시피에 일부 오류가 있어서, 유튜브를 통해 정정한 소스이다.',
      ings: [['땅콩참깨소스', '0.5', '스푼'], ['다진 파', '', '넉넉하게'], ['스위트칠리소스', '0.5', '스푼'], ['다진 마늘', '3', '스푼'], ['굴소스', '1', '스푼'], ['매운소고기소스(건더기만)', '1', '스푼'], ['청유훠궈소스(건더기만)', '2', '스푼'], ['땅콩가루', '2', '스푼'], ['만구향', '1', '스푼']],
      steps: [],
      tip: '' },
    { id: 's5', date: '2025-04-11', cat: '소스', emoji: '🥣', img: 'assets/cards/영지소스_2025.jpg?v=4', imgFit: 'cover', tint: 'linear-gradient(160deg,#F5E6D3,#E8C9A0)', name: '영지소스', ver: '2025', source: 'YouTube 채널십오야', star: true, person: '이영지', desc: '<b>나영석의 보글보글</b> 촬영 중 <b>이영지</b>가 공개한 소스로, <b>나영석</b>이 <u>그룹 활동을 하고 있음에도 불구하고 솔로 가수가 되기 위해 노력하고 있는 느낌의 소스다</u>라고 했다.',
      ings: [['땅콩참깨소스', '2', '스푼'], ['스위트칠리소스', '1.5', '스푼'], ['태국고추', '2', '스푼'], ['마라시즈닝/고춧가루', '1.5', '스푼'], ['다진 파', '1.5', '스푼'], ['다진 마늘', '1', '스푼'], ['참기름', '2', '바퀴'], ['간장소스', '1', '바퀴'], ['오향우육/다진 고기', '1.5', '스푼'], ['참깨', '', '적당히'], ['설탕', '', '한 꼬집'], ['땅콩가루', '', '한 꼬집']],
      steps: [],
      tip: '' },
    { id: 's7', date: '2025-04-11', cat: '소스', emoji: '🥣', img: 'assets/cards/마크소스.jpg?v=3', imgFit: 'cover', tint: 'linear-gradient(160deg,#FDEBD0,#F5C99B)', name: '마크소스', source: 'YouTube 채널십오야', star: true, person: '마크', desc: '<b>나영석의 보글보글</b> 촬영 중 <b>마크</b>가 최초로 공개한 소스로, <b>나영석</b>이 <u>그룹 활동에 최적화된 소스다</u>라고 했다.',
      ings: [['땅콩참깨소스', '2', '스푼'], ['다진 마늘', '1.5', '스푼'], ['양파', '1.5', '스푼'], ['굴소스', '1', '스푼'], ['태국고추', '1', '스푼'], ['간장소스', '2', '스푼'], ['오향우육/다진 고기', '', '적당히'], ['다진 파', '', '적당히'], ['땅콩가루', '', '적당히'], ['마라시즈닝/고춧가루', '', '적당히']],
      steps: [],
      tip: '' },
    { id: 's14', date: '2026-05-18', cat: '소스', emoji: '🥣', img: 'assets/cards/라젤소스.jpg?v=2', imgFit: 'cover', tint: 'linear-gradient(160deg,#EAF3D8,#C9DFA0)', name: '라젤소스', source: 'YouTube 라젤Razel', person: '라젤', desc: '유튜버 <b>라젤</b>이 본인의 이름을 붙인 간장 베이스 소스로, 건희소스와 번갈아 먹으면 질리지 않게 먹을 수 있다고 한다.',
      ings: [['양파', '', '넉넉하게'], ['간장소스', '2', '스푼'], ['다진 마늘', '1', '스푼'], ['다진 파', '1', '스푼'], ['고추기름', '1', '스푼'], ['마라시즈닝/고춧가루', '1', '스푼'], ['중국식초', '1', '스푼'], ['참기름', '0.5', '스푼'], ['태국고추', '', '넉넉하게']],
      steps: [],
      tip: '' },
    { id: 's15', date: '2026-05-18', cat: '소스', emoji: '🥣', img: 'assets/cards/라젤(이 아는 동생)소스.jpg?v=2', imgFit: 'cover', tint: 'linear-gradient(160deg,#F3E8D6,#DCC39E)', name: '라젤(이 아는 동생)소스', nameHtml: '라젤<span class="name-sub">(이 아는 동생)</span>소스', source: 'YouTube 라젤Razel', person: '라젤', desc: '유튜버 <b>라젤</b>이 <u>아는 동생이 진짜 건강하게 츠묵고 산다</u>며 소개한 소스이다.',
      ings: [['참기름', '2', '스푼'], ['소금', '0.5', '스푼'], ['다진 마늘', '1', '스푼'], ['다진 파', '1', '스푼'], ['태국고추', '1', '스푼']],
      steps: [],
      tip: '' },
    { id: 's17', date: '2026-06-09', cat: '소스', emoji: '🥣', img: 'assets/cards/세훈소스(간장).jpg?v=1', imgFit: 'cover', tint: 'linear-gradient(160deg,#EFE3CE,#DBC5A0)', name: '세훈소스', ver: '간장', source: 'YouTube 밥은영', star: true, person: '세훈', desc: '유튜브 <b>밥은영</b> 촬영 중 <b>엑소</b>의 <b>세훈</b>이 공개한 소스이다.',
      order: [['우유/청유 마라훠궈', '1', '스푼']],
      ings: [['간장소스', '3', '스푼'], ['다진 파', '2', '스푼'], ['다진 마늘', '3', '스푼'], ['양파', '3', '스푼'], ['고수', '2', '스푼'], ['태국고추', '', '적당히']],
      steps: [],
      tip: '홍탕 1스푼은 취향에 맞게 넣기' },
    { id: 's18', date: '2026-06-09', cat: '소스', emoji: '🥣', img: 'assets/cards/세훈소스(마장).jpg?v=1', imgFit: 'cover', tint: 'linear-gradient(160deg,#F6EEDD,#E7D6BA)', name: '세훈소스', ver: '마장', source: 'YouTube 밥은영', star: true, person: '세훈', desc: '유튜브 <b>밥은영</b> 촬영 중 <b>엑소</b>의 <b>세훈</b>이 공개한 소스로, <u>정통파들은 소스바 대신 홍탕에 있는 고추기름을 넣는다</u>라고 했다.',
      order: [['우유/청유 마라훠궈', '1', '국자']],
      ings: [['땅콩참깨소스', '3', '스푼'], ['다진 파', '3', '스푼'], ['양파', '2', '스푼'], ['고수', '1', '스푼'], ['다진 마늘', '0.5', '스푼']],
      steps: [],
      tip: '' },
    { id: 's19', date: '2026-06-09', cat: '소스', emoji: '🥣', img: 'assets/cards/박은영소스(참기름).jpg?v=1', heroImg: 'assets/monthly-sauce/s19.jpg?v=6', imgFit: 'cover', tint: 'linear-gradient(160deg,#F7EFD8,#EBDBB0)', name: '박은영소스', ver: '참기름', source: 'YouTube 밥은영', star: true, person: '박은영', heroDesc: '중식 여신 박은영 셰프의 참기름 소스', desc: '유튜브 <b>밥은영</b> 촬영 중 <b>박은영</b> 셰프가 공개한 소스이다.',
      ings: [['참기름', '4', '스푼'], ['중국식초', '1', '스푼'], ['다진 마늘', '2', '스푼'], ['소금', '', '한 꼬집']],
      steps: [],
      tip: '' },
    { id: 's20', date: '2026-06-09', cat: '소스', emoji: '🥣', img: 'assets/cards/박은영소스(마장).jpg?v=1', imgFit: 'cover', tint: 'linear-gradient(160deg,#F6DFC8,#ECBE96)', name: '박은영소스', ver: '마장', source: 'YouTube 밥은영', star: true, person: '박은영', heroDesc: '은영 셰프의 시그니처 마장 소스', desc: '유튜브 <b>밥은영</b> 촬영 중 <b>박은영</b> 셰프가 공개한 소스로, <u>핫바리들은 잘 모르는 두 가지 소스(부추 소스, 홍두부 소스)가 들어가야 된다</u>라고 했다.',
      order: [['우유/청유 마라훠궈', '1', '스푼']],
      ings: [['땅콩참깨소스', '3', '스푼'], ['중국식초', '2', '스푼'], ['산초기름', '1', '스푼'], ['다진 파', '2', '스푼'], ['다진 마늘', '1', '스푼'], ['땅콩가루', '1', '스푼'], ['태국고추', '1', '스푼'], ['라조장', '1', '스푼'], ['부추소스', '1', '스푼'], ['발효두부소스', '0.33', '스푼']],
      steps: [],
      tip: '부추 소스, 홍두부 소스가 소스바에 없는 경우에는 하이디라오 직원분께 요청하기' },
    { id: 's21', date: '2025-04-26', cat: '소스', emoji: '🥣', img: 'assets/cards/장하오소스.jpg?v=1', imgFit: 'cover', tint: 'linear-gradient(160deg,#F2EEE6,#E2DACB)', name: '장하오소스', source: 'MBC 전지적 참견 시점', star: true, person: '장하오', desc: '<b>전지적 참견 시점</b> 촬영 중 <b>제로베이스원</b>의 <b>장하오</b>가 멤버들과 함께 하이디라오에 방문했을 때 공개한 소스이다.',
      ings: [['다진 파', '1', '스푼'], ['양파', '0.5', '스푼'], ['다진 마늘', '0.5', '스푼'], ['발효콩장', '1', '스푼'], ['참기름', '2', '스푼'], ['굴소스', '1', '스푼'], ['간장소스', '0.5', '스푼'], ['오향우육/다진 고기', '1', '스푼'], ['발효두부소스', '2', '스푼'], ['버섯소스', '1', '스푼'], ['매운소고기소스', '1', '스푼'], ['태국고추', '', '적당히'], ['고수', '', '적당히'], ['참깨', '', '적당히'], ['중국식초', '', '적당히']],
      steps: [],
      tip: '태국고추, 고수, 참깨, 중국식초는 취향에 맞게 넣기' },
    { id: 's22', date: '2026-05-25', cat: '소스', emoji: '🥣', img: 'assets/cards/수코소스.jpg?v=2', imgFit: 'cover', tint: 'linear-gradient(160deg,#EAF3E0,#CFE3BC)', name: '수코소스', source: 'YouTube sookoh 수코', person: '수코', desc: '유튜버 <b>수코</b>가 혼자 상하이에 있는 하이디라오 와이탄점에 방문해서 공개한 소스이다.',
      ings: [['다진 파', '2', '스푼'], ['참기름', '2', '스푼'], ['다진 마늘', '1', '스푼'], ['소금', '0.5', '스푼'], ['고수', '', '적당히'], ['셀러리', '', '적당히']],
      steps: [],
      tip: '고수와 셀러리는 취향에 맞게 넣기' },
    { id: 's23', date: '2023-09-01', cat: '소스', emoji: '🥣', img: 'assets/cards/영지소스(악마).jpg?v=1', imgFit: 'cover', tint: 'linear-gradient(160deg,#F8D6CC,#EDA893)', name: '영지소스', ver: '악마 · 2023', source: 'Instagram @youngji_02', star: true, person: '이영지', desc: '<b>이영지</b>가 인스타그램 스토리를 통해서 공개한 소스로, 매운 재료들만 넣어서 만들었기 때문에 마성의 악마소스라고 소개했다.',
      ings: [['스위트칠리소스', '3', '스푼'], ['태국고추', '3', '스푼'], ['마라시즈닝/고춧가루', '3', '스푼']],
      steps: [],
      tip: '' },
    { id: 's24', date: '2025-10-07', cat: '소스', emoji: '🥣', img: 'assets/cards/김풍소스.jpg?v=1', imgFit: 'cover', tint: 'linear-gradient(160deg,#F4E7D6,#E4CBA6)', name: '김풍소스', source: 'YouTube 라꼰즈', star: true, person: '김풍', desc: '<b>김풍</b> 작가가 <b>파김치갱</b> 멤버들과 함께 하이디라오에서 회식을 하며 공개한 소스로, <u>이 소스 천만 소스 간다</u>라며 소개했다.',
      ings: [['땅콩참깨소스', '2', '스푼'], ['발효콩장', '1', '스푼'], ['중국식초', '1', '스푼'], ['굴소스', '1', '스푼'], ['칠리갈릭소스', '1', '스푼'], ['간장소스', '1', '스푼'], ['다진 파', '', '적당히'], ['양파', '', '적당히']],
      steps: [],
      tip: '' },
    { id: 's25', date: '2025-02-28', cat: '소스', emoji: '🥣', img: 'assets/cards/우기소스.jpg?v=1', imgFit: 'cover', tint: 'linear-gradient(160deg,#F0EFD9,#D6D4A2)', name: '우기소스', source: 'YouTube 미연zip MIYEON', star: true, person: '우기', desc: '<b>(여자)아이들</b> <b>미연</b>의 유튜브 촬영 중 같은 멤버 <b>우기</b>가 공개한 소스로, 자막으로 안내된 레시피와 실제 제조 과정이 달라 영상을 직접 판독해 만든 그대로 옮겨 적었다.',
      ings: [['땅콩참깨소스', '2', '스푼'], ['중국식초', '5', '스푼'], ['다진 파', '1', '스푼'], ['다진 마늘', '1', '스푼'], ['고수', '1', '스푼'], ['땅콩가루', '1', '스푼']],
      steps: [],
      tip: '' },
    { id: 's26', date: '2024-10-01', cat: '소스', emoji: '🥣', img: 'assets/cards/건희소스_2024.jpg?v=1', imgFit: 'cover', tint: 'linear-gradient(160deg,#FDECD9,#F8D9BE)', name: '건희소스', ver: '2024', source: 'Instagram @in2yourblue', star: true, person: '건희', desc: '<b>원어스</b>의 <b>건희</b>가 인스타그램 스토리를 통해서 공개한 소스로, <u>님들 나 대단한 소스를 하나 더 만들어냄</u>이라며 소개했다.',
      ings: [['양파', '3', '스푼'], ['다진 파', '1', '스푼'], ['태국고추', '', '적당히'], ['간장소스', '2', '스푼'], ['중국식초', '0.7~1', '티스푼'], ['다진 마늘', '0.5', '티스푼'], ['굴소스', '0.3', '티스푼'], ['고추기름', '0.3', '스푼'], ['참깨', '', '적당히']],
      steps: [],
      tip: '태국고추는 취향에 맞게 넣고, 홍탕에서 건진 고기, 푸주, 새우 완자를 소스에 절여진 양파와 함께 먹는게 포인트' },
    { id: 's27', date: '2025-03-27', cat: '소스', emoji: '🥣', img: 'assets/cards/건희소스_2025.jpg?v=1', imgFit: 'cover', tint: 'linear-gradient(160deg,#FDECD9,#F8D9BE)', name: '건희소스', ver: '리뉴얼 · 2025', source: 'YouTube 다비드 봉', star: true, person: '건희', desc: '<b>원어스</b>의 <b>건희</b>가 단맛 버전을 리뉴얼해 공개한 소스로, <u>입맛이 바뀌어서 조금 달라졌다</u>라며 설탕을 빼는 등 기존 레시피에서 단맛을 많이 낮췄다.',
      ings: [['땅콩참깨소스', '1', '스푼'], ['스위트칠리소스', '1', '스푼'], ['다진 파', '1', '스푼'], ['다진 마늘', '1', '스푼'], ['고추기름', '0.5', '스푼'], ['매운소고기소스', '0.5', '스푼'], ['굴소스', '0.5', '스푼'], ['태국고추', '0.5', '스푼'], ['땅콩가루', '0.5', '스푼'], ['참깨', '0.5', '스푼']],
      steps: [],
      tip: '' },
    { id: 'b3', cat: '탕', emoji: '🍲', img: 'assets/cards/스키야키탕.jpg?v=1', imgFit: 'cover', tint: 'linear-gradient(160deg,#F3E3CC,#E0C298)', name: '스키야키탕', source: 'Gemini AI', desc: '맑은 탕에 소스바 재료를 넣어서 셀프로 만드는 스키야키탕이다.',
      order: [['맑은 탕/물', '', '']],
      ings: [['굴소스', '3', '스푼'], ['간장소스', '1', '그릇'], ['오향우육/다진 고기', '2', '스푼'], ['다진 마늘', '0.5', '스푼'], ['다진 파', '0.5', '그릇'], ['설탕', '2', '스푼'], ['소금', '3', '스푼']],
      steps: [
        '국자를 이용해 맑은 탕의 물을 소스 그릇에 덜어둔다',
        '소스바에서 가져온 재료를 물이 끓으면 넣고 계속 끓여준다',
        '소스 그릇에 덜어둔 물로 취향에 맞게 간을 맞춘다',
      ],
      tip: '' },
    { id: 'b4', cat: '탕', emoji: '🍲', img: 'assets/cards/토마토탕.jpg?v=1', imgFit: 'cover', tint: 'linear-gradient(160deg,#FFE9E0,#FFC9B8)', name: '토마토탕', source: 'Gemini AI', desc: '맑은 탕에 소스바 재료를 넣어서 셀프로 만드는 토마토탕이다.',
      order: [['맑은 탕/물', '', ''], ['우유/청유 마라훠궈', '1~2', '국자']],
      ings: [['방울토마토', '2', '접시'], ['굴소스', '2', '그릇']],
      steps: [
        '직원분께 맑은 탕 물의 절반을 빼 달라고 요청한다',
        '소스바에서 가져온 방울토마토를 맑은 탕에 넣어 물과 토마토의 비율이 1:1이 되도록 해준다',
        '토마토가 익으면 가위로 자르고 국자 2개를 이용해 으깨준다',
        '탕에 거품이 생기고 끓기 시작하면 소스바에서 가져온 굴소스를 넣어준다',
        '마라훠궈 국물 1~2국자를 토마토탕에 넣고 섞어준다',
      ],
      tip: '굴소스는 취향에 맞게 조절해서 넣기' },
    { id: 'b5', cat: '탕', emoji: '🍲', img: 'assets/cards/마라훠궈탕.jpg?v=1', imgFit: 'cover', tint: 'linear-gradient(160deg,#F2DDD3,#D9A48F)', name: '마라훠궈탕', source: 'Gemini AI', desc: '맑은 탕에 소스바 재료를 넣어서 셀프로 만드는 마라훠궈탕이다.',
      order: [['맑은 탕/물', '', '']],
      ings: [['청유훠궈소스', '6', '스푼'], ['산초기름', '6', '스푼'], ['굴소스', '5', '스푼'], ['고추기름', '6', '스푼'], ['땅콩참깨소스', '5', '스푼'], ['다진 마늘', '5', '스푼'], ['간장소스', '4', '스푼'], ['참기름', '4', '스푼'], ['소금', '', '한 꼬집'], ['매운소고기소스', '2', '스푼']],
      steps: [
        '직원분께 맑은 탕 물의 절반을 빼 달라고 요청한다',
        '소스바에서 가져온 재료를 물이 끓으면 넣고 계속 끓여준다',
      ],
      tip: '' },
    { id: 'b6', date: '2025-02-05', cat: '탕', emoji: '🍲', img: 'assets/cards/혼자햐탕.jpg?v=1', imgFit: 'cover', tint: 'linear-gradient(160deg,#F2DDD3,#D9A48F)', name: '혼자햐탕', source: 'YouTube 혼자햐', desc: '유튜버 <b>혼자햐</b>가 혼자 하이디라오에 가서 맑은 탕에 소스바 재료를 넣어서 셀프로 만드는 마라탕이다.',
      order: [['맑은 탕/물', '', '']],
      ings: [['땅콩참깨소스', '6', '스푼'], ['참기름', '3', '스푼'], ['산초기름', '3', '스푼'], ['고추기름', '3', '스푼'], ['청유훠궈소스', '3', '스푼'], ['다진 마늘', '3', '스푼'], ['굴소스', '3', '스푼'], ['간장소스', '3', '스푼'], ['참깨', '', '적당히'], ['소금', '', '적당히']],
      steps: [
        '소스바에서 가져온 재료를 물이 끓으면 넣고 계속 끓여준다',
      ],
      tip: '화한 맛이 부족하면 산초기름 더 넣기\n매운맛이 부족하면 청유훠궈소스 더 넣기\n국물에 깊이가 없으면 땅콩참깨소스 더 넣기' },
    { id: 'b7', date: '2026-06-10', cat: '탕', emoji: '🍲', img: 'assets/cards/지새기탕.jpg?v=1', imgFit: 'cover', tint: 'linear-gradient(160deg,#FBEBD0,#EFCB94)', name: '지새기탕', source: 'YouTube 지새기의 인간극장', desc: '유튜버 <b>지새기</b>가 마라탕을 셀프로 만들기 위해 레시피를 미리 공부까지 해갔으나, 정작 소스바 앞에서 본인 마음대로 조합하다가 맛이 애매해졌다. 이를 가엽게 여긴 <s>천사가</s> 직원이 나타나 만들어준 비법 레시피이다.',
      order: [['맑은 탕/물', '', '']],
      ings: [['땅콩참깨소스', '1', '그릇'], ['땅콩참깨소스', '1', '스푼'], ['산초기름', '6', '스푼'], ['소금', '2', '스푼'], ['설탕', '6', '스푼'], ['굴소스', '1', '스푼'], ['마라시즈닝/고춧가루', '1', '스푼'], ['간장소스', '1', '스푼'], ['참기름', '1', '스푼'], ['태국고추', '1', '스푼'], ['다진 마늘', '1', '스푼'], ['매운소고기소스', '1', '스푼'], ['청유훠궈소스', '1', '스푼']],
      steps: [
        '직원분께 맑은 탕 물의 절반을 빼 달라고 요청한다',
        '소스바에서 가져온 재료를 물이 끓으면 넣고 계속 끓여준다',
      ],
      tip: '' },
    { id: 'r1', date: '2025-01-16', cat: '히든메뉴', emoji: '🍚', img: 'assets/cards/메기살덮밥.jpg?v=2', imgFit: 'cover', tint: 'linear-gradient(160deg,#FFF6DC,#FCE4AE)', name: '메기살덮밥', source: 'X @dduuuu__', desc: '홍탕에 익힌 메기살을 특제소스에 비빈 밥에 얹어 먹는 히든 메뉴이다.',
      order: [['우유/청유 마라훠궈', '', ''], ['팡가시우메기', '1', '인분'], ['공깃밥', '1', '공기']],
      ings: [['참기름', '1', '스푼'], ['간장소스', '1', '스푼'], ['굴소스', '0.5', '스푼'], ['중국식초', '0.5', '스푼'], ['다진 파', '1', '스푼']],
      steps: [
        '소스바에서 소스를 만든다',
        '메기살은 마라훠궈 국물에 넣어 익히고, 공깃밥에는 소스를 부어 비빈다',
        '충분히 익힌 메기살을 밥에 얹어 으깨 먹는다',
      ],
      tip: '느끼한 것 같으면 홍탕 국물 1숟가락을 밥에 추가하기' },
    { id: 'r2', cat: '히든메뉴', emoji: '🍚', img: 'assets/cards/토마토달걀밥.jpg', imgFit: 'cover', tint: 'linear-gradient(160deg,#FFE9E0,#FFC9B8)', name: '토마토달걀밥', source: 'Gemini AI', desc: '녹진하게 끓인 토마토탕에 달걀물을 풀어, 밥에 끼얹어 비벼 먹는 히든 메뉴이다.',
      order: [['토마토탕훠궈', '', ''], ['날계란', '1', '개'], ['공깃밥', '1', '공기']],
      ings: [['참기름', '0.5', '스푼'], ['오향우육/다진 고기', '2', '스푼'], ['다진 파', '2', '스푼']],
      steps: [
        '토마토탕이 녹진(꾸덕)해질 때까지 충분히 끓여준다',
        '소스바에서 소스를 만든다',
        '날계란에 물을 조금 섞어 풀어준 뒤, 녹진해진 토마토탕 위에 구멍 뚫린 국자를 대고 계란물을 천천히 부어준다',
        '계란이 잘 익도록 국자로 탕을 잘 저어준다',
        '소스가 담긴 밥에 토마토계란탕을 끼얹어 비벼 먹는다',
      ],
      tip: '토마토탕훠궈 국물 안의 토마토를 국자로 으깨주기' },
    { id: 'r3', date: '2024-09-22', cat: '히든메뉴', emoji: '🍚', img: 'assets/cards/희수국밥.jpg?v=3', imgFit: 'cover', tint: 'linear-gradient(160deg,#F5EFE0,#E5D6B8)', name: '희수국밥', source: 'X @snowdoesnot', desc: '메뉴 이름에서도 알 수 있듯이 창시자는 <b>희수</b>라는 인물이며, 유튜브 <b>햅삐찌링</b>에 본인등판하여 <u>버섯탕이 너무너무 맛있는데 국물에 밥을 말아 먹지 않는 게 이해가 되지 않아서 그때부터 밥을 말아 국밥처럼 먹었다</u>고 한다.',
      order: [['버섯탕훠궈', '', ''], ['공깃밥', '1', '공기']],
      ings: [['오향우육/다진 고기', '', '적당히'], ['다진 파', '', '적당히']],
      steps: [
        '버섯탕에 야채와 고기를 넣어가며 엑기스만 남을 때까지 우려낸다',
        '소스바에서 오향우육과 다진 파를 소스 그릇에 담는다',
        '소스 그릇에 밥을 넣고 푹 우러난 버섯탕 국물을 붓고 잘 섞어 먹는다',
      ],
      tip: '반드시 식사를 거의 끝마쳐 가는 후반부에 먹기' },
    { id: 'e2', cat: '히든메뉴', emoji: '🥟', img: 'assets/cards/토마토달걀만두.jpg?v=1', imgFit: 'cover', tint: 'linear-gradient(160deg,#FFE9E0,#FFC9B8)', name: '토마토달걀만두', source: 'Gemini AI', desc: '녹진하게 끓인 토마토탕에 달걀물을 풀고 만두를 익혀 먹는 히든 메뉴이다.',
      order: [['토마토탕훠궈', '', ''], ['날계란', '1', '개'], ['만두', '1', '인분']],
      ings: [['청유훠궈소스', '1', '티스푼'], ['오향우육/다진 고기', '2', '스푼'], ['다진 파', '2', '스푼']],
      steps: [
        '토마토탕이 녹진(꾸덕)해질 때까지 충분히 끓여준다',
        '소스바에서 소스를 만든다',
        '날계란에 물을 조금 섞어 풀어준 뒤, 녹진해진 토마토탕 위에 구멍 뚫린 국자를 대고 계란물을 천천히 부어준다',
        '계란이 잘 익도록 국자로 탕을 잘 저어준다',
        '만두를 토마토탕에 넣어 잘 익혀준다',
        '만두가 다 익으면 소스 그릇에 토마토계란탕을 끼얹고 만두를 건져 먹는다',
      ],
      tip: '토마토탕훠궈 국물 안의 토마토를 국자로 으깨주기' },
    { id: 'e1', cat: '히든메뉴', emoji: '🍢', img: 'assets/cards/유부 새우완자.jpg?v=1', imgFit: 'cover', tint: 'linear-gradient(160deg,#F5EFE4,#DCD2C0)', name: '유부 새우완자', source: 'Gemini AI', desc: '유부에 새우완자를 채워 넣어 국물에 익혀 먹는 히든 메뉴이다.',
      order: [['새우완자', '1', '인분'], ['유부', '1', '인분']],
      ings: [],
      steps: [
        '직원분께 유부 새우완자를 만들어달라고 요청한다',
        '국물에 넣어 익혀 먹는다',
      ],
      tip: '새우완자는 취향에 따라 날치알 새우완자로 바꾸거나 둘 다 넣기' },
    { id: 'e3', date: '2026-07-09', cat: '히든메뉴', emoji: '🍢', img: 'assets/cards/유부 새우완자(업그레이드).jpg?v=1', imgFit: 'cover', tint: 'linear-gradient(160deg,#F5EFE4,#DCD2C0)', name: '유부 새우완자', ver: '업그레이드', source: 'YouTube 풍류천재 조서형', desc: '새우완자에 소스바 재료를 첨가하여 유부에 채워 넣고 국물에 익혀 먹는 히든 메뉴이다.',
      order: [['새우완자', '1', '인분'], ['유부', '1', '인분']],
      ings: [['참기름', '1', '스푼'], ['다진 마늘', '1', '스푼'], ['다진 파', '1', '스푼'], ['고수', '1', '스푼']],
      steps: [
        '새우완자에 소스바 재료를 올린다',
        '직원분께 유부에 새우완자를 넣어달라고 요청한다',
        '국물에 넣어 익혀 먹는다',
      ],
      tip: '' },
    { id: 'n2', cat: '히든메뉴', emoji: '🍜', img: 'assets/cards/탄탄면.jpg?v=1', imgFit: 'cover', tint: 'linear-gradient(160deg,#F7E6CE,#E5C08C)', name: '탄탄면', source: 'Gemini AI', desc: '마라훠궈 국물에 익힌 생면을 특제소스에 비벼 먹는 히든 메뉴이다.',
      order: [['우유/청유 마라훠궈', '', ''], ['생면', '1', '인분']],
      ings: [['땅콩참깨소스', '1', '스푼'], ['버섯소스', '1', '스푼'], ['굴소스', '1', '스푼'], ['오향우육/다진 고기', '1', '스푼'], ['튀긴대두', '1', '스푼'], ['다진 파', '1', '스푼'], ['땅콩가루', '1', '스푼']],
      steps: [
        '소스바에서 소스를 만든다',
        '생면을 마라훠궈 국물에 넣고 타지 않게 저으면서 잘 익혀준다',
        '면이 다 익으면 소스 그릇에 덜어 비벼 먹는다',
      ],
      tip: '' },
    { id: 'n1', cat: '히든메뉴', emoji: '🍜', img: 'assets/cards/토마토에그누들.jpg', imgFit: 'cover', tint: 'linear-gradient(160deg,#FFECDD,#FFC2A6)', name: '토마토에그누들', source: 'Gemini AI', desc: '녹진하게 끓인 토마토탕에 달걀물을 풀고 생면을 익혀 먹는 히든 메뉴이다.',
      order: [['토마토탕훠궈', '', ''], ['날계란', '1', '개'], ['생면', '1', '인분']],
      ings: [['오향우육/다진 고기', '2', '스푼'], ['다진 파', '2', '스푼']],
      steps: [
        '토마토탕이 녹진(꾸덕)해질 때까지 충분히 끓여준다',
        '소스바에서 소스를 만든다',
        '날계란에 물을 조금 섞어 풀어준 뒤, 녹진해진 토마토탕 위에 구멍 뚫린 국자를 대고 계란물을 천천히 부어준다',
        '계란이 잘 익도록 국자로 탕을 잘 저어준다',
        '맑은 탕에 생면을 넣고 살짝 익힌 뒤, 토마토탕으로 옮겨 타지 않게 저으면서 잘 익혀준다',
        '면이 다 익으면 소스 그릇에 토마토계란탕을 끼얹고 면을 건져 먹는다',
      ],
      tip: '토마토탕훠궈 국물 안의 토마토를 국자로 으깨주기' },
  ];

  // ── 레시피 데이터 검사: 정식 목록에 없는 재료/단위/주문항목을 콘솔에 경고 ──
  // 새 레시피를 추가하다 오타를 내거나 다른 이름을 쓰면 여기서 바로 걸려요.
  // ※ 개발 중(로컬)에서만 콘솔에 출력 — 실제 사이트 방문자에겐 아무것도 안 보임.
  const IS_DEV = ['localhost', '127.0.0.1', ''].includes(location.hostname);
  (function validateRecipes() {
    if (!IS_DEV) return;
    const knownIng = new Set(SAUCE_BAR);
    const knownOrder = new Set(ORDER_ITEMS);
    const knownUnit = new Set(UNITS);
    const issues = [];
    RECIPES.forEach(r => {
      (r.ings || []).forEach(([name, , unit]) => {
        if (!knownIng.has(name)) issues.push(`재료 "${name}" — SAUCE_BAR 목록에 없음  ·  [${r.name}]`);
        if (unit && !knownUnit.has(unit)) issues.push(`단위 "${unit}" — UNITS 목록에 없음  ·  [${r.name}] ${name}`);
      });
      (r.order || []).forEach(([name, , unit]) => {
        if (!knownOrder.has(name)) issues.push(`주문항목 "${name}" — ORDER_ITEMS 목록에 없음  ·  [${r.name}]`);
        if (unit && !knownUnit.has(unit)) issues.push(`단위 "${unit}" — UNITS 목록에 없음  ·  [${r.name}] ${name}`);
      });
    });
    if (issues.length) {
      console.warn(`⚠️ 하딜고고: 정식 목록에 없는 항목 ${issues.length}건 — 오타이거나, 진짜 새 항목이면 목록에 추가하세요:`);
      issues.forEach(m => console.warn('   • ' + m));
    } else {
      console.info('✅ 하딜고고: 모든 재료·단위·주문항목이 정식 목록과 일치합니다.');
    }
  })();

  // 2026-07-25 확정: 카테고리 탭·즐겨찾기·검색·인물은 전부 서로 겹치는 필터(AND).
  // 🔴 옛 `browsing` 플래그는 없앴다(2026-08-03) — 홈이 탭으로 갈라져서 「지금 어느 화면인가」는
  //    하단바 탭(activeSection)이 곧 답이다. 한 탭 안에서 두 화면을 오가던 시절의 장치였다.
  let activeCat = '전체';       // 브라우즈 중 선택된 카테고리 탭('전체' 포함)
  let personFilter = null;      // 셀럽 레일에서 인물을 고르면 그 사람 레시피만(다른 필터와 겹침)
  let query = '';
  let showFavoritesOnly = false;
  const FAVORITES_KEY = 'haidilao_favorites';
  let favorites;
  try {
    favorites = new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY)) || []);
  } catch (err) {
    favorites = new Set();
  }
  function saveFavorites() {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
    } catch (err) {
      // 저장 공간이 없거나 접근이 막힌 경우는 무시
    }
    updateMarks(favorites, favMarks, FAV_MARKS_KEY); // 켠/끈 이력 갱신(합칠 때 필요)
    schedulePush(); // 서버 사본 갱신(맨 아래 「내 데이터 코드」 절)
  }

  // 좋아요: "내가 누른 것"(likedByMe)은 이 기기(localStorage)에만, "집계"(likeCounts)는
  // Firebase 실시간 DB로 전체 방문자 공유. likeCounts는 localStorage에도 캐시해서 즉시 표시.
  const LIKED_KEY = 'haidilao_liked';
  const LIKE_COUNTS_KEY = 'haidilao_like_counts';
  let likedByMe;
  try {
    likedByMe = new Set(JSON.parse(localStorage.getItem(LIKED_KEY)) || []);
  } catch (err) {
    likedByMe = new Set();
  }
  // 🔴 즐겨찾기·좋아요의 **켠/끈 이력**(2026-07-31). 맨 아래 「내 데이터 코드」 절에서 쓴다.
  //    { 레시피id: { v: 1(켬)|0(끔), t: 바꾼시각 } }
  //    왜 필요한가: 합치기가 "양쪽 걸 더하기"라서, 한 기기에서 끈 것이 다른 기기에 남아 있으면
  //    다시 살아 돌아온다(사용자가 지적). 스티커는 지운 id를 적어둬서 이런 일이 없다.
  //    ⚠️ 스티커와 달리 **껐다 다시 켤 수 있어서** "지웠다"만 적으면 다시 켜는 게 막힌다.
  //       그래서 시각까지 적고, 합칠 때 **나중에 바꾼 쪽이 이긴다.**
  const FAV_MARKS_KEY = 'haidilao_fav_marks';
  const LIKED_MARKS_KEY = 'haidilao_liked_marks';
  function loadMarks(key) {
    try { return JSON.parse(localStorage.getItem(key)) || {}; } catch (e) { return {}; }
  }
  let favMarks = loadMarks(FAV_MARKS_KEY);
  let likedMarks = loadMarks(LIKED_MARKS_KEY);
  // 지금 집합을 이력에 반영한다(새로 켠 것 / 사라진 것에 시각을 찍는다)
  function updateMarks(set, marks, key) {
    const now = Date.now();
    set.forEach((id) => { if (!marks[id] || marks[id].v !== 1) marks[id] = { v: 1, t: now }; });
    Object.keys(marks).forEach((id) => {
      if (marks[id].v === 1 && !set.has(id)) marks[id] = { v: 0, t: now };
    });
    try { localStorage.setItem(key, JSON.stringify(marks)); } catch (e) { /* 무시 */ }
  }

  let likeCounts;
  try {
    likeCounts = JSON.parse(localStorage.getItem(LIKE_COUNTS_KEY)) || {};
  } catch (err) {
    likeCounts = {};
  }
  // 🔴 집계(숫자)와 "내가 누른 것"은 반드시 따로 저장할 것.
  //    Firebase에서 숫자가 올 때마다 saveLikes()로 둘 다 쓰고 있었는데, 그러면 그 페이지 메모리의
  //    likedByMe가 localStorage를 덮어쓴다. 같은 사이트를 여러 창에 열어두거나 뒤로가기로 되돌아오면
  //    "좋아요는 그대로인데 하트만 흰색으로 초기화"되는 원인이었다(2026-07-25).
  //    숫자 갱신에는 saveLikeCounts()만 쓸 것.
  function saveLikeCounts() {
    try {
      localStorage.setItem(LIKE_COUNTS_KEY, JSON.stringify(likeCounts));
    } catch (err) {
      // 무시
    }
  }
  function saveLikes() {
    try {
      localStorage.setItem(LIKED_KEY, JSON.stringify([...likedByMe]));
    } catch (err) {
      // 무시
    }
    saveLikeCounts();
    updateMarks(likedByMe, likedMarks, LIKED_MARKS_KEY); // 켠/끈 이력 갱신(합칠 때 필요)
    schedulePush(); // 서버 사본 갱신(맨 아래 「내 데이터 코드」 절)
  }
  // 🔴 기본 좋아요(2026-07-30 사용자 확정) — 화면 숫자 = BASE_LIKES + 실제 방문자 좋아요.
  //    소스 20개 중 좋아요가 있는 건 4개뿐이고 16개가 0이라 "사람 없는 커뮤니티"처럼 보였다.
  //    Firebase 콘솔에서 숫자를 직접 고치는 방식은 안 쓴다(모바일에서 지옥이고 버전관리가 안 된다).
  //
  //    ⚠️ 여기 값은 "더미"이고 화면에 뜨는 숫자가 아니다. 실제 좋아요가 이미 있는 6개
  //       (s1·s2·s4·s19·r1·b7)는 표시값에서 실제분을 뺀 수가 들어 있다 —
  //       예: 화령소스는 실제 5개라 더미 6 + 실제 5 = 표시 11.
  //    ⚠️ 순서는 이 값이 정한다. 정렬은 byPopular 한 곳으로 통일돼 있으니 여기만 고치면 된다.
  //    ⚠️ 동점은 소스 두 쌍(10·6)뿐이고 일부러 남긴 것이다 — 실제 좋아요는 원래 겹친다.
  //       동점끼리는 byPopular의 타이브레이크(최신순)가 순서를 정하므로, 먼저 오길 원하는 쪽이
  //       더 최신 레시피인 자리에만 동점을 둘 수 있다. 아무 데나 동점을 만들면 순서가 뒤집힌다.
  const BASE_LIKES = {
    // 소스 — 표시: 17 11 10 9 8 8 7 6 5 5 5 5 4 4 3 3 3 2 2 0
    //   2026-07-30 사용자 재조정. 옛 값(38 24 22 …)은 아래쪽이 한 칸씩 떨어져 심어놓은 티가 났다.
    //   아래 주석의 순위는 화면에 실제로 나오는 순서다(사용자가 준 목록과 13~19위가 다르다 —
    //   동점이 많아 최신순 타이브레이크가 순서를 정하기 때문이고, 사용자가 "순서 안 지켜도 된다"고 확정했다).
    s1: 11,   // 1위  건희소스 오리지널 · 2021   (표시 17 = 더미 11 + 실제 6)
    s2: 10,   // 2위  쑨디2호소스 2022          (표시 11 = 더미 10 + 실제 1)
    s5: 10,   // 3위  영지소스 2025
    s19: 7,   // 4위  박은영소스 참기름          (표시  9 = 더미  7 + 실제 2)
    s21: 8,   // 5위  장하오소스            ┐ 동점 8
    s16: 8,   // 6위  건희소스 짭짤 · 2021   ┘
    s7: 7,    // 7위  마크소스
    s23: 6,   // 8위  영지소스 악마 · 2023
    s18: 5,   // 9위  세훈소스 마장         ┐
    s4: 0,    // 10위 화령소스              │ 동점 5 네 개. 최신순으로 이 순서가 된다.
    s26: 5,   // 11위 건희소스 2024         │ (표시 5 = 더미 0 + 실제 5 — 화령소스는 실제분만으로 5다)
    s3: 5,    // 12위 쑨디2호소스 2024      ┘
    s17: 4,   // 13위 세훈소스 간장         ┐ 동점 4 — 사용자 목록은 수코가 위였으나 세훈 간장이 더 최신
    s22: 4,   // 14위 수코소스              ┘
    s20: 3,   // 15위 박은영소스 마장       ┐ 동점 3 — 사용자 목록은 김풍이 위였으나 최신순으로 밀렸다
    s14: 3,   // 16위 라젤소스              │
    s24: 3,   // 17위 김풍소스              ┘
    s27: 2,   // 18위 건희소스 리뉴얼 · 2025 ┐ 동점 2 — 사용자 목록은 우기가 위였으나 리뉴얼이 더 최신
    s25: 2,   // 19위 우기소스              ┘
    s15: 0,   // 20위 라젤(이 아는 동생)소스  (사용자가 0으로 지정)
    // 탕 — 표시: 3 1 1 0 0 (2026-07-30 사용자 재조정. 옛 5 4 3 2 1은 한 칸씩 떨어져 심어놓은 티가 났다)
    //      🔴 홈 탕 카드엔 하트가 없어 숫자는 안 보이고 순서만 정한다(전체보기·상세에선 보인다).
    //      🔴 표시 순서는 혼자햐 → 지새기 → 토마토 → 스키야키 → 마라훠궈다.
    //         사용자가 준 순서는 토마토가 지새기보다 위였지만 둘 다 1점 동점이고 지새기탕에만
    //         날짜(2026-06-10)가 있어 최신순 타이브레이크로 지새기가 앞에 온다. 뒤집힌다고
    //         알렸고 사용자가 "순서 상관없이 그대로"라고 확정했다 — 고치려고 숫자를 건드리지 말 것.
    b6: 3,    // 혼자햐탕
    b4: 1,    // 토마토탕
    b7: 0,    // 지새기탕                  (표시 1 = 더미 0 + 실제 1)
    b3: 0,    // 스키야키탕                ┐ 둘 다 0. 날짜가 없어 RECIPES 배열 순서대로 b3 → b5
    b5: 0,    // 마라훠궈탕                ┘
    // 히든메뉴 — 표시: 5 3 2 2 1 1 1 0 (2026-07-30 사용자 재조정). 최고 5로 탕 최고 3보다 높다
    e1: 5,    // 1위 유부 새우완자
    r1: 0,    // 2위 메기살덮밥             (표시 3 = 더미 0 + 실제 3 — 사용자가 "실제 데이터 그대로"로 지정)
    r3: 2,    // 3위 희수국밥              ┐ 동점 2 — 희수국밥에만 날짜가 있어 앞에 온다
    n1: 2,    // 4위 토마토에그누들          ┘
    e3: 1,    // 5위 유부 새우완자 업그레이드  ┐ 동점 1 — e3가 가장 최신(2026-07-09)이라 맨 앞,
    r2: 1,    // 6위 토마토달걀밥            │ 나머지 둘은 날짜가 없어 RECIPES 배열 순서대로 r2 → e2
    e2: 1,    // 7위 토마토달걀만두          ┘
    n2: 0     // 8위 탄탄면                (사용자가 0으로 지정 — 여기만 0으로 보인다)
  };
  // 🔴 "실제 방문자 좋아요만"과 "화면에 보이는 숫자"를 반드시 갈라 쓸 것 (2026-07-30).
  //    likeCounts·Firebase에 저장되는 값은 언제나 실제분이다. 저장 계산에 표시값(더미 포함)을
  //    쓰면 더미가 실제값 자리에 저장돼, 좋아요를 취소하는 순간 숫자가 거꾸로 튀어오른다
  //    (더미 32 + 실제 6 = 38에서 취소 → 69로 뛴 뒤 Firebase 응답이 와서야 37로 제자리).
  function getRealLikeCount(id) {
    return likeCounts[id] || 0;
  }
  // 화면 표시·인기순 정렬용. 저장에는 절대 쓰지 않는다.
  function getLikeCount(id) {
    return (BASE_LIKES[id] || 0) + getRealLikeCount(id);
  }

  function setPressedState(el, active) {
    if (!el) return;
    el.classList.toggle('active', active);
    el.setAttribute('aria-pressed', String(active));
  }

  function bindRoleButtonKeyboard(el) {
    el.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      el.click();
    });
  }

  function trapFocusWithin(container, e) {
    if (e.key !== 'Tab') return;
    const focusable = Array.from(container.querySelectorAll(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter((el) => !el.hidden && el.getClientRects().length > 0);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  // 모달을 연 입력 방식에 따라 첫 초점 표시를 구분한다.
  // 손가락/마우스로 열었을 땐 iOS의 파란 네모만 숨기고, 키보드로 열었을 땐 초점 표시를 유지한다.
  let lastDialogInputWasKeyboard = false;
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' || e.key === 'Enter' || e.key === ' ') {
      lastDialogInputWasKeyboard = true;
    }
  }, true);
  document.addEventListener('pointerdown', () => {
    lastDialogInputWasKeyboard = false;
  }, true);
  function focusDialogClose(btn) {
    btn.classList.toggle('focus-silent', !lastDialogInputWasKeyboard);
    btn.addEventListener('blur', () => btn.classList.remove('focus-silent'), { once: true });
    btn.focus({ preventScroll: true });
  }

  // 같은 레시피의 하트가 여러 곳에 동시에 그려져 있다(홈 인기소스 .hp-like / 홈 리스트·브라우즈 .hc-row-like).
  // 어디서 눌렀든 '숫자 + 내가 누름(active)' 상태를 전부 같게 맞춘다.
  // 🔴 아래 refreshLikeCounts()는 숫자만 맞추므로 이걸 대신할 수 없다. 새 하트 UI를 추가하면
  //    여기 선택자에도 넣을 것 — 예전에 모달이 옛 선택자(.recipe-grid .like-btn)를 찾고 있어서
  //    모달에서 좋아요를 눌러도 카드 하트가 빨갛게 안 바뀌었다(2026-07-25).
  function syncLikeUI(id) {
    const sel = '.hp-like[data-id="' + id + '"], .hc-row-like[data-id="' + id + '"]';
    document.querySelectorAll(sel).forEach((el) => {
      setPressedState(el, likedByMe.has(id));
      const c = el.querySelector('.like-count');
      if (c) c.textContent = getLikeCount(id);
    });
  }

  // 하트 통통 팝 — 누른 그 순간에만 재생한다.
  // 🔴 애니메이션이 끝나면 .pop을 반드시 떼야 한다. 예전엔 계속 붙어 있어서, 즐겨찾기를 누르는 등
  //    그리드가 다시 그려질 때 카드가 DOM에 재삽입되며 CSS 애니메이션이 통째로 재생됐다
  //    ("즐겨찾기를 눌렀는데 하트가 통통 튄다", 2026-07-25).
  function popHeart(el) {
    el.classList.remove('pop');
    void el.offsetWidth; // 재시작을 위한 리플로우
    el.classList.add('pop');
    // ⚠️ animationend에만 기대면 안 된다 — 탭이 백그라운드면 애니메이션이 멈춰 이벤트가 영영 안 온다
    //    (미리보기 창에서 실제로 그랬음). 타이머로 확실히 뗀다(애니 .32s).
    clearTimeout(el._popT);
    el._popT = setTimeout(function () { el.classList.remove('pop'); }, 400);
  }

  // 화면에 그려진 하트 숫자들을 현재 likeCounts로 갱신 (active 상태는 기기별이라 건드리지 않음)
  function refreshLikeCounts() {
    // 홈 인기소스 칩(.hp-like)·홈 히든 리스트 하트(.hc-row-like) 모두 갱신
    // (옛 그리드 카드 `.like-btn`은 2026-07-30에 죽은 코드와 함께 선택자에서 뺐다. 모달 하트는
    //  아래 modalLikeCount로 따로 갱신한다 — 이 선택자에 새 하트를 추가할 땐 위 주석도 같이 고칠 것.)
    document.querySelectorAll('.hp-like, .hc-row-like').forEach((btn) => {
      const countEl = btn.querySelector('.like-count');
      if (countEl) countEl.textContent = getLikeCount(btn.dataset.id);
    });
    // 상세창은 카드와 별도 DOM이라 Firebase 갱신 경로에서 직접 맞춘다.
    if (currentModalRecipe && modalOverlay.classList.contains('open')) {
      modalLikeCount.textContent = getLikeCount(currentModalRecipe.id);
    }
  }

  // --- Firebase 실시간 DB 연결 ---
  let likesRef = null;
  let syncRoot = null; // 내 데이터 코드용. 연결 실패해도 앱은 로컬만으로 그대로 동작한다.
  try {
    if (window.firebase && firebase.initializeApp) {
      const firebaseConfig = {
        apiKey: 'AIzaSyDy3sMlz4lqMLXkdnty7GKh5ZHhwpve4ns',
        authDomain: 'haidilao-gogo.firebaseapp.com',
        databaseURL: 'https://haidilao-gogo-default-rtdb.asia-southeast1.firebasedatabase.app',
        projectId: 'haidilao-gogo',
        storageBucket: 'haidilao-gogo.firebasestorage.app',
        messagingSenderId: '648756978171',
        appId: '1:648756978171:web:497d1b4c3dfa3a65d8eb5e'
      };
      if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
      likesRef = firebase.database().ref('likes');
      syncRoot = firebase.database().ref('sync'); // 내 데이터 코드(맨 아래 절 참고)
      // 집계가 바뀔 때마다(내가/남이 눌렀든) 실시간으로 화면 숫자 갱신.
      // 🐛 첫 로드 땐 좋아요가 아직 도착 전이라 인기순이 전부 0으로 정렬돼 어긋남(사실상 가나다순).
      //    Firebase에서 좋아요가 처음 오면, 인기순일 때 딱 한 번 재정렬해 바로잡는다.
      //    (browseCardCache 재사용이라 깜빡임 없음. 이후엔 숫자만 갱신 — 사용자가 좋아요 눌렀을 때 카드가 튀지 않게.)
      let likesInitialSorted = false;
      likesRef.on('value', (snapshot) => {
        likeCounts = snapshot.val() || {};
        saveLikeCounts(); // ⚠️ saveLikes()를 쓰면 안 된다 — 위 주석 참고(하트 초기화 버그)
        if (!likesInitialSorted) {
          // 첫 도착: 인기순 그리드 재정렬 + 홈 인기소스 순위도 실데이터로 다시 그림
          renderList();
          if (typeof renderHomePopular === 'function') renderHomePopular();
          // 🔴 홈 탕·히든메뉴도 반드시 다시 그릴 것 (2026-07-30).
          //    이 둘도 byPopular로 정렬하는데 여기서 빠져 있어서, 첫 방문(localStorage 캐시가
          //    빈 상태)이면 좋아요가 0인 채로 그려진 순서가 그대로 남았다. 실제 좋아요가 있는
          //    메기살덮밥(3개)이 홈 히든메뉴 상위 3칸에서 밀려 안 보였다 — 라이브에서 확인.
          //    refreshLikeCounts()는 숫자만 갱신하고 순서는 건드리지 않으므로 이걸로는 안 된다.
          if (typeof renderHomeCatList === 'function') renderHomeCatList('히든메뉴', hiddenGridEl);
          // 🔴 전골은 여기서 다시 안 그린다 — 메뉴 육수라 좋아요와 무관하고 순서도 고정이다(2026-08-05)
          refreshLikeCounts();
        } else {
          refreshLikeCounts();
        }
        likesInitialSorted = true;
      });
    }
  } catch (err) {
    likesRef = null; // 연결 실패(오프라인 등) 시 로컬 캐시로만 동작
  }

  function toggleLike(id) {
    const liked = likedByMe.has(id);
    if (liked) {
      likedByMe.delete(id);
    } else {
      likedByMe.add(id);
    }
    // 낙관적 반영(즉시 반응) — Firebase 응답이 오면 정확한 값으로 덮어씀
    // 🔴 반드시 getRealLikeCount를 쓸 것. likeCounts는 실제 좋아요만 담는 자리이므로,
    //    화면 표시용 getLikeCount로 계산하면 나중에 더미가 섞여 저장된다(위 주석 참고).
    likeCounts[id] = Math.max(0, getRealLikeCount(id) + (liked ? -1 : 1));
    saveLikes();
    // Firebase: 원자적 증감(동시 접속에도 숫자 안 꼬임)
    if (likesRef) {
      likesRef.child(id).transaction((current) => Math.max(0, (current || 0) + (liked ? -1 : 1)));
    }
  }

  const gridEl = document.getElementById('recipeGrid');
  const countEl = document.getElementById('countNum');
  const searchInput = document.getElementById('searchInput');
  const searchClear = document.getElementById('searchClear');
  const searchBox = document.querySelector('.search-box');
  const favToggleBtn = document.getElementById('favToggleBtn');
  const favToggleIcon = document.getElementById('favToggleIcon');
  const homeBtn = document.getElementById('homeBtn');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalScroll = document.getElementById('recipe-modal-scroll');
  const modalClose = document.getElementById('modalClose');
  const modalFavBtn = document.getElementById('modalFavBtn');

  // 검색 보정: 괄호·공백을 뺀 형태로도 맞춘다(`라젤(이 아는 동생)소스` ↔ `라젤 이 아는 동생소스`)
  // 🔴 괄호·공백만 친 경우 이 값이 빈 문자열이 되는데, 빈 문자열은 아무 이름에나 들어 있어서
  //    그대로 쓰면 전부가 걸린다(2026-08-02 실제로 그랬다). 쓰는 쪽에서 반드시 비었는지 본다.
  const 검색꼴 = (s) => (s || '').replace(/[()\s]/g, '');
  function getFiltered() {
    const q = query.trim();
    // 카테고리 탭·즐겨찾기·검색·인물은 전부 서로 겹치는 이중 필터(AND)다(2026-07-25 확정) —
    // 예: 즐겨찾기 켠 채 '탕' 탭 → 즐겨찾기한 것 중 탕만. 검색 중 '소스' 탭 → 검색 결과 중 소스만.
    let filtered = RECIPES.filter((r) => activeCat === '전체' || r.cat === activeCat);
    if (personFilter) {
      filtered = filtered.filter((r) => r.person === personFilter);
    }
    if (showFavoritesOnly) {
      filtered = filtered.filter((r) => favorites.has(r.id));
    }
    if (q) {
      const nq = 검색꼴(q);          // 비면 아래 보정을 건너뛴다 — 안 그러면 전부가 걸린다
      filtered = filtered.filter((r) =>
        // 괄호·공백을 뺀 형태로도 맞춰본다 — 화면에 보이는 대로 쳐도, 빼고 쳐도 찾아진다
        // (예: `라젤(이 아는 동생)소스` ↔ `라젤 이 아는 동생소스`)
        r.name.includes(q) || (nq && 검색꼴(r.name).includes(nq))
        || (r.ings || []).some((i) => i[0].includes(q))
      );
    }
    // 정렬은 인기순 고정(2026-07-24 정렬 드롭다운 삭제 결정).
    // 🔴 반드시 byPopular를 쓸 것 — 동점 타이브레이크가 여기만 가나다순이었던 탓에,
    // 브라우즈에 4번째로 '보이는' 카드와 4위 배지를 '받는' 카드가 서로 달랐다(2026-07-25 발견).
    // 배지(sauceRankMap)·홈 인기소스 레일·홈 카테고리 목록이 전부 byPopular(동점=최신순)를 쓰므로
    // 정렬 기준은 이 한 곳으로 통일한다. 새 목록을 만들 때도 byPopular를 쓸 것.
    return filtered.slice().sort(byPopular);
  }

  // 출처 플랫폼 아이콘 (흰색 단색, 어두운 썸네일 위에 표시). 색은 CSS currentColor(흰색) 상속.
  const SRC_ICONS = {
    youtube: '<svg class="src-ic src-ic--yt" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
    twitter: '<svg class="src-ic src-ic--tw" viewBox="0 0 246.15 200.0126"><path d="M221.95 51.29c.15 2.17.15 4.34.15 6.53 0 66.73-50.8 143.69-143.69 143.69v-.04A142.966 142.966 0 0 1 1 178.83a102.726 102.726 0 0 0 12.02.73 101.407 101.407 0 0 0 62.72-21.66 50.564 50.564 0 0 1-47.18-35.07 50.338 50.338 0 0 0 22.8-.87 50.505 50.505 0 0 1-40.51-49.5v-.64a50.18 50.18 0 0 0 22.92 6.32 50.564 50.564 0 0 1-15.63-67.43 143.333 143.333 0 0 0 104.08 52.76 50.548 50.548 0 0 1 86.06-46.06 101.337 101.337 0 0 0 32.07-12.26 50.69 50.69 0 0 1-22.2 27.93 100.435 100.435 0 0 0 29-7.95 102.594 102.594 0 0 1-25.2 26.16Z" transform="translate(-1 -1.497)"/></svg>',
    x: '<svg class="src-ic" viewBox="0 0 128 115.7001"><path d="M100.808 0h19.627l-42.88 49.01L128 115.7H88.502L57.565 75.253 22.167 115.7H2.527L48.393 63.28 0 0h40.501l27.964 36.97Zm-6.89 103.952h10.877L34.592 11.131H22.92Z"/></svg>',
    naver: '<svg class="src-ic" viewBox="0 0 924.43 1000"><path d="M344.06 286.98c-70.27 0-135.39 22.03-188.86 59.55V70.18H0v858.3h155.2v-42.62c53.47 37.51 118.59 59.55 188.86 59.55 181.82 0 329.21-147.39 329.21-329.21s-147.4-329.22-329.21-329.22zm-14.78 514.64c-99.13 0-179.49-83.08-179.49-185.56S230.15 430.5 329.28 430.5s179.49 83.08 179.49 185.56-80.36 185.56-179.49 185.56zM862.35 0h62.08v1000h-62.08z"/></svg>',
    bubble: '<img class="src-ic" src="assets/icons/src-bubble.png?v=2" alt="" draggable="false">',
    mbc: '<img class="src-ic src-ic--mbc" src="assets/icons/src-mbc.png?v=1" alt="" draggable="false">',
    instagram: '<svg class="src-ic src-ic--ig" viewBox="0 0 264.58334 264.58334"><path d="M204.16 52.116c-26.716 0-30.069.117-40.562.594-10.473.479-17.621 2.136-23.876 4.567-6.47 2.51-11.959 5.869-17.427 11.335-5.472 5.464-8.833 10.948-11.354 17.412-2.439 6.252-4.099 13.397-4.57 23.858-.47 10.485-.593 13.838-.593 40.535 0 26.697.12 30.037.595 40.522.481 10.465 2.14 17.609 4.57 23.859 2.515 6.465 5.876 11.95 11.346 17.413 5.466 5.468 10.954 8.835 17.42 11.346 6.26 2.431 13.41 4.088 23.88 4.567 10.494.477 13.845.594 40.56.594 26.718 0 30.06-.117 40.554-.594 10.473-.48 17.63-2.136 23.889-4.567 6.468-2.51 11.948-5.878 17.414-11.346 5.472-5.463 8.833-10.948 11.354-17.411 2.418-6.252 4.078-13.398 4.57-23.859.472-10.485.594-13.827.594-40.524 0-26.697-.122-30.047-.594-40.533-.492-10.465-2.152-17.608-4.57-23.858-2.521-6.466-5.882-11.95-11.354-17.414-5.472-5.468-10.944-8.827-17.42-11.335-6.272-2.431-13.425-4.088-23.897-4.567-10.493-.477-13.834-.594-40.559-.594zm-8.824 17.715c2.619-.005 5.541 0 8.825 0 26.266 0 29.379.094 39.751.565 9.591.438 14.797 2.04 18.265 3.385 4.59 1.782 7.864 3.912 11.305 7.352 3.443 3.44 5.574 6.717 7.361 11.305 1.347 3.46 2.951 8.662 3.388 18.247.471 10.362.574 13.475.574 39.71 0 26.233-.103 29.346-.574 39.709-.439 9.584-2.041 14.786-3.388 18.247-1.783 4.587-3.918 7.854-7.361 11.292-3.443 3.44-6.712 5.57-11.305 7.352-3.464 1.352-8.674 2.95-18.265 3.388-10.37.47-13.485.573-39.751.573-26.268 0-29.381-.102-39.752-.573-9.591-.443-14.797-2.044-18.266-3.39-4.591-1.781-7.87-3.911-11.313-7.352-3.444-3.44-5.575-6.709-7.362-11.298-1.347-3.461-2.951-8.663-3.388-18.247-.471-10.363-.566-13.476-.566-39.726s.095-29.347.566-39.71c.439-9.584 2.041-14.786 3.388-18.251 1.783-4.587 3.918-7.864 7.362-11.305 3.443-3.44 6.722-5.57 11.313-7.356 3.467-1.351 8.675-2.949 18.266-3.39 9.075-.409 12.592-.532 30.927-.552zm61.336 16.322c-6.517 0-11.805 5.277-11.805 11.792 0 6.512 5.288 11.796 11.805 11.796 6.517 0 11.805-5.284 11.805-11.796 0-6.513-5.288-11.797-11.805-11.797zM204.16 99.935c-27.9 0-50.52 22.603-50.52 50.482 0 27.878 22.62 50.471 50.52 50.471 27.899 0 50.51-22.593 50.51-50.471 0-27.879-22.613-50.482-50.512-50.482zm0 17.715c18.109 0 32.791 14.67 32.791 32.767 0 18.095-14.682 32.767-32.791 32.767-18.111 0-32.792-14.672-32.792-32.767 0-18.098 14.68-32.767 32.792-32.767z" transform="translate(-71.815 -18.143)"/></svg>',
    // Gemini 반짝임(스파클) 별 — 어두운 배경/iOS 안전을 위해 컬러·블러 없이 흰색 단색 실루엣만 사용
    gemini: '<svg class="src-ic src-ic--gm" viewBox="0 0 65 65"><path d="M32.4473 0C33.1278 0 33.7197 0.464783 33.8857 1.125C34.3947 3.14441 35.0586 5.11414 35.8848 7.03027C38.0369 12.0299 40.99 16.406 44.7393 20.1553C48.4903 23.9045 52.8647 26.8576 57.8643 29.0098C59.7821 29.8359 61.7502 30.4998 63.7695 31.0088C64.4297 31.1748 64.8944 31.7668 64.8945 32.4473C64.8945 33.1278 64.4298 33.7198 63.7695 33.8857C61.7502 34.3947 59.7803 35.0586 57.8643 35.8848C52.8646 38.037 48.4885 40.99 44.7393 44.7393C40.99 48.4904 38.037 52.8646 35.8848 57.8643C35.0586 59.7822 34.3947 61.7502 33.8857 63.7695C33.7198 64.4298 33.1278 64.8945 32.4473 64.8945C31.7668 64.8944 31.1748 64.4297 31.0088 63.7695C30.4998 61.7502 29.8359 59.7803 29.0098 57.8643C26.8576 52.8647 23.9063 48.4885 20.1553 44.7393C16.4041 40.99 12.0299 38.0369 7.03027 35.8848C5.1123 35.0586 3.14441 34.3947 1.125 33.8857C0.464783 33.7197 0 33.1278 0 32.4473C0.0000867651 31.7668 0.464826 31.1748 1.125 31.0088C3.14442 30.4998 5.11413 29.836 7.03027 29.0098C12.03 26.8575 16.406 23.9046 20.1553 20.1553C23.9046 16.406 26.8575 12.03 29.0098 7.03027C29.836 5.11229 30.4998 3.14442 31.0088 1.125C31.1748 0.464826 31.7668 0.0000867651 32.4473 0Z" fill="currentColor"/></svg>',
  };
  // 출처 문자열 앞단어 → 아이콘 매핑 (예: "YouTube 채널십오야" → ▶ 채널십오야)
  const SRC_PREFIXES = [['YouTube ', 'youtube'], ['트위터 ', 'twitter'], ['X ', 'x'], ['네이버블로그 ', 'naver'], ['버블 ', 'bubble'], ['Gemini ', 'gemini'], ['MBC ', 'mbc'], ['Instagram ', 'instagram']];
  function sourceHtml(source) {
    for (let i = 0; i < SRC_PREFIXES.length; i++) {
      const p = SRC_PREFIXES[i][0];
      if (source.indexOf(p) === 0) {
        return SRC_ICONS[SRC_PREFIXES[i][1]] + '<span class="src-txt">' + source.slice(p.length) + '</span>';
      }
    }
    return '<span class="src-txt">' + source + '</span>';
  }

  // 연예인 "스타 표시" — 제목 첫 글자 왼쪽 위 골드 별 (그라데이션 def는 index.html)
  const STAR_SVG = '<svg class="star-accent" viewBox="0 0 24 24" fill="url(#starGold)" aria-hidden="true"><path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>';
  // 별 표시 카드 공용 헬퍼 — 모달에만 있던 별을 브라우즈 그리드·홈 인기소스·홈 히든메뉴 리스트에도 노출(2026-07-25).
  // 이름 좌측 위치는 별 유무와 무관하게 항상 같아야 하므로, 별은 항상 absolute(레이아웃 폭에 영향 없음)로만 넣는다.
  function starCls(r) { return r.star ? ' has-star' : ''; }
  function nameWithStar(r) { return (r.star ? STAR_SVG : '') + (r.nameHtml || r.name); }

  // ── 카드 제목 자동 맞춤 ──────────────────────────────────
  // 예전엔 "이름 10글자 이상이면 작게(recipe-name--long)"로 쟀는데, 글자마다 폭이 달라서
  // (한글 vs 영문/숫자, 괄호 수식어 .name-sub는 0.5em) 9글자인데 잘리거나 11글자인데 여유가
  // 남는 카드가 생겼다. 그래서 글자수 대신 **실제 렌더 폭**을 재서 들어갈 만큼만 줄인다.
  // 텍스트 폭은 폰트 크기에 거의 비례하므로 한 번에 필요한 크기를 계산하고, 반올림 오차만
  // 0.5px씩 마저 줄인다(카드 33장 × 매번 while 루프는 리플로우가 아까움).
  const TITLE_MIN_RATIO = 0.72; // 기준 크기의 72%가 하한 — 그보다 길면 나머지는 CSS ellipsis(…)에 맡긴다
  function fitCardTitle(el, minRatio) {
    // 폭 0 = 숨겨진 탭. 이땐 아무것도 건드리지 않는다(리셋해두면 다시 보일 때까지 잘린 채로 남음)
    if (!el.clientWidth) return;
    el.style.fontSize = ''; // CSS 기준 크기로 되돌리고 다시 잰다(캐시된 카드는 지난번 값이 남아 있음)
    const avail = el.clientWidth;
    if (el.scrollWidth <= avail) return;
    const base = parseFloat(getComputedStyle(el).fontSize);
    const min = base * (minRatio || TITLE_MIN_RATIO);
    let size = Math.max(min, base * (avail / el.scrollWidth));
    el.style.fontSize = size + 'px';
    for (let i = 0; i < 4 && size > min && el.scrollWidth > avail; i++) {
      size = Math.max(min, size - 0.5);
      el.style.fontSize = size + 'px';
    }
  }
  // 인기 소스는 한 줄을 유지하되, 넘치는 이름만 최대 16px→14px 범위에서 필요한 만큼 줄인다.
  // 짧은 이름은 CSS 기본 크기 그대로이며, 14px에서도 안 들어가는 극단적인 이름만 말줄임표를 유지한다.
  const POPULAR_TITLE_MIN_RATIO = 14 / 16;
  function fitPopularTitles(root) {
    (root || document).querySelectorAll('.hp-foot .hp-name')
      .forEach((el) => fitCardTitle(el, POPULAR_TITLE_MIN_RATIO));
  }
  // 전체보기 2열 카드: 기본 16px, 긴 이름만 줄이며 13px 아래로는 내려가지 않는다.
  const BROWSE_TITLE_MIN_RATIO = 13 / 16;
  function fitBrowseTitles(root) {
    (root || document).querySelectorAll('.hc-card--browse .hc-row-name')
      .forEach((el) => fitCardTitle(el, BROWSE_TITLE_MIN_RATIO));
  }
  // 웹폰트(Pretendard)가 늦게 오면 fallback 폰트 폭으로 잰 결과라 틀림 → 도착하면 전부 다시 잰다
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      fitPopularTitles();
      fitBrowseTitles();
    });
  }

  // ── 이 달의 레시피(월간 히어로 카레셀) ── 매월 자동 교체(서버 없이 월 계산). 큰 이미지 히어로 3-5개를 가로 스와이프.
  const monthlyFeatureEl = document.getElementById('monthlyFeature');
  const mfScroll = document.getElementById('mfScroll');
  const mfDots = document.getElementById('mfDots');
  const MONTHLY_COUNT = 4;

  // 👉 나중에 "이 달의 레시피"를 직접 고르려면 아래 함수를 특정 레시피 배열 반환으로 바꾸면 됨
  //    (예: return ['건희소스','마라훠궈탕',...].map(n => RECIPES.find(r => r.name === n)).filter(Boolean);)
  // ── 이 달의 소스 (첫 배너) ──────────────────────────────────
  // 규칙: 매월 1일에 소스 카테고리에서 하나로 자동 변경.
  // 특정 달을 손으로 지정하려면 아래 MONTHLY_SAUCE_PINS에 '연-월': 레시피id 를 추가하면
  // 그 달엔 그게 우선한다(자동선택 무시). 지정 없는 달은 monthIdx로 자동 순환.
  // 2026-07·08 = 박은영소스(참기름, s19) 고정 — 이번 달이 짧아 8월까지 유지(사용자 지정, 2026-07-23).
  const MONTHLY_SAUCE_PINS = {
    '2026-07': 's19',
    '2026-08': 's19',
  };
  function monthKey(now) {
    return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
  }
  function pickMonthlySauce(now) {
    const saucePool = RECIPES.filter((r) => r.cat === '소스' && r.img);
    if (!saucePool.length) return null;
    const pinId = MONTHLY_SAUCE_PINS[monthKey(now)];
    if (pinId) {
      const pinned = saucePool.find((r) => r.id === pinId);
      if (pinned) return pinned;
    }
    // 지정 없으면: 2026-01 기준 경과 월로 소스풀을 매월 한 칸씩 순환.
    const monthIdx = (now.getFullYear() - 2026) * 12 + now.getMonth();
    const idx = ((monthIdx % saucePool.length) + saucePool.length) % saucePool.length;
    return saucePool[idx];
  }
  // '이달의 소스' 배지 마크업 — 모달(.modal-badge-row)·브라우즈 그리드 카드(.hc-badge-slot) 공용(2026-07-25).
  const MONTHLY_BADGE_HTML = '<span class="monthly-badge">이달의 소스</span>';

  // ── 기획 칼럼(배너 2번 고정) ─────────────────────────────────
  // 레시피가 아닌 '읽을거리' 배너. 클릭 시 칼럼 패널이 열리고 하단에 관련 소스 자동 목록.
  // 배너 사진은 임시(초록 그라데이션+🌿) — 실제 사진 생기면 bannerImg에 경로만 넣으면 그걸 씀.
  // 하단 소스 목록은 ingFilter 재료가 ings에 든 레시피를 자동 수집(수동 관리 불필요).
  const GOSU_COLUMN = {
    id: 'col-gosu',
    isColumn: true,
    title: '고수 빼주세요!',
    heroDesc: '고수는 왜 비누 맛이 날까?',
    bannerImg: 'assets/columns/cilantro.jpg?v=2',
    bannerBg: 'linear-gradient(150deg,#3E7D4E 0%,#6FAE5C 55%,#AFD589 100%)',
    emoji: '🌿',
    ingFilter: '고수',             // 이 재료가 든 항목을 칼럼 하단에 자동 나열
    catFilter: '소스',             // 그중 이 카테고리만(요리·히든메뉴 제외, '소스'만)
    /* 🔴 「고수가 들어간 메뉴」(2026-08-05 사용자 요청) — 소스 목록 바로 아래 절.
       ⚠️ 소스는 재료(ingFilter)로 **자동 수집**되지만 메뉴는 **손으로 적는다.**
          메뉴 데이터에는 재료가 없어서 모을 근거가 없다. 이름은 `MENU_DATA` 의 것과 글자까지 같아야 한다.
       🔴 **여기가 원본이다.** 별도 주소 페이지(cilantro.html)는 복사본이고, 여기가 바뀌면
          거기도 반드시 같이 바꾼다(사용자가 정한 규칙). */
    menus: ['고수 듬뿍 훠궈', '고수'],
    body:
      // 도입부는 '훅 한 문장 + 설명 한 문단'으로 끊는다(2026-07-29). 안물안궁 도입부와 같은 꼴.
      '<p class="col-lead">고수를 한입 먹자마자 “어? 비누 맛인데?” 싶었다면 기분 탓만은 아니에요.</p>' +
      '<p class="col-lead">' +
      '누군가에게는 상큼한 허브지만, 누군가에게는 비누나 세제처럼 느껴지는 데에는 실제 이유가 있습니다.</p>' +
      '<figure class="col-figure">' +
        '<img src="assets/columns/cilantro/soap.webp?v=1" width="880" height="587" loading="lazy" decoding="async" alt="접시 위 비누에 고수가 올려진 모습">' +
        '<figcaption>비누가 없다면, 고수를 대신 써보세요</figcaption>' +
      '</figure>' +
      '<h3>진짜 비누가 들어 있는 건 아니에요</h3>' +
      // '과일과 식물' → '과일이나 다른 식물'(2026-07-29). 과일도 식물이라 위계가 어긋난 병렬이었다.
      // '과일'이라는 구체적인 말은 남긴다 — 독자가 아는 향을 떠올리는 실마리라서.
      '<p>고수 잎에는 향을 만드는 ‘알데하이드’라는 성분들이 들어 있어요. 과일이나 다른 식물에서도 자연적으로 발견되는 향 성분인데, ' +
      '그중 일부는 비누나 세제의 향을 만들 때도 사용됩니다.</p>' +
      // 마지막 문장을 떼어냈다(2026-07-29). 앞 두 문장은 성분 설명이고 이 문장은 '그래서 결론은'이라
      // 성격이 다르다. 한 덩어리일 때 6줄이었다(320px 상한 5줄).
      // 소제목 '진짜 비누가 들어 있는 건 아니에요'에 답하는 문장이라 따로 서면 눈에 들어온다.
      '<p>고수에 비누가 들어 있는 것은 아니지만, 비슷한 종류의 향 성분을 함께 가지고 있는 셈이에요.' +
      '</p>' +
      '<p>고수에서 노린재 같은 벌레 냄새가 난다는 사람도 있는데, 일부 곤충 역시 자신을 보호하기 위해 알데하이드 성분이 포함된 냄새를 내보내기 때문에 ' +
      '근거 없는 표현은 아닙니다.<button class="col-note-ref" type="button" data-note="1" aria-label="출처 1 보기">[1]</button></p>' +
      '<figure class="col-figure">' +
        '<img src="assets/columns/cilantro/tattoo.webp?v=2" width="880" height="1175" loading="lazy" decoding="async" alt="고수를 싫어한다는 문구와 고수 그림을 새긴 발목">' +
        '<figcaption>나는 고수가 싫어요</figcaption>' +
      '</figure>' +
      '<h3>같은 고수인데 왜 사람마다 다르게 느낄까?</h3>' +
      '<p>사람마다 냄새를 감지하는 방식에는 조금씩 차이가 있어요. 어떤 사람은 고수의 상큼한 향보다 비누를 떠올리게 하는 향을 더 강하게 느낍니다.</p>' +
      '<p>이 차이와 관련해 자주 언급되는 것이 냄새를 감지하는 <b>OR6A2 유전자</b>예요. 이 유전자가 고수의 알데하이드 향을 사람마다 다르게 느끼는 데 ' +
      '일부 영향을 줄 수 있다는 연구 결과가 있습니다.<button class="col-note-ref" type="button" data-note="2" aria-label="출처 2 보기">[2]</button></p>' +
      '<p>하지만 OR6A2 하나만으로 고수 취향이 결정되는 것은 아니에요. 어릴 때부터 고수를 자주 먹었는지, 그 향에 얼마나 익숙한지 같은 경험과 식문화도 ' +
      '함께 영향을 줄 수 있습니다.<button class="col-note-ref" type="button" data-note="3" aria-label="출처 3 보기">[3]</button></p>' +
      '<figure class="col-figure">' +
        '<img src="assets/columns/cilantro/review.webp?v=1" width="880" height="1092" loading="lazy" decoding="async" alt="고수를 추가해줘서 고맙다는 내용의 별점 5점 후기">' +
        '<figcaption>사장님 고수 좀 추가해주세요~</figcaption>' +
      '</figure>' +
      '<h3>고수에는 어떤 영양소가 있을까?</h3>' +
      '<p>고수에는 비타민 K를 비롯해 비타민 A와 C 등이 들어 있어요. 미국 농무부 자료에 따르면 생고수 약 4g에는 비타민 K가 12.4㎍ 들어 있습니다.' +
      '<button class="col-note-ref" type="button" data-note="4" aria-label="출처 4 보기">[4]</button></p>' +
      '<p>다만 고수는 보통 고명이나 향신 채소로 조금만 먹기 때문에 주요 영양 공급원으로 보기는 어려워요. 고수를 먹지 않더라도 다른 채소를 통해 필요한 ' +
      '영양소를 충분히 섭취할 수 있으니, 건강을 위해 억지로 먹을 필요는 없습니다.</p>' +
      '<figure class="col-figure col-figure--no-caption">' +
        '<img src="assets/columns/cilantro/couple.webp?v=1" width="880" height="587" loading="lazy" decoding="async" alt="고수를 빼달라는 티셔츠와 넣어달라는 티셔츠를 입은 커플">' +
      '</figure>' +
      '<h3>그래도 한번 도전해보고 싶다면</h3>' +
      '<p>생고수의 향이 너무 강하다면 처음부터 잎을 그대로 먹을 필요는 없어요.</p>' +
      '<p>하이디라오에서 처음 도전한다면 고수를 그대로 먹기보다, 땅콩참깨소스처럼 고소하고 진한 소스에 아주 조금만 섞어보세요. ' +
      '한 번에 많이 넣지 말고 맛을 본 뒤 조금씩 추가하면 부담을 줄일 수 있습니다.</p>' +
      '<p class="col-outro">그래도 싫다면 당당하게 “고수 빼주세요!”라고 말해도 괜찮아요. 같은 향을 사람마다 다르게 느끼는 것이니까요. ' +
      '반대로 조금 궁금해졌다면, 부담 없는 양으로 다시 한번 도전해봐도 좋고요.</p>',
    notes: [
      { label: '미국화학회 — 고수의 알데하이드와 비누·곤충 냄새', url: 'https://www.acs.org/education/chemmatters/articles/cilantro-delicious-or-disgusting.html' },
      { label: '고수 선호와 후각 수용체 주변의 유전적 차이 연구', url: 'https://link.springer.com/article/10.1186/2044-7248-1-22' },
      { label: '문화권별 고수 비선호율 연구', url: 'https://link.springer.com/article/10.1186/2044-7248-1-8' },
      { label: '미국 농무부 영양 데이터 — 생고수의 비타민 K', url: 'https://ods.od.nih.gov/pubs/usdandb/VitK-Phylloquinone-Content.pdf' },
    ],
  };

  // 예능 자막 밈처럼 제목 글자 사이에 끼우는 ↘ ↗ 화살표.
  // 글자(↘ U+2198 / ↗ U+2197)를 그냥 쓰면 iOS Safari가 컬러 이모지로 그려 제목 톤이 깨지고
  // 기기마다 모양이 달라진다 → 매장 핀·시계 아이콘과 같은 인라인 SVG로 그린다.
  // currentColor라 배너의 흰 제목·아티클의 어두운 제목 어디서나 글자색을 따라간다.
  const TITLE_ARROW_DOWN =
    '<svg class="ttl-arw" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<path d="M6 6 L18 18 M18 11 V18 H11"/></svg>';
  const TITLE_ARROW_UP =
    '<svg class="ttl-arw" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<path d="M6 18 L18 6 M11 6 H18 V13"/></svg>';

  // ── 훠궈·하이디라오 잡학 아티클(배너 3번 고정) ───────────────────
  // 제목은 2026-07-28에 '알쓸신잡' → '안물안궁' → '물어본 사람~ 궁금한 사람~'으로 확정.
  // id·이미지 파일명(hotpot-trivia)은 화면에 안 나오므로 그대로 둔다.
  const HOTPOT_TRIVIA_COLUMN = {
    id: 'col-hotpot-trivia',
    isColumn: true,
    // 그림 안에 제목 글씨가 구워져 있어 화면 제목도 같은 말로 맞춘다.
    // 한 줄로는 320px에서 감기므로 가이드 배너처럼 titleHtml로 일부러 두 줄로 끊는다.
    // 화살표는 읽어줄 필요가 없으니 titleHtml에만 넣는다(title은 낭독·aria용 순수 글자).
    title: '물어본 사람~ 궁금한 사람~',              // 접근성(aria)·칼럼 제목
    titleHtml: '물' + TITLE_ARROW_DOWN + '어본' + TITLE_ARROW_UP + '사람~<br>' +
               '궁' + TITLE_ARROW_DOWN + '금한' + TITLE_ARROW_UP + '사람~',
    heroDesc: '훠궈와 관련된 TMI',
    bannerImg: 'assets/columns/hotpot-trivia.webp?v=2',
    bannerBg: 'linear-gradient(150deg,#9F281F 0%,#C84A36 55%,#E89A61 100%)',
    emoji: '🍲',
    body:
      // 도입부는 '훅 한 문장 + 설명 한 문단'으로 끊는다(2026-07-29). 고수 도입부와 같은 꼴.
      // 한 덩어리일 때 145자·6줄이었다(320px 상한 5줄). 질문을 던지고 한 박자 쉬는 모양이 된다.
      '<p class="col-lead">훠궈를 먹으면서 그 이름이 무슨 뜻인지 생각해 본 적 있나요?</p>' +
      '<p class="col-lead">' +
      // 줄표(—) 앞뒤에 공백을 줬다(2026-07-29). 목록이 끝나고 반전이 시작되는 전환점인데
      // 글자에 바짝 붙어 있어 눈에 안 띄었다. 사이트에서 화면에 나오는 줄표는 여기 하나뿐이다.
      '훠궈와 하이디라오의 이름에 얽힌 이야기부터 마라가 입안을 얼얼하게 만드는 이유, 독특한 모양의 냄비와 온천까지 — ' +
      // 끝맺음은 제목('물어본 사람~ 궁금한 사람~')을 받는 셀프디스로 바꿨다(2026-07-28 사용자 확정).
      // 다만 '아무도 안 궁금해한다'만 두면 읽을 이유가 사라지고, 도입부 첫 문장이 독자에게 던진
      // 질문과도 부딪힌다 → '~지도 않지만, 알고 나면 은근 재밌는'으로 보상을 남겼다.
      // 'TMI'는 뺐다 — 바로 위 부제가 '훠궈와 관련된 TMI'라 두 줄 간격으로 겹친다.
      // '궁금해하다'는 한 단어라 '궁금해 하지'로 띄우지 말 것.
      '아무도 물어보지 않고 궁금해하지도 않지만, 알고 나면 은근 재밌는 이야기를 모았습니다.</p>' +
      '<figure class="col-figure col-figure--no-caption">' +
        '<img src="assets/columns/hotpot-trivia/mahjong.webp?v=1" width="880" height="496" loading="lazy" decoding="async" alt="마작패가 놓인 마작 테이블">' +
      '</figure>' +
      '<h3>훠궈와 하이디라오는 무슨 뜻일까?</h3>' +
      '<p><b>훠궈(火锅)</b>는 ‘불 화(火)’와 ‘솥 과(锅)’가 합쳐진 말이에요. 글자 그대로 풀면 ‘불 위의 냄비’라는 뜻으로, ' +
      '끓는 냄비에 고기와 채소를 직접 익혀 먹는 요리를 가리킵니다.</p>' +
      '<p><b>하이디라오(海底捞)</b>는 ‘바다 밑에서 건져 올리다’라는 뜻이에요. 하지만 식당 이름의 유래는 바다가 아니라 마작에 있습니다.</p>' +
      '<p>마작에서는 마지막 패로 승리하는 것을 ‘하이디라오웨(海底捞月)’라고 해요. ‘바다 밑에서 달을 건져 올린다’는 뜻으로, ' +
      '쓰촨에서는 이를 줄여 ‘하이디라오’라고 부르기도 합니다.</p>' +
      '<p>하이디라오 창업자 장융이 식당 이름을 정하지 못해 고민하던 어느 날, 옆에서 마작을 하던 당시 여자친구가 마지막 패로 승리했어요. ' +
      // '고민 중인'을 뺐다(2026-07-29) — 앞 문장의 '이름을 정하지 못해 고민하던'과 같은 말이 겹쳤다.
      '점수가 크게 붙는 승리여서 기뻐하던 여자친구는 장융에게 “그냥 하이디라오라고 하는 게 낫겠다”고 제안했습니다.</p>' +
      // 여기서 문단을 끊었다(2026-07-29). 앞은 '그날 벌어진 일'(고민 → 승리 → 제안)이고
      // 아래는 '그래서 어떻게 됐다'는 결말이라 화제가 바뀐다. 한 덩어리일 때 193자·7줄로
      // 이 아티클에서 가장 길었다(320px 기준 상한은 5줄). 나눠서 5줄 + 3줄이 된다.
      // '장융도' → '장융은'(2026-07-29). 조사 '도'는 앞에 짝이 되는 사람이 있어야 하는데,
      // 여자친구는 이름을 '제안'했지 '좋은 이름이라고 생각'한 게 아니라 짝이 성립하지 않았다.
      '<p>장융은 듣자마자 좋은 이름이라고 생각했고, 그렇게 지금의 하이디라오가 탄생했다고 합니다.' +
      '<button class="col-note-ref" type="button" data-note="1" aria-label="출처 1 보기">[1]</button></p>' +
      '<figure class="col-figure col-figure--no-caption">' +
        '<img src="assets/columns/hotpot-trivia/yuan-dynasty.webp?v=1" width="880" height="880" loading="lazy" decoding="async" alt="원나라 군대가 야영지에서 음식을 준비하는 모습">' +
      '</figure>' +
      '<h3>양고기 훠궈는 전쟁터에서 태어났다고?</h3>' +
      '<p>전쟁 중 원나라 황제 쿠빌라이 칸이 요리사에게 양고기 요리를 주문했는데, 음식을 준비하던 사이 적군이 다가오고 있다는 소식이 전해졌다고 해요.</p>' +
      '<p>시간이 부족했던 요리사는 양고기를 아주 얇게 썰어 끓는 물에 빠르게 익힌 뒤 양념을 곁들여 내놓았습니다.</p>' +
      // 여기서 문단을 끊었다(2026-07-29). 앞은 요리사가 한 일, 뒤는 그 뒤로 어떻게 됐다는 결말이라
      // 창업 일화와 같은 구조다. 한 덩어리일 때 156자·6줄이었다(상한 5줄).
      // 또 '나섰고,' → '나섰어요.'로 끊고 '얇은 양고기를 끓는 물에 데쳐 먹는'을 뺐다 —
      // 바로 앞 문장이 이미 그 조리법을 설명해서 수식이 세 겹으로 겹쳤다.
      '<p>황제는 급히 식사를 마치고 전투에 나섰어요. 이후 이 요리가 중국식 양고기 훠궈인 ‘솬양러우(涮羊肉)’가 ' +
      '되었다는 이야기가 전해집니다.<button class="col-note-ref" type="button" data-note="2" aria-label="출처 2 보기">[2]</button></p>' +
      '<figure class="col-figure col-figure--no-caption">' +
        '<img src="assets/columns/hotpot-trivia/sichuan-pepper.webp?v=1" width="880" height="880" loading="lazy" decoding="async" alt="나무 그릇과 탁자 위에 놓인 붉은 화자오">' +
      '</figure>' +
      '<h3>마라를 먹으면 왜 입안이 얼얼할까?</h3>' +
      '<p><b>마라(麻辣)</b>는 ‘저릴 마(麻)’와 ‘매울 랄(辣)’이 합쳐진 말로, ‘마’는 혀와 입술이 저리고 마비된 듯한 얼얼함을, ' +
      '‘라’는 화끈하게 매운맛을 뜻합니다.</p>' +
      '<p>이 두 감각을 만드는 재료도 서로 달라요. 고추의 캡사이신이 화끈한 매운맛을 만든다면, 얼얼한 감각을 만드는 주인공은 ' +
      '<b>화자오(花椒)</b>입니다.</p>' +
      '<p>화자오에 들어 있는 산쇼올 성분은 입안의 감각 신경을 자극해 미세한 진동과 비슷한 얼얼함을 일으켜요. ' +
      '그래서 마라를 먹으면 단순히 맵기만 한 것이 아니라, 혀와 입술이 찌릿하고 떨리는 듯한 감각까지 함께 느껴지는 것입니다.' +
      '<button class="col-note-ref" type="button" data-note="3" aria-label="출처 3 보기">[3]</button></p>' +
      '<figure class="col-figure col-figure--no-caption">' +
        '<img src="assets/columns/hotpot-trivia/9-grid-hotpot.webp?v=1" width="880" height="496" loading="lazy" decoding="async" alt="아홉 칸으로 나뉜 충칭식 훠궈 냄비">' +
      '</figure>' +
      '<h3>아홉 칸으로 나뉜 훠궈 냄비가 있다고?</h3>' +
      '<p>하이디라오에서는 하나의 냄비를 최대 네 칸으로 나눌 수 있어요. 그런데 충칭에는 냄비를 아홉 칸으로 나눈 ' +
      '<b>구궁격 훠궈(九宫格火锅)</b>가 있습니다.</p>' +
      // '사용했는데요' → '사용했어요'(2026-07-29). '-는데요'는 뒷말을 끌고 오는 구어체인데
      // 마침표로 끊겨 있어 어정쩡했고, 이 아티클에서 여기 한 번만 나와 문체가 튀었다.
      '<p>과거 부두의 노점에서는 서로 모르는 손님들이 큰 냄비 하나를 함께 사용했어요. 각자 자기 칸을 정해 재료가 섞이지 않게 먹고, ' +
      '먹은 만큼 따로 계산하기 위해 칸을 나눴다는 이야기가 전해집니다.</p>' +
      // '끓여요' → '끓입니다'(2026-07-29). 🔴 이 두 아티클의 문체 규칙:
      //   독자에게 말 거는 문장은 해요체, 사실·근거를 대는 문장은 합쇼체.
      //   특히 출처 번호가 붙은 문장은 합쇼체로 통일한다 — 9개 중 이 한 곳만 해요체였다.
      //   (가이드가 해요체 전용인 건 출처를 대는 글이 아니라 따라 하라고 안내하는 글이라서다.)
      '<p>오늘날에는 칸마다 끓는 정도가 다른 점을 이용해 가운데에서는 고기를 빠르게 익히고, 가장자리에서는 오래 익힐 재료를 천천히 끓입니다.' +
      '<button class="col-note-ref" type="button" data-note="4" aria-label="출처 4 보기">[4]</button></p>' +
      '<figure class="col-figure col-figure--no-caption">' +
        '<img src="assets/columns/hotpot-trivia/harbin-hotpot-spa.webp?v=1" width="880" height="1174" loading="lazy" decoding="async" alt="붉은 탕과 흰 탕으로 나뉜 훠궈 모양 온천을 즐기는 사람들">' +
      '</figure>' +
      '<h3>훠궈에 고기 대신 사람이 들어간다고?</h3>' +
      '<p>하얼빈의 펑예샤오전 온천 리조트(枫叶小镇温泉度假区)에는 거대한 훠궈 냄비처럼 꾸민 온천이 있어요. ' +
      '온천은 붉은 탕과 흰 탕으로 나뉘고, 물 위에는 고추와 채소까지 떠다녀 보기만 해도 온몸이 얼얼해질 것 같습니다.</p>' +
      '<p>하지만 실제로 매운 훠궈 국물을 사용한 것은 아니에요. 붉은 탕은 빨간 조명으로 색을 연출하며, 떠다니는 채소 중 일부는 모형이라고 합니다.' +
      '<button class="col-note-ref" type="button" data-note="5" aria-label="출처 5 보기">[5]</button></p>',
    notes: [
      { label: '중국요리협회 — 하이디라오 창업자 장융 인터뷰', url: 'https://m.ccas.com.cn/site/content/102709.html' },
      { label: 'CCTV — 솬양러우 기원에 관한 세 가지 전설', url: 'https://big5.cctv.com/gate/big5/discovery.cctv.com/20070626/103803.shtml' },
      { label: '영국왕립학회 — 화자오의 산쇼올이 일으키는 진동 감각 연구', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3779329/' },
      { label: '중국요리협회 — 충칭 훠궈의 변천', url: 'https://m.ccas.com.cn/site/content/102250.html' },
      { label: '중국관광신문 — 펑예샤오전의 원앙궈 온천', url: 'https://www.ctnews.com.cn/hlj/content/2024-12/26/content_168745.html' },
    ],
  };

  // ── 가이드 배너(항상 마지막 고정) ────────────────────────────
  // 홈 아래쪽 '하이디라오가 처음인 당신에게' 가이드를 놓치는 사람이 많아, 히어로 마지막 칸에도
  // 한 번 더 노출. 홈 배너와 히어로 배너 모두 이 아티클을 연다(내용 공유).
  // 아티클은 고수·알쓸신잡과 같은 칼럼 패널(openColumn)을 그대로 쓴다 — 배너 스타일만
  // isGuide로 구분(.mf-hero--guide). 본문은 STEP 1(확정)과 STEP 2(2026-07-29 초안)까지 들어 있다 —
  // STEP 3·BONUS·마무리는 아직 없다. STEP 2 아래 🔴 주석에 미확인 항목이 적혀 있다.
  const GUIDE_BANNER = {
    id: 'banner-guide',
    isGuide: true,
    title: '어서와~ 하이디라오는 처음이지?',            // 접근성(aria)·칼럼 제목
    titleHtml: '어서와~<br>하이디라오는 처음이지?',       // 배너 표시용(두 줄)
    heroDesc: '주문부터 소스바 사용까지 · 가이드',
    bannerImg: 'assets/columns/guide.jpg?v=1',
    bannerBg: 'linear-gradient(150deg,#C6402E 0%,#E5704A 55%,#F2A878 100%)',
    emoji: '📖',
    body:
      // 도입부는 '훅 한 문장 + 설명 한 문단'으로 끊는다(2026-07-29). 고수·안물안궁 도입부와 같은 꼴.
      // 여기는 4줄이라 길이 문제는 없었고, 아티클 셋의 도입부 형식을 맞추려고 나눈 것이다.
      '<p class="col-lead">하이디라오 방문이 처음이라면, 기다리는 동안 미리 알아보세요.</p>' +
      '<p class="col-lead">태블릿 주문부터 소스 만들기까지, 하딜고고가 하이디라오를 편하게 즐길 수 있도록 도와드릴게요.</p>' +
      // 이미지 안에 제목과 01·02·03 문구가 다 있어 웹 글자로 중복 표시하지 않음(사용자 지정).
      '<figure class="col-figure col-figure--no-caption">' +
        '<img src="assets/columns/guide/order-overview.webp?v=2" width="850" height="1400" loading="lazy" decoding="async" alt="한눈에 보는 이용 순서 — 01 태블릿으로 주문하기, 02 소스바에서 소스 만들기, 03 재료 넣고 익혀 먹기">' +
      '</figure>' +
      // 'STEP 1'은 아래 소제목들(재료·소스바·추천)과 급을 구분하려고 붙인 큰 단계 표시다
      // (2026-07-28 사용자 확정, 옛 표기는 '01'). 맨 위 '한눈에 보는 이용 순서' 그림은
      // '01'로 구워져 있는데, 숫자가 같아 독자가 헷갈리지 않는다고 보고 그림은 두었다.
      // --1: 번호 색을 요약 그림의 01(주황)과 맞춘다. STEP 2·3은 --2(초록)·--3(빨강)을 붙이면 된다.
      // STEP 앞마다 구분선(2026-07-29 사용자 지정, 네이버 블로그식). 마무리 앞에도 하나 더 있다.
      '<hr class="col-divider">' +
      '<h3 class="column-step column-step--1"><span class="step-no">STEP 1</span>태블릿으로 주문하기</h3>' +
      '<p>자리를 안내받으면, 태블릿에서 가장 먼저 먹고 싶은 탕을 골라요.</p>' +
      '<figure class="col-figure col-figure--no-caption">' +
        '<img src="assets/columns/guide/tablet-order.webp?v=2" width="880" height="620" loading="lazy" decoding="async" alt="태블릿 주문 화면에서 전골 4가지 맛을 골라 네 칸으로 나뉜 냄비가 표시된 모습">' +
      '</figure>' +
      // '전골'은 태블릿 실제 선택지 명칭이라 그대로 쓰고, 그 뒤로는 탕·물 칸으로 통일(기획초안 지침).
      // 전골=냄비를 몇 칸으로 나눌지, 탕=각 칸에 담기는 국물 — 첫 방문자가 둘을 헷갈려서 한 문장에 관계를 드러냄.
      // 드래그는 보이지 않는 동작이라 알려줄 값어치는 있으나 필수는 아니라 앞 문장에 딸린 부가 설명으로 붙임.
      '<p>전골 1맛·2가지 맛·4가지 맛 중에서 냄비를 몇 칸으로 나눌지 고르고, 각 칸에 먹고 싶은 탕을 선택하면 돼요. 탕 위치는 냄비 그림에서 드래그해 원하는 자리로 옮길 수 있어요.</p>' +
      '<figure class="col-figure col-figure--no-caption">' +
        '<img src="assets/columns/guide/hotpot-flavor-select.webp?v=3" width="880" height="382" loading="lazy" decoding="async" alt="전골 1맛·2가지 맛·4가지 맛의 냄비 칸 구성을 나란히 비교한 그림">' +
      '</figure>' +
      '<p>전골 구성에 따라 한 칸의 크기와 탕 가격이 달라요. 2가지 맛은 한 칸의 양이 더 많아 같은 탕도 가격이 더 높고, 4가지 맛은 한 칸의 양이 적어 가격도 더 낮아요.</p>' +
      // 인원별 숫자 예시(4명=탕3+물1 등)는 공식이 아니라 넣지 않기로 확정 — 일반 안내 문구만 둔다.
      '<p>인원수만큼 탕을 고르거나 모든 칸을 탕으로 채울 필요는 없어요. 일행의 취향과 맛보고 싶은 탕의 개수에 맞게 고르면 돼요.</p>' +
      // 추천은 소제목(h3)이 아니라 팁 박스로 뺀다(2026-07-28 사용자 확정) — h3에는 절차만 남긴다.
      // 딸린 두 문단(4가지 맛이 좋은 이유 / 맑은 탕 활용법)도 같은 추천의 일부라 함께 넣는다.
      '<div class="col-tip">' +
        '<img class="col-tip-ic" src="assets/icons/bulb.png?v=1" alt="" width="18" height="18" draggable="false">' +
        '<div class="col-tip-body">' +
          '<b class="col-tip-title">처음이라면 전골 4가지 맛을 추천해요</b>' +
          '<p>여러 탕을 조금씩 맛볼 수 있고, 먹고 싶은 탕만 고른 뒤 나머지 칸은 0원인 맑은 탕(물)으로 선택할 수도 있어요.</p>' +
          // '넣어' → '셀프소스바에서 재료를 가져와서': 재료를 직접 가지러 간다는 동작이 드러나야
          // 바로 뒤 'STEP 2 소스바에서 소스 만들기'로 이어진다(2026-07-28 사용자 지정).
          // 앞 문단에서 '맑은 탕(물)'로 한 번 밝혔으므로 여기선 '맑은 탕'으로 받는다.
          '<p>맑은 탕은 셀프소스바에서 재료를 가져와서 나만의 탕을 만들거나, 국자를 헹구는 용도로 활용할 수 있어요.</p>' +
        '</div>' +
      '</div>' +
      // 재료 주문·소스바 인원은 기획초안에서 각각 'STEP 3'·'STEP 2'였지만, 둘 다 태블릿에서
      // 하는 일이라 01 안에 넣는다(2026-07-28 사용자 확정). 별도 '02' 섹션으로 세우면 맨 위
      // '한눈에 보는 이용 순서' 그림의 02(소스바에서 소스 만들기)와 번호가 어긋나 독자가 헷갈린다.
      //
      // 🔴 순서는 탕 → 재료 → 소스바다(2026-07-28 사용자 확정, 기획초안과 반대). 되돌리지 말 것 —
      //   재료를 담아야 소스를 만들 이유가 생기고, 그 다음이 '02 소스바에서 소스 만들기'라
      //   매장에서 실제 움직이는 동선과 맞는다.
      //
      // 기획초안의 '※ 꼭 따라야 하는 순서는 아니에요' 각주는 넣지 않았다 —
      // 바로 아래 '처음부터 많이 시키지 않아도 괜찮아요'가 이미 같은 말을 하고 있어 겹친다.
      //
      // 🔴 소제목의 '육류·야채류'는 태블릿 메뉴의 실제 분류명이다(사용자 확인) — 화면에서 찾을
      //   이름 그대로 보여준다. 본문의 '고기와 채소'는 우리 문장이라 사이트 표기(채소 8회 / 야채 0회)를
      //   따른다. 이 둘은 일부러 다르게 쓴 것이니 한쪽으로 통일하지 말 것.
      // 🔴 소제목에 '탕에 넣어'를 넣으면 320px에서 281px이 되어 자리(276px)를 5px 넘겨 두 줄이 된다.
      //   그래서 그 말은 본문으로 내렸다(실측). 소제목을 늘릴 땐 다시 재볼 것.
      // '스와이프'·'쓸어내려' 대신 '화면을 내려' — 대기 줄의 전 연령이 한 번에 알아듣는 말을 고름.
      // 문단에 '태블릿'이 두 번 나오지 않게 앞쪽은 생략했다. 뒤의 '옆에 있는 태블릿'은 남긴다 —
      // 직원을 부르지 않고 자리에서 바로 추가할 수 있다는 정보라 값어치가 있다.
      '<h3>육류·야채류 등 먹을 재료를 주문해요</h3>' +
      // 배치는 '태블릿으로 주문하기' 그림과 같은 문법 — 짧은 안내 한 문장 → 그림 → 나머지 설명.
      // "화면을 내리라"는 말을 읽자마자 그 화면을 보게 된다. 그래서 한 문단이던 것을 그림 앞뒤로 나눴다
      // (문장은 그대로, 나누기만 함 — 2026-07-28 사용자 확정).
      '<p>이제 화면을 내려 고기와 채소, 버섯, 두부 등 탕에 넣어 먹을 재료를 골라요.</p>' +
      '<figure class="col-figure col-figure--no-caption">' +
        '<img src="assets/columns/guide/tablet-ingredients.webp?v=1" width="880" height="619" loading="lazy" decoding="async" alt="태블릿의 재료 주문 화면 — 소고기·삼겹살·새우·두부·버섯·채소가 격자로 놓여 있다">' +
      '</figure>' +
      '<p>처음부터 많이 시키지 않아도 괜찮아요. 먹어보고 부족하면 옆에 있는 태블릿으로 언제든 추가할 수 있어요.</p>' +
      // 추천이라 소제목이 아니라 팁 박스로 둔다(전골 4가지 맛 추천과 같은 규칙).
      // 마지막 줄은 하딜고고 히든메뉴로 이어지는 자리 — 재료를 고르는 이 대목이 가장 자연스럽다.
      '<div class="col-tip">' +
        '<img class="col-tip-ic" src="assets/icons/bulb.png?v=1" alt="" width="18" height="18" draggable="false">' +
        '<div class="col-tip-body">' +
          '<b class="col-tip-title">첫 주문이 고민된다면 이렇게 골라보세요</b>' +
          // '먹다가 더 들어갈 것 같으면'은 구어체라 글에서 튄다 → '배가 덜 찼다면'.
          // 먹어본 뒤라는 시점이 말 안에 담기고, 바로 위 본문의 '부족하면'과도 말이 겹치지 않는다.
          '<p>고기 + 채소·버섯 + 두부·완자를 먼저 고르고, 배가 덜 찼다면 면이나 사이드 메뉴를 추가해보세요.</p>' +
          '<p>색다르게 먹고 싶다면 하딜고고의 히든메뉴를 참고해보세요!</p>' +
        '</div>' +
      '</div>' +
      // 🔴 소스바 대목의 결정들(2026-07-28 사용자 확정). 되돌리지 말 것.
      //   - 소제목·본문의 '셀프소스바'는 태블릿 실제 표기('셀프소스바 (1인)')를 따른 것이다.
      //     여기 말고 사이트의 다른 '소스바' 30여 곳은 그대로 둔다 — 같이 바꾸지 말 것.
      //   - 옛 소제목 '소스바를 이용할 사람 수만큼 선택해요'는 "일행 전체가 아니라 쓸 사람만
      //     고르면 된다"로 읽히는데 그게 맞는지 확인되지 않아 뺐다.
      //     소스바 이용이 자율인지 강제인지는 아예 건드리지 않는다.
      //   - **요금은 있다고 확정해서 쓴다.** 불확실한 건 금액이지 요금의 존재가 아니다
      //     (기획초안·공개 자료 모두 유료라 하고 무료라는 자료는 없다).
      //   - **금액은 쓰지 않는다.** 지점·시기마다 다르고(태블릿 3,000원 / 제주·부산 메뉴 3,500원)
      //     어차피 태블릿에 뜬다. '지점에 따라 다를 수 있어요' 같은 부연도 넣지 않는다.
      //   - 요금과 '즐기는 핵심'을 한 문장에 묶는다 — 비용을 인정하자마자 이유를 대야
      //     '그럴 만하다'로 읽힌다. 따로 떼면 요금이 그냥 부담으로만 남는다.
      '<h3>셀프소스바 이용 인원도 선택해요</h3>' +
      '<p>재료까지 골랐다면, 소스바를 이용할 인원수도 함께 선택해요. 셀프소스바는 별도 요금이 있지만, 하이디라오를 제대로 즐기는 핵심이에요.</p>' +
      // 태블릿의 소스바 항목 카드. 앞 문단(인원수 선택)을 설명하는 그림이라 그 아래에 둔다
      // — 사진은 바로 위/아래 문단과 한 덩어리로 읽히게 배치한다는 STEP 1 규칙과 같다.
      // 원본이 826px라 880으로 확대하지 않았다(작은 원본은 키우지 않는다).
      // 🔴 그림 속 가격은 사용자가 일부러 'W ●,●●●'로 가려뒀다. 다시 만들 일이 있어도 금액은 넣지 말 것.
      // --narrow: 세로로 긴 그림이라 폭을 60%로 줄인다(styles.css의 규칙 주석 참고).
      '<figure class="col-figure col-figure--no-caption col-figure--narrow">' +
        '<img src="assets/columns/guide/sauce-bar-qty.webp?v=1" width="826" height="1340" loading="lazy" decoding="async" alt="태블릿의 셀프소스바 (1인) 항목 카드와 인원을 더하는 버튼">' +
      '</figure>' +
      // '무엇을 넣어야 할지 모르겠다면 하딜고고에서 취향에 맞는 레시피를 찾아보세요!'는
      // 2026-07-28에 여기서 빼 STEP 2에서 쓰기로 했으나, 2026-07-29에 STEP 2에서도 안 쓰기로 최종
      // 결정됐다(STEP 2 팁 박스의 🔴 주석 참고). 지금은 어디에도 안 쓰이는 문장이다.
      // 앞 절('다양한 재료를 원하는 대로 조합해 나만의 소스를 만들 수 있고')은 뺐다(2026-07-29) —
      // STEP 2가 '다양한 재료가 놓여 있어요'·'취향대로 조합해보세요'로 같은 말을 두 번 한다.
      // 여기는 요금을 납득시키는 자리로만 두고, 재료 조합 이야기는 STEP 2에 맡긴다.
      '<p>같은 탕에 같은 고기를 먹어도 어떤 소스를 곁들이느냐에 따라 맛이 완전히 달라지기 때문에 소스바 이용을 추천해요.</p>' +
      // ── STEP 2 ────────────────────────────────────────────────
      // 🔴 2026-07-29 초안 상태다. 사용자가 다음 날 읽고 고치기로 하고 먼저 넣은 것이라
      //    아래 세 가지는 아직 확인받지 못했다. 그대로 확정본으로 취급하지 말 것:
      //    (1) ✅해소 — 그릇은 소스바 하단에 있다(2026-07-29 사용자 확인). 문장에 위치를 명시함.
      //    (2) ✅해소 — 소스바 왕복은 자유롭다(2026-07-29 사용자 확인). 팁 박스 전제가 맞았다.
      //    (3) 팁 박스 내용 — 기획초안의 '여럿이 왔다면 소스팀·주문팀으로 나눠보세요'를 쓸지 물었으나
      //        지금 순서(태블릿 주문을 다 끝내고 소스바로 감)와 안 맞아 보여 아래 안으로 대체했다.
      // 제목은 맨 위 '한눈에 보는 이용 순서' 그림의 '02 소스바에서 소스 만들기' 그대로 맞췄다
      // (STEP 1이 그림의 '01 태블릿으로 주문하기'와 같은 것과 동일한 규칙).
      '<hr class="col-divider">' +
      '<h3 class="column-step column-step--2"><span class="step-no">STEP 2</span>소스바에서 소스 만들기</h3>' +
      // '자리에서 일어나'는 STEP 1의 소스바 대목과 구분하려고 넣었다(2026-07-29).
      // STEP 1은 앉아서 태블릿으로 인원을 고르는 일, 여기는 실제로 걸어가는 일인데
      // 둘 다 '소스바'라고만 하면 독자가 "아까 했는데 또?" 하고 멈춘다.
      '<p>주문을 마쳤다면, 음식이 준비되는 동안 자리에서 일어나 셀프소스바에 다녀와요.</p>' +
      // 가로로 넓은 그림(원본 1448×1086)이라 --narrow 없이 폭 100%로 둔다.
      '<figure class="col-figure col-figure--no-caption">' +
        '<img src="assets/columns/guide/sauce-bar.webp?v=1" width="880" height="660" loading="lazy" decoding="async" alt="셀프 소스바 전경 — 여러 가지 소스가 담긴 스테인리스 통이 줄지어 있고 위쪽에 채소와 과일 접시, 아래 진열장에 그릇이 놓여 있다">' +
      '</figure>' +
      // 재료 예시는 지어내지 않고 SAUCE_BAR 정식 목록에 있는 이름에서만 뽑았다
      // (베이스 소스 / 채소·향신 / 가루·기름 세 갈래를 하나씩) — 표기가 레시피 화면과 어긋나지 않게.
      // 도입 문장에서 이미 '셀프소스바'라고 밝혔으므로 여기서는 '소스바'로 받는다(2026-07-29 사용자 지정).
      '<p>소스바에는 땅콩참깨소스·스위트칠리소스 같은 베이스 소스부터 다진 마늘·고수 같은 향신료, 땅콩가루와 고추기름까지 다양한 재료가 놓여 있어요.</p>' +
      // 그릇 위치는 사용자 확인(2026-07-29) — 소스바 하단 진열장에 있다. 전경 그림에도 보인다.
      // 끝을 '정답은 없으니 취향대로'로 열어둬야 바로 다음 소제목('하딜고고를 열고 레시피대로 담아요')이
      // 자연스럽게 받는다. 옛 문장('그게 바로 나만의 소스예요')은 "아무렇게나 담으면 완성"으로 읽혀
      // 곧바로 레시피를 권하는 다음 대목과 부딪혔다(2026-07-29 사용자가 B안 선택).
      '<p>소스바 하단에 있는 그릇을 하나 챙겨서, 담고 싶은 재료를 골라 담으면 돼요. 정답은 없으니 취향대로 조합해보세요.</p>' +
      // 소제목(h3)이 아니라 팁 박스로 둔다(2026-07-29 사용자 지시). 절차가 아니라 권유라
      // '추천·조언은 팁 박스' 규칙에 맞고, 앞 문단의 '정답은 없으니 취향대로'를 곧바로 받는다.
      '<div class="col-tip">' +
        '<img class="col-tip-ic" src="assets/icons/bulb.png?v=1" alt="" width="18" height="18" draggable="false">' +
        '<div class="col-tip-body">' +
          // 제목은 다른 팁 박스처럼 '조건 → 권유' 형태로 맞췄다(2026-07-29 사용자 확정).
          // 사용자 원안('처음인데다 소스 종류도 너무 많아 뭐부터 해야될지 모르겠다면 이렇게 해보세요')은
          // 458px이라 두 줄 — '처음인데다'는 가이드 전체가 첫 방문자용이라 없어도 전달돼서 줄였다.
          // 🔴 팁 제목 길이는 전구 아이콘이 폭을 가져가므로 **.col-tip-body 폭(320px에서 220px)** 으로 잰다.
          //   칼럼 본문 폭(340px)으로 재면 한 줄로 착각한다.
          //   이 제목은 284px이라 두 줄인데, 기존 '첫 주문이 고민된다면 이렇게 골라보세요'(2줄)와 같아
          //   튀지 않으므로 그대로 둔다. 한 줄로 만들려면 199px 이하로 줄여야 한다(예: '소스가 고민된다면
          //   이렇게 해보세요') — 그만큼 깎으면 뜻이 얕아져서 두 줄을 택했다(2026-07-29 사용자 확정).
          '<b class="col-tip-title">소스 종류가 너무 많아 고민된다면 이렇게 해보세요</b>' +
          // 🔴 예약 문장 '무엇을 넣어야 할지 모르겠다면 하딜고고에서 취향에 맞는 레시피를 찾아보세요!'는
          //   결국 안 쓰기로 했다(2026-07-29 사용자 지정). 2026-07-28에 STEP 1 소스바 대목에서 일부러
          //   빼내 여기에 쓰려고 남겨둔 문장이었으나, 팁 제목이 이미 '고민된다면 이렇게 해보세요'로
          //   같은 말을 하고 바로 아래 소스 카드가 눌려서 겹쳤다. 다시 넣자는 얘기가 나오면 이 이력을 볼 것.
          // 아래 두 문단은 사용자가 직접 쓴 문안이다(2026-07-29). 맞춤법·말투만 손봤다:
          //   쑨디소스 → 쑨디2호소스(아래 카드 표기와 맞춤) / 먹어보는걸 → 먹어보는 걸(의존명사) /
          //   안맞는다면 → 안 맞는다면 / 추천드립니다 → 추천해요(가이드는 해요체, 합쇼체는 아티클 전용).
          // 문장은 '입맛에' 3회→2회, 겹치는 '소스' 하나 제거, 마지막 문장의 네 겹 연결을 폈다.
          '<p>처음에는 한국인 입맛에 가장 무난한 건희소스와 쑨디2호소스를 만들어보세요.</p>' +
          '<p>특히 건희소스는 대한민국에서 가장 유명한 국민 소스라 꼭 한번 먹어보는 걸 추천해요. 달달한 게 입맛에 안 맞는다면 스위트칠리소스나 설탕의 양을 줄여 덜 달게 만들어보세요.</p>' +
        '</div>' +
      '</div>' +
      // 팁 박스 바로 아래에 직접 고른 소스 두 개(2026-07-29 사용자 지정).
      // 누르면 칼럼이 닫히고 해당 레시피 상세가 열린다 — 위 '레시피를 찾아보세요'를 실제로 이어준다.
      // s1=건희소스(오리지널 · 2021, 달달) / s2=쑨디2호소스(2022, 건더기 씹히는 짭짤).
      '<div class="column-sauce-list" data-sauce-ids="s1,s2"></div>' +
      // 여기 있던 팁 박스 '한 번에 완성하지 않아도 괜찮아요'(처음엔 조금만 만들어 맛보고 재료를
      // 더해보라는 내용)는 2026-07-29 사용자 지시로 뺐다. 팁 박스가 둘 나란히 붙어 무거웠다.
      // 그 내용은 STEP 3의 '소스가 부족하거나 입에 안 맞으면 다시 가도 된다'로 되살아났다 —
      // 맛을 본 뒤인 거기가 원래 제자리였다.
      //
      // ── STEP 3 ────────────────────────────────────────────────
      // 제목은 맨 위 요약 그림에 구워진 '03 재료 넣고 익혀 먹기' 그대로다.
      // 🔴 기획초안의 'STEP 5 재료는 조금씩 넣어 즐겨요'가 아니다 — STEP 1·2도 그림의 01·02와
      //   같은 말로 맞췄고, 그림이 화면에 그대로 보이는데 제목만 다르면 독자가 헷갈린다.
      '<hr class="col-divider">' +
      '<h3 class="column-step column-step--3"><span class="step-no">STEP 3</span>재료 넣고 익혀 먹기</h3>' +
      // 🔴 상태를 단정하지 않는다(2026-07-29 사용자 지적). 소스를 만들어 오는 시간도, 냄비가 언제
      //   나오는지도 지점·상황마다 달라서 '냄비가 끓고 있어요'·'재료가 나와 있어요'로는 쓸 수 없다.
      //   '탕이 끓기 시작하면'은 조건문이라 어떤 상황에도 틀리지 않는다.
      //   STEP 1('자리를 안내받으면')·STEP 2('주문을 마쳤다면')와 같은 '조건 + 행동' 꼴이다.
      '<p>소스를 만들어 자리로 돌아온 뒤, 탕이 끓기 시작하면 이제 재료를 넣어 익힐 준비가 된 거예요.</p>' +
      // 식탁 전경 — STEP 2의 소스바 전경과 짝이다(가기 전 ↔ 돌아온 뒤). 가로 그림이라 --narrow 없이 폭 100%.
      // 그림 속에 4칸 냄비의 맑은 탕 칸(STEP 1 팁)과 소스 종지 두 개(STEP 2 팁의 두 가지 소스)가
      // 그대로 들어 있어 앞 STEP들과 이어진다. '한꺼번에 vs 조금씩 비교' 안은 사용자가 안 쓰기로 했다.
      '<figure class="col-figure col-figure--no-caption">' +
        '<img src="assets/columns/guide/table-setting.webp?v=1" width="880" height="660" loading="lazy" decoding="async" alt="식탁 전경 — 네 칸으로 나뉜 전골 냄비에 마라·토마토·버섯·맑은 탕이 담겨 있고, 둘레에 소고기·채소·버섯·완자·두부·연근·당면 접시와 소스 종지 두 개가 놓여 있다">' +
      '</figure>' +
      //
      // 아래 문단은 기획초안 문장을 말투만 풀고 한 문단으로 합친 것이다. 초안은 세 문장이 따로였는데
      // '나눠 넣어라 → 한꺼번에 넣으면 → 조금씩 넣어야'가 한 흐름이라 끊을 이유가 없고,
      // STEP 3이 짧은 편이라 문단을 잘게 쪼개면 더 성겨 보인다.
      // '찾기 어렵다 → 못 건진다 → 너무 익는다'로 인과를 한 줄에 드러낸다(2026-07-29 사용자 추가).
      // 4칸 냄비에 재료가 섞이면 뭘 넣었는지 놓치는 게 첫 방문자가 제일 많이 겪는 일이라
      // '너무 익어버려요'만 있을 때보다 설득이 세다. 아래 거름망 팁이 바로 이 '찾기 어렵다'의
      // 해법이라 문제 → 해법으로 이어진다.
      '<p>주문한 재료가 나오면 먹을 만큼씩 나눠 넣어보세요. 한꺼번에 넣으면 국물 속에서 재료를 찾기 어렵고, 못 건진 재료는 결국 너무 익어버려요. 조금씩 넣어야 가장 맛있는 상태로 천천히 즐길 수 있어요.</p>' +
      // 🔴 이 문단은 초안에 없다(2026-07-29 추가). 없으면 가이드가 STEP 2에서 소스를 만들게만 하고
      //   그 소스를 쓰는 장면이 끝까지 안 나온다 — 가이드 전체가 소스를 향해 왔는데 결말이 빠진 셈이다.
      // 뒷문장은 '소스바 왕복이 자유롭다'는 사용자 확인 사실을 쓴 자리다.
      //   첫 방문자가 "또 가도 되나?" 하고 눈치 보는 대목이라 알려줄 값어치가 있다.
      '<p>알맞게 익은 재료는 소스바에서 만들어온 소스에 찍어 드세요. 먹다가 소스가 부족하거나 입에 안 맞으면, 소스바에 다시 가서 재료를 더하거나 새로 만들어도 돼요.</p>' +
      // 🔴 팁을 거름망으로 바꿨다(2026-07-29 사용자 지시). 원래는 초안의 '고기와 해산물은 충분히
      //   익혀 드세요'였는데, 대부분 샤브샤브를 아는 한국 독자에겐 새 정보가 아니라 실용성이 낮았다.
      //   (초안의 '조리법이 헷갈리면 직원에게 물어보세요'는 그 전에 이미 뺐다 — 직원이 익는 시간을
      //   알려주는지 확인된 바 없어서.)
      // 🔴 이 팁은 원래 BONUS(별도 아티클)로 미뤄뒀던 것인데 여기로 옮겼다. 바로 위 문단이
      //   '국물 속에서 재료를 찾기 어렵고'로 문제를 던져놓아서, 거름망이 그 해법으로 바로 이어진다.
      //   별도 아티클에는 서비스 팁(앞치마·머리끈·케이크 등)만 남는다.
      // 재료 예시는 성격이 다른 둘을 골랐다 — 당면=집게로 못 잡음 / 메기살=집으면 부서짐.
      //   🔴 태블릿 실제 메뉴명은 '팡가시우메기'지만 아티클 본문이라 알아듣기 쉬운 '메기살'로 썼다
      //   (사용자 지정). STEP 1의 소제목 '육류·야채류' vs 본문 '고기와 채소'와 같은 판단이다.
      // hedge는 문장 안에 녹였다 — 거름망은 지점·상황에 따라 없을 수 있어 '있다'고 단정하지 않는다.
      '<div class="col-tip">' +
        '<img class="col-tip-ic" src="assets/icons/bulb.png?v=1" alt="" width="18" height="18" draggable="false">' +
        '<div class="col-tip-body">' +
          '<b class="col-tip-title">거름망이 있는지 물어보세요</b>' +
          '<p>당면처럼 집게로 잡기 어려운 재료, 메기살처럼 잘 부서지는 재료는 거름망에 넣어 익히면 건져 먹기 편해요. 지점이나 상황에 따라 준비되어 있지 않을 수 있으니 직원에게 물어보고 요청해보세요.</p>' +
        '</div>' +
      '</div>' +
      // ── 마무리 ────────────────────────────────────────────────
      '<hr class="col-divider">' +
      // 가이드의 전제(입장 대기 중에 읽는다)를 마지막에 회수한다(2026-07-29 사용자 아이디어).
      // 다 읽은 시점에 독자는 '대기가 끝났다 / 아직 기다린다' 둘 중 하나라, 두 갈래를 다 챙긴다.
      '<p>입장 대기가 끝났다면, 이제 하이디라오를 재밌게 즐겨보세요! 아직 기다리는 중이라면 하딜고고의 레시피를 구경하며 기다려도 좋아요.</p>' +
      // col-outro는 고수 아티클도 쓰는 마무리 서식(굵게 + 위 여백 20px)이다.
      // --plain을 더해 줄 전체는 본문색으로 두고 '하딜고고'만 로고체+빨강으로 띄운다(사용자 지정).
      '<p class="col-outro col-outro--plain">소스바 앞에서 헤매지 않도록, <span class="col-brand">하딜고고</span>가 함께할게요.</p>' +
      // '레시피를 구경하며 기다려도 좋아요'를 실제로 이어주는 출구. 누르면 칼럼을 닫고 전체보기를 연다.
      // data-go 값으로 동작을 정한다(openColumn에서 배선) — 소스 카드의 data-rid와 같은 방식이다.
      '<button class="col-cta" type="button" data-go="browse">레시피 보러 가기</button>',
  };

  function pickMonthlyFeatures() {
    const pool = RECIPES.filter((r) => r.img); // 히어로는 큰 이미지 필요
    if (!pool.length) return [];
    const now = new Date();
    const out = [];
    // 1) 첫 배너 = 이 달의 소스(고정/자동). out[0]이 항상 '이 달의 소스'.
    const monthlySauce = pickMonthlySauce(now);
    if (monthlySauce) out.push(monthlySauce);
    // 2) 두 번째 배너 = 기획 칼럼(고정).
    out.push(GOSU_COLUMN);
    // 3) 세 번째 배너 = 훠궈·하이디라오 알쓸신잡.
    out.push(HOTPOT_TRIVIA_COLUMN);
    // 4) 마지막 배너 = 가이드 배너(항상 끝에 고정).
    out.push(GUIDE_BANNER);
    return out;
  }

  let monthlyList = [];
  let monthlyUpdatePill = null; // 인디케이터 막대 재배치 함수(섹션 보일 때 호출)
  function initMonthlyFeature() {
    monthlyList = pickMonthlyFeatures();
    if (!monthlyList.length) { monthlyFeatureEl.hidden = true; return; }
    const total = monthlyList.length;
    mfScroll.innerHTML = monthlyList.map((r, i) => {
      const tagline = r.heroDesc || r.desc;
      const desc = tagline ? '<div class="mf-desc">' + tagline + '</div>' : '';
      // 특수 배너(기획 칼럼 / 가이드 / 준비중): 이미지 대신 임시 배경(bannerImg 있으면 그 사진) + 큰 이모지
      if (r.isColumn || r.isGuide || r.isSoon) {
        const bg = r.bannerImg
          ? 'background-image:url(' + r.bannerImg + ');background-size:cover;background-position:center;'
          : 'background:' + r.bannerBg + ';';
        const aria = r.isColumn ? ' 칼럼 열기' : r.isGuide ? ' 가이드 열기' : '';
        const kind = r.isGuide ? ' mf-hero--guide' : r.isSoon ? ' mf-hero--soon' : '';
        return '<button class="mf-hero mf-hero--column' + kind + '" type="button" aria-label="' + r.title + aria + '">'
          + '<div class="mf-colbg" style="' + bg + '">' + (r.bannerImg ? '' : '<span class="mf-colemoji">' + (r.emoji || '') + '</span>') + '</div>'
          + '<div class="mf-caption"><div class="mf-name">' + (r.titleHtml || r.title) + '</div>' + desc + '</div>'
          + '</button>';
      }
      // 히어로 전용 이미지(heroImg) 있으면 그걸, 없으면 카드 썸네일(img)로 폴백(2026-07-21)
      const heroImg = r.heroImg || r.img;
      // 첫 배너(i===0)에만 제목 위 '이달의 소스' kicker — '소스'만 빨강(.mf-badge-em)
      const kicker = i === 0 ? '<div class="mf-kicker">이달의 <span class="mf-badge-em">소스</span></div>' : '';
      return '<button class="mf-hero" type="button" aria-label="' + r.name + ' 자세히 보기">'
        + '<img src="' + heroImg + '" alt="' + r.name + '" draggable="false">'
        + '<div class="mf-caption">' + kicker + '<div class="mf-name">' + (r.nameHtml || r.name) + '</div>' + desc + '</div>'
        + '</button>';
    }).join('');
    // 뷰포트 고정 인디케이터: 작은 점 N개 + 스크롤에 실시간 연동해 미끄러지는 활성 막대(pill)
    mfDots.innerHTML = monthlyList.map(() => '<i></i>').join('') + '<b class="mf-dots-pill"></b>';
    mfDots.hidden = total <= 1;
    const heroes = [...mfScroll.querySelectorAll('.mf-hero')];
    heroes.forEach((el, i) => el.addEventListener('click', () => {
      const item = monthlyList[i];
      if (item.isSoon) return;                         // 준비중 배너는 클릭 무반응
      if (item.isColumn || item.isGuide) openColumn(item);
      else openModal(item);
    }));
    const pill = mfDots.querySelector('.mf-dots-pill');
    const dotEls = [...mfDots.querySelectorAll('i')];
    // 스크롤 위치(소수 인덱스)로 막대를 점 위에 실시간 배치 → 손가락 따라 스르륵.
    // 측정은 매번 실시간(섹션이 숨김일 땐 offset이 0이라 캐시하면 안 됨 — 초기 hidden 이슈 회피).
    function updatePill() {
      const step = (heroes[1] ? heroes[1].offsetLeft - heroes[0].offsetLeft : heroes[0].offsetWidth) || 1;
      const stride = dotEls[1] ? dotEls[1].offsetLeft - dotEls[0].offsetLeft : 11;
      const base = dotEls[0].offsetLeft + dotEls[0].offsetWidth / 2;
      const frac = Math.max(0, Math.min(total - 1, mfScroll.scrollLeft / step));
      pill.style.transform = 'translateX(' + (base + frac * stride - pill.offsetWidth / 2) + 'px)';
    }
    monthlyUpdatePill = updatePill; // 섹션이 보이게 될 때(syncMonthlyFeature) 재배치용
    syncMonthlyFeature();           // 만들었으면 편다 — 옛날엔 renderList 가 불러줬다(2026-08-03 홈 분리)
    mfScroll.addEventListener('scroll', updatePill, { passive: true });
    window.addEventListener('resize', updatePill);
    updatePill();

    // ── 데스크탑 마우스 드래그 스크롤 (한 번에 한 칸씩) ──
    // 터치는 브라우저가 스와이프를 기본 지원하지만, 마우스는 가로 오버플로를 드래그로
    // 못 끈다. mouse 이벤트로만 붙여(포인터/터치 이벤트는 네이티브 스와이프와 충돌) 직접 구현.
    // 드래그 중엔 scroll-snap을 꺼서 손 따라 끌리되, 시작 칸 기준 ±1칸으로 범위를 묶어
    // 아무리 멀리 끌어도 한 번에 한 칸씩만 넘어가게 한다. 놓으면 가까운 칸으로 스냅.
    const stepSize = () => (heroes[1] ? heroes[1].offsetLeft - heroes[0].offsetLeft : heroes[0].offsetWidth) || 1;
    const snapTo = (i) => {
      const t = Math.max(0, Math.min(total - 1, i));
      heroes[t].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    };
    let dragging = false, startX = 0, startIdx = 0, dragMoved = false;
    mfScroll.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      dragging = true; dragMoved = false;
      startX = e.pageX;
      startIdx = Math.round(mfScroll.scrollLeft / stepSize());
      mfScroll.classList.add('mf-dragging');
      e.preventDefault(); // 이미지 고스트 드래그·텍스트 선택 방지
    });
    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const dx = e.pageX - startX;
      if (Math.abs(dx) > 4) dragMoved = true;
      const step = stepSize();
      const lo = Math.max(0, startIdx - 1) * step; // 시작 칸 기준 ±1칸으로 제한
      const hi = Math.min(total - 1, startIdx + 1) * step;
      mfScroll.scrollLeft = Math.max(lo, Math.min(hi, startIdx * step - dx));
    });
    function endDrag() {
      if (!dragging) return;
      dragging = false;
      mfScroll.classList.remove('mf-dragging'); // 스냅 다시 켜짐
      snapTo(Math.round(mfScroll.scrollLeft / stepSize())); // 가까운 칸(시작±1 내)으로 정렬
    }
    window.addEventListener('mouseup', endDrag);
    // 드래그로 끝난 경우엔 히어로 클릭(모달 열기)을 무효화 — 캡처 단계에서 가로챔
    mfScroll.addEventListener('click', (e) => {
      if (dragMoved) { e.stopPropagation(); e.preventDefault(); dragMoved = false; }
    }, true);
  }

  // ── 홈 ↔ 그리드 뷰 전환(2026-07-21 7단 개편) ──
  // 홈 = 필터가 하나도 없는 기본 상태. 검색·즐겨찾기·카테고리 전체보기·인물 보기가 켜지면 그리드 뷰.
  const viewRecipeEl = document.getElementById('view-recipe');
  const listTitleEl = document.getElementById('listTitle');

  function browseTitle() {
    if (query.trim()) return '검색 결과';
    if (showFavoritesOnly) return '즐겨찾기';
    if (personFilter) return personFilter + ' 레시피';
    if (activeCat !== '전체') return activeCat;
    return '레시피';
  }
  // 홈의 「전체보기」에서 레시피 탭으로 넘어감(2026-08-03) — 카테고리를 지정해 열고 하단바 표시도 바뀐다.
  // 즐겨찾기·검색은 홈에서 켤 수 없지만 방어적으로 한 번 더 초기화한다.
  function enterBrowse(cat, person) {
    activeCat = cat || '전체';
    personFilter = person || null;
    if (showFavoritesOnly) {
      showFavoritesOnly = false;
      favToggleBtn.classList.remove('active');
    }
    if (query) {
      query = '';
      searchInput.value = '';
      searchBox.classList.remove('has-value');
    }
    renderList();
    switchSection('recipe');   // 하단바 활성 표시까지 함께 바뀌고, 스크롤은 맨 위로 간다
  }
  // 🔴 옛 goHome() 은 없앴다(2026-08-03) — 홈으로 가는 길은 하단바이고,
  //    로고를 누르면 강제 새로고침(?_r=)이라 어차피 홈부터 다시 시작한다.

  function syncMonthlyFeature() {
    // 이 배너는 #view-home 안에 있어 홈 탭에서만 보인다(2026-08-03). 데이터가 있을 때만 편다.
    monthlyFeatureEl.hidden = false;
    // 보이게 된 직후 인디케이터 막대 재배치(숨김일 때 측정한 0값 교정)
    if (!monthlyFeatureEl.hidden && monthlyUpdatePill) monthlyUpdatePill();
  }

  // ── 전체보기(브라우즈) 화면 — 전체/소스/히든메뉴/탕 카테고리 탭 (2026-07-24 개편, 2026-07-25 이중 필터로 재구조화) ──
  // 탭은 브라우즈 중 항상 표시(전체 포함)되고, 즐겨찾기·검색·인물과 서로 겹치는 필터로 동작한다(getFiltered 참고).
  // 소스 카드는 절대 순위 top5(sauceRankMap 기준)면 배지(homeRankBadge) 표시 — 카테고리 탭·즐겨찾기·검색·인물
  // 어느 필터에서 봐도 값이 같다(2026-07-25 버그 수정: 예전엔 화면에 보이는 목록 안 순번을 썼음).
  const BROWSE_TABS = ['전체', '소스', '히든메뉴', '탕'];
  const browseCatTabsEl = document.getElementById('browseCatTabs');
  const browseCatUnderlineEl = document.getElementById('browseCatUnderline');
  const browseCardCache = new Map(); // 브라우즈 그리드 카드(clean card) 캐시

  // 🔴 고른 탭이 가로 스크롤 밖에 있으면 보이는 자리로 밀어준다(2026-08-04).
  //    이 사이트는 스크롤바를 안 보여주므로(CLAUDE.md), 밀려 있는 탭은 스스로 나타나야 한다.
  //    옆 탭이 살짝 걸치게 16px 을 남긴다 — "옆에 더 있다"는 유일한 신호다.
  //    별도 IIFE 인 메뉴 코드도 써야 해서 window 에 건다(mnSyncUnderline 과 같은 방식).
  function keepTabVisible(btn) {
    // 🔴 스크롤되는 것은 `.tabs` 자신이다(styles.css @media all 의 overflow-x: auto).
    //    감싼 .tabs-scroll 이 아니다 — 매장 탭에서도 실제로 미는 것은 `.tabs` 쪽이다(실측).
    const box = btn && btn.closest('.tabs');
    if (!box || box.scrollWidth <= box.clientWidth) return;   // 넘치지 않으면 할 일이 없다
    const pad = 16;
    const left = btn.offsetLeft;                              // .tabs 가 position:relative 라 이 값이 스크롤 좌표다
    const right = left + btn.offsetWidth;
    if (left - pad < box.scrollLeft) {
      box.scrollTo({ left: Math.max(0, left - pad), behavior: 'smooth' });
    } else if (right + pad > box.scrollLeft + box.clientWidth) {
      box.scrollTo({ left: right + pad - box.clientWidth, behavior: 'smooth' });
    }
  }
  window.keepTabVisible = keepTabVisible;

  function updateBrowseCatUnderline() {
    const active = browseCatTabsEl.querySelector('.tab-btn.active');
    if (active && active.offsetWidth) {
      browseCatUnderlineEl.style.width = active.offsetWidth + 'px';
      browseCatUnderlineEl.style.transform = 'translateX(' + active.offsetLeft + 'px)';
      keepTabVisible(active);
    }
  }
  // 뷰가 숨어 있어도 그려 둔다 — 탭을 눌러 레시피로 넘어오는 순간 이미 맞아 있어야 한다(2026-08-03).
  // 숨어 있는 동안엔 폭이 0이라 밑줄 자리를 못 잡으므로 switchSection 에서 한 번 더 부른다.
  function renderBrowseCatTabs() {
    browseCatTabsEl.querySelectorAll('.tab-btn').forEach((b) => b.remove());
    BROWSE_TABS.forEach((cat) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tab-btn' + (cat === activeCat ? ' active' : '');
      btn.textContent = cat;
      btn.addEventListener('click', () => {
        // 같은 탭이면 아무 일도 하지 않는다(밑줄이 다시 그려지는 것을 막는다).
        // 🔴 다른 탭이면 맨 위로 — 목록이 통째로 바뀌므로(2026-08-03 사용자 확정). 메뉴 탭도 같다.
        if (activeCat === cat) return;
        activeCat = cat;
        renderList();
        window.scrollTo({ top: 0, behavior: 'instant' });   // smooth 를 확실히 우회
      });
      browseCatTabsEl.appendChild(btn);
    });
    updateBrowseCatUnderline();
  }

  // 즐겨찾기(북마크) — 브라우즈 카드 이미지 위 오버레이. 흰 아이콘+그림자(어떤 사진 위에서도 보이게, Q2 확정).
  const FAV_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>';
  // span(버튼 아님) — hc-row-like와 같은 이유: 이 카드 자체가 <button>이라 그 안에 진짜 <button>을 중첩하면
  // 브라우저가 파싱 중 바깥 버튼을 조기 종료시켜 DOM이 깨짐(실측 확인, 2026-07-24).
  function browseFavHtml(r) {
    const active = favorites.has(r.id);
    return '<span class="browse-fav' + (active ? ' active' : '') + '" data-id="' + r.id + '" role="button" tabindex="0" aria-label="즐겨찾기" aria-pressed="' + active + '">' + FAV_SVG + '</span>';
  }
  function bindBrowseFav(container) {
    container.querySelectorAll('.browse-fav').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        if (favorites.has(id)) favorites.delete(id); else favorites.add(id);
        saveFavorites();
        setPressedState(btn, favorites.has(id));
      });
      bindRoleButtonKeyboard(btn);
    });
  }
  function browseLikeHtml(r) {
    const active = likedByMe.has(r.id);
    return '<span class="hc-row-like' + (active ? ' active' : '') + '" data-id="' + r.id + '" role="button" tabindex="0" aria-label="좋아요" aria-pressed="' + active + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg><span class="hc-row-like-n like-count">' + getLikeCount(r.id) + '</span></span>';
  }
  function bindBrowseLike(container) {
    container.querySelectorAll('.hc-row-like').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = el.dataset.id;
        toggleLike(id);
        syncLikeUI(id); // 누른 하트뿐 아니라 같은 레시피의 다른 하트도 함께
        popHeart(el);
      });
      bindRoleButtonKeyboard(el);
    });
  }
  // 그리드 카드(소스/히든메뉴/탕 공통) — 이미지 우상단 즐겨찾기. 아래는 이름(위)+부제(아래) 텍스트 칼럼과
  // 좋아요(오른쪽, 세로 가운데)를 감싸는 박스(.hc-card-foot)로 — 썸네일이 제각각이라 이름이 묻히는 문제 해결(2026-07-25).
  // 박스 높이는 부제 있는 카드 기준으로 고정(.hc-card-txt min-height)해 부제 유무와 무관하게 카드 높이 통일.
  // 순위 배지는 빈 슬롯(.hc-badge-slot)만 만들어두고, 실제 배지는 syncBrowseGridCard가 매 렌더마다 채운다
  // (좋아요 수가 바뀌어 순위가 달라질 수 있어 캐시된 카드도 배지를 다시 계산해야 함).
  // opts.hideLike/hideFav: 좋아요·즐겨찾기 숨김(가챠 결과 카드용). opts.eager: 이미지 즉시 로드.
  // opts.interactive=false: 카드 자체를 버튼이 아닌 정적 div로 렌더(가챠 결과 카드용).
  // 기존 브라우즈 그리드 호출(buildBrowseGridCard(r))은 opts 없이 그대로 호출되므로 동작 그대로.
  function buildBrowseGridCard(r, opts) {
    opts = opts || {};
    const interactive = opts.interactive !== false;
    const el = document.createElement(interactive ? 'button' : 'div');
    if (interactive) el.type = 'button';
    el.className = 'hc-card hc-card--browse' + (interactive ? '' : ' hc-card--static');
    el.dataset.id = r.id;
    el.innerHTML = '<span class="hc-thumb"><span class="hc-badge-slot"></span>' + (opts.hideFav ? '' : browseFavHtml(r)) + homeCardBody(r, opts.eager) + '</span>'
      + '<span class="hc-card-foot">'
      + '<span class="hc-card-txt"><span class="hc-row-name' + starCls(r) + '">' + nameWithStar(r) + '</span>'
      + (r.ver ? '<span class="card-sub">' + r.ver + '</span>' : '') + '</span>'
      + (opts.hideLike ? '' : browseLikeHtml(r))
      + '</span>';
    if (interactive) el.addEventListener('click', () => openModal(r));
    if (!opts.hideFav) bindBrowseFav(el);
    if (!opts.hideLike) bindBrowseLike(el);
    return el;
  }
  // rankIdx: 0-based 순위(배지 표시), null이면 배지 없음. isMonthly: '이달의 소스'면 true.
  // 순위 배지 옆에 가로로 나란히(순위→이달의 소스 순서, 모달과 동일). 캐시 히트여도 매번 호출해
  // 배지(월이 바뀌면 이달의 소스도 바뀜)·즐겨찾기·좋아요를 최신화.
  function syncBrowseGridCard(el, r, rankIdx, isMonthly) {
    el.querySelector('.hc-badge-slot').innerHTML =
      (rankIdx != null ? homeRankBadge(rankIdx) : '') + (isMonthly ? MONTHLY_BADGE_HTML : '');
    setPressedState(el.querySelector('.browse-fav'), favorites.has(r.id));
    const lb = el.querySelector('.hc-row-like');
    if (lb) {
      setPressedState(lb, likedByMe.has(r.id));
      lb.querySelector('.like-count').textContent = getLikeCount(r.id);
    }
  }

  function renderList() {
    const filtered = getFiltered();
    listTitleEl.textContent = browseTitle();
    countEl.textContent = filtered.length;
    renderBrowseCatTabs();
    gridEl.innerHTML = '';
    if (filtered.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'empty-state';
      if (query.trim()) {
        empty.textContent = '검색 결과가 없어요';
      } else if (showFavoritesOnly) {
        empty.textContent = '즐겨찾기한 레시피가 없어요';
      } else {
        empty.textContent = '아직 등록된 레시피가 없어요';
      }
      gridEl.appendChild(empty);
      return;
    }
    // 순위 배지 = 소스 카테고리 전체를 인기순 정렬한 절대 인덱스(sauceRankMap). 값 자체는 화면 필터(탭·즐겨찾기·
    // 검색·인물)와 무관하게 항상 같다 — 예전엔 filtered 배열 안에서의 순번(i)을 써서, 즐겨찾기·검색으로 걸러진
    // 화면에서 실제 4위 소스가 '2위'처럼 잘못 보이는 버그가 있었다(2026-07-25 수정).
    // 노출 여부는 별도(2026-07-25 재조정): '소스' 탭으로 카테고리가 좁혀졌을 때만 보여준다. '전체' 탭·검색 중·
    // 즐겨찾기·인물 필터에서는 옆 카드(히든메뉴·탕 등)와 섞여 "무엇의 몇 위"인지 맥락이 사라지므로 숨김.
    const rankMap = sauceRankMap();
    const showRankBadges = activeCat === '소스' && !personFilter && !query.trim() && !showFavoritesOnly;
    // '이달의 소스' 배지도 순위 배지와 노출 조건이 같다(카테고리가 섞이는 화면에선 둘 다 숨김, 2026-07-25).
    // 매 렌더 재계산 — 월이 바뀌면 이달의 소스 id도 바뀌므로 캐시된 카드 DOM에 굳어 있으면 안 됨.
    const monthlySauceId = showRankBadges ? pickMonthlySauce(new Date())?.id : null;
    filtered.forEach((r) => {
      let el = browseCardCache.get(r.id);
      if (!el) {
        el = buildBrowseGridCard(r);
        browseCardCache.set(r.id, el);
      }
      const rank = (showRankBadges && r.cat === '소스') ? rankMap.get(r.id) : undefined;
      const isMonthly = showRankBadges && r.cat === '소스' && r.id === monthlySauceId;
      syncBrowseGridCard(el, r, (rank != null && rank < 5) ? rank : null, isMonthly);
      gridEl.appendChild(el);
    });
    requestAnimationFrame(() => fitBrowseTitles(gridEl));
  }

  // ── 홈 섹션 렌더링(2026-07-21 7단 구조) ──
  // ② 셀럽 레일: person 필드로 그룹핑. 사진(assets/people/<이름>.jpg)이 없으면 이니셜 원으로 표시
  //    — img onerror가 스스로 제거되는 방식이라, 나중에 사진만 넣으면 자동으로 얼굴로 바뀜.
  const celebRailEl = document.getElementById('celebRail');
  const popularRailEl = document.getElementById('popularRail');
  const jeongolGridEl = document.getElementById('jeongolGrid');   // 홈 「전골」 — 레시피가 아니라 메뉴 육수다(2026-08-05)
  const hiddenGridEl = document.getElementById('hiddenGrid');

  // 가로 레일 마우스 드래그 스크롤(데스크탑용). 트랙패드·휠로만 되던 걸 손으로 끌 수 있게.
  //  - 컨테이너에 한 번만 붙임(레일은 innerHTML만 다시 그려도 컨테이너 자체는 유지됨).
  //  - 4px 넘게 끌면 dragMoved → 캡처 단계에서 자식 카드 클릭(이동)을 무효화.
  //  - 🔴 끌 게 없으면 손 모양 커서를 안 준다(2026-08-04). 탭줄에도 쓰게 되면서 필요해졌다 —
  //    레시피 카테고리는 넷이라 안 넘칠 때가 있는데, 그때 grab 커서만 뜨면 끌리는 줄 알고 헛손질한다.
  //    레일(셀럽·인기소스)은 늘 넘치므로 지금까지와 똑같이 동작한다.
  function enableDragScroll(el) {
    if (!el) return;
    const 넘치나 = () => el.scrollWidth > el.clientWidth + 1;
    const 커서맞추기 = () => el.classList.toggle('drag-scroll', 넘치나());
    커서맞추기();
    el.addEventListener('mouseenter', 커서맞추기);
    let down = false, startX = 0, startScroll = 0, moved = false;
    el.addEventListener('mousedown', (e) => {
      if (e.button !== 0 || !넘치나()) return;
      down = true; moved = false;
      startX = e.pageX;
      startScroll = el.scrollLeft;
      el.classList.add('is-dragging');
      e.preventDefault(); // 이미지 고스트 드래그·텍스트 선택 방지
    });
    window.addEventListener('mousemove', (e) => {
      if (!down) return;
      const dx = e.pageX - startX;
      if (Math.abs(dx) > 4) moved = true;
      el.scrollLeft = startScroll - dx;
    });
    window.addEventListener('mouseup', () => {
      if (!down) return;
      down = false;
      el.classList.remove('is-dragging');
    });
    el.addEventListener('click', (e) => {
      if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; }
    }, true);
  }
  enableDragScroll(celebRailEl);
  enableDragScroll(popularRailEl);
  // 탭줄도 데스크탑에서 손으로 끌 수 있게(2026-08-04 사용자 요청) — 분류가 8개가 되면서 필요해졌다.
  // 🔴 버튼이 아니라 **컨테이너**에 건다 — 탭 버튼은 다시 그려져도 `.tabs` 자체는 남는다.
  enableDragScroll(browseCatTabsEl);
  window.enableDragScroll = enableDragScroll;   // 매장 탭줄·메뉴 탭줄은 아래에서 붙인다(선언이 여기보다 뒤다)
  // 회색(#5F5E5A) 제외 — 'seen=회색 링'과 헷갈려서 안 본 셀럽이 꺼져 보이는 착시 방지(2026-07-22). 대신 베리로즈.
  const CELEB_COLORS = ['#D85A30', '#B98A44', '#7C9A5A', '#993556', '#534AB7', '#185FA5', '#0F6E56', '#B85575', '#A3612E', '#3E7C8A', '#8A5FB0'];

  // 셀럽 레일 정렬 = 이름 가나다순(2026-07-29 사용자 확정). 옛 기준이던 인스타 팔로워 수(CELEB_FOLLOWERS)는
  // 지웠다 — 화면에 숫자가 안 보여서 틀려도 아무도 모르는데 월 1회 수동 갱신이 필요했고, 셀럽이 늘수록
  // 부담만 커졌다. 가나다순은 이름만 넣으면 자동으로 자리를 찾는다.
  // 덤: 좋아요 1위인 건희소스의 주인공 '건희'가 팔로워로는 꼴찌라 맨 뒤였는데 가나다순에서는 맨 앞이 된다.
  // (옛 팔로워 값이 필요하면 이 커밋 이전 이력에서 볼 것.)

  // 본(터치한) 셀럽 = 회색 링 + 맨 뒤. 앱 내부 ‹ 뒤로가기 동안만 유지(메모리 Set).
  //  - 새로고침·재진입 → 스크립트 새로 실행돼 빈 Set → 그라데이션·팔로워순 원복.
  //  - 사파리 하단 뒤로가기는 bfcache로 옛 화면을 복원해 이전 seen이 되살아나므로 → pageshow(persisted)에서 초기화.
  let seenCelebs = new Set();
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      seenCelebs.clear();
      renderCelebRail();
      syncExternalState();
    }
  });

  // 셀럽 레일에 보이는 사람과 그 순서. 🔴 스토리 자동 넘김(다음 사람)도 이 순서를 따르므로
  // 레일과 스토리가 어긋나지 않게 한 곳에서만 계산한다.
  // 레일은 연예인(star)만 노출 — 유튜버/크리에이터(쑨디·라젤·수코 등)는 제외(2026-07-22).
  // 레시피는 그대로 남아 전체보기·검색으로 접근 가능. 추후 크리에이터 별도 레일 분리 예정.
  // 이름 가나다순. localeCompare(…, 'ko')를 쓴다 — 기본 정렬은 유니코드 코드포인트 순이라
  // 한글 자모 조합에 따라 사전 순서와 어긋날 수 있다.
  function celebOrder() {
    const byName = new Map();
    RECIPES.forEach((r) => {
      if (!r.person) return;
      if (!byName.has(r.person)) byName.set(r.person, { name: r.person, star: false });
      if (r.star) byName.get(r.person).star = true;
    });
    return [...byName.values()].filter((p) => p.star)
      .sort((a, b) => a.name.localeCompare(b.name, 'ko'))
      .map((p) => p.name);
  }

  function renderCelebRail() {
    // 색은 정렬된 자리 순서대로 배정한다. 셀럽 8명 모두 assets/people/에 사진이 있어 이 색은
    // 사진 뒤에 깔리는 대체 배경일 뿐 화면에 보이지 않는다(사진이 없는 셀럽이 생기면 그때만 드러남).
    // 본(터치한) 셀럽은 회색 링(seen)만 표시하고 순서는 그대로 — 항상 가나다순 고정.
    celebRailEl.innerHTML = celebOrder().map((name, idx) => {
      const seenCls = seenCelebs.has(name) ? ' celeb--seen' : '';
      const color = CELEB_COLORS[idx % CELEB_COLORS.length];
      return '<button class="celeb' + seenCls + '" type="button" data-person="' + name + '">'
        + '<span class="celeb-img"><span class="celeb-face" style="background:' + color + '">' + name.charAt(0)
        + '<img src="assets/people/' + name + '.jpg" alt="" draggable="false" onerror="this.remove()">'
        + '</span></span>'
        + '<span class="celeb-name">' + name + '</span></button>';
    }).join('');
    celebRailEl.querySelectorAll('.celeb').forEach((btn) => {
      btn.addEventListener('click', () => {
        seenCelebs.add(btn.dataset.person); // 본 것으로 표시 → 회색 링 (앱 내부 뒤로가기 동안만, 순서는 유지)
        openStory(btn.dataset.person);       // 인스타 스토리 뷰어 열기(구 인물 그리드 대체)
        renderCelebRail();                   // 회색 링이 반영되게 지금 다시 그림
      });
    });
  }

  // ── 셀럽 인스타 스토리 뷰어 ── (7초 자동재생 + 탭 수동넘김. 누르면 정지, 마지막서 다음=닫기. CTA=기존 레시피 모달 재사용)
  const storyViewer = document.getElementById('storyViewer');
  const storyProgress = document.getElementById('storyProgress');
  const storyAvatarEl = document.getElementById('storyAvatar');
  const storyNameEl = document.getElementById('storyName');
  const storyBody = document.getElementById('storyBody');
  let storyList = [];
  let storyIdx = 0;
  let currentStoryRecipe = null;
  // 자동 넘김용 — 지금 보고 있는 사람이 셀럽 순서(celebOrder)에서 몇 번째인지.
  let storyPersons = [];
  let storyPersonIdx = -1;

  // 한 사람의 스토리를 뷰어에 채운다(뷰어를 여닫지는 않는다).
  // atEnd=true면 마지막 칸부터 — 앞사람으로 되돌아갈 때 인스타처럼 그 사람의 끝에서 시작한다.
  function loadStoryPerson(personName, atEnd) {
    // 그 인물 레시피를 오래된→최신 순으로(스토리는 시간순이 자연스러움)
    storyList = RECIPES.filter((r) => r.person === personName)
      .slice()
      .sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    if (!storyList.length) return false;
    storyIdx = atEnd ? storyList.length - 1 : 0;
    storyAvatarEl.innerHTML = '<img src="assets/people/' + personName + '.jpg" alt="" draggable="false" onerror="this.remove()">';
    storyNameEl.textContent = personName;
    // 각 세그먼트에 안쪽 채움 바(.story-seg-fill) — 현재 칸만 CSS 애니메이션으로 차오름
    storyProgress.innerHTML = storyList.map(() => '<span class="story-seg"><i class="story-seg-fill"></i></span>').join('');
    storyViewer.classList.remove('paused');
    renderStorySlide();
    return true;
  }

  function openStory(personName) {
    storyPersons = celebOrder();
    storyPersonIdx = storyPersons.indexOf(personName);
    if (!loadStoryPerson(personName)) return;
    document.documentElement.style.overflow = 'hidden';
    storyViewer.classList.add('open');
    storyViewer.setAttribute('aria-hidden', 'false');
  }

  // 옆 사람으로 이동(dir: +1 다음 / -1 이전). 갈 사람이 없으면 false.
  // ⚠️ 레시피가 하나도 없는 사람은 건너뛴다 — 그 사람에서 멈추면 빈 화면이 된다.
  //    (지금은 celebOrder가 레시피에서 뽑히므로 그런 사람이 없지만, 이름만 남는 경우를 대비.)
  function goToStoryPerson(dir) {
    for (let i = storyPersonIdx + dir; i >= 0 && i < storyPersons.length; i += dir) {
      if (loadStoryPerson(storyPersons[i], dir < 0)) {
        storyPersonIdx = i;
        // 넘어간 사람도 '본 것'으로 표시해 레일의 회색 링을 맞춘다(직접 눌렀을 때와 같게).
        if (dir > 0) { seenCelebs.add(storyPersons[i]); renderCelebRail(); }
        return true;
      }
    }
    return false;
  }

  function renderStorySlide() {
    const r = storyList[storyIdx];
    currentStoryRecipe = r;
    const rt = document.getElementById('storyRecipeToggle');
    if (rt) rt.hidden = true; // 슬라이드 바뀌면 열려있던 토글 닫기
    // 지난 칸=꽉(filled), 현재 칸=애니메이션(current). 애니메이션 재시작을 위해 current를 잠깐 뗐다 다시 붙임
    Array.from(storyProgress.children).forEach((seg, i) => {
      seg.classList.remove('current');
      seg.classList.toggle('filled', i < storyIdx);
    });
    const cur = storyProgress.children[storyIdx];
    if (cur) { void cur.offsetWidth; cur.classList.add('current'); } // reflow로 애니메이션 확실히 재시작
    // 풀블리드 배경: 사진 있으면 블러 확대본, 없으면 tint 색으로 채움
    const storyBg = document.getElementById('storyBg');
    if (r.img) {
      storyBg.style.backgroundImage = 'url("' + r.img + '")'; // 따옴표 필수 — 괄호 든 파일명(세훈소스(간장) 등) 깨짐 방지
      storyBg.classList.remove('story-bg--tint');
    } else {
      storyBg.style.backgroundImage = 'none';
      storyBg.style.background = r.tint;
      storyBg.classList.add('story-bg--tint');
    }
    // 🔴 넘길 때 흰색이 번쩍이던 것 대응(2026-07-30 사용자 지적, 실기기에서 보임).
    //    .story-img의 CSS 배경이 #fff라, 새 사진이 다 그려지기 전 그 흰 바탕이 한 프레임 보였다.
    //    → 카드마다 가진 imgBg(썸네일 여백 색)를 인라인으로 덮어씌운다. imgBg가 없으면 tint를,
    //      그것도 없으면 투명(뒤의 블러 배경이 비쳐 자연스럽다)으로 둔다. 흰색만 피하면 된다.
    //    ⚠️ CSS의 background:#fff는 지우지 않는다 — 이 뷰어 밖에서도 쓰일 여지가 있어
    //      인라인으로만 덮는다.
    const thumbBg = r.imgBg || r.tint || 'transparent';
    const thumb = r.img
      ? '<img class="story-img" src="' + r.img + '" alt="' + r.name + '" draggable="false" style="background:' + thumbBg + '">'
      : '<span class="story-img story-img--emoji" style="background:' + r.tint + '">' + r.emoji + '</span>';
    storyBody.innerHTML = thumb
      + '<div class="story-rname">' + (r.nameHtml || r.name) + '</div>'
      + (r.ver ? '<div class="story-rver">' + r.ver + '</div>' : '')
      + (r.desc ? '<div class="story-desc">' + r.desc + '</div>' : '');
    preloadNextStoryImages();
  }

  // 다음에 나올 사진을 미리 받아둔다 — 배경색만 고쳐도 "흰색 대신 색이 번쩍"일 뿐이라,
  // 넘김 자체가 매끄러우려면 사진이 이미 캐시에 있어야 한다.
  // 미리 받는 범위: ①같은 사람의 다음 칸 ②다음 셀럽의 첫 칸(사람이 바뀌는 순간이 제일 티가 난다).
  // 브라우저 캐시에만 얹으면 되므로 만든 Image 객체는 붙들지 않는다.
  const storyPreloaded = new Set(); // 같은 주소를 매 슬라이드마다 다시 요청하지 않게
  function preloadStoryImg(src) {
    if (!src || storyPreloaded.has(src)) return;
    storyPreloaded.add(src);
    const im = new Image();
    im.decoding = 'async';
    im.src = src;
  }
  function preloadNextStoryImages() {
    preloadStoryImg(storyList[storyIdx + 1]?.img);
    if (storyIdx >= storyList.length - 1) {
      const nextPerson = storyPersons[storyPersonIdx + 1];
      if (nextPerson) {
        const first = RECIPES.filter((x) => x.person === nextPerson)
          .slice()
          .sort((a, b) => (a.date || '').localeCompare(b.date || ''))[0];
        preloadStoryImg(first && first.img);
      }
    }
  }

  // 🔴 마지막 칸에서 다음 = **다음 셀럽으로 이어서**(2026-07-30 사용자 요청, 인스타 스토리와 같은 동작).
  //    예전에는 여기서 그냥 닫혔다. 맨 마지막 사람의 마지막 칸에서만 닫힌다.
  function storyNext() {
    if (storyIdx < storyList.length - 1) { storyIdx++; renderStorySlide(); return; }
    if (!goToStoryPerson(1)) closeStory();
  }
  // 첫 칸에서 이전 = 앞 셀럽의 **마지막 칸**으로(인스타와 같음). 맨 앞 사람의 첫 칸이면 아무 일 없음.
  function storyPrev() {
    if (storyIdx > 0) { storyIdx--; renderStorySlide(); return; }
    goToStoryPerson(-1);
  }
  function closeStory() {
    storyViewer.classList.remove('open', 'paused');
    storyViewer.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    const rt = document.getElementById('storyRecipeToggle');
    if (rt) rt.hidden = true; // 닫을 때 토글도 정리
  }

  // 자동재생: 현재 진행바가 다 차면(animationend) 다음 칸으로
  storyProgress.addEventListener('animationend', (e) => {
    if (e.animationName === 'storyFill' && storyViewer.classList.contains('open')) storyNext();
  });
  // 누르고 있으면 정지, 떼면 재개. 200ms 넘게 눌렀으면 '홀드'로 보고 그 탭 이동은 무효
  let storyPressT = 0, storyWasHold = false;
  storyViewer.addEventListener('pointerdown', () => {
    storyPressT = Date.now(); storyWasHold = false;
    storyViewer.classList.add('paused');
  });
  storyViewer.addEventListener('pointerup', () => {
    if (Date.now() - storyPressT > 200) storyWasHold = true;
    storyViewer.classList.remove('paused');
  });
  storyViewer.addEventListener('pointercancel', () => { storyViewer.classList.remove('paused'); });

  document.getElementById('storyClose').addEventListener('click', closeStory);
  // ── 탭 로직: 이미지 안 탭 = '레시피 보기' 토글 / 이미지 밖 탭 = 이전·다음 넘김 ──
  // z-index로 이미지를 탭존 위에 못 올림(story-body 스택 컨텍스트) → 탭 좌표가 이미지 안인지로 판정.
  const storyRecipeToggle = document.getElementById('storyRecipeToggle');
  function hideRecipeToggle() { storyRecipeToggle.hidden = true; }
  function showRecipeToggle(clientX, clientY) {
    const rect = storyPhoneEl.getBoundingClientRect();
    storyRecipeToggle.style.left = (clientX - rect.left) + 'px';
    storyRecipeToggle.style.top = (clientY - rect.top) + 'px';
    storyRecipeToggle.hidden = false;
    storyViewer.classList.add('paused'); // 토글 떠 있는 동안 자동재생 정지
  }
  function tapInImage(e) {
    const img = storyBody.querySelector('.story-img');
    if (!img) return false;
    const r = img.getBoundingClientRect();
    return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
  }
  function onZoneTap(advanceFn) {
    return (e) => {
      if (storyWasHold) { storyWasHold = false; return; }   // 홀드·드래그였으면 무시
      if (!storyRecipeToggle.hidden) {                       // 토글 떠 있으면: 닫기
        hideRecipeToggle();
        if (tapInImage(e)) showRecipeToggle(e.clientX, e.clientY); // 이미지 다시 탭 → 위치만 이동
        return;                                              // 이 탭은 넘김 안 함
      }
      if (tapInImage(e)) { showRecipeToggle(e.clientX, e.clientY); return; } // 이미지 탭 → 토글
      advanceFn();                                           // 이미지 밖 탭 → 넘김
    };
  }
  document.getElementById('storyNext').addEventListener('click', onZoneTap(storyNext));
  document.getElementById('storyPrev').addEventListener('click', onZoneTap(storyPrev));
  // 토글 탭 → 기존 레시피 상세 모달을 스토리 위(z 200>190)에 겹쳐 띄움
  storyRecipeToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    hideRecipeToggle();
    if (currentStoryRecipe) {
      storyViewer.classList.add('paused');
      modalOverlay.classList.add('from-story'); // 모바일에서 모달이 상단까지 꽉 덮어 스토리 헤더가 안 비치게
      openModal(currentStoryRecipe);
    }
  });
  // 키보드: ← → 이동, Esc 닫기
  document.addEventListener('keydown', (e) => {
    if (!storyViewer.classList.contains('open')) return;
    if (e.key === 'Escape') closeStory();
    else if (e.key === 'ArrowRight') storyNext();
    else if (e.key === 'ArrowLeft') storyPrev();
  });
  // 아래로 드래그 → 스토리 화면이 손 따라 내려가며 닫힘(인스타식). 조금만 내리면 스프링백.
  const storyPhoneEl = storyViewer.querySelector('.story-phone');
  let stDragY = 0, stDragX = 0, stDragging = false;
  function stClearDrag(animate) {
    storyPhoneEl.style.transition = animate ? 'transform .34s cubic-bezier(.33,.9,.3,1)' : 'none';
    storyPhoneEl.style.transform = '';
    storyViewer.style.transition = animate ? 'background-color .3s' : 'none';
    storyViewer.style.backgroundColor = '';
  }
  storyViewer.addEventListener('touchstart', (e) => {
    stDragY = e.touches[0].clientY; stDragX = e.touches[0].clientX; stDragging = false;
    storyPhoneEl.style.transition = 'none';
  }, { passive: true });
  storyViewer.addEventListener('touchmove', (e) => {
    const dy = e.touches[0].clientY - stDragY;
    const dx = e.touches[0].clientX - stDragX;
    if (!stDragging) {
      if (dy > 8 && dy > Math.abs(dx)) { stDragging = true; storyWasHold = true; } // 세로 아래 드래그 확정 → 탭 무효
      else return;
    }
    if (dy <= 0) { storyPhoneEl.style.transform = ''; return; }
    e.preventDefault();
    const moved = dy * 0.6; // 손보다 덜 움직이게 감쇠 → 묵직한 저항감(폭은 유지, 스케일 없음)
    storyPhoneEl.style.transform = 'translateY(' + moved + 'px)';
    storyViewer.style.backgroundColor = 'rgba(20,20,22,' + Math.max(0, 1 - dy / 480) + ')'; // 뒤 배경 서서히 걷힘
  }, { passive: false });
  storyViewer.addEventListener('touchend', (e) => {
    if (!stDragging) return;
    stDragging = false;
    const dy = e.changedTouches[0].clientY - stDragY;
    if (dy > 90) { // 충분히 내렸으면 계속 미끄러져 닫힘
      storyPhoneEl.style.transition = 'transform .26s ease-in';
      storyViewer.style.transition = 'background-color .26s';
      storyPhoneEl.style.transform = 'translateY(100vh)';
      storyViewer.style.backgroundColor = 'rgba(20,20,22,0)';
      const done = () => { storyPhoneEl.removeEventListener('transitionend', done); closeStory(); stClearDrag(false); };
      storyPhoneEl.addEventListener('transitionend', done);
    } else { stClearDrag(true); } // 스프링백
  }, { passive: true });

  // 홈 카드(클린 스타일) 공통 마크업 — 캐러셀·그리드가 함께 씀. 클릭은 컨테이너에서 data-id로 위임.
  // eager=true면 즉시 로드(인기소스=첫 화면에 바로 보임). 탕·히든은 스크롤해야 보여 lazy 유지.
  function homeCardBody(r, eager) {
    const thumb = r.img
      ? '<img src="' + r.img + '" alt="' + r.name + '"' + (eager ? '' : ' loading="lazy"') + ' draggable="false">'
      : '<span class="hc-emoji" style="background:' + r.tint + '">' + r.emoji + '</span>';
    return thumb;
  }
  // 이름(+버전)만 — 인기소스 카드용(출처는 상세 모달에서만 노출)
  function homeCardName(r) {
    return '<span class="hp-name">' + (r.nameHtml || r.name) + '</span>'
      + (r.ver ? '<span class="card-sub">' + r.ver + '</span>' : '');  // 부제 = 버전(연도·업그레이드 등)
  }
  // 이름 + 출처 — 탕·히든 그리드용
  function homeCardMeta(r) {
    return homeCardName(r)
      + (r.source ? '<span class="hp-src">' + r.source + '</span>' : '');
  }
  function bindHomeCards(container) {
    // 직속 카드만 바인딩(:scope >) — 인기소스 카드 안에 중첩된 하트(data-id)까지 모달 열리는 것 방지
    container.querySelectorAll(':scope > [data-id]').forEach((btn) => {
      const r = RECIPES.find((x) => x.id === btn.dataset.id);
      if (r) btn.addEventListener('click', () => openModal(r));
    });
  }

  // 인기소스 순위 배지: 1~5위 전부 같은 검정 알약(쿠팡이츠 방식, 2026-07-25 — 금색 알약+왕관은
  // 되돌림). 1~3위는 알약 안에 메달 아이콘(gold/silver/bronze.svg) + 'N위', 4~5위는 글자만.
  const RANK_MEDALS = ['gold', 'silver', 'bronze'];
  function homeRankBadge(i) {
    const medal = RANK_MEDALS[i];
    const medalImg = medal
      ? '<img class="hp-medal" src="assets/icons/medal/' + medal + '.svg" alt="" aria-hidden="true">'
      : '';
    return '<i class="hp-rank">' + medalImg + (i + 1) + '위</i>';
  }

  // ③ 인기 소스: 좋아요순 상위 5개 캐러셀. 순서는 렌더 시점 고정(좋아요 눌러도 즉시 재정렬 안 함 —
  //    카드가 눈앞에서 튀지 않게. 숫자만 refreshLikeCounts로 갱신, 순서는 다음 방문 때 반영).
  function renderHomePopular() {
    // 정렬은 byPopular로 통일(2026-07-25) — 예전엔 동점 타이브레이크가 이름순이라, 좋아요 수가 같을 때
    // 이 레일의 순서와 브라우즈/모달 순위 배지(sauceRankMap, byPopular 기준)가 서로 어긋날 수 있었다.
    const sauces = RECIPES.filter((r) => r.cat === '소스').slice().sort(byPopular);
    const top = sauces.slice(0, 5);
    popularRailEl.innerHTML = top.map((r, i) =>
      // 이름 앞 별(연예인 표시) 미노출(2026-07-25) — 이 레일은 "인기 소스" 랭킹이 목적이라
      // 별(셀럽) 여부와 섞이면 랭킹 카드에 배지가 두 종류(메달+별) 겹쳐 산만해짐. 브라우즈·모달 별은 유지.
      '<button class="hp-card" type="button" data-id="' + r.id + '">'
      + '<span class="hp-thumb">' + homeRankBadge(i) + homeCardBody(r, true) + '</span>'
      + '<span class="hp-foot"><span class="hp-foot-txt"><span class="hp-name">' + (r.nameHtml || r.name) + '</span>'
      + (r.ver ? '<span class="hp-sub">' + r.ver + '</span>' : '') + '</span>'
      + '<i class="hp-like' + (likedByMe.has(r.id) ? ' active' : '') + '" data-id="' + r.id + '" role="button" tabindex="0" aria-label="좋아요" aria-pressed="' + likedByMe.has(r.id) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg><span class="like-count">' + getLikeCount(r.id) + '</span></i>'
      + '</span>'
      + '</button>'
    ).join('');
    bindHomeCards(popularRailEl);
    // 하트 = 홈에서 바로 좋아요(카드 모달과 겹치지 않게 stopPropagation). 누르면 빨강 채움 + 팝 애니메이션
    popularRailEl.querySelectorAll('.hp-like').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = el.dataset.id;
        toggleLike(id);
        syncLikeUI(id); // 누른 하트뿐 아니라 같은 레시피의 다른 하트도 함께
        popHeart(el);
      });
      bindRoleButtonKeyboard(el);
    });
    requestAnimationFrame(() => fitPopularTitles(popularRailEl));
  }

  // ⑤⑥ 탕·히든메뉴: 몇 개 안 되니 전부 2열 그리드로(전체보기 버튼 없음)
  // 정렬 기준(홈 노출) — filter 결과라 원본 RECIPES는 안 바뀜
  function byNewest(a, b) { return (b.date || '').localeCompare(a.date || ''); }
  // 인기순: 좋아요 많은 순, 동점이면 최신순(2026-07-23, 탕·히든도 인기순 — baseLikes 넣기 전엔 0동점이라 최신순처럼 보임)
  function byPopular(a, b) { return getLikeCount(b.id) - getLikeCount(a.id) || byNewest(a, b); }
  // 소스 카테고리 전체를 인기순 정렬했을 때의 절대 순위(0-based) 맵 — 화면 필터·모달 어디서 계산해도 같은
  // 값이 나오도록 하는 단일 기준(2026-07-25). 좋아요가 바뀌면 순위도 바뀌므로 캐시하지 않고 호출 시마다 재계산.
  function sauceRankMap() {
    const ranked = RECIPES.filter((r) => r.cat === '소스').sort(byPopular);
    const map = new Map();
    ranked.forEach((r, i) => map.set(r.id, i));
    return map;
  }
  function renderHomeCatGrid(cat, gridElement) {
    const list = RECIPES.filter((r) => r.cat === cat).sort(byPopular);
    gridElement.innerHTML = list.slice(0, 4).map((r) => // 소스(주인공)는 최신순 4개=2×2 그리드, 나머지는 '전체보기'로
      '<button class="hc-card" type="button" data-id="' + r.id + '">'
      + '<span class="hc-thumb">' + homeCardBody(r) + '</span>'
      + homeCardName(r) + '</button>'  // 홈 그리드는 이름만(출처는 상세 모달에서만, 2026-07-24)
    ).join('');
    bindHomeCards(gridElement);
  }
  // 컴팩트 리스트(탕): 사진 + 이름 + 좋아요 행. 홈엔 최신순 3개(2026-07-23, 그리드와 무게 맞춤). 나머지는 전체보기.
  function renderHomeCatList(cat, listElement) {
    const list = RECIPES.filter((r) => r.cat === cat).sort(byPopular);
    listElement.innerHTML = list.slice(0, 3).map((r) =>
      '<button class="hc-row" type="button" data-id="' + r.id + '">'
      + '<span class="hc-row-thumb">' + homeCardBody(r) + '</span>'
      + '<span class="hc-row-txt"><span class="hc-row-name' + starCls(r) + '">' + nameWithStar(r) + '</span>'
      + (r.ver ? '<span class="card-sub">' + r.ver + '</span>' : '') + '</span>'
      + '<span class="hc-row-like' + (likedByMe.has(r.id) ? ' active' : '') + '" data-id="' + r.id + '" role="button" tabindex="0" aria-label="좋아요" aria-pressed="' + likedByMe.has(r.id) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg><span class="hc-row-like-n like-count">' + getLikeCount(r.id) + '</span></span>'
      + '</button>'
    ).join('');
    bindHomeCards(listElement);
    // 하트 = 홈 리스트에서 바로 좋아요(카드 모달과 안 겹치게 stopPropagation). 인기소스와 동일 동작
    listElement.querySelectorAll('.hc-row-like').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = el.dataset.id;
        toggleLike(id);
        syncLikeUI(id); // 누른 하트뿐 아니라 같은 레시피의 다른 하트도 함께
        popHeart(el);
      });
      bindRoleButtonKeyboard(el);
    });
  }
  /* 🔴 홈 「전골」 — 메뉴 탭의 육수 중 **넷만** 보여준다(2026-08-05 사용자 확정).
     순서는 사용자가 정한 것이다(2열 그리드라 좌·우·좌·우로 놓인다). 인기순 같은 계산이 아니다.
     ⚠️ 이름은 `MENU_DATA.broths` 의 것과 **글자까지 같아야** 한다 — 그림 파일 이름도 이것을 쓴다.
        (`청유마라훠궈` 와 `우유마라훠궈` 는 다른 항목이다. 헷갈리기 쉬우니 고칠 때 확인할 것.)
     🔴 카드 생김새는 옛 「탕」 그리드 그대로다(`.hc-card` + 그림 + 이름). 사용자 지시 —
        「이미지만 따오고 아래에 전골 이름 표시」. 그래서 레시피 카드의 하트·출처는 안 붙인다. */
  const HOME_BROTHS = ['토마토탕훠궈', '청유마라훠궈', '후추탕훠궈', '고수 듬뿍 훠궈'];
  function renderHomeJeongol() {
    if (!jeongolGridEl) return;
    const D = window.MENU_DATA;
    if (!D || !D.broths) { jeongolGridEl.innerHTML = ''; return; }  // 메뉴 데이터가 없으면 조용히 빈칸
    jeongolGridEl.innerHTML = HOME_BROTHS.map((n) => {
      const b = D.broths.find((x) => x.n === n);
      if (!b) return '';   // 이름이 바뀌었으면 그 칸만 빠진다(화면이 깨지지 않게)
      return '<button class="hc-card" type="button" data-broth="' + n + '">'
        + '<span class="hc-thumb">'
        + (b.img ? '<img src="assets/menu/' + n + '.webp" alt="' + n + '" loading="lazy" draggable="false">' : '')
        + '</span>'
        + '<span class="hp-name">' + n + '</span>'
        + '</button>';
    }).join('');
    jeongolGridEl.querySelectorAll('[data-broth]').forEach((btn) => {
      btn.addEventListener('click', 전골로가기);
    });
  }
  /* 메뉴 탭의 전골로 보낸다. 섹션을 먼저 바꾼 뒤 분류를 고른다 —
     반대로 하면 메뉴 화면이 아직 안 보여서 폭이 0 이라 밑줄이 자리를 못 잡는다(mnSyncUnderline 주석 참고). */
  function 전골로가기() {
    switchSection('menu');
    if (window.mnGoTab) window.mnGoTab('전골');
  }

  function renderHomeSections() {
    renderCelebRail();
    renderHomePopular();
    renderHomeCatList('히든메뉴', hiddenGridEl); // 히든메뉴 = 리스트(위), 전골 = 그리드(아래)
    renderHomeJeongol();
  }

  function renderIngList(el, items) {
    el.innerHTML = '';
    items.forEach((i, idx) => {
      // 같은 재료를 단위만 달리해 여러 줄로 적은 경우(예: 1그릇 + 1스푼) 이름은 첫 줄에만.
      // 열 정렬은 그대로 두고 이름 반복만 지운다.
      const 이름반복 = idx > 0 && items[idx - 1][0] === i[0];
      const row = document.createElement('div');
      row.className = 'ing-row' + (이름반복 ? ' ing-row--same' : '');
      row.innerHTML = `
        <span class="ing-name">${이름반복 ? '' : i[0]}</span>
        <span class="ing-amt">${i[1]}</span>
        <span class="ing-unit">${i[2]}</span>
      `;
      el.appendChild(row);
    });
  }

  let currentModalRecipe = null;
  let modalReturnFocus = null;
  let modalClosingViaHistory = false;
  const MODAL_HISTORY_KEY = 'haidilgogoRecipeModal';
  function modalHistoryRecipeId() {
    const id = history.state?.[MODAL_HISTORY_KEY];
    return typeof id === 'string' ? id : null;
  }

  function openModal(r) {
    // 카드는 홈·레시피 섹션에만 있음 — iOS 클릭 지연 등으로 카드 클릭이 다른 섹션 전환 뒤 늦게 도착해
    // "메뉴/매장 위에 레시피 모달이 뜨는" desync(모달·섹션 어긋남)를 원천 차단(2026-07-21).
    // 🔴 홈이 탭으로 갈라지면서 'home' 을 넣어야 한다(2026-08-03) — 안 넣으면 홈의 인기소스·히든메뉴·
    //    탕 카드, 스토리·가챠의 「레시피 보기」가 전부 눌러도 아무 일이 안 일어난다(실제로 그랬다).
    if (pageEl.dataset.section !== 'recipe' && pageEl.dataset.section !== 'home') return;
    const wasOpen = modalOverlay.classList.contains('open');
    currentModalRecipe = r;
    if (!wasOpen) {
      modalReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    }
    syncTopbarH(); // 모바일 전체화면 패널이 상단바 바로 아래에서 시작하도록 열 때마다 재측정
    // 배경 스크롤 잠금은 반드시 html(실제 스크롤 컨테이너)에 걸어야 한다. body에 걸면
    // body가 새 스크롤 컨테이너가 되어, sticky 상단바가 "스크롤 0인 body" 기준으로 붙어
    // 스크롤한 만큼 화면 밖(위)으로 사라진다(모바일에서 상단바 실종 버그). html은
    // scrollbar-gutter:stable이라 overflow:hidden이어도 데스크톱 스크롤바 폭 변화 없음.
    document.documentElement.style.overflow = 'hidden';

    // 원본 썸네일(모바일 전용 표시) — 카드와 동일한 이미지·출처 오버레이 재사용
    const thumbEl = document.getElementById('modalThumb');
    if (r.img) {
      thumbEl.style.background = r.imgBg || '#fff';
      thumbEl.innerHTML = '<img class="modal-thumb-img" src="' + r.img + '" alt="' + r.name + '" draggable="false">' +
        '<div class="recipe-thumb-overlay">' + (r.source ? '<div class="recipe-thumb-source">' + sourceHtml(r.source) + '</div>' : '') + '</div>';
    } else {
      thumbEl.style.background = r.tint;
      thumbEl.innerHTML = '<span class="modal-thumb-emoji">' + r.emoji + '</span>';
    }
    // 순위·이달의 소스 배지(2026-07-25) — 소스 카테고리에서 절대 순위(sauceRankMap) top5면 순위 배지
    // (homeRankBadge, 홈 인기소스와 동일 마크업/클래스 재사용), 이번 달 소스(pickMonthlySauce)면 '이달의
    // 소스' 배지. 둘 다 해당하면(예: s19) 좌상단에 가로로 나란히 — 순위 배지 → 이달의 소스 배지 순서.
    const modalRank = r.cat === '소스' ? sauceRankMap().get(r.id) : undefined;
    const modalIsMonthly = pickMonthlySauce(new Date())?.id === r.id;
    if ((modalRank != null && modalRank < 5) || modalIsMonthly) {
      thumbEl.insertAdjacentHTML('beforeend',
        '<span class="modal-badge-row">'
        + (modalRank != null && modalRank < 5 ? homeRankBadge(modalRank) : '')
        + (modalIsMonthly ? MONTHLY_BADGE_HTML : '')
        + '</span>');
    }

    const modalNameEl = document.getElementById('modalName');
    modalNameEl.classList.toggle('has-star', !!r.star); // 연예인 별 — 카드와 동일
    modalNameEl.innerHTML = (r.star ? STAR_SVG : '') + (r.nameHtml || r.name);
    modalScroll.dataset.cat = r.cat; // 모바일 TCG 프레임·배지 색 스위치 (CSS 변수 세트)
    document.getElementById('modalCat').textContent = r.cat;
    document.getElementById('modalVer').textContent = r.ver || '';
    // desc는 고유명사 <b> 강조 등 제한적 HTML 허용(작성자 데이터). 없으면 빈 박스가 남으므로 숨김.
    const descEl = document.getElementById('modalDesc');
    if (r.desc) {
      descEl.style.display = '';
      descEl.innerHTML = r.desc;
    } else {
      descEl.style.display = 'none';
    }
    setPressedState(modalFavBtn, favorites.has(r.id));
    setPressedState(modalLikeBtn, likedByMe.has(r.id));
    modalLikeCount.textContent = getLikeCount(r.id);

    const orderWrap = document.getElementById('modalOrderWrap');
    if (r.order && r.order.length > 0) {
      orderWrap.style.display = '';
      renderIngList(document.getElementById('modalOrder'), r.order);
    } else {
      orderWrap.style.display = 'none';
    }

    const ingsWrap = document.getElementById('modalIngsWrap');
    if (r.ings && r.ings.length > 0) {
      ingsWrap.style.display = '';
      renderIngList(document.getElementById('modalIngs'), sortIngs(r.ings));
    } else {
      ingsWrap.style.display = 'none';
    }

    const stepsWrap = document.getElementById('modalStepsWrap');
    const stepsEl = document.getElementById('modalSteps');
    if (r.steps.length > 0) {
      stepsWrap.style.display = '';
      stepsEl.innerHTML = '';
      r.steps.forEach((text, idx) => {
        const row = document.createElement('div');
        row.className = 'step-row';
        row.innerHTML = `
          <span class="step-num">${idx + 1}</span>
          <span class="step-text">${text}</span>
        `;
        stepsEl.appendChild(row);
      });
    } else {
      stepsWrap.style.display = 'none';
    }

    const tipWrap = document.getElementById('modalTipWrap');
    if (r.tip) {
      tipWrap.style.display = '';
      document.getElementById('modalTip').textContent = r.tip;
    } else {
      tipWrap.style.display = 'none';
    }

    // 확대 전환 애니메이션은 제거됨(2026-07-12 사용자 결정) — 즉시 열림
    modalOverlay.inert = false;
    modalOverlay.classList.add('open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    syncPageBackgroundA11y();
    modalScroll.scrollTop = 0; // 데스크톱 스크롤 컨테이너
    document.getElementById('modalCard').scrollTop = 0; // 모바일 스크롤 컨테이너(카드 본체)
    requestAnimationFrame(() => focusDialogClose(modalClose));

    // 상세를 새 화면처럼 history에 한 칸 쌓아, 안드로이드 뒤로가기·iOS 엣지 스와이프가
    // 사이트를 떠나는 대신 상세만 닫게 한다. 스토리 위에서 연 경우에도 한 칸만 빠져 스토리는 남는다.
    if (!wasOpen && modalHistoryRecipeId() !== r.id) {
      try {
        // 레시피 id도 함께 기록해야 X로 닫은 뒤 '앞으로 가기' 했을 때 같은 상세를 복원할 수 있다.
        history.pushState({ ...(history.state || {}), [MODAL_HISTORY_KEY]: r.id }, '', location.href);
      } catch (err) {
        // pushState를 막는 환경에서도 X·Esc 닫기는 정상 동작
      }
    }
  }

  function finishCloseModal() {
    modalOverlay.classList.remove('open', 'from-story');
    modalOverlay.setAttribute('aria-hidden', 'true');
    modalOverlay.inert = true;
    modalClosingViaHistory = false;
    // 스토리 위에서 열렸던 모달이면: 스크롤 잠금 유지 + 스토리 자동재생 재개. 아니면 잠금 해제
    if (storyViewer.classList.contains('open')) {
      storyViewer.classList.remove('paused');
    } else {
      document.documentElement.style.overflow = '';
    }
    syncPageBackgroundA11y();
    const target = modalReturnFocus && modalReturnFocus.isConnected && !modalReturnFocus.hidden
      ? modalReturnFocus
      : (storyViewer.classList.contains('open') ? document.getElementById('storyClose') : null);
    modalReturnFocus = null;
    if (target) requestAnimationFrame(() => target.focus());
  }

  function closeModal(options) {
    if (!modalOverlay.classList.contains('open')) return;
    if (!options?.fromHistory && modalHistoryRecipeId()) {
      if (modalClosingViaHistory) return;
      modalClosingViaHistory = true;
      history.back();
      return;
    }
    finishCloseModal();
  }

  modalOverlay.addEventListener('click', closeModal);
  modalScroll.addEventListener('click', (e) => e.stopPropagation());
  modalClose.addEventListener('click', closeModal);
  document.getElementById('modalBottomClose').addEventListener('click', closeModal); // 하단 닫기 = 상단 X와 동일 동작(history 처리 포함)
  modalScroll.addEventListener('keydown', (e) => trapFocusWithin(modalScroll, e));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal(); });
  window.addEventListener('popstate', () => {
    const historyRecipeId = modalHistoryRecipeId();
    if (modalOverlay.classList.contains('open')) {
      // 왼쪽 가장자리 뒤로가기: 모달 기록에서 기본 화면 기록으로 이동했으므로 상세를 닫는다.
      if (!historyRecipeId) closeModal({ fromHistory: true });
      return;
    }
    // X로 닫은 뒤 오른쪽 가장자리 앞으로가기: Safari가 보여준 상세 미리보기가 다시
    // 사라지지 않도록, 기록에 들어 있는 같은 레시피를 실제 상세창으로 복원한다.
    if (historyRecipeId) {
      const historyRecipe = RECIPES.find((r) => r.id === historyRecipeId);
      if (historyRecipe) openModal(historyRecipe);
    }
  });

  // 모달 하단 좋아요 — 그리드 카드의 하트 숫자도 재렌더 없이 동기화(이미지 깜빡임 방지)
  const modalLikeBtn = document.getElementById('modalLikeBtn');
  const modalLikeCount = document.getElementById('modalLikeCount');
  modalLikeBtn.addEventListener('click', () => {
    if (!currentModalRecipe) return;
    const id = currentModalRecipe.id;
    toggleLike(id);
    setPressedState(modalLikeBtn, likedByMe.has(id));
    modalLikeCount.textContent = getLikeCount(id);
    syncLikeUI(id); // 뒤에 깔린 카드 하트(숫자+빨강 채움)도 같이 맞춤
    popHeart(modalLikeBtn); // 홈 하트와 같은 통통 팝 — 알약을 벗기며 사라진 "눌림" 신호를 대신한다
  });

  // 모바일 전체화면 상세: 오버레이가 상단바 아래에서 시작하도록 실제 높이를 CSS 변수로 전달
  const topbarEl = document.querySelector('.topbar');
  function syncTopbarH() {
    document.documentElement.style.setProperty('--topbar-h', topbarEl.offsetHeight + 'px');
  }
  syncTopbarH();
  window.addEventListener('resize', syncTopbarH);

  // 데스크톱 우클릭으로 이미지 저장·복사 막기 — 사이트 모든 <img>(로고·카드/모달 썸네일·스티커 등)에
  // 컨텍스트 메뉴 차단. 문서 위임이라 나중에 동적 생성되는 이미지도 자동 적용.
  // ⚠️ 완벽한 보호 아님(개발자도구·네트워크 탭으로 우회 가능) — 무심코 저장하는 것만 억제.
  document.addEventListener('contextmenu', (e) => {
    if (e.target && e.target.tagName === 'IMG') e.preventDefault();
  });

  // 상세/모달이 열린 채 상단바(탭·검색·즐겨찾기 등)를 누르면 닫고 그 동작을 그대로 실행
  // (스티커 보기 모달도 지역 탭 누르면 닫히고 그 지역으로 필터 — 레시피 상세와 동일 규칙)
  // ⚠️ 공유 버튼(#topShareBtn)은 화면/섹션을 바꾸지 않으므로 예외 — 캡처 단계라 이 리스너가 버튼 자체의
  // 클릭 핸들러보다 먼저 실행돼, 예외 없이는 모달이 열린 채 공유를 눌러도 모달이 먼저 닫혀버렸다(2026-07-25 버그 수정).
  topbarEl.addEventListener('click', (e) => {
    if (e.target.closest('#topShareBtn')) return;
    if (modalOverlay.classList.contains('open')) closeModal();
    if (stampViewOverlay.classList.contains('open')) closeStampView();
    if (!columnOverlay.hidden) closeColumn(); // 기획 칼럼(아티클)도 같은 규칙
  }, true);
  modalFavBtn.addEventListener('click', () => {
    if (!currentModalRecipe) return;
    const id = currentModalRecipe.id;
    if (favorites.has(id)) {
      favorites.delete(id);
    } else {
      favorites.add(id);
    }
    saveFavorites();
    setPressedState(modalFavBtn, favorites.has(id));
    renderList();
  });

  // 검색은 카테고리 탭과 겹치는 필터(AND, 2026-07-25 확정) — activeCat을 건드리지 않는다.
  // 홈에서는 검색창 자체가 안 보이므로(list-head가 숨김) 검색은 항상 이미 브라우즈 중일 때만 일어난다.
  searchInput.addEventListener('input', (e) => {
    query = e.target.value;
    searchBox.classList.toggle('has-value', query.length > 0);
    renderList();
  });
  // 즐겨찾기도 카테고리 탭과 겹치는 필터다. 🔴 버튼이 레시피 탭 상단바에만 있으므로(2026-08-03
  // 상단바 규칙) 「켰던 자리로 돌아가기」 장치는 없앴다 — 켜고 끄는 곳이 언제나 레시피 탭이다.
  favToggleBtn.addEventListener('click', () => {
    showFavoritesOnly = !showFavoritesOnly;
    setPressedState(favToggleBtn, showFavoritesOnly);
    renderList();
    scrollToTop();   // 목록이 통째로 바뀌므로 맨 위로
  });

  // ===== 오늘의 소스 가챠 =====
  const gachaOverlay = document.getElementById('gachaOverlay');
  const gachaModal = document.getElementById('gachaModal');
  const gachaClose = document.getElementById('gachaClose');
  const gachaStage = document.getElementById('gachaStage');
  const gachaMat = document.getElementById('gachaMat');
  const gachaBowl = document.getElementById('gachaBowl');
  const gachaBowlShadow = document.getElementById('gachaBowlShadow');
  const gachaSauce = document.getElementById('gachaSauce');
  const gachaSauceBeige = document.getElementById('gachaSauceBeige');
  const gachaIngs = document.getElementById('gachaIngs');
  const gachaResult = document.getElementById('gachaResult');
  const gachaPull = document.getElementById('gachaPull');
  const gachaActions = document.getElementById('gachaActions');
  const gachaView = document.getElementById('gachaView');
  const GACHA_POOL = RECIPES.filter((r) => r.cat === '소스');
  const GACHA_CONFETTI = ['#E0301E', '#F8B888', '#FCE4AE', '#F5B8A8', '#E8C9A0', '#FFB07A', '#EF9F27'];
  // 그릇에 떨어지는 재료들(SVG, 필터 금지). x = 그릇 중앙 기준 가로 위치(px)
  const GACHA_DROPS = [
    { x: -30, svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="giA" cx="38%" cy="30%" r="78%"><stop offset="0%" stop-color="#FBE7BC"/><stop offset="55%" stop-color="#DDB070"/><stop offset="100%" stop-color="#A9763A"/></radialGradient></defs><path d="M12 2 C15 7 19 9.5 19 14 A7 7 0 0 1 5 14 C5 9.5 9 7 12 2 Z" fill="url(#giA)"/><ellipse cx="9.3" cy="12.5" rx="2.6" ry="1.7" fill="rgba(255,255,255,.6)" transform="rotate(-28 9.3 12.5)"/></svg>' },
    { x: 20, svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="giB" cx="38%" cy="32%" r="78%"><stop offset="0%" stop-color="#FF9070"/><stop offset="55%" stop-color="#D63A1B"/><stop offset="100%" stop-color="#9A250E"/></radialGradient></defs><path d="M12 2 C15 7 19 9.5 19 14 A7 7 0 0 1 5 14 C5 9.5 9 7 12 2 Z" fill="url(#giB)"/><ellipse cx="9.3" cy="12.5" rx="2.6" ry="1.7" fill="rgba(255,255,255,.55)" transform="rotate(-28 9.3 12.5)"/></svg>' },
    { x: -12, svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g transform="rotate(-20 9 10)"><rect x="2" y="7" width="14" height="6" rx="3" fill="#569A3E"/><ellipse cx="16" cy="10" rx="2" ry="3" fill="#A8D68C"/><ellipse cx="16" cy="10" rx="1.1" ry="1.8" fill="#EFF8E4"/></g><g transform="rotate(16 15 17)"><rect x="9" y="14" width="11" height="5" rx="2.5" fill="#6DB553"/><ellipse cx="20" cy="16.5" rx="1.7" ry="2.5" fill="#B9E09E"/></g></svg>' },
    { x: 28, svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g transform="rotate(-30 8 9)"><ellipse cx="8" cy="9" rx="3.1" ry="2" fill="#F1E3C0" stroke="#C2A678" stroke-width=".7"/><ellipse cx="7.2" cy="8.4" rx="1" ry=".6" fill="#FBF4E2"/></g><g transform="rotate(22 16 11)"><ellipse cx="16" cy="11" rx="3.1" ry="2" fill="#F5EACB" stroke="#C2A678" stroke-width=".7"/><ellipse cx="15.2" cy="10.4" rx="1" ry=".6" fill="#FCF6E6"/></g><g transform="rotate(70 11 16)"><ellipse cx="11" cy="16" rx="3.1" ry="2" fill="#EDDDB6" stroke="#C2A678" stroke-width=".7"/><ellipse cx="10.2" cy="15.4" rx="1" ry=".6" fill="#F9F1DC"/></g></svg>' },
    { x: 0, svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="giC" cx="40%" cy="30%" r="78%"><stop offset="0%" stop-color="#FFC287"/><stop offset="55%" stop-color="#F26A20"/><stop offset="100%" stop-color="#C24A10"/></radialGradient></defs><path d="M12 3 C14.6 7.4 18 9.8 18 13.6 A6 6 0 0 1 6 13.6 C6 9.8 9.4 7.4 12 3 Z" fill="url(#giC)"/><circle cx="9.8" cy="11.5" r="1.7" fill="rgba(255,255,255,.65)"/></svg>' },
  ];
  let gachaLast = -1;
  let gachaPicked = null;

  function gachaConfetti() {
    for (let i = 0; i < 26; i++) {
      const s = document.createElement('span');
      const z = 7 + Math.random() * 7;
      s.style.cssText = 'position:absolute;left:104px;top:102px;width:' + z + 'px;height:' + (z * 0.6) + 'px;background:' + GACHA_CONFETTI[i % GACHA_CONFETTI.length] + ';border-radius:2px;pointer-events:none;z-index:9;';
      gachaStage.appendChild(s);
      const ang = Math.random() * 6.283;
      const dist = 52 + Math.random() * 82;
      const anim = s.animate([
        { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
        { transform: 'translate(' + (Math.cos(ang) * dist).toFixed(1) + 'px,' + (Math.sin(ang) * dist).toFixed(1) + 'px) rotate(' + Math.round(Math.random() * 600) + 'deg)', opacity: 0 }
      ], { duration: 900, easing: 'cubic-bezier(.15,.6,.4,1)', fill: 'forwards' });
      anim.onfinish = () => s.remove();
    }
  }

  // 재료 착지 시 튀는 소스 방울 색: 소스가 베이지 → 빨강으로 변해가는 단계를 따라감
  const GACHA_SPLASH_COLORS = ['#D8AE6C', '#CE8B4F', '#C86636', '#C24E24', '#C23517'];

  function gachaSplash(x, color) {
    for (let k = 0; k < 2; k++) {
      const p = document.createElement('span');
      const sz = 4 + Math.random() * 3;
      p.style.cssText = 'position:absolute;left:calc(50% + ' + x + 'px);top:26px;width:' + sz + 'px;height:' + sz + 'px;background:' + color + ';border-radius:50%;pointer-events:none;';
      gachaIngs.appendChild(p);
      const dx = (k === 0 ? -1 : 1) * (8 + Math.random() * 8);
      const dy = -(10 + Math.random() * 8);
      const anim = p.animate([
        { transform: 'translate(0,0) scale(1)', opacity: .9 },
        { transform: 'translate(' + dx.toFixed(0) + 'px,' + dy.toFixed(0) + 'px) scale(.6)', opacity: 0 }
      ], { duration: 320, easing: 'ease-out', fill: 'forwards' });
      anim.onfinish = () => p.remove();
    }
  }

  const GACHA_STAR = '<svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg"><path d="M6 0 L7.3 4.7 L12 6 L7.3 7.3 L6 12 L4.7 7.3 L0 6 L4.7 4.7 Z" fill="#FFD98A"/></svg>';

  function gachaSparkle() {
    [[52, 8], [88, 4], [70, 16]].forEach((pos, k) => {
      const st = document.createElement('span');
      st.style.cssText = 'position:absolute;left:' + pos[0] + 'px;top:' + pos[1] + 'px;width:11px;height:11px;pointer-events:none;';
      st.innerHTML = GACHA_STAR;
      gachaIngs.appendChild(st);
      const anim = st.animate([
        { transform: 'translateY(4px) scale(.4)', opacity: 0 },
        { transform: 'translateY(-3px) scale(1)', opacity: 1, offset: .45 },
        { transform: 'translateY(-11px) scale(1.15)', opacity: 0 }
      ], { duration: 550, delay: k * 80, easing: 'ease-out', fill: 'forwards' });
      anim.onfinish = () => st.remove();
    });
  }

  function gachaResetBowl() {
    // 그릇 복구는 전환 없이 즉시 — 다시 뽑기 때 잔상이 새 연출과 겹치지 않게
    gachaIngs.innerHTML = '';
    gachaSauce.style.transition = 'none';
    gachaSauce.style.opacity = '0';
    gachaSauce.style.transform = 'scale(.5)';
    gachaSauceBeige.style.transition = 'none';
    gachaSauceBeige.style.opacity = '1'; // 처음엔 땅콩소스(베이지)부터 시작
    void gachaSauce.offsetWidth;
    gachaSauce.style.transition = '';
    gachaSauceBeige.style.transition = '';
    gachaBowl.classList.remove('bump');
    gachaBowl.style.opacity = '1';
    gachaMat.style.opacity = '1';
    gachaBowlShadow.style.opacity = '1';
    // 결과 카드는 애니메이션 없이 즉시 제거(다시 뽑기 때 흰 네모 잔상 방지)
    gachaResult.style.transition = 'none';
    gachaResult.style.opacity = '0';
    gachaResult.style.transform = 'scale(.35)';
    gachaResult.innerHTML = '';
    void gachaResult.offsetWidth;
    gachaResult.style.transition = '';
  }

  function gachaToStart() {
    gachaResetBowl();
    gachaActions.style.display = 'none';
    gachaPull.style.display = 'inline-flex'; // 글자 세로 가운데(2026-08-05 주사위 아이콘 제거 후에도 유지)
    gachaPull.style.pointerEvents = 'auto';
    // 🔴 뽑기 전 상태 — 그릇을 1.3배로 키우고 버튼 아래를 띄워 **뽑은 뒤와 창 높이를 같게** 한다.
    //    값과 이유는 styles.css 의 `.gacha-modal.is-start` 주석에 있다.
    gachaModal.classList.add('is-start');
  }

  function gachaPullOnce() {
    gachaResetBowl();
    gachaPull.style.pointerEvents = 'none';
    // 결과를 미리 뽑아 이미지를 먼저 로드해둔다(카드가 흰 네모로 잠깐 보이는 현상 방지)
    let i;
    do { i = Math.floor(Math.random() * GACHA_POOL.length); } while (i === gachaLast && GACHA_POOL.length > 1);
    gachaLast = i;
    const r = GACHA_POOL[i];
    gachaPicked = r;
    saveGachaToday(r.id); // 하루 한 번: 오늘 뽑은 결과 기억(기기 저장)
    const preload = new Image();
    preload.src = r.img;
    // 재료를 하나씩 그릇에 떨어뜨린다: 착지마다 그릇 출렁 + 소스 차오름/색 변화 + 스플래시
    GACHA_DROPS.forEach((d, idx) => {
      setTimeout(() => {
        const s = document.createElement('span');
        s.className = 'gacha-ing';
        s.style.left = 'calc(50% + ' + d.x + 'px)';
        s.innerHTML = d.svg;
        s.firstChild.style.transform = 'rotate(' + Math.round(Math.random() * 50 - 25) + 'deg)'; // 낙하마다 아이콘 각도 랜덤
        gachaIngs.appendChild(s);
        setTimeout(() => {
          gachaBowl.classList.remove('bump');
          void gachaBowl.offsetWidth;
          gachaBowl.classList.add('bump');
          const step = (idx + 1) / GACHA_DROPS.length;
          gachaSauce.style.opacity = String(.35 + .65 * step);
          gachaSauce.style.transform = 'scale(' + (.5 + .5 * step).toFixed(2) + ')';
          gachaSauceBeige.style.opacity = String(1 - step); // 재료가 들어갈수록 베이지 → 빨강
          gachaSplash(d.x, GACHA_SPLASH_COLORS[idx]);
          s.classList.add('sink');
          if (idx === GACHA_DROPS.length - 1) setTimeout(gachaSparkle, 130); // 완성 반짝임
        }, 430); // gachaDrop 애니메이션(.43s) 착지 시점
      }, idx * 170);
    });
    setTimeout(() => {
      // 브라우즈 그리드 카드와 완전히 동일한 마크업을 재사용(buildBrowseGridCard, 2026-07-25에 옛 TCG
      // 카드에서 교체. 그 옛 코드는 2026-07-30에 삭제됨). 좋아요는 숨기고 즐겨찾기·셀럽 별은 그대로 노출.
      // 카드는 opacity 0(리셋 상태)로 먼저 그려두고, 이미지가 실제로 로드된 뒤에만 공개한다.
      // → 캐시 여부와 무관하게 카드가 흰 네모로 먼저 뜨는 현상 방지.
      gachaResult.innerHTML = '';
      // eager: 결과 카드는 바로 보여야 하므로 지연 로딩 없이 즉시 로드(딜레이 방지, 이미지는 openGacha 때 프리로드됨)
      gachaResult.appendChild(buildBrowseGridCard(r, { hideLike: true, hideFav: true, eager: true, interactive: false }));
      let revealed = false;
      const reveal = () => {
        if (revealed) return;
        revealed = true;
        gachaResult.style.opacity = '1';
        gachaResult.style.transform = 'scale(1)';
        gachaBowl.style.opacity = '0';
        gachaMat.style.opacity = '0';
        gachaBowlShadow.style.opacity = '0';
        gachaConfetti();
        gachaPull.style.display = 'none';
        gachaActions.style.display = 'flex';
        // 🔴 그릇 확대를 여기서 푼다 — 그릇이 사라지는 0.25초와 겹치게 부드럽게 줄어든다.
        //    창 높이는 안 바뀐다(확대가 transform 이라 자리를 안 차지하고, 버튼 아래 66px 이
        //    액션 영역으로 그대로 대체되기 때문).
        gachaModal.classList.remove('is-start');
      };
      const cardImg = gachaResult.querySelector('.hc-thumb > img');
      if (cardImg && cardImg.complete && cardImg.naturalWidth > 0) {
        reveal();
      } else if (cardImg) {
        cardImg.addEventListener('load', reveal);
        cardImg.addEventListener('error', reveal); // 이미지 실패해도 그릇에 갇히지 않게
        setTimeout(reveal, 1500); // 안전장치: 아무리 느려도 1.5초 뒤엔 공개
      } else {
        reveal();
      }
    }, 1480); // 마지막 재료 착지(~1110ms)와 잠김 연출이 끝난 뒤 카드 공개
  }

  // ===== 하루 한 번 제한 (기기 localStorage, 로그인 없어 소프트 제한) =====
  const GACHA_DAILY_KEY = 'haidilao_gacha_daily';
  function gachaTodayStr() {
    const d = new Date(); // 기기 로컬 날짜(자정 지나면 새로 뽑힘)
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function getGachaTodayId() {
    try { const o = JSON.parse(localStorage.getItem(GACHA_DAILY_KEY)); if (o && o.date === gachaTodayStr()) return o.id; } catch (e) {}
    return null;
  }
  function saveGachaToday(id) {
    try { localStorage.setItem(GACHA_DAILY_KEY, JSON.stringify({ date: gachaTodayStr(), id: id })); } catch (e) {}
  }
  // 오늘 이미 뽑았으면 뽑기 연출 없이 그 소스를 바로 결과 카드로(그릇/뽑기 버튼 숨김)
  function gachaShowSaved(r) {
    gachaResetBowl();
    gachaModal.classList.remove('is-start');   // 이미 뽑은 상태로 바로 여는 길 — 확대·여백 없이 시작
    gachaPull.style.display = 'none';
    gachaResult.innerHTML = '';
    gachaResult.appendChild(buildBrowseGridCard(r, { hideLike: true, hideFav: true, eager: true, interactive: false }));
    gachaResult.style.transition = 'none';
    gachaResult.style.opacity = '1';
    gachaResult.style.transform = 'scale(1)';
    void gachaResult.offsetWidth;
    gachaResult.style.transition = '';
    gachaBowl.style.opacity = '0';
    gachaMat.style.opacity = '0';
    gachaBowlShadow.style.opacity = '0';
    gachaActions.style.display = 'flex';
  }

  let gachaPreloaded = false;
  function openGacha() {
    document.documentElement.style.overflow = 'hidden'; // body 아닌 html에 — 상단바 sticky 유지 (openModal 주석 참고)
    // 첫 뽑기에서도 카드가 흰 네모로 안 뜨게, 소스 이미지를 미리 받아둔다(한 번만)
    if (!gachaPreloaded) {
      gachaPreloaded = true;
      GACHA_POOL.forEach((r) => { const im = new Image(); im.src = r.img; });
    }
    const savedId = getGachaTodayId();
    const savedR = savedId ? GACHA_POOL.find((x) => x.id === savedId) : null;
    if (savedR) { gachaPicked = savedR; gachaShowSaved(savedR); } // 오늘 이미 뽑음 → 결과 바로
    else { gachaToStart(); }                                       // 아직 안 뽑음 → 뽑기 버튼
    gachaOverlay.classList.add('open');
  }

  function closeGacha() {
    document.documentElement.style.overflow = '';
    gachaOverlay.classList.remove('open');
  }

  // 홈 맨 아래 '운명의 소스 뽑기'도 같은 가챠를 연다(헤더의 옛 '오늘의 소스' 버튼은 2026-07-24 삭제)
  const homeRandomBtn = document.getElementById('homeRandomBtn');
  if (homeRandomBtn) homeRandomBtn.addEventListener('click', openGacha);

  // 초심자 가이드 — 홈 배너도 히어로 배너와 같은 칼럼 패널을 연다(GUIDE_BANNER).
  // 옛 '곧 만나요!' 자리표시 패널(#guideOverlay)은 아티클이 들어오면서 제거됨.
  document.getElementById('homeGuide').addEventListener('click', () => { openColumn(GUIDE_BANNER); });

  // ── 기획 칼럼 패널 ──────────────────────────────────────────
  const columnOverlay = document.getElementById('columnOverlay');
  const columnSheet = document.getElementById('columnSheet');
  // ingFilter 재료가 ings에 든 레시피 자동 수집(고수 든 소스 등)
  // 칼럼에 붙는 소스 한 줄(썸네일 + 이름 + 버전 + 화살표). 누르면 칼럼을 닫고 그 레시피를 연다.
  // 아티클 맨 아래 자동 목록과 본문 중간 목록이 같은 모양을 쓰도록 여기 한 곳에서만 만든다.
  function buildColumnSauce(r) {
    const ver = r.ver ? '<span class="col-sauce-ver">' + r.ver + '</span>' : '';
    const thumb = r.img
      ? '<img class="col-sauce-thumb" src="' + r.img + '" alt="" draggable="false">'
      : '<span class="col-sauce-thumb col-sauce-thumb--emoji">' + (r.emoji || '🥣') + '</span>';
    return '<button class="col-sauce" type="button" data-rid="' + r.id + '">'
      + thumb
      + '<span class="col-sauce-meta"><span class="col-sauce-name">' + r.name + '</span>'
      + ver + '</span>'
      + '<svg class="col-sauce-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      + '</button>';
  }
  /* 칼럼에 붙는 **메뉴** 한 줄. 위 `buildColumnSauce` 와 같은 부품을 쓰되 셋이 다르다:
     ① 그림이 `assets/menu/*.webp` 다 — 배경 없는 냄비 그림이라 `col-sauce-thumb--menu`(안에 맞춤 + 크림 배경)를 쓴다.
        소스처럼 `cover` 로 두면 잘린다.
     ② **누르면 메뉴 탭에서 그 항목이 보이는 자리로 간다**(2026-08-05 사용자 확정). 소스 줄처럼 화살표를 붙인다.
        🔴 가는 방법이 둘이다 — 누르는 사람에겐 하나로 보이지만 속은 다르다:
           · **육수(전골)** → `mnGoTab('전골')`. 검색으로는 **안 걸린다**(검색이 상위 7개 분류만 훑는다).
             육수 목록이 12개뿐이라 탭만 열어도 바로 보인다.
           · **그 밖의 메뉴** → `mnSearch(이름)`. 분류 탭으로만 보내면 60여 개에 파묻혀 못 찾는다.
     ③ 부제는 **있는 것만**. 지금은 「제주 한정」뿐이고, 한라봉 아이콘을 반드시 같이 넣는다
        (2026-08-05 사용자 지시 — 같은 말이 화면마다 다르게 보이면 안 된다). 색·크기는 메뉴 탭과 같은 값.
     ⚠️ 복사본(`cilantro.html`)에서는 **소스도 메뉴도 안 눌린다** — 그 페이지엔 앱이 없어 갈 데가 없다.
        글자와 모양은 같게 두되 **동작만 다른 것**이고, 원본↔복사본 규칙에 어긋나지 않는다. */
  function buildColumnMenu(n) {
    const D = window.MENU_DATA;
    const 육수 = D && (D.broths || []).find((b) => b.n === n);
    const it = 육수 || (D ? (D.tabs || []).flatMap((t) => t.items).find((i) => i.n === n) : null);
    if (!it) return '';   // 이름이 바뀌었으면 그 줄만 빠진다(아티클이 깨지지 않게)
    const 부제 = it.jeju
      ? '<span class="col-sauce-ver col-sauce-ver--jeju"><img src="assets/icons/hallabong.svg" alt="">제주 한정</span>'
      : '';
    return '<button class="col-sauce" type="button" data-menu-n="' + n + '"' + (육수 ? ' data-menu-broth="1"' : '') + '>'
      + '<img class="col-sauce-thumb col-sauce-thumb--menu" src="assets/menu/' + n + '.webp" alt="" draggable="false">'
      + '<span class="col-sauce-meta"><span class="col-sauce-name">' + n + '</span>' + 부제 + '</span>'
      + '<svg class="col-sauce-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      + '</button>';
  }
  function getColumnSauces(col) {
    return RECIPES.filter((r) =>
      (!col.catFilter || r.cat === col.catFilter) &&
      r.ings && r.ings.some((ing) => ing[0] === col.ingFilter));
  }
  function openColumn(col) {
    syncTopbarH(); // 칼럼 패널이 상단바 바로 아래에서 시작하도록 열 때마다 재측정
    document.documentElement.style.overflow = 'hidden';
    const hero = document.getElementById('columnHero');
    // 어두운 썸네일 위에서는 상단 X를 흰색으로(기본 X는 어두운 색이라 안 보인다).
    // 칼럼마다 lightClose로 지정 — 예전엔 id === 'col-hotpot-trivia'로 박아뒀는데, 그 썸네일이
    // 밝은 그림으로 바뀌자 흰 X가 안 보이게 됐다. 그림에 딸린 성질이니 칼럼 데이터에 둔다.
    columnSheet.classList.toggle('column-sheet--light-close', !!col.lightClose);
    hero.style.cssText = col.bannerImg
      ? 'background-image:url(' + col.bannerImg + ');background-size:cover;background-position:center;'
      : 'background:' + col.bannerBg + ';';
    // 배너와 같은 줄바꿈을 칼럼 제목에도 — titleHtml이 있으면 그걸 쓴다(가이드만 해당, <br> 포함).
    // 없으면 기존대로 순수 텍스트(고수·알쓸신잡). aria 제목은 계속 col.title을 쓴다.
    const titleEl = document.getElementById('columnTitle');
    if (col.titleHtml) titleEl.innerHTML = col.titleHtml;
    else titleEl.textContent = col.title;
    document.getElementById('columnSub').textContent = col.heroDesc || '';
    document.getElementById('columnBody').innerHTML = col.body || '';
    // 본문의 출처 번호는 URL/history를 바꾸지 않고 하단 해당 출처로 이동.
    [...document.querySelectorAll('#columnBody .col-note-ref')].forEach((el) => {
      el.addEventListener('click', () => {
        document.getElementById('columnNote' + el.dataset.note)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
    // 하단: 관련 소스 자동 목록(각 항목 클릭 → 칼럼 닫고 해당 레시피 열기)
    const sauces = getColumnSauces(col);
    const saucesSection = document.querySelector('.column-sauces');
    saucesSection.hidden = !sauces.length;
    const listEl = document.getElementById('columnSauceList');
    listEl.innerHTML = sauces.map(buildColumnSauce).join('');
    // 하단: 관련 메뉴(손으로 적은 목록). 적어 둔 칼럼에만 뜬다 — 없으면 절째로 숨는다.
    const menusSection = document.getElementById('columnMenus');
    const menus = (col.menus || []).map(buildColumnMenu).filter(Boolean);
    menusSection.hidden = !menus.length;
    document.getElementById('columnMenuList').innerHTML = menus.join('');
    // 본문 중간에 직접 고른 소스를 놓는 자리. 본문 HTML에
    // <div class="column-sauce-list" data-sauce-ids="s1,s2"></div> 를 넣으면 그 자리에 채워진다.
    // 아래 자동 목록(.column-sauces)은 재료로 모으고 위치가 맨 끝 고정이라, 가이드처럼
    // "이 두 개를 골랐다"를 본문 흐름 안에서 보여줘야 하는 경우를 위해 따로 둔다.
    // 적은 순서 그대로 나오고, 없는 id는 조용히 건너뛴다.
    [...document.getElementById('columnBody').querySelectorAll('.column-sauce-list[data-sauce-ids]')].forEach((box) => {
      box.innerHTML = box.dataset.sauceIds.split(',')
        .map((id) => RECIPES.find((r) => r.id === id.trim()))
        .filter(Boolean)
        .map(buildColumnSauce).join('');
    });
    // 관련 소스 아래: 주석·출처(아티클의 마지막 요소)
    const notesEl = document.getElementById('columnNotes');
    const notes = col.notes || [];
    notesEl.hidden = !notes.length;
    notesEl.innerHTML = notes.length
      ? '<h3 class="column-notes-title">출처</h3><ol class="column-notes-list">'
        + notes.map((note, idx) =>
          '<li id="columnNote' + (idx + 1) + '"><span class="column-note-num">[' + (idx + 1) + ']</span>'
          + '<a class="column-note-link" href="' + note.url + '" target="_blank" rel="noopener noreferrer">'
          + note.label
          + '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 5h5v5M19 5l-8 8M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
          + '</a></li>').join('')
        + '</ol>'
      : '';
    // 자동 목록과 본문 중간 목록을 함께 잡는다(listEl만 보면 본문 것이 눌리지 않는다).
    // 열 때마다 버튼을 새로 만들므로 리스너가 겹치지 않는다.
    [...columnOverlay.querySelectorAll('.col-sauce[data-rid]')].forEach((el) => {
      el.addEventListener('click', () => {
        const r = RECIPES.find((x) => x.id === el.dataset.rid);
        if (r) { closeColumn(); openModal(r); }
      });
    });
    /* 메뉴 줄 — 아티클을 닫고 **메뉴 탭에서 그게 보이는 자리**로 간다(2026-08-05 사용자 확정).
       소스 줄이 「칼럼을 닫고 레시피를 연다」와 같은 흐름이다.
       ⚠️ 가는 방법이 둘인 이유는 buildColumnMenu 주석 참고(육수는 검색에 안 걸린다). */
    [...columnOverlay.querySelectorAll('.col-sauce[data-menu-n]')].forEach((el) => {
      el.addEventListener('click', () => {
        const n = el.dataset.menuN;
        closeColumn();
        switchSection('menu');
        if (el.dataset.menuBroth) { if (window.mnGoTab) window.mnGoTab('전골'); }
        else if (window.mnSearch) window.mnSearch(n);
      });
    });
    // 본문 안 CTA 버튼. data-go 값으로 갈 곳을 정한다 — 소스 카드의 data-rid와 같은 방식이라
    // 나중에 다른 아티클에서 <button class="col-cta" data-go="browse">만 넣으면 그대로 동작한다.
    [...columnOverlay.querySelectorAll('.col-cta[data-go]')].forEach((el) => {
      el.addEventListener('click', () => {
        if (el.dataset.go === 'browse') { closeColumn(); enterBrowse('전체'); }
      });
    });
    columnOverlay.hidden = false;
    columnOverlay.scrollTop = 0;
  }
  function closeColumn() {
    document.documentElement.style.overflow = '';
    columnOverlay.hidden = true;
  }
  document.getElementById('columnClose').addEventListener('click', closeColumn);
  document.getElementById('columnBottomClose').addEventListener('click', closeColumn);
  columnOverlay.addEventListener('click', (e) => { if (e.target === columnOverlay) closeColumn(); });
  gachaPull.addEventListener('click', gachaPullOnce);
  gachaClose.addEventListener('click', closeGacha);
  gachaOverlay.addEventListener('click', closeGacha);
  gachaModal.addEventListener('click', (e) => e.stopPropagation());
  gachaView.addEventListener('click', () => {
    if (!gachaPicked) return;
    const r = gachaPicked;
    closeGacha();
    openModal(r);
  });
  homeBtn.addEventListener('click', () => {
    location.href = location.pathname + '?_r=' + Date.now();
  });
  searchClear.addEventListener('click', () => {
    query = '';
    searchInput.value = '';
    searchBox.classList.remove('has-value');
    renderList();
    searchInput.focus();
  });

  // ===== 섹션(뷰) 전환: 레시피 · 메뉴 · 매장 · 스탬프 =====
  const pageEl = document.querySelector('.page');
  const tabbarEl = document.getElementById('tabbar');
  const tabbarIndicator = document.getElementById('tabbarIndicator');
  const SECTIONS = ['home', 'recipe', 'menu', 'store', 'stamp'];
  let activeSection = 'home';   // 시작은 홈 탭(2026-08-03 분리)
  // 🔴 탭마다 스크롤 위치를 기억한다(2026-08-03 사용자 확정). 예전엔 「맨 위로」를 의도했는데
  //    그 방식(scroll-behavior 를 잠깐 auto 로 바꿔치기)이 안 먹어 우연히 유지되고 있었다.
  //    우연에 기대지 않고 여기서 직접 저장·복원한다.
  const sectionScroll = Object.create(null);
  const scrollTopNow = () => (document.scrollingElement || document.documentElement).scrollTop;
  // 🔴 「맨 위로」 버튼과 탭 재탭은 **부드럽게** 올라간다(2026-08-03 사용자 확정) —
  //    사람이 「올려달라」고 누른 것이라 올라가는 게 보여야 한다.
  //    반대로 카테고리를 바꿀 때는 instant 다 — 목록이 통째로 바뀌는 자리라 훑고 지나갈 이유가 없다.
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    sectionScroll[activeSection] = 0;
  }

  // 인디케이터 2상태(배민식): 정지=불투명 필(활성 버튼에 딱 맞음) / 이동=유리구슬(원형 76px).
  // 크기·위치는 여기서 인라인으로, 질감(필↔유리)은 CSS .tabbar-indicator(--glass)가 담당.
  const BUBBLE = 58; // 유리구슬 지름(2026-07-21: 76→66→58로 축소). 위치·클램프 계산 모두 이 값 기준
  function bubblePosFor(btn) {
    return {
      x: btn.offsetLeft + btn.offsetWidth / 2 - BUBBLE / 2,
      y: btn.offsetTop + btn.offsetHeight / 2 - BUBBLE / 2,
    };
  }
  function setGlass(on) {
    tabbarIndicator.classList.toggle('tabbar-indicator--glass', on);
  }
  // (정지 상태) 필을 현재 활성 탭에 딱 맞춤
  function updateIndicator() {
    const active = tabbarEl.querySelector('.tabbar-btn.active');
    if (!active) return;
    setGlass(false);
    tabbarIndicator.style.width = active.offsetWidth + 'px';
    tabbarIndicator.style.height = active.offsetHeight + 'px';
    tabbarIndicator.style.transform =
      'translate(' + active.offsetLeft + 'px,' + active.offsetTop + 'px)';
  }
  // (스크롤 축소/확대용) 트랜지션을 끄고 매 프레임 정확히 붙임 → 크기 변할 때 원이 더디게 안 쫓아옴
  let indicatorAnimId = 0;
  let indicatorBusy = false; // 루프 진행 중엔 placeIndicator(즉시 스냅)가 끼어들어 슬라이드를 죽이지 않게
  function trackIndicator(duration) {
    cancelAnimationFrame(indicatorAnimId);
    // 슬라이드 WAAPI가 남아 있으면(진행 중이거나 fill:forwards 홀드) 인계 — WAAPI가 인라인 쓰기를
    // 덮어써서 아래 프레임 추적이 안 먹는 것 방지. 같은 틱에 updateIndicator가 바로 그리므로 깜빡임 없음.
    if (indicatorWA) { const prev = indicatorWA; indicatorWA = null; prev.cancel(); }
    indicatorBusy = true;
    tabbarIndicator.style.transition = 'none';
    const start = performance.now();
    (function step(now) {
      updateIndicator();
      if (now - start < duration) {
        indicatorAnimId = requestAnimationFrame(step);
      } else {
        indicatorBusy = false;
        tabbarIndicator.style.transition = ''; // 다음 탭 전환의 부드러운 슬라이드를 위해 복구
      }
    })(start);
  }
  // (탭 전환용) 빨간 원 슬라이드 — Web Animations API로 브라우저 합성기(GPU)에서 재생.
  // JS 시계(rAF)·CSS 트랜지션 방식은 전환 직후 메인스레드가 무거우면(iOS: 레시피 그리드
  // 숨김+스크롤 점프) 프레임이 밀려 애니메이션이 잘려 보였음. WAAPI의 transform 애니메이션은
  // 메인스레드가 바빠도 GPU에서 독립적으로 끝까지 재생됨(네이티브 앱과 같은 원리).
  let indicatorWA = null;
  function slideIndicator(targetBtn) {
    cancelAnimationFrame(indicatorAnimId);
    // 출발점 = 지금 화면에 그려진 위치. ⚠️ 진행 중 애니메이션의 "현재 중간값"을 취소 *전에* 읽어야 함 —
    // 취소부터 하면 밑그림(이전 슬라이드 도착점)으로 스냅된 값이 읽혀서, 빠르게 연속 탭할 때
    // 원이 목적지로 순간이동했다가 다시 미끄러지는 "뚝뚝 끊김"이 됨(iOS 실기기 보고).
    const cs = getComputedStyle(tabbarIndicator);
    const m = cs.transform && cs.transform !== 'none' ? new DOMMatrixReadOnly(cs.transform) : null;
    const x0 = m ? m.e : 0, y0 = m ? m.f : 0;
    // 필(사각)→유리(원) 변신 시 중심이 튀지 않게, 현재 크기 기준으로 버블 좌표계로 환산
    const w0 = parseFloat(tabbarIndicator.style.width) || BUBBLE;
    const h0 = parseFloat(tabbarIndicator.style.height) || BUBBLE;
    const bx0 = x0 + (w0 - BUBBLE) / 2;
    const by0 = y0 + (h0 - BUBBLE) / 2;
    if (indicatorWA) { const prev = indicatorWA; indicatorWA = null; prev.cancel(); }
    indicatorBusy = true;
    // 도착점 = "펼침이 끝난 뒤"의 최종 위치를 트랜지션 없이 한 프레임 안에서 미리 측정(FLIP).
    // 이러면 펼침(목표 이동)을 뒤쫓을 필요 없이 처음부터 정확한 목적지로 슬라이드함
    const wasCompact = tabbarEl.classList.contains('tabbar--compact');
    tabbarEl.classList.add('tabbar--freeze');
    tabbarEl.classList.remove('tabbar--compact');
    const fp = bubblePosFor(targetBtn); // 원형 버블: 도착점 = 대상 버튼 중심
    const fx = fp.x, fy = fp.y;
    const fw = BUBBLE, fh = BUBBLE;
    if (wasCompact) { tabbarEl.classList.add('tabbar--compact'); void tabbarEl.offsetWidth; }
    tabbarEl.classList.remove('tabbar--freeze');
    // 크기는 즉시 최종값(축소·일반 차이가 몇 px라 안 보임), 위치만 슬라이드.
    // 밑그림(인라인)=도착점, 애니메이션이 출발→도착을 덧그림 — v178 원형(실기기 "아주 잘됩니다" 검증본).
    // ⚠️ fill:forwards+종료 시 인라인 확정 방식(v206)은 iOS에서 "애니 제거→인라인 반영" 타이밍이 어긋나
    // 원이 출발점으로 되돌아갔다 트랜지션으로 다시 미끄러지는 "두 번 반복" 회귀를 냈음 → 원복.
    // 자연 종료 시 애니 끝값=인라인 값이라 제거 순간 값 변화가 없어 종료 레이스 자체가 없음.
    tabbarIndicator.style.transition = 'none';
    setGlass(true); // 이동 시작 = 유리구슬로 변신(질감은 CSS --glass가 담당)
    tabbarIndicator.style.width = fw + 'px';
    tabbarIndicator.style.height = fh + 'px';
    tabbarIndicator.style.transform = 'translate(' + fx + 'px,' + fy + 'px)';
    const wa = tabbarIndicator.animate(
      [{ transform: 'translate(' + bx0 + 'px,' + by0 + 'px)' },
       { transform: 'translate(' + fx + 'px,' + fy + 'px)' }],
      { duration: 360, easing: 'cubic-bezier(.4, 0, .2, 1)' }
    );
    indicatorWA = wa;
    wa.onfinish = wa.oncancel = () => {
      if (indicatorWA !== wa) return; // 이미 다음 슬라이드가 시작됐으면 손대지 않음
      indicatorWA = null;
      indicatorBusy = false;
      tabbarIndicator.style.transition = ''; // 다음 일반 슬라이드용 복구
      // 도착: 다음 프레임에 유리→필 복귀(updateIndicator가 --glass 제거 + 버튼에 딱 맞춤).
      // 스타일시트의 width/height/radius transition이 변신을 부드럽게 이어줌.
      requestAnimationFrame(() => { if (!indicatorWA && !indicatorBusy) updateIndicator(); });
    };
  }
  // (축소 상태에서 탭 전환용) 원 즉시 배치 — 슬라이드 없이 활성 탭 위치로 스냅.
  // 축소→펼침 전환은 바 폭·중앙정렬·아이콘 좌표가 동시에 바뀌어 iOS 합성기 레이스가 반복됐던 구간
  // (실기기 영상 3건: 오른쪽 오버슈트·뚝뚝 끊김·두 번 반복) → 이 구간만 애니메이션을 포기함.
  function snapIndicator() {
    cancelAnimationFrame(indicatorAnimId);
    if (indicatorWA) { const prev = indicatorWA; indicatorWA = null; prev.cancel(); }
    indicatorBusy = false;
    tabbarIndicator.style.transition = 'none';
    updateIndicator();
    requestAnimationFrame(() => { tabbarIndicator.style.transition = ''; });
  }
  function switchSection(name) {
    if (!SECTIONS.includes(name) || name === activeSection) return;
    sectionScroll[activeSection] = scrollTopNow();   // 떠나는 탭의 자리를 적어 둔다
    activeSection = name;
    // 뷰 보이기/숨기기
    document.querySelectorAll('.view').forEach((v) => {
      v.hidden = v.id !== 'view-' + name;
    });
    // 상단바: 탭마다 전용 아이콘 하나만 보이게 하는 판정에 쓴다(2026-08-03 규칙)
    pageEl.dataset.section = name;
    // 하단 탭바 활성 표시
    tabbarEl.querySelectorAll('.tabbar-btn').forEach((btn) => {
      const on = btn.dataset.section === name;
      btn.classList.toggle('active', on);
      if (on) btn.setAttribute('aria-current', 'page');
      else btn.removeAttribute('aria-current');
    });
    // 상세가 열려 있으면 닫기
    if (modalOverlay.classList.contains('open')) closeModal();
    // 🔴 그 탭에서 보던 자리로 되돌린다(2026-08-03). 프로그램 스크롤이 축소/펼침 판정에 끼어들지
    //    않게 다음 스크롤 이벤트 1회는 무시한다.
    //    behavior:'instant' 를 쓴다 — 전역 scroll-behavior:smooth 를 확실히 우회하는 방법이고,
    //    옛 방식(스타일을 잠깐 auto 로 바꿔치기)은 실제로 안 먹었다(2026-08-03 실측).
    ignoreScrollOnce = true;
    const y = sectionScroll[name] || 0;
    window.scrollTo({ top: y, behavior: 'instant' });
    lastScrollY = y;
    requestAnimationFrame(() => { ignoreScrollOnce = false; });
    // 탭 전환은 항상 바를 펼침(상태 플래그 정리).
    // 과거엔 축소 상태 전환 시 스냅으로 우회했지만(iOS 합성기 레이스), 축소 시각효과(compact CSS)를
    // 제거해 바 좌표가 더는 변하지 않으므로 항상 v178 슬라이드(실기기 검증본)로 통일.
    setCompact(false, { silent: true, instant: true });
    slideIndicator(tabbarEl.querySelector('.tabbar-btn.active'));
    // 매장으로 오면 지역 탭 밑줄 위치 잡기 — 방금 display:flex로 바뀐 직후라 offsetWidth 읽으면
    // 강제 리플로우로 즉시 정확. rAF는 폰트 로드 등으로 폭이 미세하게 바뀔 때 보정용.
    if (name === 'recipe') { updateBrowseCatUnderline(); requestAnimationFrame(updateBrowseCatUnderline); }
    if (name === 'store') { updateStoreUnderline(); requestAnimationFrame(updateStoreUnderline); }
    // 메뉴도 같은 이유(숨어 있는 동안엔 폭이 0이라 밑줄 자리를 못 잡는다, 2026-08-03)
    if (name === 'menu' && window.mnSyncUnderline) { window.mnSyncUnderline(); requestAnimationFrame(window.mnSyncUnderline); }
    // 🔴 스티커도 마찬가지다(2026-08-04 사용자 발견) — 이 줄이 없어서 새로고침 뒤 처음 스티커 탭에
    //    들어가면 「전체」 밑에 밑줄이 없었고, 지역을 한 번 눌러야 그때 생겼다.
    //    상단바는 늘 보이지만 .topbar-cat--stamp 는 스티커일 때만 display 되므로, 그 전엔 폭이 0이다.
    if (name === 'stamp' && window.updateStampUnderline) { window.updateStampUnderline(); requestAnimationFrame(window.updateStampUnderline); }
    syncTopbarH();
  }

  tabbarEl.querySelectorAll('.tabbar-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (suppressClick) return; // 드래그로 끝난 제스처의 잔여 click 무시
      // 지금 보고 있는 탭을 한 번 더 누르면 맨 위로(2026-08-03 사용자 확정) — 여러 앱의 관례다
      if (btn.dataset.section === activeSection) return scrollToTop();
      switchSection(btn.dataset.section);
    });
  });
  pageEl.dataset.section = 'home';   // 시작 탭(2026-08-03)

  // ── 탭바 드래그(배민식) ── 버블을 손가락으로 끌면 따라오고, 놓으면 가장 가까운 탭으로 전환.
  // 놓는 순간의 이동은 기존 switchSection→slideIndicator를 그대로 탐 — slideIndicator가
  // "지금 화면에 그려진 위치"에서 출발하므로 드래그 지점→목적지 슬라이드가 자연스럽게 이어짐.
  // (WAAPI 종료처리 등 검증된 구조는 손대지 않고, 진행 중 애니 인계는 trackIndicator와 같은 패턴)
  let dragPointerId = null;
  let dragMoved = false; // 6px 이상 움직였을 때만 드래그로 판정(그냥 탭은 click이 처리)
  let dragStartX = 0;
  let suppressClick = false;
  function nearestTabBtn(clientX) {
    let best = null, bestD = Infinity;
    tabbarEl.querySelectorAll('.tabbar-btn').forEach((b) => {
      const r = b.getBoundingClientRect();
      const d = Math.abs(clientX - (r.left + r.width / 2));
      if (d < bestD) { bestD = d; best = b; }
    });
    return best;
  }
  // 드래그 중 "버블 밑 탭만 빨강"(2026-07-21): 버블이 지나는 탭에만 --candidate 부여, 나머지는 뗌.
  // 색 전환(빨강↔회색)은 CSS(.tabbar--dragging 규칙 + .tabbar-btn transition:color)가 담당.
  function setDragCandidate(btn) {
    tabbarEl.querySelectorAll('.tabbar-btn--candidate').forEach((b) => {
      if (b !== btn) b.classList.remove('tabbar-btn--candidate');
    });
    if (btn) btn.classList.add('tabbar-btn--candidate');
  }
  function clearDragCandidate() {
    tabbarEl.classList.remove('tabbar--dragging');
    tabbarEl.querySelectorAll('.tabbar-btn--candidate')
      .forEach((b) => b.classList.remove('tabbar-btn--candidate'));
  }
  tabbarEl.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragPointerId = e.pointerId;
    dragMoved = false;
    dragStartX = e.clientX;
    // ⚠️ 여기서 캡처하면 안 됨 — pointer capture가 걸리면 click 이벤트가 버튼 대신 바로 재타게팅되어
    // 탭 클릭 전환이 죽는다(실제 버그였음). 캡처는 드래그로 판정된 순간(pointermove 6px)에만.
  });
  tabbarEl.addEventListener('pointermove', (e) => {
    if (e.pointerId !== dragPointerId) return;
    if (!dragMoved) {
      if (Math.abs(e.clientX - dragStartX) < 6) return; // 아직 클릭 범위
      dragMoved = true;
      // 드래그로 확정된 지금만 캡처(pointerdown에서 걸면 click이 죽음) — 손가락이 바 밖으로 나가도 추적 유지
      try { tabbarEl.setPointerCapture(e.pointerId); } catch (_) { /* 일부 브라우저 방어 */ }
      // 진행 중인 슬라이드/추적 인계 후 손가락 직접 추적 시작
      cancelAnimationFrame(indicatorAnimId);
      if (indicatorWA) { const prev = indicatorWA; indicatorWA = null; prev.cancel(); }
      indicatorBusy = true; // resize의 placeIndicator가 끼어들지 않게
      tabbarIndicator.style.transition = 'none';
      setGlass(true); // 드래그 시작 = 필→유리구슬 변신
      tabbarEl.classList.add('tabbar--dragging'); // 출발(active) 빨강을 회색으로 풀어 "버블 밑만 빨강" 성립
      tabbarIndicator.style.width = BUBBLE + 'px';
      tabbarIndicator.style.height = BUBBLE + 'px';
    }
    const barRect = tabbarEl.getBoundingClientRect();
    const active = tabbarEl.querySelector('.tabbar-btn.active');
    const y = active ? bubblePosFor(active).y : 0;
    let x = e.clientX - barRect.left - BUBBLE / 2;
    x = Math.max(-6, Math.min(x, barRect.width - BUBBLE + 6)); // 양끝 살짝만 넘게 제한
    tabbarIndicator.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    // 버블(클램프된 실제 위치) 중심 밑에 있는 탭만 빨강으로 물듦
    setDragCandidate(nearestTabBtn(barRect.left + x + BUBBLE / 2));
  });
  function endTabbarDrag(e) {
    if (e.pointerId !== dragPointerId) return;
    dragPointerId = null;
    if (!dragMoved) return; // 드래그 아님 → click 리스너가 처리
    dragMoved = false;
    clearDragCandidate(); // dragging 클래스·candidate 해제 → 아래 switchSection의 .active가 빨강 인계(같은 색이라 깜빡임 없음)
    indicatorBusy = false;
    tabbarIndicator.style.transition = '';
    suppressClick = true;
    setTimeout(() => { suppressClick = false; }, 0); // 이 제스처의 잔여 click만 무시
    const target = nearestTabBtn(e.clientX);
    const activeBtn = tabbarEl.querySelector('.tabbar-btn.active');
    if (!target || target === activeBtn) {
      slideIndicator(activeBtn); // 같은 탭이면 제자리 복귀 슬라이드
    } else {
      switchSection(target.dataset.section);
    }
  }
  tabbarEl.addEventListener('pointerup', endTabbarDrag);
  tabbarEl.addEventListener('pointercancel', endTabbarDrag);

  // 인스타·쓰레드식 방향 감지 축소: 내리면 작아지고, 조금이라도 올리면 바로 커짐(사라지진 않음).
  // 손 떨림으로 깜빡이지 않게 6px 둔감 구간을 둠. 최상단은 항상 펼침.
  let tabbarCompact = false;
  let lastScrollY = window.scrollY;
  let ignoreScrollOnce = false; // 탭 전환의 프로그램 스크롤(맨 위로)이 바 크기를 바꾸지 않게 1회 무시
  function setCompact(v, opts) {
    if (v === tabbarCompact) return;
    tabbarCompact = v;
    if (opts && opts.instant) {
      // 탭 전환 시: 펼침을 애니메이션 없이 즉시 적용(--freeze로 트랜지션 끔) → 아이콘(특히 맨끝 스탬프)이
      // 곧장 최종 위치로 가서, "최종 위치로 슬라이드하는 인디케이터"와 안 어긋남(오른쪽 오버슈트 방지).
      tabbarEl.classList.add('tabbar--freeze');
      tabbarEl.classList.toggle('tabbar--compact', v);
      void tabbarEl.offsetWidth; // 강제 리플로우로 즉시 확정
      tabbarEl.classList.remove('tabbar--freeze');
    } else {
      tabbarEl.classList.toggle('tabbar--compact', v); // 스크롤 축소/펼침은 CSS 트랜지션으로 부드럽게
    }
    // silent: 호출한 쪽이 원 움직임을 직접 책임질 때(탭 전환의 슬라이드를 스냅으로 끊지 않게)
    if (!(opts && opts.silent)) trackIndicator(300); // 크기 변하는 동안 빨간 원이 딱 붙어 따라오게(트랜지션 끔)
  }
  // 스크롤 중엔 인디케이터가 반응하지 않는다(2026-07-21 확정) — 채워진 필이 탭 위에 그대로.
  // 구슬 변신·이동은 오직 "탭 이동(클릭·드래그)" 때만. (스크롤 출렁임을 넣었다가 제거한 이력: e853805)
  function onScroll() {
    const y = window.scrollY;
    if (ignoreScrollOnce) { ignoreScrollOnce = false; }
    lastScrollY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  // 즉시 배치(슬라이드 없이) — 로드·리사이즈·폰트 로드 때 원이 구석에서 미끄러져 오지 않게
  function placeIndicator() {
    // 슬라이드·추적 루프 진행 중이면 양보 — iOS 주소창 변화의 resize가 여길 불러
    // 애니메이션을 즉시 스냅으로 죽이던 문제 방지(루프가 어차피 목표를 따라가고 있음)
    if (indicatorBusy) return;
    tabbarIndicator.style.transition = 'none';
    updateIndicator();
    requestAnimationFrame(() => { tabbarIndicator.style.transition = ''; });
  }
  window.addEventListener('resize', placeIndicator);

  // ── 매장(지점) 렌더 ──
  let activeRegion = '전국'; // 매장 지역 필터 기본값(=전체 지점). 탭 라벨·개수 표기 모두 '전국'
  // STORES에 등장하는 지역을 순서대로(중복 없이)
  const storeRegions = () => {
    const seen = [];
    STORES.forEach((s) => { if (!seen.includes(s.region)) seen.push(s.region); });
    return seen;
  };
  // 매장 지역 탭 — 레시피 카테고리 탭과 동일 형태(.tab-btn + 밑줄 슬라이더). 상단바 안 #storeTabs.
  const storeTabsEl = document.getElementById('storeTabs');
  const storeUnderline = document.getElementById('storeTabsUnderline');
  function updateStoreUnderline() {
    if (!storeTabsEl || !storeUnderline) return;
    const active = storeTabsEl.querySelector('.tab-btn.active');
    // 매장 섹션이 숨겨져 있으면 offsetWidth=0 → 위치 못 잡으므로, 보일 때(switchSection) 다시 호출됨
    if (active && active.offsetWidth) {
      storeUnderline.style.width = active.offsetWidth + 'px';
      storeUnderline.style.transform = 'translateX(' + active.offsetLeft + 'px)';
      keepTabVisible(active);   // 320px 에서 「제주」가 44px 밀려 있다 — 고르면 따라 들어온다
    }
  }
  enableDragScroll(storeTabsEl);   // 데스크탑에서 손으로 끌기(2026-08-04)
  function renderStoreTabs() {
    if (!storeTabsEl) return;
    storeTabsEl.querySelectorAll('.tab-btn').forEach((b) => b.remove());
    ['전국'].concat(storeRegions()).forEach((reg) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tab-btn' + (reg === activeRegion ? ' active' : '');
      btn.textContent = reg;
      btn.addEventListener('click', () => {
        if (activeRegion === reg) return;
        activeRegion = reg;
        renderStoreTabs();
        renderStores();
      });
      storeTabsEl.appendChild(btn);
    });
    updateStoreUnderline();
  }
  function renderStores() {
    const wrap = document.getElementById('stores');
    if (!wrap) return;
    wrap.innerHTML = '';
    const showAll = activeRegion === '전국';
    const list = STORES.filter((s) => showAll || s.region === activeRegion);
    // 개수 표기 — 전국은 '전국 N곳', 특정 지역은 '서울 N곳'(레시피 'N개'와 같은 언어)
    const cLabel = document.getElementById('storeCountLabel');
    const cNum = document.getElementById('storeCountNum');
    if (cLabel) cLabel.textContent = activeRegion;
    if (cNum) cNum.textContent = list.length;
    let lastRegion = null;
    list.forEach((s) => {
      // 지역 헤더는 '전체'일 때만(특정 지역 필터 중엔 칩이 이미 지역을 나타내므로 생략)
      if (showAll && s.region !== lastRegion) {
        lastRegion = s.region;
        const h = document.createElement('div');
        h.className = 'store-region';
        h.textContent = s.region;
        wrap.appendChild(h);
      }
      const card = document.createElement('div');
      card.className = 'store' + (s.soon ? ' store--soon' : '');

      const top = document.createElement('div');
      top.className = 'store-top';
      const nm = document.createElement('span');
      nm.className = 'store-name';
      nm.textContent = '하이디라오 ' + s.name;
      top.appendChild(nm);
      if (s.soon) {
        const badge = document.createElement('span');
        badge.className = 'store-badge';
        badge.textContent = '오픈 예정';
        top.appendChild(badge);
      }
      card.appendChild(top);

      if (s.addr) {
        const addr = s.addr.replace(/,\s*/g, ' '); // 주소에서 쉼표 제거(표시·복사 공통)
        const a = document.createElement('div');
        a.className = 'store-info store-info--addr';
        a.innerHTML = '<span class="store-i store-i--pin"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-6-5.686-6-10a6 6 0 0 1 12 0c0 4.314-6 10-6 10z"/><circle cx="12" cy="11" r="2"/></svg></span><span class="store-addr">' + addr + '</span>';
        // 주소 복사 버튼 — 주소 줄 오른쪽 끝
        const copy = document.createElement('button');
        copy.type = 'button';
        copy.className = 'store-copy';
        copy.setAttribute('aria-label', '주소 복사');
        copy.innerHTML =
          '<svg class="ic-copy" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg>' +
          '<svg class="ic-check" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg>';
        copy.addEventListener('click', (e) => { e.stopPropagation(); copyAddr(copy, addr); });
        a.appendChild(copy); // 주소 블록 옆(형제) — 짧으면 글자 바로 뒤, 2줄이면 오른쪽 위(혼자 안 떨어짐)
        card.appendChild(a);
      }
      if (s.hours) {
        const h = document.createElement('div');
        h.className = 'store-info';
        h.innerHTML = '<span class="store-i"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/></svg></span><span>' + s.hours + '</span>';
        card.appendChild(h);
      }
      if (s.soon && !s.addr) {
        const p = document.createElement('div');
        p.className = 'store-info store-info--muted';
        p.textContent = '자세한 정보가 곧 준비될 예정이에요.';
        card.appendChild(p);
      }

      // 버튼: 오픈 예정이 아니고 주소/전화가 있을 때만
      if (!s.soon || s.addr) {
        const acts = document.createElement('div');
        acts.className = 'store-actions';
        // 예약(캐치테이블 웨이팅) — 맨 앞 강조 버튼. 'soon'이면 비활성 '오픈 예정' 버튼.
        const catchUrl = STORE_CATCH[s.name];
        if (catchUrl === 'soon') {
          const book = document.createElement('span');
          book.className = 'store-btn book--soon';
          book.textContent = '오픈 예정';
          acts.appendChild(book);
        } else if (catchUrl) {
          const book = document.createElement('a');
          book.className = 'store-btn book';
          book.textContent = '캐치테이블';
          book.href = catchUrl;
          book.target = '_blank';
          book.rel = 'noopener';
          acts.appendChild(book);
        }
        if (s.addr && catchUrl === 'soon') {
          // 오픈 예정 지점의 지도 — 전화와 같은 이유로 막는다(2026-08-04 사용자 지시).
          // 아직 문을 안 연 자리라 지도에서 찾아도 나오지 않거나 엉뚱한 곳이 잡힌다.
          // 전화(tel--soon)와 같은 크림 바랜 모양이고, 자리는 지켜서 카드 폭이 안 흔들린다.
          const map = document.createElement('span');
          map.className = 'store-btn tel--soon';
          map.textContent = '지도';
          acts.appendChild(map);
        } else if (s.addr) {
          // '지도' 버튼 → 아래(위)로 펼쳐지는 드롭다운(네이버 지도/카카오맵)
          const dd = document.createElement('div');
          dd.className = 'map-dd';
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'store-btn map';
          btn.textContent = '지도';
          const menu = document.createElement('div');
          menu.className = 'map-dd-menu';
          const q = encodeURIComponent('하이디라오 ' + s.name);
          // 🔴 네이버는 공백을 %20 이 아니라 + 로 받는다(2026-08-04 실기기 확인).
          //    %20 으로 보내면 「명동점」이 통째로 잘려 나가고 「하이디라오」만 검색돼서
          //    명동점·대학로점·홍대점이 다 나오거나, 지도만 뜨고 아무 데도 안 찍혔다.
          const qPlus = q.replace(/%20/g, '+');
          [
            // 🔴 map.naver.com/p/search/ 를 쓰면 안 된다 — 폰에서 열면 네이버가 앱 실행 페이지
            //    (app.map.naver.com, appSchemeName=nmap&appmarket=N)로 넘겨서, 네이버지도 앱이
            //    없으면 「앱 설치」 화면만 뜨고 지도를 못 본다(실기기 캡처로 확인).
            //    m.map.naver.com/search + mapMode=0 은 앱으로 안 튀고 웹 지도에 핀을 찍는다.
            //    🔴 핀은 pinId + pinType=site + menu=location 이 찍는다.
            //    🔴🔴 그런데 그것만으로는 안 됐다 — **rel 에 noreferrer 가 있어야 한다**(아래 a.rel 참고).
            //       네이버·카카오가 「어디서 왔는지」를 읽고 바깥에서 들어온 링크에는 핀을 안 내줬다.
            //       주소를 직접 열면 핀이 나오고 우리 사이트에서 누르면 안 나오던 것이 이 차이였다.
            //       ⚠️ 서버가 보내는 주소만 봐서는 안 보인다(curl 로는 referrer 있든 없든 같은 곳으로 간다).
            //          페이지 안 스크립트가 읽는 값이라 실기기에서 여는 방식을 바꿔 가며 재야 잡힌다.
            //          _map-test.html 로 여덟 가지를 눌러 보고 가려냈다(커밋 3f43f04 다음).
            //    ⚠️ 여기까지 오는 데 다섯 번 틀렸다. 다음에 손댈 때 같은 길로 다시 가지 말 것:
            //       · map.naver.com/p/search/…        폰에서 앱 설치 화면으로 튄다(appmarket=N 이라 아무 일도 안 남)
            //       · …/search?query=…&mapMode=0#map/<번호>  이미 열린 화면 안에서만 통한다.
            //                                        새 탭으로 열면 「알 수 없는 오류가 발생했습니다」
            //       · m.map.naver.com/entry/place/<번호>     오류
            //       · m.place.naver.com/restaurant/<번호>/home  열리긴 하나 지도가 아니라 매장정보 페이지
            //       · map.naver.com/p/entry/place/<번호>     앱으로 튄다
            //    번호가 없는 지점은 핀 없이 검색 결과로 뜬다 — 매장 하나만 잡히므로 쓸 만하다.
            { label: '네이버지도', img: 'assets/icons/navermap.png?v=1',
              href: STORE_NAVER_ID[s.name]
                ? 'https://m.map.naver.com/map.naver?pinId=' + STORE_NAVER_ID[s.name] + '&pinType=site&menu=location'
                : 'https://m.map.naver.com/search?query=' + qPlus + '&mapMode=0' },
            // 🔴 카카오는 해시(#!/<번호>/map/place)가 핀을 찍는다. 네이버와 마찬가지로
            //    rel 의 noreferrer 가 있어야 한다 — 없으면 해시가 무시되고 검색 결과만 나온다.
            //    ⚠️ 카카오는 핀 지도 위에 「카카오맵 앱에서 더 편리하게」 안내창이 뜬다(네이버는 안 뜬다).
            //       🔴 못 끈다. 같은 탭으로 열어도 뜬다(2026-08-04 실기기 확인) — 여는 방식과 무관하게
            //          카카오 페이지가 스스로 띄우는 것이라 우리 쪽에서 손댈 수 없다.
            //          받아 온 HTML 에도 끄는 값이 없다(배너 관련 낱말 자체가 안 나온다).
            //          지도는 안내창 뒤에 이미 핀까지 찍혀 있어서, 닫으면 바로 보인다.
            //    ⚠️ 옛 map.kakao.com/?q=… 는 쓰면 안 된다 — 폰에서 applink.map.kakao.com 으로 앱에 튄다.
            //    ⚠️ place.map.kakao.com/<번호> 는 열리지만 지도가 아니라 매장정보 페이지다.
            //    번호가 없는 지점은 핀 없이 검색 결과로 뜬다.
            { label: '카카오맵',   img: 'assets/icons/kakaomap.png?v=1',
              href: 'https://m.map.kakao.com/actions/searchView?q=' + qPlus +
                    (STORE_KAKAO_ID[s.name] ? '#!/' + STORE_KAKAO_ID[s.name] + '/map/place' : '') },
          ].forEach((o) => {
            const a = document.createElement('a');
            a.className = 'map-dd-item';
            a.href = o.href;
            a.target = '_blank';
            // 🔴🔴 noreferrer 를 빼면 지도에 핀이 안 찍힌다(2026-08-04 실기기로 가려냄).
            //    네이버·카카오가 「어디서 왔는지」(document.referrer)를 읽고, 바깥 사이트에서 들어온
            //    링크에는 핀 대신 기본 지도나 검색 결과를 준다. noreferrer 가 그 값을 지워서
            //    주소창에 직접 친 것과 같아진다. 주소를 아무리 정확히 만들어도 이것 없이는 소용없다.
            //    ⚠️ 이건 서버 응답으로는 안 보인다 — curl 로는 referrer 유무에 상관없이 같은 곳으로 간다.
            //       페이지 안 스크립트가 읽는 값이라 실기기에서 여는 방식을 바꿔 가며 재야 잡힌다.
            a.rel = 'noopener noreferrer';
            a.innerHTML = '<img class="map-dd-ic" src="' + o.img + '" alt="" draggable="false">' + o.label;
            a.addEventListener('click', closeAllMapDd);
            menu.appendChild(a);
          });
          btn.addEventListener('click', (e) => {
            e.stopPropagation(); // 바깥클릭 닫기 리스너가 곧바로 닫지 않게
            const open = dd.classList.contains('open');
            closeAllMapDd();
            if (!open) {
              dd.classList.add('open');
              // 기본은 아래로 펼침. 단, 버튼 아래 공간이 부족하면(하단 탭바 영역 ~100px 감안) 위로 뒤집음.
              const rect = btn.getBoundingClientRect();
              const spaceBelow = window.innerHeight - rect.bottom - 100;
              dd.classList.toggle('map-dd--up', spaceBelow < menu.offsetHeight);
            }
          });
          dd.appendChild(btn);
          dd.appendChild(menu);
          acts.appendChild(dd);
        }
        // 전화 — 오픈 예정 지점은 아직 걸어도 소용없으므로 번호 유무와 무관하게 비활성으로 자리만 지킨다
        // (버튼 개수가 지점마다 달라 카드 폭이 들쭉날쭉해지는 것도 함께 막힘).
        if (catchUrl === 'soon') {
          const tel = document.createElement('span');
          tel.className = 'store-btn tel tel--soon';
          tel.textContent = '전화';
          acts.appendChild(tel);
        } else if (s.tel) {
          const tel = document.createElement('a');
          tel.className = 'store-btn tel';
          tel.textContent = '전화';
          tel.href = 'tel:' + s.tel.replace(/[^0-9]/g, '');
          acts.appendChild(tel);
        }
        if (acts.children.length) card.appendChild(acts);
      }

      wrap.appendChild(card);
    });
  }

  // ── 지도 드롭다운(네이버/카카오) 닫기 ──
  function closeAllMapDd() {
    document.querySelectorAll('.map-dd.open').forEach((d) => d.classList.remove('open'));
  }
  document.addEventListener('click', closeAllMapDd); // 바깥 클릭 시 닫힘
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAllMapDd(); });

  // ── 주소 복사 ──
  function copyAddr(btn, text) {
    const done = () => {
      btn.classList.add('copied'); // 잠깐 체크 표시
      clearTimeout(btn._copyT);
      btn._copyT = setTimeout(() => btn.classList.remove('copied'), 1200);
    };
    // clipboard API는 https·localhost(보안 컨텍스트)에서만 동작 → 실패 시 execCommand 폴백
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
    } else {
      fallbackCopy(text, done);
    }
  }
  function fallbackCopy(text, done) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { /* 무시 */ }
    document.body.removeChild(ta);
  }

  // ===== 스티커 (방문 기록장) =====
  // 저장 = 이 기기 localStorage에만(즐겨찾기와 동일, 로그인 없음). 나중에 서버 이전이 쉽게
  // 버전 있는 JSON 한 덩어리로 보관: { version: 1, stamps: { 지점명: { date, memo } } }
  const STAMPS_KEY = 'haidilao_stamps';
  // 스티커 그림이 준비된 지점(assets/stickers/). 새 그림이 생기면 여기에 한 줄 추가.
  // 🔴 **이 목록에 없는 매장은 기록 드롭다운에 안 나온다**(2026-07-30). 예전엔 골라도 🐾
  //    자리표시 카드로 나왔지만 그 카드를 없앴다 — 새 매장을 STORES에 넣고 스티커를 안 만들면
  //    그 매장은 조용히 선택 목록에서 빠지므로, 스티커부터 만들 것(.claude/make_stickers.py).
  const STAMP_IMGS = {
    '명동점': 'assets/stickers/명동점.webp',
    '서초점': 'assets/stickers/서초점.webp',
    '홍대점': 'assets/stickers/홍대점.webp',
    '건대점': 'assets/stickers/건대점.webp',
    '영등포점': 'assets/stickers/영등포점.webp',
    '대학로점': 'assets/stickers/대학로점.webp',
    '코엑스점': 'assets/stickers/코엑스점.webp',
    '가산점': 'assets/stickers/가산점.webp',
    '부천점': 'assets/stickers/부천점.webp',
    '부산역점': 'assets/stickers/부산역점.webp',
    '대구점': 'assets/stickers/대구점.webp',
    '제주점': 'assets/stickers/제주점.webp',
    '안산점': 'assets/stickers/안산점.webp',
  };
  // v2(2026-07-19): 매장당 1개(stamps 객체) → 기록 목록(records 배열)으로 구조 변경.
  // 같은 매장을 여러 번 방문해도 각각 기록됨(일기 컨셉). 기록 = { id, name, date, memo, with?, addedAt }
  let stampData = { version: 2, records: [] };
  function saveStamps() {
    try { localStorage.setItem(STAMPS_KEY, JSON.stringify(stampData)); } catch (e) { /* 시크릿 모드 등 저장 실패 무시 */ }
    schedulePush(); // 서버 사본 갱신 + 코드 생성 + 띠 갱신(맨 아래 「내 데이터 코드」 절)
  }
  function newStampId() {
    return 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }
  try {
    const savedStamps = JSON.parse(localStorage.getItem(STAMPS_KEY));
    if (savedStamps && Array.isArray(savedStamps.records)) {
      stampData = savedStamps;
    } else if (savedStamps && savedStamps.stamps) {
      // v1 → v2 자동 이전: 기존 사용자의 기록을 그대로 배열로 옮김(유실 0)
      stampData = {
        version: 2,
        records: Object.keys(savedStamps.stamps).map((name) => {
          const r = savedStamps.stamps[name];
          return { id: newStampId(), name: name, date: r.date, memo: r.memo || '', with: r.with, addedAt: r.addedAt || 0 };
        }),
      };
      saveStamps();
    }
  } catch (e) { /* 손상된 저장값은 무시하고 새로 시작 */ }

  // 스티커 카드 DOM(그리드 타일·시트 슬롯 공용). 지점명 밴드는 앱이 얹음(그림 하단 빈 띠 위).
  // 🔴 여기 있던 '그림 없는 지점 = 🐾 자리표시 카드' 분기는 삭제했다(2026-07-30 사용자 지시).
  //    대신 **스티커 그림이 없는 매장은 기록 드롭다운에 아예 안 나온다**(아래 드롭다운 코드).
  //    그래서 이 함수에 들어오는 이름은 항상 STAMP_IMGS에 있다.
  // ⚠️ 새 매장을 STORES에 추가할 때 스티커를 안 만들면 그 매장은 조용히 선택 목록에서 빠진다.
  //    빈 카드가 뜨는 것보다 낫다고 판단한 것이다. 새 스티커는 .claude/make_stickers.py로만 만들 것.
  function buildStampCard(name, opts) {
    const card = document.createElement('div');
    // 스티커 이미지엔 지점명이 이미 구워져 있음 → 앱 밴드 오버레이 안 붙임.
    // loading: 기록 그리드 카드는 lazy(화면 밖은 스크롤 시 로드). 수정 슬롯·찍기(pop)는
    // 반드시 즉시 보여야 하는 초점 이미지라 eager — lazy면 시트 슬라이드 중 로드가 미뤄져
    // 스티커가 한 박자 늦게 떴음(opts.eager로 지정).
    const loading = opts && opts.eager ? 'eager' : 'lazy';
    card.innerHTML = '<img src="' + STAMP_IMGS[name] + '" alt="' + name + ' 스티커" loading="' + loading + '">';
    return card;
  }

  // ── 스티커 지역 탭(2026-08-04 사용자 지시로 되살림) ──
  // 🔴 2026-07-24 에 「스티커에 지역 탭 안 씀」으로 지웠던 기능이다. 그때 주석에 「되살릴 일이 생기면
  //    매장 탭 지역탭을 참고할 것」이라 적어 뒀고, 실제로 그것을 본떠 다시 만들었다(같은 .tab-btn + 밑줄).
  // 🔴 탭은 **매장과 똑같이 전부** 나온다(2026-08-04 사용자 확정).
  //    한때 「다녀온 지역만」으로 만들었다가 되돌렸다 — 기록이 하나도 없으면 탭이 다 사라져서
  //    상단바 왼쪽이 통째로 비었다. 빈 지역을 눌렀을 때는 아래 renderStamps 가 그 지역용 문구를 띄운다.
  let activeStampRegion = '전체';
  const STAMP_REGION_OF = (name) => (STORES.find((s) => s.name === name) || {}).region || '';
  const stampTabsEl = document.getElementById('stampTabs');
  const stampUnderline = document.getElementById('stampTabsUnderline');
  function updateStampUnderline() {
    if (!stampTabsEl || !stampUnderline) return;
    const active = stampTabsEl.querySelector('.tab-btn.active');
    if (active && active.offsetWidth) {
      stampUnderline.style.width = active.offsetWidth + 'px';
      stampUnderline.style.transform = 'translateX(' + active.offsetLeft + 'px)';
      keepTabVisible(active);
    }
  }
  // switchSection 에서도 부른다(숨어 있는 동안엔 폭이 0이라 밑줄 자리를 못 잡는다).
  // 🔴 window 에 얹는 이유: switchSection 이 이 함수보다 위에 있어서, 스코프가 갈리면 직접 못 부른다.
  //    메뉴 탭이 window.mnSyncUnderline 을 쓰는 것과 같은 방식이다.
  window.updateStampUnderline = updateStampUnderline;
  if (stampTabsEl) enableDragScroll(stampTabsEl);
  function renderStampTabs() {
    if (!stampTabsEl) return;
    stampTabsEl.querySelectorAll('.tab-btn').forEach((b) => b.remove());
    // 매장 탭과 같은 목록·같은 순서(storeRegions) — 기록이 없어도 탭은 그대로 서 있다
    ['전체'].concat(storeRegions()).forEach((reg) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tab-btn' + (reg === activeStampRegion ? ' active' : '');
      btn.textContent = reg;
      btn.addEventListener('click', () => {
        if (activeStampRegion === reg) return;
        activeStampRegion = reg;
        renderStampTabs();
        renderStamps();
      });
      stampTabsEl.appendChild(btn);
    });
    updateStampUnderline();
  }

  // 기록 카드 노드 캐시(id→카드 DOM). 지역 탭 전환·삭제 때 카드를 새로 안 만들고 재사용해
  // 스티커 <img>가 매번 재생성돼 재디코딩·깜빡이던 것 방지(레시피 그리드 browseCardCache와 같은 원리).
  // 수정으로 내용이 바뀐 카드는 저장 시 이 캐시에서 지워 새로 그림.
  const stampCardCache = new Map();
  function buildStampRecCard(rec) {
    // 컴팩트 가로 카드: [작은 스티커] 날짜 → 매장명 — 리스트는 색인만(상세는 탭 → 보기 모달)
    const card = document.createElement('div');
    card.className = 'stamp-rec';
    card.setAttribute('role', 'button');
    card.tabIndex = 0;
    card.setAttribute('aria-label', rec.name + ' 기록 보기');
    const tile = buildStampCard(rec.name);
    tile.className = 'stamp-tile';
    card.appendChild(tile);
    const info = document.createElement('div');
    info.className = 'stamp-rec-info';
    const date = document.createElement('div');
    date.className = 'stamp-rec-date';
    date.textContent = fmtStampDateKr(rec.date); // 시트와 같은 '2026년 7월 19일' 형식
    info.appendChild(date);
    const nm = document.createElement('div');
    nm.className = 'stamp-rec-name';
    nm.textContent = rec.name;
    info.appendChild(nm);
    // 동행 — 있을 때만. 카드엔 문장형('가족'→'가족과 함께'), 직접 입력은 적은 그대로.
    // 저장값은 프리셋 원본('가족')이고 문장은 표시용이라, 수정 시트·보기 모달은 종전대로 원본을 쓴다.
    if (rec.with) {
      const w = document.createElement('div');
      w.className = 'stamp-rec-with';
      w.textContent = WITH_CARD_LABELS[rec.with] || rec.with; // 프리셋에 없으면 = 직접 입력 → 적은 그대로(길면 CSS가 …)
      info.appendChild(w);
    }
    card.appendChild(info);
    card.addEventListener('click', () => openStampView(rec.id)); // 탭 → 보기 모달(수정/삭제는 거기서)
    bindRoleButtonKeyboard(card);
    return card;
  }

  function renderStamps() {
    const grid = document.getElementById('stampGrid');
    if (!grid) return;
    renderStampTabs();   // 기록이 늘고 줄 때마다 「다녀온 지역」이 달라진다
    const 전체 = stampData.records.slice();
    const list = activeStampRegion === '전체'
      ? 전체
      : 전체.filter((r) => STAMP_REGION_OF(r.name) === activeStampRegion);
    // 🔴 "다녀온 매장 N곳"은 **거른 결과가 아니라 늘 전체** 기준이다 — 이 줄은 「내가 다녀온 곳이 몇 곳인가」를
    //    말하는 것이라 지역 탭을 눌렀다고 숫자가 줄면 다른 뜻이 되어 버린다.
    //    (매장 탭의 개수는 반대로 「지금 보고 있는 목록의 개수」라 지역에 따라 바뀐다 — 뜻이 다르다.)
    document.getElementById('stampCountNum').textContent = new Set(전체.map((r) => r.name)).size;
    // 일기라 최신이 먼저: 날짜 최근순, 같은 날짜면 나중에 기록한 것(addedAt)이 위.
    // addedAt 없는 옛 기록은 0 취급 → 같은 날짜 안에서 맨 아래(정렬 안 깨짐).
    list.sort((a, b) => {
      if ((a.date || '') !== (b.date || '')) return (a.date || '') < (b.date || '') ? 1 : -1;
      return (b.addedAt || 0) - (a.addedAt || 0);
    });
    // 빈 상태 — 지역 탭이 돌아오면서 두 가지가 됐다(2026-08-04).
    //   ① 기록이 하나도 없음      → 첫 기록을 부른다
    //   ② 이 지역에만 없음        → 「아직 없다」만 말한다. 여기서 '첫 방문'을 부르면
    //                              다른 지역엔 기록이 있는 사람에게 거짓말이 된다.
    // ⚠️ ②의 문구는 아직 사용자 확정 전이다.
    if (!list.length) {
      const empty = document.createElement('div');
      empty.className = 'stamp-empty';
      empty.innerHTML = (activeStampRegion !== '전체' && 전체.length)
        ? '<p class="stamp-empty-text">' + activeStampRegion + '에는 아직 기록이 없어요</p>'
        // 🔴 「기록하기로…」 앞의 연필 아이콘은 뺐다(2026-08-04 사용자 지시).
        //    위 버튼에 이미 같은 뜻의 아이콘이 있어서 한 화면에 두 번 나오던 것이다.
        : '<p class="stamp-empty-text">아직 스티커가 없어요<br>기록하기로 첫 방문을 남겨보세요</p>';
      grid.replaceChildren(empty);
    } else {
      // 캐시된 카드는 재사용, 없으면 새로 만들어 캐시 → replaceChildren로 순서만 재배치(재생성 X)
      const cards = list.map((rec) => {
        let card = stampCardCache.get(rec.id);
        if (!card) { card = buildStampRecCard(rec); stampCardCache.set(rec.id, card); }
        return card;
      });
      grid.replaceChildren(...cards);
    }
    // 🔴 「맨 위로」는 보여줄 목록이 있을 때만 — 빈 화면에 있으면 내릴 게 없는데 올라가라는 말이 된다.
    //    기준은 `list`(지금 보이는 목록)다. 전체 기록이 있어도 이 지역이 비었으면 화면은 비어 있다.
    const 맨위로 = document.getElementById('stampToTop');
    if (맨위로) 맨위로.hidden = !list.length;
    // 삭제된 기록의 캐시 정리(메모리 누수·오래된 카드 재사용 방지)
    const liveIds = new Set(stampData.records.map((r) => r.id));
    stampCardCache.forEach((_, id) => { if (!liveIds.has(id)) stampCardCache.delete(id); });
  }

  // ── 스티커 입력 시트: 점선 슬롯 → 지점 선택 → "기록하기" → 스티커 탁!(stampPop) ──
  const stampSheetOverlay = document.getElementById('stampSheetOverlay');
  const stampSheetEl = stampSheetOverlay.querySelector('.stamp-sheet'); // 시트 안쪽 스크롤 컨테이너
  const stampSheetClose = document.getElementById('stampSheetClose');
  let stampSheetReturnFocus = null;
  stampSheetEl.addEventListener('keydown', (e) => trapFocusWithin(stampSheetEl, e));
  const stampSlot = document.getElementById('stampSlot');
  const stampSlotEmpty = document.getElementById('stampSlotEmpty');
  const stampSlotHint = document.getElementById('stampSlotHint');
  const stampDdEl = document.getElementById('stampDd');           // 매장 선택 드롭다운(정렬 dd와 같은 문법)
  const stampDdBtn = document.getElementById('stampDdBtn');
  const stampDdCurrent = document.getElementById('stampDdCurrent');
  const stampDdMenu = document.getElementById('stampDdMenu');
  const stampDateEl = document.getElementById('stampDate');
  const stampDateText = document.getElementById('stampDateText'); // 투명 입력 위에 얹는 앱 폰트 날짜 글자
  function fmtStampDateKr(iso) { // 'YYYY-MM-DD' → '2026년 7월 19일' (시트·기록 카드 공용 날짜 형식)
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    return m ? m[1] + '년 ' + Number(m[2]) + '월 ' + Number(m[3]) + '일' : iso;
  }
  function todayIso() { // 이 기기 시간대 기준 오늘 (toISOString은 UTC라 자정 전후 하루 밀림 → 로컬로 조립)
    const n = new Date();
    return n.getFullYear() + '-' + String(n.getMonth() + 1).padStart(2, '0') + '-' + String(n.getDate()).padStart(2, '0');
  }
  // 스티커 = 방문 기록이라 미래 날짜는 무의미 → 오늘 이후 선택 금지. max로 달력에서 미래를 비활성화하고,
  // 혹시 미래 값이 들어오면(직접 입력·기존 데이터) 오늘로 되돌린다.
  function clampStampDate() {
    const max = todayIso();
    if (stampDateEl.value && stampDateEl.value > max) stampDateEl.value = max;
  }
  function syncStampDateText() { clampStampDate(); stampDateText.textContent = fmtStampDateKr(stampDateEl.value); }
  stampDateEl.addEventListener('input', syncStampDateText);
  stampDateEl.addEventListener('change', syncStampDateText);
  const stampMemoEl = document.getElementById('stampMemo');
  const stampSubmitEl = document.getElementById('stampSubmit');
  let stampSelected = null;   // 고른 매장 이름
  let stampEditId = null;     // 수정 중인 기록 id (add면 null)
  let stampAnimating = false; // 찍기 연출 중 중복 제출·닫기 방지
  let stampMode = 'add';      // 'add'(새로 찍기) | 'edit'(기록 수정)
  // 삭제는 보기 모달로 이동함(입력 시트엔 없음) — 아래 stampViewDelete 참고

  // 매장 선택 반영 — add: 슬롯 힌트+버튼 활성 / edit: 슬롯의 스티커 교체(매장도 수정 가능, v2)
  function setStampStore(name) {
    stampSelected = name;
    stampDdCurrent.textContent = name;
    stampDdCurrent.classList.remove('placeholder');
    stampDdMenu.querySelectorAll('.stamp-dd-item').forEach((i) => i.classList.toggle('active', i.dataset.value === name));
    if (stampMode === 'edit') {
      stampSlot.querySelectorAll('.stamp-slot-card').forEach((el) => el.remove());
      const card = buildStampCard(name, { eager: true }); // 수정 슬롯 = 즉시 보여야 함(늦게 뜸 방지)
      card.className = 'stamp-slot-card';
      stampSlot.appendChild(card);
    } else {
      stampSlotHint.textContent = '스티커 붙이는 곳'; // 지점 선택해도 지점명 안 붙이고 고정 문구 유지
      stampSubmitEl.disabled = false;
    }
    if (STAMP_IMGS[name]) { const pre = new Image(); pre.src = STAMP_IMGS[name]; } // 미리 로드 → 팝/교체 때 흰 카드 안 뜸
  }

  // editId 있으면 = 그 기록 수정 모드(매장·날짜·메모·동행 수정 + 삭제), 없으면 새로 찍기
  function openStampSheet(editId) {
    stampSheetReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const rec = editId ? stampData.records.find((r) => r.id === editId) : null;
    stampMode = rec ? 'edit' : 'add';
    stampEditId = rec ? rec.id : null;
    stampAnimating = false;
    stampSlot.querySelectorAll('.stamp-slot-card').forEach((el) => el.remove());
    stampDateEl.max = todayIso(); // 달력에서 미래 날짜 선택 막기 (열 때마다 갱신 = 날짜 바뀌어도 정확)
    closeStampDd();
    closeStampWithDd();

    if (rec) {
      stampSlotEmpty.hidden = true;
      stampDateEl.value = rec.date || '';
      stampMemoEl.value = rec.memo || '';
      loadStampWith(rec.with); // 프리셋이면 그걸로, 자유 입력이면 '직접 입력'+글자
      setStampStore(rec.name); // 드롭다운 라벨·슬롯 스티커 세팅(edit 모드라 슬롯에 정적 표시)
      stampSubmitEl.textContent = '저장';
      stampSubmitEl.disabled = false;
    } else {
      stampSlotEmpty.hidden = false;
      stampSlotHint.textContent = '스티커 붙이는 곳';
      stampSelected = null;
      stampDdCurrent.textContent = '선택'; // 앞에 「매장」 라벨이 있어 "매장 선택"이면 중복
      stampDdCurrent.classList.add('placeholder');
      stampDdMenu.querySelectorAll('.stamp-dd-item').forEach((i) => i.classList.remove('active'));
      stampDateEl.value = todayIso(); // 새로 찍기 기본값 = 오늘
      stampMemoEl.value = '';
      stampSubmitEl.textContent = '스티커 붙이기';
      stampSubmitEl.disabled = true;
      resetStampWith();
    }
    syncStampDateText(); // 새로 찍기(오늘)·수정(기존 날짜) 모두 값 세팅 후 표시 글자 갱신
    stampSheetOverlay.classList.add('open');
    // 오버레이가 opacity로만 여닫혀 시트가 늘 레이아웃에 남는다 → 지난번 스크롤 위치가 그대로 유지됨.
    // 다시 열 땐 항상 맨 위(날짜부터)에서 시작하도록 되돌린다(2026-07-24 버그 수정).
    if (stampSheetEl) stampSheetEl.scrollTop = 0;
    requestAnimationFrame(() => focusDialogClose(stampSheetClose));
  }
  function closeStampSheet() {
    if (stampAnimating) return; // 찍히는 중엔 닫기 무시(연출 보장)
    stampSheetOverlay.classList.remove('open');
    const target = stampSheetReturnFocus;
    stampSheetReturnFocus = null;
    if (target && target.isConnected && !target.hidden) requestAnimationFrame(() => target.focus());
  }
  // 매장 드롭다운 열기/닫기 — 정렬 dd와 같은 동작(버튼 토글, 바깥 클릭 시 닫힘)
  function closeStampDd() {
    stampDdEl.classList.remove('open');
    stampDdBtn.setAttribute('aria-expanded', 'false');
  }
  stampDdBtn.addEventListener('click', () => {
    const open = stampDdEl.classList.toggle('open');
    stampDdBtn.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (e) => {
    if (stampDdEl.classList.contains('open') && !stampDdEl.contains(e.target)) closeStampDd();
  });

  // ── 누구랑(동행) — 드롭다운(프리셋) + "직접 입력" 선택 시 자유 입력 칸. 선택 항목(비워도 됨). ──
  const COMPANIONS = ['혼자', '가족', '친구', '연인', '동료', '지인'];
  const WITH_CUSTOM = '직접 입력';
  // 스티커 카드에만 쓰는 문장형 표기(일기 말투). 드롭다운·수정·보기 모달은 짧은 원본을 그대로 쓴다.
  // 조사가 받침에 따라 갈리므로('가족과' vs '친구와') 규칙 대신 표로 적어둠 — 프리셋 추가 시 여기도 한 줄 추가.
  const WITH_CARD_LABELS = {
    '혼자': '나 혼자',
    '가족': '가족과 함께',
    '친구': '친구와 함께',
    '연인': '연인과 함께',
    '동료': '동료와 함께',
    '지인': '지인과 함께',
  };
  const stampWithEl = document.getElementById('stampWith'); // 직접 입력 칸(직접 입력 선택 때만 보임)
  const stampWithDdEl = document.getElementById('stampWithDd');
  const stampWithDdBtn = document.getElementById('stampWithDdBtn');
  const stampWithDdCurrent = document.getElementById('stampWithDdCurrent');
  const stampWithDdMenu = document.getElementById('stampWithDdMenu');
  const stampWithCustomWrap = document.getElementById('stampWithCustomWrap');
  let stampWithSelected = null; // 고른 동행(프리셋 or '직접 입력' or null=미선택)

  function closeStampWithDd() {
    stampWithDdEl.classList.remove('open');
    stampWithDdBtn.setAttribute('aria-expanded', 'false');
  }
  // 동행 옵션 선택 반영. '직접 입력'이면 자유 입력 칸 노출, 프리셋이면 숨기고 칸 비움.
  function setStampWithOption(label) {
    stampWithSelected = label;
    stampWithDdCurrent.textContent = label;
    stampWithDdCurrent.classList.remove('placeholder');
    stampWithDdMenu.querySelectorAll('.stamp-dd-item').forEach((i) => i.classList.toggle('active', i.dataset.value === label));
    const custom = label === WITH_CUSTOM;
    stampWithCustomWrap.hidden = !custom;
    if (!custom) stampWithEl.value = '';
  }
  // 미선택 상태로 초기화(새로 찍기·비움)
  function resetStampWith() {
    stampWithSelected = null;
    stampWithDdCurrent.textContent = '선택';
    stampWithDdCurrent.classList.add('placeholder');
    stampWithDdMenu.querySelectorAll('.stamp-dd-item').forEach((i) => i.classList.remove('active'));
    stampWithCustomWrap.hidden = true;
    stampWithEl.value = '';
  }
  // 저장에 쓸 동행 값 — 프리셋이면 그 라벨, '직접 입력'이면 자유 입력 글자, 미선택이면 ''
  function getStampWithValue() {
    if (stampWithSelected === WITH_CUSTOM) return stampWithEl.value.trim();
    if (stampWithSelected) return stampWithSelected;
    return '';
  }
  // 기존 자유 입력 기록도 편집 시 자동 매핑 — 프리셋에 있으면 그걸로, 아니면 '직접 입력'+그 글자
  function loadStampWith(value) {
    if (value && COMPANIONS.includes(value)) {
      setStampWithOption(value);
    } else if (value) {
      setStampWithOption(WITH_CUSTOM);
      stampWithEl.value = value;
    } else {
      resetStampWith();
    }
  }
  COMPANIONS.concat([WITH_CUSTOM]).forEach((label) => { // '직접 입력'을 맨 아래로(2열 메뉴에서 프리셋 다음)
    const item = document.createElement('button');
    item.type = 'button';
    item.setAttribute('role', 'option');
    item.className = 'stamp-dd-item';
    item.dataset.value = label;
    item.textContent = label;
    item.addEventListener('click', () => {
      setStampWithOption(label);
      closeStampWithDd();
      if (label === WITH_CUSTOM) stampWithEl.focus(); // 직접 입력이면 바로 타이핑
    });
    stampWithDdMenu.appendChild(item);
  });
  stampWithDdBtn.addEventListener('click', () => {
    const open = stampWithDdEl.classList.toggle('open');
    stampWithDdBtn.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (e) => {
    if (stampWithDdEl.classList.contains('open') && !stampWithDdEl.contains(e.target)) closeStampWithDd();
  });

  // 매장 드롭다운 메뉴 — v2: 같은 매장 여러 번 기록 가능이라 ✓ 잠금 없음(전부 선택 가능), 항목 고정이라 한 번만 생성
  STORES.forEach((s) => {
    // 🔴 스티커 그림이 없는 매장은 목록에 넣지 않는다(2026-07-30). 예전엔 골라도 🐾 자리표시
    //    카드가 나왔지만 그 카드를 없앴으므로, 고르면 빈 카드가 된다. 애초에 못 고르게 막는다.
    //    (오픈 예정 매장은 아래에서 '오픈 예정'으로 따로 보여주므로 이 줄에서 거르지 않는다 —
    //     지금 그림 없는 매장은 부산점 하나뿐이고 그게 곧 오픈 예정 매장이다.)
    if (!STAMP_IMGS[s.name] && STORE_CATCH[s.name] !== 'soon') return;
    const item = document.createElement('button');
    item.type = 'button';
    item.setAttribute('role', 'option');
    item.className = 'stamp-dd-item';
    item.dataset.value = s.name;
    // 오픈 예정 매장(STORE_CATCH='soon')은 아직 방문 불가 → 비활성(선택 X, "오픈 예정" 표시).
    // 매장 탭의 '오픈 예정' 버튼과 같은 신호를 재사용 — 실제 오픈해 URL로 바뀌면 자동으로 선택 가능해짐.
    if (STORE_CATCH[s.name] === 'soon') {
      item.classList.add('soon');
      item.disabled = true;
      item.setAttribute('aria-disabled', 'true');
      item.innerHTML = s.name + '<span class="stamp-dd-soon">오픈 예정</span>';
    } else {
      item.textContent = s.name;
      item.addEventListener('click', () => {
        setStampStore(s.name);
        closeStampDd();
      });
    }
    stampDdMenu.appendChild(item);
  });
  stampSheetClose.addEventListener('click', closeStampSheet);
  stampSheetOverlay.addEventListener('click', (e) => { if (e.target === stampSheetOverlay) closeStampSheet(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && stampSheetOverlay.classList.contains('open')) closeStampSheet();
  });

  stampSubmitEl.addEventListener('click', () => {
    if (!stampSelected || stampAnimating) return;
    // 수정 모드: 그 기록(id)만 갱신하고 바로 닫음(팝 애니 없음 — 이미 붙은 스티커). 매장도 변경 가능(v2)
    if (stampMode === 'edit') {
      const rec = stampData.records.find((r) => r.id === stampEditId);
      if (rec) {
        rec.name = stampSelected;
        rec.date = stampDateEl.value || rec.date;
        rec.memo = stampMemoEl.value.trim();
        rec.with = getStampWithValue() || undefined; // 동행(프리셋 or 직접입력) — 없으면 JSON에서 자동 생략
        // addedAt은 그대로(처음 기록한 시각 보존 — 같은 날짜 안 정렬 기준)
        // 🔴 대신 editedAt을 찍는다 — 합칠 때 '어느 쪽이 최신 내용인가'를 이걸로 가린다.
        //    없으면 수정해도 addedAt이 그대로라, 다른 기기에 남아 있던 **옛 내용이 이겨서
        //    수정한 메모가 되돌아간다**(2026-07-31 교차검증에서 잡힘).
        rec.editedAt = Date.now();
      } else {
        // 🔴 시트를 열어둔 사이에 **다른 기기가 이 기록을 지웠다**(2026-07-31 6차 교차검증 2번).
        //   예전엔 `if (rec)`에 걸려 **아무것도 저장하지 않고 시트만 닫혔다** — 사용자는 저장된
        //   줄 알고 방금 쓴 내용을 잃었다(재현함).
        //   → 방금 쓴 것을 **새 기록으로 남긴다**(2026-07-31 사용자 확정).
        //   ⚠️ 이건 '지운 기록의 부활'이 아니다. **새 id**라 tombstone(`deleted`)에 걸리지 않고,
        //     지워진 그 기록은 지워진 채로 남는다. 되살아나는 건 사용자가 지금 쓴 내용뿐이다.
        stampData.records.push({
          id: newStampId(),
          name: stampSelected,
          date: stampDateEl.value || todayIso(),
          memo: stampMemoEl.value.trim(),
          with: getStampWithValue() || undefined,
          addedAt: Date.now(),
        });
      }
      stampCardCache.delete(stampEditId); // 내용 바뀌었으니 카드 새로 그리게(날짜·매장·스티커 갱신)
      saveStamps();
      stampSheetOverlay.classList.remove('open');
      renderStamps();
      return;
    }
    stampAnimating = true;
    stampSubmitEl.disabled = true;
    // 점선 슬롯 자리에 스티커가 탁! 붙는 연출. ⚠️ 스티커 이미지가 준비된 뒤에 시작해야
    // 빈 카드가 안 뜬다 — 선택 시 미리 로드하지만, 느린 망·빠른 탭이면 아직 로딩 중일 수 있음.
    const playStampPop = () => {
      stampSlotEmpty.hidden = true;
      const card = buildStampCard(stampSelected, { eager: true }); // 찍기 연출 = 즉시 보여야 함
      card.className = 'stamp-slot-card pop';
      stampSlot.appendChild(card);
      if (navigator.vibrate) navigator.vibrate(35); // 지원 기기(안드로이드)만 살짝 진동
      // 저장은 즉시(연출이 끊겨도 기록은 남게), 화면 정리는 연출이 끝난 뒤
      stampData.records.push({
        id: newStampId(),
        name: stampSelected,
        date: stampDateEl.value || todayIso(),
        memo: stampMemoEl.value.trim(),
        with: getStampWithValue() || undefined, // 동행(프리셋 or 직접입력) — 없으면 JSON에서 자동 생략
        addedAt: Date.now(), // 같은 날짜 안에선 나중에 기록한 것이 위로(일기 정렬)
      });
      saveStamps();
      setTimeout(() => {
        stampAnimating = false;
        stampSheetOverlay.classList.remove('open');
        renderStamps();
      }, 1250); // 팝 0.55s + 붙은 스티커 감상 시간
    };
    // 이미지가 캐시됐으면(대개 이 경우) 즉시, 아직이면 로드 완료 후 pop. 실패·지연 시엔 안전장치로 진행.
    const stampImgUrl = STAMP_IMGS[stampSelected];
    if (stampImgUrl) {
      const pre = new Image();
      let started = false;
      const go = () => { if (started) return; started = true; playStampPop(); };
      pre.onload = go;
      pre.onerror = go; // 실패해도 진행(자리표시라도 뜨게, 기록은 남아야 함)
      pre.src = stampImgUrl;
      if (pre.complete) go(); // 이미 로드됨 → 즉시
      else setTimeout(go, 1500); // 안전장치: 느려도 최대 1.5초 뒤엔 진행
    } else {
      playStampPop(); // 그림 없는 지점(자리표시) — 기다릴 것 없음
    }
  });

  // ── 스티커 보기 모달 (카드 탭 시, 읽기 전용 + 수정/삭제) ──
  const stampViewOverlay = document.getElementById('stampViewOverlay');
  const stampViewSticker = document.getElementById('stampViewSticker');
  const stampViewInfo = document.getElementById('stampViewInfo');
  const stampViewClose = document.getElementById('stampViewClose');
  const stampViewEdit = document.getElementById('stampViewEdit');
  const stampViewDelete = document.getElementById('stampViewDelete');
  const stampViewEl = stampViewOverlay.querySelector('.stamp-view');
  let stampViewId = null;         // 보고 있는 기록 id
  let stampViewDeleteArmed = false; // 삭제 두 번 눌러 확인용
  let stampViewReturnFocus = null;
  stampViewEl.addEventListener('keydown', (e) => trapFocusWithin(stampViewEl, e));

  // 시트·모달이 열려 있는 동안 뒤 화면 스크롤 잠금(html.is-locked).
  // 닫는 지점이 6곳으로 흩어져 있어(X·바깥클릭·Esc·저장 후·연출 종료 등) 호출부마다 넣는 대신
  // .open 클래스 변화를 관찰해 자동 동기화한다 — 나중에 닫는 경로가 늘어도 빠뜨릴 일이 없다.
  const SCROLL_LOCK_OVERLAYS = [stampSheetOverlay, stampViewOverlay];
  function syncPageBackgroundA11y() {
    const recipeOpen = modalOverlay.classList.contains('open');
    const stampOpen = SCROLL_LOCK_OVERLAYS.some((el) => el.classList.contains('open'));
    const anyOpen = recipeOpen || stampOpen;
    [document.querySelector('.main'), document.getElementById('tabbar')].forEach((el) => {
      if (!el) return;
      el.inert = anyOpen;
      if (anyOpen) el.setAttribute('aria-hidden', 'true');
      else el.removeAttribute('aria-hidden');
    });
    // 스토리 위에 레시피 상세를 띄울 수 있으므로, 상세가 열려 있을 때만 스토리를 배경 처리한다.
    storyViewer.inert = recipeOpen;
    storyViewer.setAttribute(
      'aria-hidden',
      String(recipeOpen || !storyViewer.classList.contains('open'))
    );
  }
  function syncScrollLock() {
    const anyOpen = SCROLL_LOCK_OVERLAYS.some((el) => el.classList.contains('open'));
    document.documentElement.classList.toggle('is-locked', anyOpen);
    SCROLL_LOCK_OVERLAYS.forEach((el) => {
      const open = el.classList.contains('open');
      el.setAttribute('aria-hidden', String(!open));
      el.inert = !open;
    });
    syncPageBackgroundA11y();
  }
  SCROLL_LOCK_OVERLAYS.forEach((el) => {
    new MutationObserver(syncScrollLock).observe(el, { attributes: true, attributeFilter: ['class'] });
  });

  function resetStampViewDelete() {
    stampViewDeleteArmed = false;
    stampViewDelete.textContent = '삭제';
    stampViewDelete.classList.remove('armed');
    clearTimeout(stampViewDelete._t);
  }
  function openStampView(id) {
    const rec = stampData.records.find((r) => r.id === id);
    if (!rec) return;
    stampViewReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    stampViewId = id;
    renderStampView(rec);
    stampViewOverlay.classList.add('open');
    requestAnimationFrame(() => focusDialogClose(stampViewClose));
  }
  // 🔴 그리기만 하는 부분을 따로 뒀다(2026-07-31 5차 교차검증 2번). 열려 있는 상세를 새
  //   내용으로 다시 그려야 하는데, `openStampView`를 그대로 다시 부르면 **포커스 복귀 대상**
  //   (`stampViewReturnFocus`)이 지금 눌린 대화상자 안 버튼으로 덮여 닫을 때 못 돌아간다.
  //   여는 것(포커스·open 클래스)은 openStampView만, 여기서는 내용만 바꾼다.
  function renderStampView(rec) {
    // 스티커(크게, 즉시 로드)
    const sticker = buildStampCard(rec.name, { eager: true });
    sticker.className = 'stamp-view-card';
    stampViewSticker.innerHTML = '';
    stampViewSticker.appendChild(sticker);
    // 정보 — 날짜·매장은 항상, 동행·메모는 입력했을 때만
    const rows = [['날짜', fmtStampDateKr(rec.date)], ['매장', rec.name]];
    if (rec.with) rows.push(['동행', WITH_CARD_LABELS[rec.with] || rec.with]); // 목록 카드와 같은 문장형('가족'→'가족과 함께')
    if (rec.memo) rows.push(['메모', rec.memo]);
    stampViewInfo.innerHTML = rows
      .map((r) => '<div class="stamp-view-row"><span class="stamp-view-label">' + r[0] + '</span><span class="stamp-view-val"></span></div>')
      .join('');
    // 값은 사용자 입력이라 textContent로(안전) 채움
    stampViewInfo.querySelectorAll('.stamp-view-val').forEach((el, i) => { el.textContent = rows[i][1]; });
    resetStampViewDelete();
  }
  // 열려 있는 상세를 지금 데이터로 맞춘다. 지워졌으면 닫는다.
  // 🔴 다른 기기에서 고친 내용이 동기화로 들어와도 상세는 옛 매장·날짜·메모를 그대로 보여줬다
  //   (5차 교차검증 2번). 목록만 갱신되니 **같은 화면 안에서 두 값이 어긋났다.** 게다가 지워진
  //   기록에서 `수정`을 누르면 그 id를 못 찾아 **빈 새 기록 화면**이 떴다.
  function refreshStampView() {
    if (!stampViewId || !stampViewOverlay.classList.contains('open')) return;
    const rec = stampData.records.find((r) => r.id === stampViewId);
    if (!rec) { closeStampView(); return; }
    renderStampView(rec);
  }
  function closeStampView() {
    stampViewOverlay.classList.remove('open');
    resetStampViewDelete();
    const target = stampViewReturnFocus;
    stampViewReturnFocus = null;
    if (target && target.isConnected && !target.hidden) requestAnimationFrame(() => target.focus());
  }
  stampViewClose.addEventListener('click', closeStampView);
  stampViewOverlay.addEventListener('click', (e) => { if (e.target === stampViewOverlay) closeStampView(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && stampViewOverlay.classList.contains('open')) closeStampView();
  });
  // 수정 → 보기 닫고 기존 입력 시트(수정 모드) 열기
  stampViewEdit.addEventListener('click', () => {
    const id = stampViewId;
    closeStampView();
    openStampSheet(id);
  });
  // 삭제 — 두 번 눌러야(첫 클릭=확인 상태, 3초 뒤 자동 원복). v2: 그 기록(id)만 삭제
  stampViewDelete.addEventListener('click', () => {
    if (!stampViewId) return;
    if (!stampViewDeleteArmed) {
      stampViewDeleteArmed = true;
      stampViewDelete.textContent = '한 번 더 누르면 삭제돼요';
      stampViewDelete.classList.add('armed');
      clearTimeout(stampViewDelete._t);
      stampViewDelete._t = setTimeout(resetStampViewDelete, 3000);
      return;
    }
    stampData.records = stampData.records.filter((r) => r.id !== stampViewId);
    // 🔴 지운 id를 남긴다 — 안 남기면 다른 기기와 합칠 때 지운 기록이 되살아난다.
    //    (맨 아래 「내 데이터 코드」 절의 합치기 규칙 참고)
    if (!Array.isArray(stampData.deleted)) stampData.deleted = [];
    if (stampData.deleted.indexOf(stampViewId) === -1) stampData.deleted.push(stampViewId);
    saveStamps();
    closeStampView();
    renderStamps();
  });

  // 상단바 ✏️ 기록하기(스티커 섹션 전용) → 새로 찍기 시트
  const stampWriteBtn = document.getElementById('stampWriteBtn');
  if (stampWriteBtn) stampWriteBtn.addEventListener('click', () => {
    if (stampSheetOverlay.classList.contains('open')) return; // 이미 작성 중이면 무시 — 다시 누르면 입력 리셋되던 것 방지
    openStampSheet();
  });

  // 그리드 뷰 헤더 ‹(뒤로) + 인기소스 '전체 ›' → 홈/전체보기 전환
  // 「맨 위로」 — 레시피·메뉴 탭 목록 끝의 버튼(2026-08-03). 하단바 재탭과 같은 일을 한다.
  document.querySelectorAll('.to-top-btn').forEach((btn) => btn.addEventListener('click', scrollToTop));
  // 탕·히든·소스 섹션 '전체보기' → 해당 카테고리 브라우즈(소스는 1~5위 랭킹+6위 이하 그리드가 renderList에서 자동 적용됨)
  // 🔴 홈 「전골」의 「메뉴 보기」는 **레시피가 아니라 메뉴 탭**으로 간다(2026-08-05 사용자 확정).
  //    카드도 같은 곳으로 간다 — 육수는 상세 화면이 없어서 갈 데가 여기뿐이고, 홈 카드가 눌러도
  //    반응이 없으면 고장으로 보인다. ⚠️ 눌렀다고 냄비에 담지는 않는다(구경하다 담기면 놀란다).
  document.getElementById('jeongolMore').addEventListener('click', 전골로가기);
  document.getElementById('hiddenMore').addEventListener('click', () => enterBrowse('히든메뉴'));
  document.getElementById('popularMore').addEventListener('click', () => enterBrowse('소스'));

  function readStoredSet(key) {
    try {
      return new Set(JSON.parse(localStorage.getItem(key)) || []);
    } catch (err) {
      return new Set();
    }
  }

  function readStoredObject(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    } catch (err) {
      return {};
    }
  }

  // 같은 사이트를 여러 창에서 열었거나 iOS가 bfcache 화면을 복원했을 때, 메모리에 남은
  // 옛 상태가 localStorage의 최신값을 덮지 않도록 저장값을 다시 읽고 필요한 부분만 갱신한다.
  // 전체 renderList()는 즐겨찾기 필터에서 항목이 빠져야 할 때만 호출해 스크롤 위치를 보존한다.
  function syncExternalState(key) {
    const syncAll = !key;

    if (syncAll || key === FAVORITES_KEY) {
      favorites = readStoredSet(FAVORITES_KEY);
      document.querySelectorAll('.browse-fav[data-id]').forEach((el) => {
        setPressedState(el, favorites.has(el.dataset.id));
      });
      if (currentModalRecipe) {
        setPressedState(modalFavBtn, favorites.has(currentModalRecipe.id));
      }
      if (showFavoritesOnly) renderList();
    }

    if (syncAll || key === LIKED_KEY) {
      likedByMe = readStoredSet(LIKED_KEY);
      RECIPES.forEach((r) => syncLikeUI(r.id));
      if (currentModalRecipe) {
        setPressedState(modalLikeBtn, likedByMe.has(currentModalRecipe.id));
      }
    }

    if (syncAll || key === LIKE_COUNTS_KEY) {
      likeCounts = readStoredObject(LIKE_COUNTS_KEY);
      refreshLikeCounts();
    }

    if (syncAll || key === STAMPS_KEY) {
      const saved = readStoredObject(STAMPS_KEY);
      if (Array.isArray(saved.records) || localStorage.getItem(STAMPS_KEY) === null) {
        stampData = Array.isArray(saved.records) ? saved : { version: 2, records: [] };
        stampCardCache.clear();
        renderStamps();
        // 열린 상세도 맞춘다 — 예전엔 **지워졌을 때 닫기만** 하고 내용이 바뀐 경우는 그대로 둬서
        // 목록과 상세가 어긋났다(동기화 경로에서 발견된 것과 같은 결함, 5차 교차검증 2번).
        refreshStampView();
      }
    }

    // 🔴 다른 탭에서 코드를 불러오면 이 탭도 그 코드를 따라간다(5차 교차검증 1번).
    //   이 항목만 빠져 있어서, 탭1이 코드 A를 불러온 뒤 탭2에서 B를 불러오면 **탭1은 계속 A로
    //   전송했다.** 다른 데이터는 이 함수가 이미 탭 사이를 맞추고 있으므로 코드도 같이 맞춘다.
    //   ⚠️ 값이 비었으면(다른 탭이 저장소를 통째로 비운 경우) 메모리 사본을 지우지 않는다 —
    //     그 사본은 저장소가 막혔을 때 코드를 잃지 않으려고 둔 것이다.
    if (syncAll || key === SYNC_CODE_KEY) {
      let stored = '';
      try { stored = localStorage.getItem(SYNC_CODE_KEY) || ''; } catch (e) { /* 무시 */ }
      if (stored && stored !== syncCodeMem) {
        syncCodeMem = stored;
        renderCodeNotice(); // 띠 문구·버튼
        // 🔴 열려 있는 「내 코드」 시트의 코드 글자도 바꾼다(6차 교차검증 1번).
        //   안 바꾸면 **보이는 코드와 복사되는 코드가 달라진다** — 복사·보내기는 `getSyncCode()`를 쓴다.
        renderSyncCode();
      }
    }
  }

  window.addEventListener('storage', (e) => {
    if (e.key === null) {
      syncExternalState();
    } else if ([FAVORITES_KEY, LIKED_KEY, LIKE_COUNTS_KEY, STAMPS_KEY, SYNC_CODE_KEY].includes(e.key)) {
      syncExternalState(e.key);
    }
  });

  renderHomeSections();
  initMonthlyFeature();
  renderList();
  renderStoreTabs();
  renderStores();
  renderStamps();
  window.addEventListener('resize', updateStoreUnderline);
  window.addEventListener('resize', () => {
    requestAnimationFrame(() => fitPopularTitles(popularRailEl));
    requestAnimationFrame(() => fitBrowseTitles(gridEl));
  });

  // 초기 빨간 원 위치 잡기(레이아웃·폰트 로드 후 다시 한 번)
  requestAnimationFrame(placeIndicator);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeIndicator);

  // 첫 화면 렌더 후 브라우저가 한가할 때, 아직 요청되지 않은 앞쪽 카드 이미지만 제한적으로 프리로드.
  // 나머지는 카드의 loading="lazy"에 맡겨 홈만 보고 나가는 방문자에게 전체 이미지 비용을 지우지 않는다.
  const CARD_PRELOAD_LIMIT = 6;
  function preloadCardImages() {
    const alreadyRequested = new Set(
      Array.from(document.images, (img) => img.getAttribute('src')).filter(Boolean)
    );
    const srcs = RECIPES
      .filter((r) => r.img && !alreadyRequested.has(r.img))
      .map((r) => r.img)
      .slice(0, CARD_PRELOAD_LIMIT);
    let i = 0;
    const next = () => {
      if (i >= srcs.length) return;
      const im = new Image();
      im.onload = im.onerror = () => setTimeout(next, 60);
      im.src = srcs[i++];
    };
    next();
  }
  if ('requestIdleCallback' in window) {
    requestIdleCallback(preloadCardImages, { timeout: 3000 });
  } else {
    setTimeout(preloadCardImages, 1500); // iOS Safari 등 미지원 브라우저
  }

  // iOS Safari에서 :active 스타일이 먹히려면 touchstart 리스너가 하나라도 있어야 함
  document.addEventListener('touchstart', () => {}, { passive: true });

  // 기기/브라우저 판별
  const ua = navigator.userAgent;
  const isIos = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/.test(ua);
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
  const isStandalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
  const isInAppBrowser = /KAKAOTALK|NAVER|Instagram|FBAN|FBAV|Line\//.test(ua);

  function isIosSafariNotInstalled() {
    return isIos && isSafari && !isStandalone && !isInAppBrowser;
  }

  // 앱 설치 진입점 = 헤더 아이콘만 (데스크탑 = 우측 topInstallBtn, 모바일 = 탭줄 공유 옆 .tabs-install-btn).
  // 예전 우하단 플로팅 CTA는 하단 탭바와 계속 겹쳐(콘텐츠 가림) 제거 — 설치는 의지가 있는 재방문자가
  // 아이콘으로도 충분히 찾는다는 판단(사용자 합의). 설치 가능할 때만 아래 로직이 아이콘을 표시.
  const a2hsOverlay = document.getElementById('a2hsOverlay');
  const a2hsClose = document.getElementById('a2hsClose');
  const topInstallBtn = document.getElementById('topInstallBtn');
  const tabsInstallBtns = [...document.querySelectorAll('.tabs-install-btn')];
  const installBtns = [topInstallBtn].concat(tabsInstallBtns);
  // 🔴 인라인 display 로 켜지 않는다(2026-08-04) — 「레시피·메뉴에서는 설치를 감춘다」는
  //    CSS 규칙을 인라인이 이겨서 두 탭에도 나왔다(사용자가 실기기에서 발견).
  //    켜고 끄는 것은 클래스로만 하고, 어디에 보일지는 CSS 가 정한다.
  function showInstallBtns() {
    document.querySelector('.page').classList.add('can-install');
    // 탭줄 아이콘은 인라인만 걷어내면 CSS가 표시를 결정(모바일 flex / 데스크탑 none — 공유 버튼과 동일 규칙)
    tabsInstallBtns.forEach((b) => { b.style.display = ''; });
  }
  function hideInstallBtns() {
    document.querySelector('.page').classList.remove('can-install');
    tabsInstallBtns.forEach((b) => { b.style.display = 'none'; });
  }

  // ADD TO HOME SCREEN (iOS Safari — no install API exists, so we guide manually)
  if (isIosSafariNotInstalled()) {
    showInstallBtns();
    const openA2hsOverlay = () => a2hsOverlay.classList.add('open');
    installBtns.forEach((b) => b.addEventListener('click', openA2hsOverlay));
    a2hsOverlay.addEventListener('click', (e) => {
      if (e.target === a2hsOverlay) a2hsOverlay.classList.remove('open');
    });
    a2hsClose.addEventListener('click', () => a2hsOverlay.classList.remove('open'));
  }

  // INSTALL APP (Android Chrome/삼성 인터넷 — 표준 설치 프롬프트 이용)
  let deferredInstallPrompt = null;

  window.addEventListener('beforeinstallprompt', (e) => {
    if (isInAppBrowser || isStandalone) return;
    e.preventDefault();
    deferredInstallPrompt = e;
    showInstallBtns();
  });

  async function promptAndroidInstall() {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    hideInstallBtns();
  }

  installBtns.forEach((b) => b.addEventListener('click', () => {
    if (deferredInstallPrompt) promptAndroidInstall();
  }));

  window.addEventListener('appinstalled', hideInstallBtns);

  // 카카오톡 등 인앱 브라우저 안내
  const inappBanner = document.getElementById('inappBanner');
  const inappBannerText = document.getElementById('inappBannerText');
  const inappBannerClose = document.getElementById('inappBannerClose');
  const INAPP_DISMISS_KEY = 'inappBannerDismissed';

  if (isInAppBrowser && !isStandalone && !sessionStorage.getItem(INAPP_DISMISS_KEY)) {
    inappBannerText.textContent = isIos
      ? '홈 화면에 추가해서 앱처럼 사용하려면 Safari로 열어주세요'
      : '앱 설치를 하려면 Chrome 또는 기본 브라우저로 열어주세요';
    inappBanner.style.display = 'flex';
    const bannerHeight = inappBanner.offsetHeight;
    document.body.style.paddingTop = bannerHeight + 'px';
    inappBannerClose.addEventListener('click', () => {
      inappBanner.style.display = 'none';
      document.body.style.paddingTop = '';
      sessionStorage.setItem(INAPP_DISMISS_KEY, '1');
    });
  }

  // 친구에게 공유
  const favShareBtn = document.getElementById('favShareBtn');
  const topShareBtn = document.getElementById('topShareBtn');
  const storeShareBtn = document.getElementById('storeShareBtn'); // 매장 섹션(모바일) 공유 버튼
  const shareToast = document.getElementById('shareToast');
  let shareToastTimer = null;

  // 화면 아래(탭바 위 20px)에 뜨는 검은 알약. 2초 뒤 저절로 사라진다.
  // 🔴 이름은 share- 로 시작하지만 공유 전용이 아니다 — 처음 쓴 곳이 공유였을 뿐이고,
  //    지금은 메뉴 탭(냄비가 가득 찼을 때)도 쓴다. 알려만 주고 사라지는 모든 자리에 쓴다.
  function showShareToast(text) {
    shareToast.textContent = text;
    shareToast.classList.add('show');
    clearTimeout(shareToastTimer);
    shareToastTimer = setTimeout(() => shareToast.classList.remove('show'), 2000);
  }
  window.showToast = showShareToast;   // 메뉴 탭 IIFE 는 따로 감싸여 있어 이걸로 건넨다

  async function shareSite() {
    const isLocalPreview = /^(localhost|127\.0\.0\.1|\d{1,3}(?:\.\d{1,3}){3})$/.test(location.hostname);
    const shareUrl = location.origin + location.pathname + (isLocalPreview ? '?share=7' : '');
    const shareData = { title: document.title, url: shareUrl };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // 사용자가 공유를 취소한 경우 등은 무시
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(shareData.url);
      showShareToast('링크가 복사되었어요!');
    } catch (err) {
      showShareToast('링크 복사에 실패했어요');
    }
  }

  favShareBtn.addEventListener('click', shareSite);
  topShareBtn.addEventListener('click', shareSite);
  if (storeShareBtn) storeShareBtn.addEventListener('click', shareSite);
  const stampShareBtn = document.getElementById('stampShareBtn'); // 스티커 섹션(모바일) 공유 버튼
  if (stampShareBtn) stampShareBtn.addEventListener('click', shareSite);

  // ════════════════════════════════════════════════════════════════════════
  // 내 데이터 코드 — 기기 간 복구 (2026-07-31)
  // ════════════════════════════════════════════════════════════════════════
  // 🔴 왜 만들었나: localStorage만으로는 이 사이트 데이터를 못 지킨다.
  //   ① **iOS 홈 화면 웹앱은 사파리와 저장소가 분리된다**(2026-07-31 실기기 확인). 사파리에서
  //      남긴 스티커 기록이 홈 화면 앱에선 하나도 안 보였다. 홈 화면 추가는 사이트가 마음에 든
  //      사람이 하는 행동이라, **기록을 제일 많이 쌓은 사람이 제일 크게 잃는다.**
  //   ② 사파리는 7일간 그 사이트 방문이 없으면 저장소를 비울 수 있다(애플 ITP).
  //   ③ 폰을 바꾸면 끝난다.
  //   스티커 방문 일기는 사용자가 직접 쓴 것이라 **다시 만들 수 없다** → 서버에 사본을 둔다.
  //   (즐겨찾기·좋아요는 다시 누르면 그만이지만, 구조가 같아 같이 태운다.)
  //
  // 방식 = **코드 하나**. 로그인·이메일·개인정보 없음. 이미 쓰는 Firebase에 얹는다.
  //   첫 스티커 기록 때 코드가 생기고 그 뒤로는 같은 코드에 계속 쌓인다(매번 안 보여준다).
  //
  // 🔴 합치기 규칙 (2026-07-31 사용자 확정: "덮어쓰기 말고 합치기"):
  //   - **스티커** = id로 합치고, 지운 id는 `deleted`에 남겨 되살아나지 않게 한다.
  //     이 tombstone이 없으면 A기기에서 지운 기록이 B기기 동기화 때 되살아난다.
  //   - **즐겨찾기·좋아요** = 합집합만. 해제한 게 다른 기기에서 되살아날 수 있지만 다시 누르면
  //     그만이라 감수한다(스티커와 달리 복구 불가한 데이터가 아니다).
  // 🔴 좋아요 **숫자**는 여기서 절대 안 건드린다. 숫자는 `likes/`에 있고 여기 있는 건 "내가
  //   눌렀다"는 표시뿐이다. 이게 따라다니면 기기를 옮겨도 같은 레시피를 두 번 세는 일이 준다.
  // 🔴 서버가 없거나 막혀도 앱은 **지금과 똑같이 로컬만으로 동작한다.** 동기화는 전부 덤이다.

  const SYNC_CODE_KEY = 'haidilao_sync_code';
  // 헷갈리는 글자(I·O·0·1) 제외 — 사용자가 눈으로 읽고 손으로 입력하는 코드다.
  /* 🔴 코드를 **만들 때** 쓰는 글자다(2026-08-05 개편). 모음 A·E·U 와 반모음 Y 를 뺐다 —
     안 빼면 읽히는 영어 단어가 만들어진다. 실제로 욕설이 그대로 들어간 코드가 나왔다(사용자 발견).
     I·O·0·1 은 원래부터 헷갈려서 빼 두었다.
     🔴 **입력 검사(아래 CODE_CHAR)는 절대 같이 좁히지 말 것.** 이미 나가 있는 옛 코드에는 모음이
        들어 있어서, 좁히면 그 사람들이 자기 코드를 못 넣게 된다. **만들 때만** 좁힌다.
     가짓수는 28^6 ≈ 4억 8천만이다(전 32^6 ≈ 10억 7천만). 줄지만 이 규모엔 넘친다 —
     더 늘려야 하면 알파벳을 넓히지 말고 **자릿수를 7로** 올릴 것(28^7 ≈ 135억). */
  const CODE_ALPHABET = 'BCDFGHJKLMNPQRSTVWXZ23456789';
  /* 🔴 모음을 빼도 자음만으로 읽히는 말이 남는다(FCK 처럼). 그런 조각이 들어간 코드는 다시 뽑는다.
     ⚠️ 이 목록이 전부일 수 없다 — 거슬리는 코드가 나오면 여기 한 줄 추가하면 된다.
     ⚠️ 소문자로 적고 대문자 코드와 맞출 땐 대소문자를 무시한다. */
  const CODE_BANNED = ['fck', 'fuk', 'sht', 'nggr', 'ngr', 'cnt', 'kkk', 'dck', 'phk', 'wtf', 'jjk'];

  // 🔴 저장소가 가득 차거나 막혀도 **이 세션에선 코드가 살아 있어야 한다**(2026-07-31 교차검증).
  //    예전엔 setSyncCode의 실패를 삼켰는데, pushSync가 저장소에서 코드를 다시 읽는 구조라
  //    "코드가 없다"고 판단해 **서버 업로드를 통째로 건너뛰었다.** 로컬도 못 쓰고 서버에도 안 올라가
  //    기록이 그냥 사라진다. 메모리에 사본을 들고 있으면 최소한 서버에는 올라간다.
  let syncCodeMem = '';
  // 🔴 **메모리 사본이 먼저다**(2026-07-31 2차 교차검증). 저장소에 옛 코드가 남아 있는데
  //    새 코드 저장이 실패하면, 저장소를 먼저 읽는 순간 화면엔 새 코드가 보이는데 데이터는
  //    **옛 코드 쪽으로 올라간다.** 메모리 사본은 이번 세션에 실제로 정한 코드이므로 이게 진실이다.
  //    (페이지를 새로 열면 메모리는 비어 있어 자연스럽게 저장소 값이 쓰인다.)
  function getSyncCode() {
    if (syncCodeMem) return syncCodeMem;
    try { return localStorage.getItem(SYNC_CODE_KEY) || ''; } catch (e) { return ''; }
  }
  function setSyncCode(code) {
    syncCodeMem = code;
    try { localStorage.setItem(SYNC_CODE_KEY, code); } catch (e) { /* 저장 실패해도 위 사본으로 버틴다 */ }
  }
  function 여섯자리() {
    let s = '';
    const buf = new Uint32Array(6);
    if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(buf);
    for (let i = 0; i < 6; i++) {
      const n = buf[i] || Math.floor(Math.random() * 0xffffffff);
      s += CODE_ALPHABET[n % CODE_ALPHABET.length];
    }
    return s;
  }
  function makeSyncCode() {
    // 🔴 걸리는 조각이 들어 있으면 다시 뽑는다. 20번은 넉넉한 상한이다 —
    //    걸릴 확률이 아주 낮아 실제로는 첫 판에 끝난다. 상한을 두는 이유는 목록이 잘못 커져
    //    (예: 한 글자를 넣어 버림) 영원히 도는 일을 막기 위해서다. 그땐 마지막 것을 그냥 쓴다.
    let s = '';
    for (let i = 0; i < 20; i++) {
      s = 여섯자리();
      const 소문자 = s.toLowerCase();
      if (!CODE_BANNED.some((w) => 소문자.includes(w))) break;
    }
    return 'HG-' + s;
  }
  // 사용자가 어떻게 적어와도 받아준다 — 소문자, 공백, 하이픈 유무, 'HG' 생략까지.
  // 🔴 'HG'를 무조건 떼면 안 된다. 코드 알파벳에 H와 G가 있어서 뒤 6자리가 'HGXY12'처럼
  //    HG로 시작할 수 있는데, 그때 접두어로 착각해 떼면 4글자만 남아 멀쩡한 코드가 거부된다.
  //    → **길이가 8일 때만** 앞의 HG를 접두어로 본다(6자리면 그대로가 본체다).
  // 🔴 헷갈리는 글자(I·O·0·1)만 막는다. 예전엔 [A-Z0-9]를 다 받아서, 0이나 1이 섞인 코드가
  //    화면에선 멀쩡히 통과한 뒤 서버 규칙에 막혀 "저장된 데이터가 없어요"로 나왔다 —
  //    형식 문제인데 없는 코드처럼 보였다.
  // 🔴 **이 집합은 CODE_ALPHABET(만들 때)보다 넓다. 좁히지 말 것**(2026-08-05).
  //    만들 때는 모음을 빼지만, **이미 나가 있는 옛 코드에는 모음이 들어 있다.** 여기를 같이 좁히면
  //    그 사람들이 자기 코드를 못 넣게 된다 — 되살릴 방법이 없는 데이터라 치명적이다.
  const CODE_CHAR = /^[A-HJ-NP-Z2-9]{6}$/;
  function normalizeCode(raw) {
    let s = String(raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (s.length === 8 && s.slice(0, 2) === 'HG') s = s.slice(2);
    return CODE_CHAR.test(s) ? 'HG-' + s : '';
  }

  // 이 기기의 현재 상태를 서버에 보낼 모양으로.
  // 🔴 `undefined`인 값이 하나라도 섞이면 Firebase의 set()이 **그 자리에서 예외를 던진다**(비동기 아님).
  //    실제로 겪었다 — 동행을 안 적은 기록의 `with`가 undefined라, 코드를 만든 직후 여기서 멈춰
  //    뒤따르는 코드(안내 띠 표시 등)가 통째로 안 돌았고 화면상 아무 일도 안 일어난 것처럼 보였다.
  //    그래서 보내기 전에 undefined를 **반드시** 털어낸다. 새 필드를 추가할 때도 이 함수를 거칠 것.
  function clean(obj) {
    const out = {};
    Object.keys(obj).forEach((k) => { if (obj[k] !== undefined) out[k] = obj[k]; });
    return out;
  }
  // 내용이 실제로 바뀌었는지 비교할 때 쓰는 지문. 🔴 updatedAt은 뺀다 —
  // 부를 때마다 Date.now()가 새로 들어가서 데이터가 같아도 늘 "바뀌었다"가 된다(교차검증).
  function fingerprint() {
    const p = syncPayload();
    delete p.updatedAt;
    return JSON.stringify(p);
  }
  function syncPayload() {
    return {
      stamps: {
        records: (stampData.records || []).map(clean),
        deleted: (stampData.deleted || []).slice(),
      },
      favorites: [...favorites],
      liked: [...likedByMe],
      // 켠/끈 이력도 함께 보낸다 — 이게 있어야 "끈 것"이 다른 기기에서 안 되살아난다.
      // 🔴 **사본**이어야 한다. 이 값은 트랜잭션이 도는 동안 스냅샷으로 붙들려 있는데,
      //    원본을 그대로 넘기면 그 사이 사용자가 즐겨찾기를 눌러 원본이 바뀔 때 스냅샷도 같이
      //    흔들린다(3차 교차검증 R1). 항목 자체는 통째로 교체되므로 얕은 사본이면 충분하다.
      favMarks: Object.assign({}, favMarks),
      likedMarks: Object.assign({}, likedMarks),
      // 🔴 담은 목록(메뉴 탭)도 함께 보낸다(2026-08-04 사용자 확정) —
      //    「초기화하기 전까지 유지되니 다음 주문 때도 써먹는다」는 것이 이유다.
      //    메뉴 탭은 다른 IIFE 라 값을 직접 못 읽는다 → 저장된 것을 그대로 읽어 싣는다.
      menu: readMenuPicked(),
      updatedAt: Date.now(),
    };
  }
  // 담은 목록 저장값 그대로. { picked:[], broths:[], cells:n, at:ms } — at 은 마지막으로 손댄 시각이다.
  const MENU_PICKED_KEY = 'haidilao_menu_picked';
  function readMenuPicked() {
    try {
      const v = JSON.parse(localStorage.getItem(MENU_PICKED_KEY));
      return (v && typeof v === 'object') ? v : null;
    } catch (e) { return null; }
  }

  // 서버 것 + 이 기기 것을 합쳐서 로컬에 적용. 합친 결과를 돌려준다(개수 안내용).
  // ── 합치기는 **순수 계산**이다 ────────────────────────────────────────────
  // 🔴 왜 순수해야 하나(2026-07-31 2차 교차검증): 이걸 Firebase `transaction()` 안에서 쓰는데,
  //    트랜잭션 콜백은 **여러 번 불릴 수 있고 null로도 불린다.** 안에서 로컬 상태를 건드리면
  //    그 부작용이 여러 번 적용된다. 그래서 값만 받아 값만 돌려주고, 로컬 반영은 커밋된 뒤에 한다.
  //    덕분에 **쓰기가 실패하면 로컬도 안 바뀐다** — 화면·저장소가 어긋나던 문제(2차 지적 3)도 같이 풀린다.
  function marksOf(marks, list) {
    // 이력이 없던 시절 자료 보완: 목록에 있으면 '켠 것(시각 0)'. 0이라 명시적 변경에는 진다.
    const out = {};
    (list || []).forEach((id) => { out[id] = { v: 1, t: 0 }; });
    Object.keys(marks || {}).forEach((id) => { if (marks[id]) out[id] = marks[id]; });
    return out;
  }
  function mergeMarkMaps(a, b) {
    const out = {};
    [a, b].forEach((m) => Object.keys(m).forEach((id) => {
      const cur = out[id], nw = m[id];
      if (!cur) { out[id] = nw; return; }
      const ct = cur.t || 0, nt = nw.t || 0;
      if (nt > ct) { out[id] = nw; return; }
      // 🔴 동점이면 **끈 쪽**을 남긴다. 안 그러면 두 기기가 서로 자기 것만 고집해 영영 안 맞는다.
      if (nt === ct && nw.v === 0) out[id] = nw;
    }));
    return out;
  }
  function mergePayloads(a, b) {
    // 🔴 한쪽이 없어도 **그냥 돌려주면 안 된다.** 아래 applyPayload는 이력(marks)만 보고
    //    집합을 다시 만드는데, 이력이 없던 시절 자료는 marksOf를 거쳐야 살아난다.
    //    그대로 넘기면 옛 즐겨찾기가 그 순간 사라진다(1차 교차검증에서 겪은 그 버그).
    a = a || { stamps: { records: [], deleted: [] }, favorites: [], liked: [], favMarks: {}, likedMarks: {} };
    b = b || { stamps: { records: [], deleted: [] }, favorites: [], liked: [], favMarks: {}, likedMarks: {} };
    const deleted = new Set([].concat(
      (a.stamps && a.stamps.deleted) || [], (b.stamps && b.stamps.deleted) || []
    ));
    // 같은 id끼리는 **내용을 마지막으로 손댄 쪽**이 이긴다.
    // 🔴 addedAt만 보면 안 된다 — 수정해도 addedAt은 그대로라 늘 동점이 되고, 나중에 처리되는
    //    쪽이 무조건 이겨 수정한 메모가 되돌아간다(1차 교차검증).
    // 🔴 시각까지 같으면 **내용 문자열이 큰 쪽**으로 정한다. 크고 작음에 뜻은 없고, 두 기기가
    //    같은 답에 도달하는 것이 목적이다. 예전엔 '동점이면 로컬'이라 기기마다 답이 달라
    //    영영 수렴하지 않았다(2차 교차검증).
    const touchedAt = (r) => Math.max(r.editedAt || 0, r.addedAt || 0);
    const byId = new Map();
    const put = (r) => {
      if (!r || !r.id || deleted.has(r.id)) return;
      const old = byId.get(r.id);
      if (!old) { byId.set(r.id, r); return; }
      const rt = touchedAt(r), ot = touchedAt(old);
      if (rt > ot) { byId.set(r.id, r); return; }
      if (rt === ot && JSON.stringify(r) > JSON.stringify(old)) byId.set(r.id, r);
    };
    ((a.stamps && a.stamps.records) || []).forEach(put);
    ((b.stamps && b.stamps.records) || []).forEach(put);
    const favMarksM = mergeMarkMaps(marksOf(a.favMarks, a.favorites), marksOf(b.favMarks, b.favorites));
    const likedMarksM = mergeMarkMaps(marksOf(a.likedMarks, a.liked), marksOf(b.likedMarks, b.liked));
    return {
      stamps: { records: [...byId.values()], deleted: [...deleted] },
      favMarks: favMarksM,
      likedMarks: likedMarksM,
      // 목록도 이력과 같이 채워 둔다 — 이력이 진실이지만, 사람이 서버 값을 열어볼 때 읽기 쉽다.
      favorites: setsFromMarks(favMarksM),
      liked: setsFromMarks(likedMarksM),
      // 🔴 담은 목록은 **합치지 않고 최신 것이 통째로 이긴다**(2026-08-04).
      //    스티커·즐겨찾기는 항목마다 켠/끈 이력이 있어 합칠 수 있지만, 담은 목록은
      //    「지금 이 한 벌」이다 — 합치면 냄비 칸 수(1·2·4)와 육수가 서로 안 맞게 뒤엉킨다.
      //    예: 한쪽이 2칸에 육수 둘, 다른 쪽이 4칸에 육수 넷이면 합친 결과가 성립하지 않는다.
      //    at 이 없는 옛 자료는 0 으로 봐서 새 쪽이 이긴다.
      menu: ((a.menu && a.menu.at) || 0) >= ((b.menu && b.menu.at) || 0) ? (a.menu || b.menu || null)
                                                                        : (b.menu || null),
      updatedAt: Date.now(),
    };
  }
  function setsFromMarks(marks) {
    return Object.keys(marks || {}).filter((id) => marks[id] && marks[id].v === 1);
  }
  // 기록 한 건의 지문. 🔴 키 순서에 흔들리면 안 된다 — 로컬 객체와 서버에서 온 객체는
  //   같은 내용이라도 키 순서가 다를 수 있어, 그냥 stringify하면 안 바뀐 것도 바뀐 것이 된다.
  function recFingerprint(r) {
    return JSON.stringify(r, Object.keys(r).sort());
  }
  // 합쳐진 값을 로컬에 반영한다. 🔴 서버 쓰기가 **성공한 뒤에만** 부른다.
  function applyPayload(p) {
    if (!p) return;
    const prevRecs = stampData.records || [];
    stampData.records = (p.stamps && p.stamps.records) || [];
    stampData.deleted = (p.stamps && p.stamps.deleted) || [];
    // 🔴 카드 캐시에서 **내용이 바뀐 id만** 지운다(3차 교차검증 3번 + 4차 3번). 목록 카드는
    //    id로 재사용하는데, 다른 기기에서 수정된 내용이 들어와도 캐시가 옛 카드를 그대로
    //    내놓아 **목록과 상세가 다르게** 보였다. 그렇다고 매번 전부 비우면(3차 수정) 아무것도
    //    안 바뀐 동기화에서도 카드·이미지를 통째로 다시 만들어 깜빡일 수 있다(4차 지적).
    //    ⚠️ 사라진 id의 캐시는 renderStamps 끝에서 liveIds로 정리하므로 여기선 안 건드린다.
    const nextById = new Map(stampData.records.map((r) => [r.id, r]));
    prevRecs.forEach((old) => {
      const nw = nextById.get(old.id);
      if (nw && recFingerprint(nw) !== recFingerprint(old)) stampCardCache.delete(old.id);
    });
    favMarks = p.favMarks || {};
    likedMarks = p.likedMarks || {};
    favorites.clear(); setsFromMarks(favMarks).forEach((id) => favorites.add(id));
    likedByMe.clear(); setsFromMarks(likedMarks).forEach((id) => likedByMe.add(id));
    try {
      localStorage.setItem(FAV_MARKS_KEY, JSON.stringify(favMarks));
      localStorage.setItem(LIKED_MARKS_KEY, JSON.stringify(likedMarks));
    } catch (e) { /* 무시 */ }
    // 🔴 담은 목록은 **더 새로울 때만** 덮어쓴다(2026-08-04). 지금 이 기기 것이 더 최신인데
    //    덮으면 방금 담은 게 사라진다. mergePayloads 가 이미 최신 쪽을 골라 주지만,
    //    여기서 한 번 더 보는 이유는 이 함수가 합치기를 거치지 않고 불릴 수도 있기 때문이다.
    const 지금 = readMenuPicked();
    if (p.menu && ((p.menu.at || 0) > ((지금 && 지금.at) || 0))) {
      try { localStorage.setItem(MENU_PICKED_KEY, JSON.stringify(p.menu)); } catch (e) { /* 무시 */ }
      // 메뉴 탭이 이미 그려져 있으면 화면까지 새로 그린다(다른 IIFE 라 window 를 거친다)
      if (window.mnReloadPicked) window.mnReloadPicked();
    }
  }
  function mergeIntoLocal(remote) {
    if (!remote) return;
    applyPayload(mergePayloads(syncPayload(), remote));
  }

  // 서버에 올리기 — 저장이 연달아 일어나도 한 번만 보내게 묶는다
  let pushTimer = null;
  // 🔴 메뉴 탭은 다른 IIFE 라 직접 못 부른다 — 담은 목록이 바뀔 때도 코드에 올려야 해서 window 에 얹는다.
  //    (메뉴 탭의 saveMenu 가 window.schedulePush() 를 부른다)
  window.schedulePush = () => schedulePush();
  function schedulePush() {
    if (!syncRoot) return;
    // 🔴 **저장할 게 생기는 순간** 코드를 만든다 — 스티커든 즐겨찾기든 좋아요든(2026-07-31).
    //    예전엔 스티커 첫 기록 때만 만들어서, 즐겨찾기·좋아요만 쓰는 사람은 코드도 없고
    //    서버에 아무것도 안 올라갔다. 띠에는 "셋 다 따라온다"고 적어놓고 실제론 아니었다.
    //    (사용자가 발견: "즐겨찾기나 좋아요 했을때는 반응이 없고")
    ensureSyncCode();
    renderCodeNotice(); // 코드가 막 생겼으면 띠 문구·버튼을 바꿔준다
    clearTimeout(pushTimer);
    pushTimer = setTimeout(pushSync, 800);
  }
  // 🔴 **읽고 → 합치고 → 쓴다**(2026-07-31 교차검증에서 잡힌 데이터 유실).
  //    예전엔 그냥 set()으로 통째 덮어썼다. 같은 코드를 쓰는 다른 기기가 그 사이 올린 것이
  //    **나중에 저장한 기기 때문에 통째로 사라졌다.** 특히 둘 다 오프라인에서 각자 기록한 뒤
  //    차례로 연결되면 앞 기기 것이 날아간다.
  //    ⚠️ 합치면 로컬 상태가 바뀔 수 있으므로, 바뀌었으면 화면도 다시 그린다.
  //    ⚠️ 재진입 방지(pushing) — refreshAfterSync가 save*를 부르고 그게 다시 schedulePush를
  //       부르는 고리를 끊는다. 대신 그 사이 들어온 저장은 pendingPush로 기억했다 한 번 더 올린다.
  let pushing = false;
  let pendingPush = false;
  function pushSync() {
    const code = getSyncCode();
    if (!syncRoot || !code) return Promise.resolve(false);
    if (pushing) { pendingPush = true; return Promise.resolve(false); }
    pushing = true;
    const done = (ok) => {
      pushing = false;
      if (pendingPush) { pendingPush = false; schedulePush(); }
      return ok;
    };
    // try로 감싼다 — set()은 값이 잘못되면 비동기가 아니라 **그 자리에서** 던진다(위 clean 주석).
    // 여기서 새면 이걸 부른 쪽(저장·기록 흐름)이 통째로 멈춘다. 동기화는 덤이지 본업이 아니다.
    try {
      // 🔴 `transaction`을 쓴다(2026-07-31 2차 교차검증). 읽고→합치고→쓰기는 그 사이가
      //    원자적이지 않아서, **두 기기가 같은 옛 상태를 동시에 읽으면** 나중 쓰기가 앞 기기 것을
      //    지웠다. 트랜잭션은 충돌하면 서버 최신값으로 콜백을 다시 불러 재시도한다.
      //    ⚠️ 콜백은 여러 번·null로도 불리므로 **부작용이 없어야 한다** → mergePayloads는 순수.
      const mine = syncPayload();      // 로컬 스냅샷(값)
      const before = fingerprint();
      return syncRoot.child(code).transaction((remote) => mergePayloads(mine, remote))
        .then((res) => {
          // 🔴 커밋된 뒤에만 로컬에 반영한다 — 쓰기가 실패하면 화면·저장소도 그대로 둬야
          //    어긋나지 않는다(2차 지적 3).
          // 🔴 커밋 결과를 **그대로 덮어쓰면 안 된다**(3차 교차검증). 이 결과는 트랜잭션을
          //    시작할 때 찍은 옛 스냅샷(mine) 기준이라, **전송하는 동안 사용자가 새로 저장한 것**이
          //    빠져 있다. 그대로 적용하면 방금 남긴 스티커나 방금 끈 즐겨찾기가 사라진다.
          //    → 지금 로컬 상태와 **한 번 더 합쳐서** 넣는다. 그 사이 변경은 pendingPush가
          //      다음 전송으로 서버에 올린다.
          // 🔴 코드가 바뀌었으면 적용하지 않는다 — 코드 A 전송 중 코드 B를 불러왔는데 A의 늦은
          //    결과가 B 상태를 덮는 경로가 있었다(3차 교차검증 2번).
          if (res && res.committed && res.snapshot && getSyncCode() === code) {
            applyPayload(mergePayloads(syncPayload(), res.snapshot.val()));
            if (fingerprint() !== before) refreshAfterSync();
          }
          return done(true);
        })
        .catch(() => done(false));
    } catch (e) {
      return Promise.resolve(done(false));
    }
  }

  // 코드로 서버에서 받아오기.
  // 🔴 **읽기 실패와 '서버가 빈 것'을 구분해서** 돌려준다(5차 교차검증 3번). 예전엔 둘 다
  //   `null`이어서, 네트워크가 끊긴 상태로 불러오면 "저장된 데이터가 없어요"가 떴다 —
  //   멀쩡한 코드를 틀린 코드로 오해하고 버리게 만드는 문구다.
  //   `{ ok:false }` = 못 읽었다 / `{ ok:true, value:null }` = 읽었는데 비어 있다.
  function pullSyncResult(code) {
    if (!syncRoot || !code) return Promise.resolve({ ok: false });
    return syncRoot.child(code).once('value')
      .then((snap) => ({ ok: true, value: snap.val() }))
      .catch(() => ({ ok: false }));
  }
  // 시작 동기화용 — 여기서는 둘을 구분할 필요가 없다. 못 읽었으면 못 읽은 대로 `null`이고,
  // 그래도 push는 한다(4차 교차검증 ①). 트랜잭션이 서버 최신값을 다시 읽으므로 유실은 없다.
  function pullSync(code) {
    return pullSyncResult(code).then((res) => (res.ok ? res.value : null));
  }

  // 합친 뒤 화면을 다시 그린다 — 세 데이터가 걸린 화면이 여러 곳이라 한꺼번에
  function refreshAfterSync() {
    saveStamps();
    saveFavorites();
    saveLikes();
    try {
      if (typeof renderStamps === 'function') renderStamps();
      // 🔴 열린 스티커 상세도 맞춘다(5차 교차검증 2번) — 목록만 새로 그리면 상세가 옛 매장·날짜·
      //   메모를 그대로 들고 있어 **같은 화면 안에서 두 값이 어긋났다.** 지워진 기록이면 닫는다
      //   (그대로 두면 `수정`을 눌렀을 때 빈 새 기록 화면이 뜬다).
      if (typeof refreshStampView === 'function') refreshStampView();
      if (typeof renderList === 'function') renderList();
      if (typeof renderHomePopular === 'function') renderHomePopular();
    } catch (e) { /* 그리기 실패해도 데이터는 이미 저장됐다 */ }
  }

  // 코드를 만든다(이미 있으면 그대로). 🔴 여기서 올리지 않는다 — 부르는 쪽(schedulePush)이
  //   곧바로 올린다. 여기서도 올리면 저장 한 번에 두 번 보내게 된다.
  function ensureSyncCode() {
    let code = getSyncCode();
    if (code) return code;
    code = makeSyncCode();
    setSyncCode(code);
    return code;
  }

  // 앱을 열 때: 코드가 있으면 서버 것과 한 번 맞춰본다.
  // 🔴 이때도 '합치기'다 — 다른 기기에서 추가된 게 있으면 따라오고, 지운 건 되살아나지 않는다.
  function syncOnStart() {
    const code = getSyncCode();
    if (!syncRoot || !code) return;
    pullSync(code).then((remote) => {
      // 🔴 코드가 바뀌었으면 이 응답은 버린다(4차 교차검증 2번). 코드 A로 시작한 자동
      //    불러오기가 늦게 도착하는 사이 사용자가 코드 B를 불러왔다면, A의 기록이 B에
      //    합쳐지고 그대로 B 서버로 올라간다. pushSync에만 있던 확인을 여기에도 둔다.
      if (getSyncCode() !== code) return;
      if (remote) {
        const before = fingerprint(); // updatedAt 제외 비교(위 fingerprint 주석 참고)
        mergeIntoLocal(remote);
        if (fingerprint() !== before) refreshAfterSync(); // 바뀐 게 있을 때만
      }
      // 🔴 서버가 비어 있어도(remote가 null) **올린다**(4차 교차검증 5번). 예전엔 여기서
      //    그냥 끝나서, 첫 전송이 실패한 사람은 다음 실행에서도 업로드를 안 했다. 추가로
      //    저장하는 일이 없으면 서버 백업이 영영 없고, 그 상태로 폰을 잃으면 코드로도
      //    복구가 안 된다. 이 기능의 목적 자체가 사라지는 자리다.
      pushSync();
    });
  }

  // ── 화면 ──────────────────────────────────────────────────────────────
  const syncOverlay = document.getElementById('syncSheetOverlay');
  const syncCodeText = document.getElementById('syncCodeText');
  const syncInput = document.getElementById('syncInput');
  const syncMsg = document.getElementById('syncMsg');

  function setSyncMsg(text, kind) {
    if (!syncMsg) return;
    syncMsg.textContent = text || '';
    syncMsg.className = 'sync-msg' + (kind ? ' sync-msg--' + kind : '');
    syncMsg.hidden = !text;
  }
  // 🔴 복사·보내기 결과는 **그 버튼 바로 위**(내 코드 칸 아래)에 뜬다. 아래 #syncMsg는
  //    불러오기 전용이다 — 위 버튼을 눌렀는데 저 아래에서 말하면 안 보인다(2026-07-31 사용자 지시).
  const syncCodeMsg = document.getElementById('syncCodeMsg');
  function setCodeMsg(text, kind) {
    if (!syncCodeMsg) return;
    syncCodeMsg.textContent = text || '';
    syncCodeMsg.className = 'sync-msg sync-msg--code' + (kind ? ' sync-msg--' + kind : '');
    syncCodeMsg.hidden = !text;
  }
  // ⚠️ 예전엔 '첫 기록 직후'를 알리는 안내 문단을 띄울지(isIntro) 골랐는데, 그 문단을 없애서
  //    구분이 사라졌다(2026-07-31). 이제 어디서 열든 같은 화면이다.
  // 시트에 뜬 '내 코드'를 지금 코드로 맞춘다.
  // 🔴 한 곳에서만 그린다(2026-07-31 6차 교차검증 1번). 예전엔 **시트를 열 때와 불러오기
  //   성공 직후에만** 글자를 찍어서, 다른 탭이 코드를 바꾸면 **화면엔 옛 코드가 남았다.**
  //   복사·보내기는 `getSyncCode()`를 쓰므로 **보이는 코드와 복사되는 코드가 달랐다** —
  //   복구 코드를 정확히 적어두게 하는 것이 이 화면의 목적이라 그냥 넘길 문제가 아니다.
  function renderSyncCode() {
    const code = getSyncCode();
    // 🔴 박스 안에는 **6자리만** 넣는다 — `HG-`는 박스 밖에 따로 있다(index.html .sync-code-row).
    if (syncCodeText) syncCodeText.textContent = code ? code.replace(/^HG-/, '') : '';
    // 🔴 코드가 없으면 '내 코드' 덩어리를 통째로 숨긴다(2026-07-31 사용자 확정).
    //    예전엔 '아직 없어요'와 함께 복사·보내기 버튼이 남아 있었는데, 눌러도 아무 일이
    //    안 일어나 고장난 것처럼 보였다. 할 일이 '불러오기' 하나뿐인 사람에겐 그것만 보이면 된다.
    const mine = document.getElementById('syncMine');
    if (mine) mine.hidden = !code;
  }
  function openSyncSheet() {
    if (!syncOverlay) return;
    renderSyncCode();
    setSyncMsg('');
    setCodeMsg(''); // 지난번에 뜬 '복사했어요'가 남아 있지 않게
    if (syncInput) syncInput.value = '';
    syncOverlay.classList.add('open');
    syncOverlay.setAttribute('aria-hidden', 'false');
    // 🔴 뒷화면 스크롤을 막는다(2026-08-04 사용자 발견) — 시트를 열고 손가락을 움직이면
    //    뒤의 홈이 그대로 스크롤됐다. 내 메뉴 시트가 쓰는 것과 같은 방법이다.
    //    ⚠️ body 가 아니라 **documentElement** 다 — body 를 스크롤 컨테이너로 만들면 sticky 상단바가 깨진다
    //       (CLAUDE.md 스크롤바 규칙에 적혀 있는 함정).
    document.documentElement.style.overflow = 'hidden';
    // 🔴 열려 있는 동안 상단바 아이콘을 빨갛게(2026-08-04 사용자 확정) — 즐겨찾기·내 메뉴와 같은 규칙.
    //    ⚠️ 어디서 열든(홈 박스로 열어도) 붙인다. 아이콘만 입구가 아니기 때문이다.
    const cb = document.getElementById('topCodeBtn');
    if (cb) cb.classList.add('is-open');
  }
  function closeSyncSheet() {
    document.documentElement.style.overflow = '';   // 열 때 막아 둔 뒷화면 스크롤을 푼다
    const cb = document.getElementById('topCodeBtn');
    if (cb) cb.classList.remove('is-open');
    if (!syncOverlay) return;
    syncOverlay.classList.remove('open');
    syncOverlay.setAttribute('aria-hidden', 'true');
  }

  // 첫 기록을 남기면 코드를 만들고, 스티커 탭에 **띠 안내**를 띄운다.
  // 🔴 팝업으로 한 번 띄우는 방식은 버렸다(2026-07-31) — 스티커 붙는 연출 뒤에 겹쳐 뜨는 데다
  //    한 번 지나가면 다시 못 보고, "코드를 저장해두라"는 말은 놓치면 의미가 없다.
  //    띠는 사용자가 **직접 닫을 때까지 남는다**. 타이밍에 기대지 않아 훨씬 튼튼하다.
  // 🔴 접기는 없앴다(2026-08-04) — 스티커 탭의 띠(.code-notice)를 홈의 박스(.home-code)로 옮기면서,
  //    통째로 누르는 박스에는 접을 자리가 없어졌다. CODE_FOLD_KEY·toggleCodeNotice 도 함께 지웠다.
  //    옛 띠를 되살릴 일이 있으면 커밋 74a6893 을 볼 것.
  // (여기 있던 maybeIntroCode는 지웠다 — 코드 만들기와 띠 갱신을 schedulePush가 맡는다.
  //  스티커에만 걸려 있던 게 즐겨찾기·좋아요를 빠뜨린 원인이었다.)
  function renderCodeNotice() {
    const el = document.getElementById('homeCode');
    if (!el) return;
    // 🔴 기록이 없어도 **항상** 보인다(2026-07-31 사용자 확정: "기록이 없을 때도 띄우자").
    //    기록이 없을 때가 오히려 중요하다 — 새 기기·홈 화면에서 처음 열었을 때가 그 상태이고,
    //    그 사람에게 필요한 건 '내 코드'가 아니라 **불러오기**다. 그래서 문구가 상황에 따라 바뀐다.
    const hasCode = !!getSyncCode();
    // 🔴 제목은 **한 가지로 고정**한다(2026-07-31 사용자 확정).
    //    잠깐 상태에 따라 바꿔봤는데("이 기기에만" ↔ "내 코드에"), 제목이 뒤집히는 게 더 이상했다.
    //    코드가 없는 상태 = 아직 아무것도 저장 안 한 새 방문자뿐인데, 그 사람이 뭐라도 저장하는
    //    순간 코드가 생기면서 "이 기기에만"이 곧바로 거짓이 된다.
    //    「데이터는 내 코드에 저장돼요」는 지금도 앞으로도 맞는 말이라 뒤집힐 일이 없다.
    // 🔴 제목만 상태에 따라 바뀐다(2026-08-04 사용자 확정). 부제는 마크업에 고정으로 둔다.
    //    코드는 **뭔가를 처음 저장할 때 생긴다** — 새로 들어온 사람에게는 볼 코드가 없어서
    //    「내 코드 보기」가 거짓말이 된다. 그 사람에게 필요한 건 「불러오기」다.
    //    ⚠️ 이 박스가 가장 필요한 사람이 바로 그 「코드 없는 사람」이라, 분기를 없애면 안 된다.
    const title = document.getElementById('homeCodeTitle');
    if (title) title.textContent = hasCode ? '내 코드 보기 · 불러오기' : '코드로 불러오기';
  }

  // 🔴 입구는 이 박스 **하나뿐**이다(2026-07-31). 목록 아래 있던 별도 링크는 지웠다 —
  //    시트 안에 '내 코드'와 '불러오기'가 둘 다 있어서 입구가 둘일 이유가 없었다.
  //    안내 문단은 **코드가 있을 때만** 띄운다("기록이 저장됐어요"가 빈 기기에선 거짓말이 된다).
  //    2026-08-04: 옛 띠의 버튼 대신 홈 박스 전체가 입구다.
  const homeCodeBox = document.getElementById('homeCode');
  if (homeCodeBox) homeCodeBox.addEventListener('click', () => openSyncSheet());
  // 상단바 아이콘(홈 전용, 공유 왼쪽) — 같은 시트를 연다. 홈 박스와 입구가 둘이지만 역할이 다르다:
  // 아이콘은 「상시 손 닿는 곳」, 박스는 「무엇인지 설명이 있는 곳」.
  // 🔴 다시 누르면 닫힌다(2026-08-04 사용자 지시) — 메뉴 탭의 냄비 버튼과 같은 규칙이다.
  //    아이콘이 제자리에 그대로 보이는데 다시 눌러도 안 닫히면 갇힌 느낌이 든다.
  const topCodeBtn = document.getElementById('topCodeBtn');
  if (topCodeBtn) topCodeBtn.addEventListener('click', () => {
    if (syncOverlay && syncOverlay.classList.contains('open')) closeSyncSheet();
    else openSyncSheet();
  });
  renderCodeNotice(); // 새로 열었을 때도 아직 안 닫았으면 계속 보이게
  const syncCloseBtn = document.getElementById('syncSheetClose');
  if (syncCloseBtn) syncCloseBtn.addEventListener('click', closeSyncSheet);
  if (syncOverlay) {
    syncOverlay.addEventListener('click', (e) => { if (e.target === syncOverlay) closeSyncSheet(); });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && syncOverlay && syncOverlay.classList.contains('open')) closeSyncSheet();
  });

  const syncCopyBtn = document.getElementById('syncCopyBtn');
  if (syncCopyBtn) syncCopyBtn.addEventListener('click', async () => {
    const code = getSyncCode();
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCodeMsg('코드를 복사했어요', 'ok');
    } catch (e) {
      setCodeMsg('복사가 안 됐어요. 코드를 직접 적어두세요', 'bad');
    }
  });

  const syncShareBtn = document.getElementById('syncShareBtn');
  if (syncShareBtn) syncShareBtn.addEventListener('click', async () => {
    const code = getSyncCode();
    if (!code) return;
    /* 🔴 이 글은 **카톡이나 메모에 남아 몇 달 뒤에 읽힌다** — 그때는 앱 화면이 옆에 없다.
       그래서 네 가지가 다 들어간다(2026-08-05 사용자 확정):
         ① 무슨 앱인지(「하딜고고」 = 나중에 검색해 찾는 말) ② 코드 ③ 무엇에 쓰는지 ④ 남에게 주지 말 것
       ③④ 는 앱의 「내 코드」 절 문구를 **그대로** 가져왔다 — 앱과 메시지가 다른 말을 하면 안 된다.
       🔴 순서도 그 절과 같다: 불러올 수 있다 → 공유하지 마라 → 무엇이 들어 있나(2026-08-05 사용자 확정).
          경고를 목록 뒤로 미루면 목록을 읽다 끝나서 경고를 안 읽고 넘어간다.
       ⚠️ 「내 코드」 절 문구를 고치면 여기도 같이 고칠 것(index.html 의 .sync-note--strong).
       🔴 ④를 빼지 말 것 — 「나에게 보내기」를 누르면 공유창에 **친구 목록이 먼저 뜬다.** 잘못 눌러
          남에게 갈 수 있는 자리이고, 메모에 남은 글은 나중에 그대로 전달되기도 한다.
       ⚠️ 문구를 길게 써도 된다 — 붙여넣기는 extractCode 가 `HG-` 뒤 6자만 뽑아낸다(확인함).
       🔴 주소는 **글 안에 넣는다 — `url:` 로 따로 넘기지 말 것**(2026-08-05 사용자 요청으로 추가).
          `url` 은 받는 앱에 따라 **주소만 가져가고 본문을 버린다.** 그러면 코드가 통째로 사라진다.
          글 안에 있으면 카톡이 알아서 링크로 만들어 준다. 주소가 코드 인식을 방해하지도 않는다
          (`haidilgogo.com` 에는 `HG` 다음에 여섯 글자가 오는 자리가 없다 — 확인함).
       🔴 **주소는 둘째 줄이다 — 맨 위로 올리지 말 것**(2026-08-05 사용자 확정).
          **첫 줄이 카톡 목록·검색 결과에 보이는 줄**이라, 주소를 맨 위에 두면 몇 달 뒤 「하딜고고」로
          검색했을 때 결과에 주소만 보이고 코드는 열어야 알 수 있다. 첫 줄은 코드 몫이다.
          위 두 줄이 「무엇」과 「어디」다 — 급할 땐 그 둘만 보면 되고 아래 셋은 설명이다. */
    const text = '하딜고고 내 코드 ' + code + '\n'
      + 'https://haidilgogo.com\n'
      + '이 코드가 있으면 어디서든 데이터를 불러올 수 있어요.\n'
      + '코드를 아는 사람은 내 데이터를 볼 수 있으니 절대 공유하지 마세요.\n'
      + '데이터에는 내 메뉴, 스티커, 즐겨찾기, 좋아요가 포함되어 있어요.';
    /* 🔴 **본문(text)만 넘긴다 — 제목(title)을 같이 넘기지 말 것**(2026-08-05).
       제목을 같이 넘겼더니 카톡에 온 글 **맨 아래에 빈 줄이 하나 생겼다**(사용자가 화면으로 발견).
       우리 글에는 마지막 줄바꿈이 없다(확인함) — 아이폰이 제목과 본문을 **따로** 넘기고,
       받는 앱이 그 둘을 이어 붙이면서 생긴 자리다. 카톡은 제목을 화면에 쓰지도 않으므로 뺀다.
       ⚠️ 제목을 되살릴 일이 있으면 실기기 카톡으로 **다시 보내 보고** 빈 줄이 없는지 확인할 것 —
          공유창은 폰 것이라 맥에서는 재현이 안 된다. */
    if (navigator.share) {
      try { await navigator.share({ text: text }); return; } catch (e) { return; }
    }
    try {
      await navigator.clipboard.writeText(text);
      setCodeMsg('코드를 복사했어요. 메모나 카톡에 붙여넣어 두세요', 'ok');
    } catch (e) {
      setCodeMsg('코드를 직접 적어두세요', 'bad');
    }
  });

  // 🔴 입력칸은 6자리만 받는다(`HG-`는 칸 안에 글자로 박혀 있다). 그래도 전체 코드를
  //    붙여넣는 사람이 반드시 있으므로, 입력될 때마다 다듬어준다 —
  //    대문자로 올리고, 글자·숫자만 남기고, 앞의 HG는 **8자리로 붙여넣었을 때만** 떼어낸다
  //    (본체가 HG로 시작할 수 있어서다. normalizeCode 주석 참고).
  // 붙여넣은 글에서 코드만 뽑아낸다. 🔴 문장째 붙여넣는 경우를 반드시 받아야 한다 —
  //    '내게 보내기'가 만드는 문구가 「하딜고고 내 데이터 코드: HG-PAGZZ2」라서,
  //    카톡에서 그 줄을 통째로 복사해 오는 게 오히려 자연스럽다.
  // 🔴 **조용히 자르지 않는다**(2026-07-31 2차 교차검증). 예전엔 앞 6자만 남겨서,
  //    `HG-TESTA2X`처럼 한 글자 더 붙은 걸 붙여넣으면 `TESTA2`가 되어 **멀쩡한 코드처럼
  //    보인 뒤** "저장된 데이터가 없어요"로 나왔다. 잘못 붙여넣은 건 잘못돼 보여야 한다.
  //    문장 속에서 뽑는 경우는 코드 뒤에 다른 글자가 안 붙어 있을 때만(뒤 (?![A-Z0-9])).
  function extractCode(raw) {
    const up = String(raw || '').toUpperCase();
    const m = up.match(/HG[-\s]?([A-Z0-9]{6})(?![A-Z0-9])/);
    if (m) return m[1];
    return up.replace(/[^A-Z0-9]/g, '').slice(0, 20); // 6자가 아니면 normalizeCode가 거른다
  }
  if (syncInput) {
    syncInput.addEventListener('input', () => {
      const s = extractCode(syncInput.value);
      if (s !== syncInput.value) syncInput.value = s;
      setSyncMsg(''); // 다시 치기 시작하면 옛 오류 문구는 지운다
    });
  }

  const syncLoadBtn = document.getElementById('syncLoadBtn');
  if (syncLoadBtn) syncLoadBtn.addEventListener('click', () => {
    const code = normalizeCode(syncInput && syncInput.value);
    // 🔴 'HG-'를 언급하지 않는다 — 이제 박스 밖 고정 글자라 사용자는 6자리만 친다(2026-07-31).
    if (!code) {
      // 덜 쳤을 때와 잘못 붙여넣었을 때는 할 말이 다르다.
      const typed = (syncInput && syncInput.value || '').length;
      setSyncMsg(typed < 6 ? '코드 6글자를 모두 입력해 주세요' : '코드를 다시 확인해 주세요', 'bad');
      return;
    }
    // 🔴 자기 코드를 넣어도 **막지 않는다**(2026-07-31 사용자 시나리오로 발견).
    //    폰을 잃어버려 임시폰에서 쓰다가 원래 폰을 되찾은 경우, 원래 폰에서 자기 코드를 넣어보는 게
    //    자연스러운 행동이다. 앱을 열 때 이미 자동으로 맞춰지지만 사용자는 그걸 모르니 눌러본다.
    //    예전엔 "지금 쓰고 있는 코드예요"라고 빨갛게 거부해서 고장난 것처럼 보였다.
    //    그냥 한 번 더 맞춰주면 될 일이다 — 합치기라서 여러 번 해도 해롭지 않다.
    if (!syncRoot) { setSyncMsg('연결이 안 돼요. 잠시 뒤 다시 해주세요', 'bad'); return; }
    setSyncMsg('불러오는 중…');
    syncLoadBtn.disabled = true;
    pullSyncResult(code).then((res) => {
      syncLoadBtn.disabled = false;
      // 🔴 못 읽은 것과 빈 것을 다르게 말한다(5차 교차검증 3번). 문구는 위 연결 실패와 같은 것을
      //   쓴다 — 사용자에게는 둘 다 "지금은 안 되니 잠시 뒤에"로 같은 상황이다.
      if (!res.ok) { setSyncMsg('연결이 안 돼요. 잠시 뒤 다시 해주세요', 'bad'); return; }
      const remote = res.value;
      if (!remote) { setSyncMsg('입력하신 코드로 저장된 데이터가 없어요', 'bad'); return; }
      mergeIntoLocal(remote);
      // 🔴 불러온 코드를 이 기기의 코드로 삼는다 — 그래야 이후 저장이 같은 곳에 쌓인다.
      setSyncCode(code);
      refreshAfterSync();
      pushSync(); // 합친 결과를 서버에도 올려 양쪽을 같게 만든다
      // 박스 안에는 6자리만(밖에 `HG-`가 따로 있다) + 코드가 없던 기기는 '내 코드' 덩어리도
      // 열어준다 — 둘 다 renderSyncCode 한 곳에서 한다(위 주석 참고). `setSyncCode`가 이미
      // 위에서 불렸으므로 여기서 읽는 코드는 방금 불러온 그 코드다.
      renderSyncCode();
      // 🔴 개수를 세지 않는다(2026-07-31 사용자 확정: "그냥 데이터를 불러왔어요").
      //    예전엔 '기록 N개를 가져왔어요 (합계 N곳)'이었는데 두 가지가 틀렸다 —
      //    ① '곳'은 위쪽 「다녀온 매장 N곳」이 매장 종류를 세는 것과 단위가 겹치는데 여기선
      //       기록 개수를 세서 같은 단어로 다른 숫자가 나왔다.
      //    ② 스티커만 세어서, 즐겨찾기만 든 코드를 불러오면 '이미 다 있다'는 거짓말을 했다.
      //    개수는 화면(스티커 목록·하트·북마크)이 이미 보여준다. 문장은 짧을수록 안 틀린다.
      setSyncMsg('데이터를 불러왔어요', 'ok');
    });
  });

  syncOnStart();
})();

/* ══════════════════════════════════════════════════════════════════════════
   ── 메뉴 탭 ──  목업(_mockup-menu.html)에서 옮겨온 것이다(그 목업은 앱에 다 옮긴 뒤 지웠다 —
   커밋 이력에 있다). 앱의 다른 코드와 섞이지 않게
   따로 감쌌다 — 이 안의 render/count 는 위쪽의 같은 이름과 아무 상관이 없다.
   데이터는 menu-data.js(`node .claude/make_menu_data.mjs`가 메뉴.md 에서 만든다).
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  const D = window.MENU_DATA;
  if (!D || !document.getElementById('mnTabs')) return; // 데이터·화면이 없으면 조용히 빠진다

  // 🔴 화면 분류는 공식 2단이다(메뉴.md 「화면 분류」). 상위 = 전골·육류·야채류·디저트.
  //    D.tabs 의 7개 묶음은 자료 정리용이라 화면에 쓰지 않는다 — items 만 꺼내 쓴다.
  const ALL = D.tabs.flatMap((t) => t.items);
  // 🔴 탭은 성격이 다른 셋이 한 줄에 있다(2026-08-04 사용자 확정):
  //    전골(냄비 고르기) │ 전체메뉴(130개 훑기) · 상위 분류 7개.
  //    전골과 나머지 사이에만 세로 구분선을 넣는다 — 전골만 「목록」이 아니라서다(renderTabs 참고).
  const TABS = [{ name: '전골', pot: true }, { name: '전체메뉴', all: true }].concat(
    D.cats.map((g) => ({ name: g.up, subs: g.subs }))
  );
  const 분류탭 = () => TABS.filter((t) => t.subs);   // 전골·전체메뉴를 뺀 상위 7개
  const 하위메뉴 = (up, sub) => ALL.filter((it) => it.up === up && it.sub === sub);
  // 상위 하나에 딸린 항목 전부. 🔴 순서는 하위 분류가 정한다 — 하위는 화면에 안 나오지만
  //    「소양돈고기 다음 닭고기」 같은 줄 세우기는 그대로 살아 있다(2026-08-03 확정 참고).
  const 상위메뉴 = (t) => t.subs.flatMap((sub) => 하위메뉴(t.name, sub));
  const IMG = (n) => 'assets/menu/' + n + '.webp';
  // 🔴 담긴 표시 ✓ 는 SVG 다(2026-08-04 사용자 확정). 옛 글자 `✓`(U+2713)는 폰트가 그려주는 것이라
  //    굵기·모양이 앱의 다른 아이콘(전부 SVG, 「18px 통일」 규격)과 따로 놀았다.
  //    18px + stroke 2.2 = 화면에서 획 약 1.65px — 상단바 아이콘들과 같은 굵기다.
  const 체크아이콘 =
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"' +
    ' stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M5 12.5l4.5 4.5L19 7"/></svg>';
  // 냄비 칸은 타일(-타일)을 쓴다. 아직 안 들어온 육수는 카드용 그림을 임시로 쓴다(냄비 속 냄비로 보인다)
  const TILE = new Set(D.broths.filter((b) => b.tile).map((b) => b.n));
  const CELL_IMG = (n) => IMG(TILE.has(n) ? n + '-타일' : n);
  // 🔴 냄비 칸 그림(`-타일`)은 **카드 그림과 다른 파일**이라, 담는 순간에야 처음 받는다.
  //    그래서 첫 담기가 살짝 늦어 보였다(2026-08-04 사용자 지적 — 실제로 확인:
  //    전골 화면에 들어가면 카드용 12장만 받고 타일은 0장이었다).
  //    🔴 **하나를 담고 나서** 나머지를 뒤에서 받아 둔다(B안, 사용자 확정). 전골 탭에 들어가자마자
  //    12장(584KB)을 다 받으면 냄비를 안 쓰는 사람까지 치르게 된다 — 첫 한 번만 겪게 하는 쪽으로 정했다.
  let 타일미리받음 = false;
  function 타일미리받기() {
    if (타일미리받음) return;
    타일미리받음 = true;
    D.broths.forEach((b) => { const im = new Image(); im.src = CELL_IMG(b.n); });
  }

  let cur = 0;                    // 지금 탭
  let cells = 2;                  // 냄비 칸 수(1·2·4)
  let broths = [];                // 고른 육수(칸 수만큼, 중복 허용)
  let query = '';                 // 검색어 (아래 「검색」 절)
  const picked = new Map();       // 담은 메뉴

  const $ = (s) => document.querySelector(s);
  const sheetOverlay = $('#mnSheetOverlay');

  /* ── 내 메뉴 저장 ──────────────────────────────────────────────────────────
     🔴 이 기기에만 저장한다(2026-08-04 사용자 확정). 켰다 꺼도 남아야 화면의
        「여기에 담아두고 매장에서 편하게 주문해보세요」가 참이 된다 — 그 전엔 새로고침하면 사라졌다.
     🔴 기기 간 동기화(내 코드에 담기)는 **아직 아니다** — 계획서 5단계에 남아 있다.
     🔴 되살릴 때 **지금 있는 메뉴만** 되살린다. 메뉴가 바뀌어 이름이 없어졌는데 그대로 넣으면
        담긴 표시는 있는데 목록엔 없는 유령이 된다(칸 수도 1·2·4 가 아니면 버린다).
     키 이름은 앱의 다른 것과 같은 꼴이다(haidilao_favorites · haidilao_stamps).
     ────────────────────────────────────────────────────────────────────────── */
  const MENU_KEY = 'haidilao_menu_picked';
  // 🔴 되살리는 동안에는 저장하지 않는다(2026-08-04). refreshCards·refreshPot 이 끝에서 saveMenu 를
  //    부르는데, 불러오기로 받은 값을 그리는 중에 그게 돌면 두 가지가 한꺼번에 잘못된다:
  //      ① at 이 지금 시각으로 덮여 **방금 받아온 것이 「더 새것」으로 둔갑**한다
  //      ② schedulePush 가 다시 돌아 올리기 → 받기 → 그리기로 되돌아 나간다
  let 되살리는중 = false;
  function saveMenu() {
    if (되살리는중) return;
    try {
      // 🔴 at = 마지막으로 손댄 시각. 내 코드로 기기 간에 옮길 때 **어느 쪽이 최신인지** 가리는 데 쓴다.
      //    스티커·즐겨찾기는 켠/끈 이력을 합치지만, 담은 목록은 「지금 이 한 벌」이라
      //    합치면 냄비 칸 수와 육수가 뒤엉킨다 — 그래서 통째로 최신 것이 이긴다.
      localStorage.setItem(MENU_KEY, JSON.stringify({ picked: [...picked.keys()], broths, cells, at: Date.now() }));
    } catch (err) {
      // 시크릿 모드 등 저장이 막힌 경우는 무시한다(즐겨찾기와 같은 방식)
    }
    if (window.schedulePush) window.schedulePush(); // 담은 목록도 내 코드에 실린다
  }
  // 다른 기기에서 온 담은 목록을 반영할 때 쓴다(내 코드 불러오기) — 저장값을 다시 읽어 화면까지 새로 그린다.
  window.mnReloadPicked = function () {
    되살리는중 = true;
    try {
      picked.clear(); broths = []; cells = 2;   // 2 = 이 파일 위쪽 `let cells = 2` 와 같은 기본값
      loadMenu();
      refreshCards(); refreshPot();
    } finally {
      되살리는중 = false;
    }
  };
  function loadMenu() {
    let saved;
    try { saved = JSON.parse(localStorage.getItem(MENU_KEY)); } catch (err) { return; }
    if (!saved || typeof saved !== 'object') return;
    const 있는메뉴 = new Set(ALL.map((it) => it.n));
    const 있는육수 = new Set(D.broths.map((b) => b.n));
    if (POTS.includes(saved.cells)) cells = saved.cells;
    if (Array.isArray(saved.broths)) broths = saved.broths.filter((n) => 있는육수.has(n)).slice(0, cells);
    if (Array.isArray(saved.picked)) saved.picked.forEach((n) => { if (있는메뉴.has(n)) picked.set(n, 1); });
    // 되살린 육수가 있으면 냄비 칸 그림도 곧 필요하다 — 미리 받아 둔다(위 타일미리받기 참고)
    if (broths.length) 타일미리받기();
  }

  function count() { return picked.size + (broths.length ? 1 : 0); }

  // 상위 탭 하나의 항목 수. 🔴 화면에 실제로 뜨는 것만 센다 — 하위 분류(subs)에 안 걸린 항목은
  //    화면에 나오지 않으므로 데이터 총계가 아니라 하위 분류를 훑어 더한다.
  //    하위 분류를 눌러도 숫자는 안 바뀐다(상위 카테고리 개수다).
  const 탭개수 = (t) => t.pot ? D.broths.length
    : t.all ? 분류탭().reduce((a, x) => a + 상위메뉴(x).length, 0)
    : 상위메뉴(t).length;

  function renderHead() {
    // 검색 중에는 분류가 아니라 「검색 결과 N개」다 — 레시피 탭의 목록 제목과 같은 문구를 쓴다
    if (검색중()) {
      $('#mnCountLabel').textContent = '검색 결과';
      $('#mnCountNum').textContent = 검색결과().reduce((a, g) => a + g.items.length, 0);
      return;
    }
    const t = TABS[cur];
    $('#mnCountLabel').textContent = t.name;
    $('#mnCountNum').textContent = 탭개수(t);
  }

  // 🔴 서식은 레시피 카테고리 탭과 똑같이 쓴다(.tabs/.tab-btn/.tabs-underline, 2026-08-03 사용자 확정).
  //    밑줄이 미끄러지는 것까지 매장 지역 탭(updateStoreUnderline)과 같은 방식이다.
  function updateMenuUnderline() {
    const wrap = $('#mnTabs');
    if (!wrap) return;
    const line = wrap.querySelector('.tabs-underline');
    if (!line) return;
    // 🔴 전골은 탭줄 **밖**(#mnPotTab)에 있다 — 그래서 고른 탭을 두 곳에서 찾아야 한다.
    //    전골이 골라져 있으면 공용 밑줄은 숨기고 자기 밑줄(CSS .tab-btn.is-pot.active::before)에 맡긴다.
    //    공용 밑줄은 탭줄 안 요소라 밖으로 못 나간다.
    const pot = $('#mnPotTab .tab-btn.active');
    if (pot) { line.hidden = true; return; }
    line.hidden = false;
    const active = wrap.querySelector('.tab-btn.active');
    // 메뉴 섹션이 숨겨져 있으면 offsetWidth=0 → 위치를 못 잡는다. 보일 때 다시 불린다(switchSection)
    if (active && active.offsetWidth) {
      line.style.width = active.offsetWidth + 'px';
      line.style.transform = 'translateX(' + active.offsetLeft + 'px)';
      if (window.keepTabVisible) window.keepTabVisible(active);
    }
  }
  window.mnSyncUnderline = updateMenuUnderline;   // 섹션 전환 때 switchSection 이 부른다
  /* 🔴 밖에서 특정 분류로 열어 주는 통로(2026-08-05) — 홈의 「전골」 섹션이 쓴다.
     탭 누름 처리와 **같은 일**을 한다(cur 바꾸고 검색 끄고 다시 그리기). 한 곳에 몰아넣지 않고
     따로 둔 이유는, 탭 누름 쪽에는 「같은 탭이면 아무 일도 안 한다」가 있어서다 — 밖에서 부를 땐
     이미 그 탭이어도 목록을 맨 위로 올려 줘야 「눌렀더니 왔다」가 된다.
     ⚠️ 분류 순서(TABS)가 바뀌면 부르는 쪽 번호도 같이 봐야 한다. 그래서 번호가 아니라 **이름**으로 받는다. */
  window.mnGoTab = function (이름) {
    const i = TABS.findIndex((t) => t.name === 이름);
    if (i < 0) return false;
    cur = i;
    clearSearch();
    render(true);
    return true;
  };
  /* 🔴 밖에서 **검색된 상태로** 열어 주는 통로(2026-08-05) — 고수 아티클의 「고수가 들어간 메뉴」가 쓴다.
     ⚠️ **육수(전골)는 검색으로 안 걸린다** — 검색은 상위 7개 분류만 훑는다(검색결과() 참고).
        그래서 부르는 쪽이 육수면 이걸 쓰지 말고 `mnGoTab('전골')` 로 보내야 한다.
     검색을 켜면 「전체메뉴」 탭으로 옮긴다 — 사람이 직접 칠 때와 같은 규칙이다(그쪽 주석 참고). */
  window.mnSearch = function (말) {
    const s = String(말 || '').trim();
    if (!s) return false;
    query = s;
    if (searchInput) searchInput.value = s;
    if (searchBox) searchBox.classList.add('has-value');
    if (전체메뉴자리 >= 0) cur = 전체메뉴자리;
    render(true);
    return true;
  };
  if (window.enableDragScroll) window.enableDragScroll($('#mnTabs'));   // 데스크탑에서 손으로 끌기(2026-08-04)

  function renderTabs() {
    // 🔴 탭에 숫자를 넣지 않는다 — 고른 카드에 이미 ✓가 있어 같은 정보가 두 번 나온다
    // 🔴 밑줄(.tabs-underline)은 지우지 않는다 — 버튼만 갈아 끼운다(레시피 renderBrowseCatTabs 와 같은 방식).
    //    통째로 새로 그리면 밑줄이 옛 위치를 잃어 0 에서 다시 미끄러진다.
    const wrap = $('#mnTabs');
    const pin = $('#mnPotTab');
    wrap.querySelectorAll('.tab-btn').forEach((b) => b.remove());
    pin.replaceChildren();
    TABS.forEach((t, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tab-btn' + (t.pot ? ' is-pot' : '') + (i === cur ? ' active' : '');
      btn.dataset.i = i;
      btn.textContent = t.name;
      // 🔴 전골만 **스크롤 영역 밖**(#mnPotTab)에 담는다(2026-08-05 사용자 확정) — 탭줄 안에
      //    position:sticky 로 붙여 뒀더니 왼쪽 끝에서 튕길 때 같이 딸려갔다. 자세한 경위는 styles.css
      //    `.tab-btn.is-pot` 주석. 구분선·전용 밑줄도 거기서 맡는다(따로 있던 `.mn-tab-div` 는 없앴다).
      (t.pot ? pin : wrap).appendChild(btn);
    });
    updateMenuUnderline();
  }

  const POTS = [1, 2, 4];
  // 「1 맛 / 2가지 맛」 → 「1칸 / 2칸 / 4칸」(2026-08-02) → 「한 칸 / 두 칸 / 네 칸」(2026-08-04 사용자 확정).
  // 🔴 한글로 쓰는 이유는 **숫자가 두 뜻으로 섞여서**다 — 「2칸」의 2는 개수인데, 바로 아래 냄비 안
  //    배지와 고른 육수 목록의 1·2·3·4 는 순번이다. 한국어는 개수(두 칸)와 순번(2번)을 다르게 말한다.
  // 🔴 띄어쓴다(「한 칸」) — 단위 명사는 띄어 쓰는 게 어법이고, 이 프로젝트에 이미 같은 규칙이 있다
  //    (CLAUDE.md 「관형형+명사는 어법대로 띄어 씀」 — 다진 마늘·다진 파).
  const POT_LABEL = { 1: '한 칸', 2: '두 칸', 4: '네 칸' };
  const potLabel = (n) => POT_LABEL[n] || n + ' 칸';
  // 🔴 「더는 못 담는다」를 말하는 곳이 둘이다 — 확대 모달의 잠긴 버튼과 카드 누름 토스트.
  //    한 곳에 적어 두 곳이 저절로 같은 말을 하게 한다(2026-08-04 사용자 확정).
  //    「찼어요」만 쓰면 「(물이) 찼어요」로도 읽혀서 「가득」을 넣었다.
  const 냄비참 = '냄비가 가득 찼어요';

  // 🔴 냄비 영역과 육수 목록을 따로 그린다(2026-08-04) — 육수를 담을 때마다 통째로 다시 그렸더니
  //    아래 육수 카드 12장의 <img> 가 매번 새로 만들어져 그림이 깜빡였다. 바뀌는 것은 냄비뿐이다.
  function renderPotTop() {
    return `
      <div class="mn-pot-seg">
        ${POTS.map((n) => `<button data-pot="${n}" class="${n === cells ? 'is-on' : ''}">${potLabel(n)}</button>`).join('')}
      </div>

      <div class="mn-pot-wrap">
        <div class="mn-pot">
          <div class="mn-pot-inner" data-cells="${cells}">
            ${Array.from({ length: cells }, (_, i) => {
              const b = broths[i];
              return b
                ? `<div class="mn-cell is-filled" data-cell="${i}"><img src="${CELL_IMG(b)}" alt=""></div>`
                : `<div class="mn-cell"></div>`;
            }).join('')}
            ${cells > 1 ? `<div class="mn-pot-nums" data-cells="${cells}">
              ${Array.from({ length: cells }, (_, i) => `<span class="mn-pot-num">${i + 1}</span>`).join('')}
            </div>` : ''}
          </div>
        </div>
        <div class="mn-pot-list ${cells === 1 ? 'is-one' : ''}">${renderPotRows()}</div>
      </div>`;
  }
  // 고른 육수 목록의 줄들 — 그림이 없어서 통째로 다시 써도 깜빡이지 않는다(아래 refreshPot 참고)
  function renderPotRows() {
    return Array.from({ length: cells }, (_, i) => {
      const b = broths[i];
      return `<div class="mn-pot-row ${b ? '' : 'is-empty'}"><b>${i + 1}</b><span>${b || '비어 있음'}</span>` +
             (b ? `<button class="mn-pot-row-x" data-cell="${i}" aria-label="빼기">✕</button>` : '') + `</div>`;
    }).join('');
  }
  // 🔴 육수 카드에 「몇 번 칸에 담겼는지」를 붙인다(2026-08-04 사용자 제안).
  //    체크(✓)를 안 쓰는 이유가 「이미 골라서 또 못 담는다」로 읽혀서였는데(2026-08-02),
  //    번호는 **여러 개가 붙을 수 있어** 중복해 담는 이 화면의 동작을 그대로 보여준다.
  //    규격은 냄비 옆 목록의 번호(.mn-pot-row b)와 같은 것을 쓴다 — 값을 새로 정하지 않았다.
  function 칸번호HTML(n) {
    const 칸 = [];
    broths.forEach((x, i) => { if (x === n) 칸.push(i + 1); });
    return 칸.map((i) => `<span class="mn-card-num">${i}</span>`).join('');
  }
  // 번호가 셋 이상이면 두 줄로 접는다(아래 CSS) — 그래야 이름 자리를 안 뺏는다
  function 칸번호칸수(n) {
    return broths.filter((x) => x === n).length;
  }
  /* 🔴 「제주 한정」 줄 — **메뉴 카드와 육수 카드가 이 한 곳을 같이 쓴다**(2026-08-04 사용자 확정).
     예전엔 육수만 아이콘 없는 맨 글자였다. 같은 뜻인데 화면마다 달라 보였다.
     자리·크기·색을 왜 이렇게 정했는지는 카드HTML() 위 주석에 있다. */
  const 제주한정 = '제주 한정';
  function 제주줄(부제) {
    return `<span class="mn-card-sub mn-card-sub--jeju">` +
           `<img src="assets/icons/hallabong.svg" alt="">${제주한정}${부제 ? ` · ${부제}` : ''}</span>`;
  }

  // 육수를 담고 뺄 때 카드의 번호만 갈아 끼운다 — 카드를 다시 그리면 그림이 깜빡인다
  function refreshBrothNums() {
    document.querySelectorAll('#mnBody .mn-card--broth').forEach((el) => {
      const box = el.querySelector('.mn-card-nums');
      if (!box) return;
      box.innerHTML = 칸번호HTML(el.dataset.broth);
      box.dataset.n = 칸번호칸수(el.dataset.broth);
    });
  }

  function renderPot() {
    return `<div id="mnPotTop">${renderPotTop()}</div>
      <div class="mn-list">
        ${D.broths.map((b) => {
          // 🔴 체크(✓)는 여전히 안 붙인다(2026-08-02 사용자 지시) —
          //    「이미 골랐으니 또 못 담는다」로 읽히기 때문이다. 중복해서 담을 수 있는 화면이다.
          //    대신 **몇 번 칸에 담겼는지 번호**를 붙인다(2026-08-04 사용자 제안).
          //    번호는 여러 개가 붙을 수 있어 중복 담기를 그대로 보여준다 — 체크로는 못 하던 것이다.
          // 🔴 썸네일은 **냄비째 그린 카드용**이다 — 타일(국물만)로 바꿔봤더니 「냄비를 고르는
          //    화면」이라는 게 안 읽혔다. 타일은 냄비 칸 안에서만 쓴다.
          return `<button class="mn-card mn-card--broth ${b.img ? '' : 'mn-card--text'}" data-broth="${b.n}">
            <div class="mn-card-thumb ${b.img ? '' : 'is-text'}">${
              b.img ? `<img src="${IMG(b.n)}" alt="">` : b.n}</div>
            <span class="mn-card-body">
              <span class="mn-card-name">${b.n}</span>
              ${b.jeju ? 제주줄() : ''}
            </span>
            <span class="mn-card-nums" data-n="${칸번호칸수(b.n)}">${칸번호HTML(b.n)}</span>
          </button>`;
        }).join('')}
      </div>`;
  }

  // 🔴 이름 규칙(2026-08-02 사용자 확정) — 화면에서만 나눈다. 데이터(메뉴.md)는 공식 이름 그대로 둔다.
  //    ① 끝 괄호는 부제로 내린다        차돌박이(지방 적음) → 차돌박이 / 지방 적음
  //    ② 앞의 「하이디라오」도 부제로     하이디라오 특제소고기 → 특제소고기 / 하이디라오
  //    이렇게 해야 320px 에서 이름이 안 잘린다(그림 80px 기준으로 재서 정함).
  function 이름나누기(n) {
    let 이름 = n, 부제 = '';
    const m = /^(.*?)\((.+)\)$/.exec(n);
    if (m) { 이름 = m[1].trim(); 부제 = m[2]; }
    if (/^하이디라오\s+/.test(이름)) {
      부제 = '하이디라오' + (부제 ? ' · ' + 부제 : '');
      이름 = 이름.replace(/^하이디라오\s+/, '');
    }
    return { 이름, 부제 };
  }

  function toggle(n) { picked.has(n) ? picked.delete(n) : picked.set(n, 1); }

  /* ── 그림 확대 모달은 없앴다 (2026-08-04 사용자 확정) ───────────────────────────
     🔴 되살리지 말 것. 이유 셋이 전부 같은 방향이었다.
     ① **담으려고 그림을 눌렀는데 창이 떴다.** 카드에서 가장 눈에 띄는 자리(그림, 카드 폭의
        24% · 320px 에선 29%)만 다른 일을 했다. 레시피 카드는 「다른 일」이 구석의 작은
        아이콘 둘(즐겨찾기 5.5% · 좋아요 6.3%)뿐이라 안 헷갈리는 것과 대비된다.
        담기는 이 탭에서 수십 번 하는 동작이고 확대는 어쩌다 한 번이다.
     ② 🔴 **저작권** — 메뉴 일러스트는 하이디라오 사전주문 페이지 사진을 보고 생성한 것이라
        크게 보여주지 않는 편이 하딜고고에 유리하다(CLAUDE.md 「공식 사진·로고는 못 쓴다」).
     ③ 모달 생김새가 마음에 안 든다는 이야기도 있었다 — 고치는 대신 없애는 쪽으로 갔다.
     이제 카드는 **어디를 눌러도 담기** 하나다. 「냄비가 가득 찼어요」는 토스트가 맡는다.
     ⚠️ 80px 썸네일이 130장을 보여주는 유일한 자리가 됐다 — 그래서 그릇 그림자를 넣었다
        (styles.css `.mn-card-thumb img`).
     ────────────────────────────────────────────────────────────────────────── */

  // 🔴 하위 분류를 화면에서 걷어냈다(2026-08-03 사용자 확정) — 상위 하나를 누르면 그 안의 것이 전부 나온다.
  //    하위 줄 하나 때문에 붙박이·구분선·방향 감지까지 세 겹을 쌓게 돼서 접었다.
  //    데이터의 하위 분류는 그대로 살아 있고(정렬 순서를 그게 정한다), 화면에만 안 나온다.
  // 🔴 이름에 Menu 를 붙인다 — 레시피 탭에도 `renderList()` 가 따로 있다(script.js 위쪽 IIFE).
  //    별개 IIFE 라 충돌은 안 나지만, 같은 이름이 둘이면 찾을 때 헷갈린다(2026-08-04 정리).
  function 카드HTML(it) {
    const on = picked.has(it.n);
    const { 이름, 부제 } = 이름나누기(it.n);
    /* 🔴 「일부 매장」 꼬리표를 뗐다(2026-08-04 사용자 확정). 되살리지 말 것.
       판정이 「13곳이 아니면 일부 매장」이라 **한 시점의 조회값**일 뿐인데, 화면에서는
       「이 매장에서만 판다」는 단정으로 읽혔다. 실제로는 실시간 판매 상태(품절 등)가 섞인다.
       근거 — 2026-08-04 재조사에서 이틀 만에 이만큼 움직였다:
         공심채 9곳 → 3곳 · 비타민채 6곳 → 5곳 · 소부채살 2곳 → 3곳 · 우아롱사태 1곳 → 2곳
         (그전에도 차돌박이가 하루 만에 1곳 → 13곳, 부천점 응답이 146 → 140 → 143)
       대신 내 메뉴 안내와 메뉴 탭 푸터가 「매장 사정에 따라 판매하지 않는 메뉴가 있을 수
       있어요」로 **한 번만, 맞는 말로** 알린다. 47개에 개별 딱지를 붙이는 것보다 정직하다.
       ⚠️ 「제주 한정」은 남긴다 — 그건 조회값이 아니라 진짜 지역 한정이고, 공식 분류에
          「제주한정」이 실제로 있다(제주도점에만). 메뉴 6개 + 육수 `고수 듬뿍 훠궈` 1개.
       ⚠️ 데이터의 `part`·판매 지점 기록은 그대로 둔다 — 조사 자료로는 쓸모가 있고
          `메뉴.md` 가 원본이다. 화면에만 안 쓴다. */
    /* 🔴 「제주 한정」은 **부제 자리(이름 아래)에 한라봉 아이콘 + 주황 글씨**다(2026-08-04 사용자 확정).
       거쳐 온 안들과 왜 이걸로 정했는지 —
       · 이름 **위** 배지로 올려 봤더니 **이름이 12.5px 내려갔다.** 부제 있는 카드(위로 8px)와
         반대로 움직여서 목록을 내리면 이름 줄이 20.7px 폭으로 튀었다(재서 확인)
       · 썸네일 **위**에 아이콘만 얹는 안도 봤다. 이름은 안 움직이지만 아이콘과 「제주 한정」
         글자가 왼쪽 위·오른쪽 아래로 떨어져 서로 안 묶인다. `.mn-card-thumb img` 규칙이
         썸네일 안 모든 그림을 100%로 늘리는 함정도 있다
       · 지금 방식은 이름 이동이 **부제 있는 카드와 똑같아서**(위로 8px) 새 어긋남이 없다
       ⚠️ 아이콘 13px 이다 — 부제 글자 12px 과 키를 맞춘 값이다. 16px 은 아이콘만 도드라진다.
       ⚠️ 「제주 한정」은 **띄어 쓴다.** 「한정」이 명사라 명사구는 띄어 쓰는 게 원칙이고,
          CLAUDE.md 에 「관형형+명사는 어법대로 띄어 씀」이 이미 있다.
          (메뉴.md 의 `🍊제주한정` 은 문서 안 표식이라 붙여 쓴 것이고 화면 문구가 아니다)
       아이콘은 코덱스가 하딜고고용으로 새로 그렸다 — 원본은 저장소 밖
       `data/brand/icon/svg/jeju/hallabong-16px-color.svg`, 앱에는 복사본을 쓴다. */
    const 제주 = !!(it.part && it.jeju);
    const 아랫줄 = 제주 ? 제주줄(부제)
      : (부제 ? `<span class="mn-card-sub">${부제}</span>` : '');
    return `<button class="mn-card ${on ? 'is-on' : ''} ${it.img ? '' : 'mn-card--text'}" data-menu="${it.n}">
      <div class="mn-card-thumb ${it.img ? '' : 'is-text'}">${it.img ? `<img src="${IMG(it.n)}" alt="">` : 이름}</div>
      <span class="mn-card-body">
        <span class="mn-card-name">${이름}</span>
        ${아랫줄}
      </span>
      <span class="mn-card-check">${체크아이콘}</span>
    </button>`;
  }

  function renderMenuList(t) {
    return `<div class="mn-list">${상위메뉴(t).map(카드HTML).join('')}</div>`;
  }

  // 묶음 소제목이 붙은 목록. 🔴 「전체메뉴」와 「검색 결과」가 같은 것을 쓴다 — 둘 다
  //    여러 분류가 한 화면에 섞이는 목록이라, 값을 두 벌로 두면 저절로 어긋난다.
  function 묶음목록HTML(groups) {
    return `<div class="mn-list">${groups.map((g) =>
      `<p class="mn-group">${g.up}</p>${g.items.map(카드HTML).join('')}`
    ).join('')}</div>`;
  }

  // 전체메뉴 — 육수를 뺀 130개를 상위 일곱 덩이로 끊어 보여준다(2026-08-04 사용자 확정).
  // 소제목 없이 이으면 한 덩이가 대략 17,000px 이라 지금 어디를 보는지 알 수 없다.
  function renderAllMenus() {
    return 묶음목록HTML(분류탭().map((t) => ({ up: t.name, items: 상위메뉴(t) })));
  }

  /* ── 검색 ──────────────────────────────────────────────────────────────────
     🔴 대상은 **화면에 보이는 이름 + 부제**다(2026-08-03 확정). 즉 이름나누기()를 거친 값이라
        `하이디라오 특제소고기` 는 `특제소고기` 로도, `하이디라오` 로도 걸린다.
     🔴 **「제주 한정」도 대상에 넣는다**(2026-08-04 사용자 확정). 처음엔 뺐는데 그때는 꼬리표가
        「일부 매장」 47개 + 「제주 한정」 0개라, 넣으면 `일부 매장` 한 번에 47개가 쏟아져 쓸모가
        없었다. 그 47개를 뗀 지금은 남은 꼬리표가 「제주 한정」 6개뿐이라 넣는 편이 쓸모 있다
        (「제주도 가는데 거기만 있는 게 뭐지」가 실제로 있을 법한 검색이다).
        ⚠️ 붙여 써도 걸린다 — 검색꼴()이 공백을 떼므로 `제주한정`·`제주 한정` 둘 다 맞는다.
     🔴 범위는 **분류를 가로지른다**(2026-08-04 사용자 확정). 어느 탭에서 치든 130개 전부에서
        찾는다 — 레시피 탭처럼 분류와 겹치는 AND 가 **아니다**.
        ⚠️ 나중에 「전체메뉴」 탭이 생겼지만 이 규칙은 그대로 두기로 했다(같은 날 재확인) —
        AND 로 바꾸면 「전체메뉴로 먼저 가야 한다」를 모르는 사람이 막힌다.
        대신 결과에 상위 분류 소제목을 붙여 어디 것인지 보인다.
     🔴 전골(육수 12개)은 대상에서 뺀다(2026-08-04 사용자 확정) — 전골은 목록이 아니라 냄비를
        고르는 화면이고, 담는 규칙(칸 번호·중복 담기)이 달라 결과 안에서 따로 논다.
     🔴 묶음 소제목은 **상위 한 단만** 쓴다(2026-08-04 사용자 지적). 화면에서 하위 분류는
        2026-08-03에 걷어내기로 확정된 것이라, 검색 결과에만 되살리면 화면마다 단 수가 달라진다.
     ────────────────────────────────────────────────────────────────────────── */
  const searchBox = $('#mnSearchBox');
  const searchInput = $('#mnSearchInput');

  // 괄호·공백을 뺀 형태로도 맞춘다 — 레시피 탭의 검색꼴()과 같은 규칙이다(script.js 위쪽 IIFE).
  // 🔴 괄호·공백만 친 경우 빈 문자열이 되는데, 빈 문자열은 아무 이름에나 들어 있어 그대로 쓰면
  //    전부가 걸린다. 쓰는 쪽에서 반드시 비었는지 본다(레시피 탭이 실제로 당했던 함정이다).
  const 검색꼴 = (s) => (s || '').replace(/[()\s]/g, '');
  // 🔴 전골 탭은 검색창 자체가 없다(CSS 가 감춘다). 그 탭에서 검색 상태가 살아 있으면 「보이지 않는
  //    검색창에 걸려 목록이 이상하다」가 되므로, 여기 한 곳에서 함께 막는다.
  const 검색중 = () => !!query.trim() && !TABS[cur].pot;

  // 상위별 묶음 배열을 돌려준다. 화면 순서는 탭 순서 그대로다(전골·전체메뉴는 분류가 아니라 건너뛴다).
  function 검색결과() {
    const q = query.trim();
    const nq = 검색꼴(q);
    const 걸린다 = (it) => {
      const { 이름, 부제 } = 이름나누기(it.n);
      // 화면에 보이는 글자를 그대로 이어 붙인다 — 이름 + 부제 + (제주 한정)
      const 대상 = 이름 + ' ' + 부제 + (it.part && it.jeju ? ' ' + 제주한정 : '');
      return 대상.includes(q) || (nq && 검색꼴(대상).includes(nq));
    };
    const out = [];
    분류탭().forEach((t) => {
      const items = 상위메뉴(t).filter(걸린다);
      if (items.length) out.push({ up: t.name, items });
    });
    return out;
  }

  function renderSearch() {
    const groups = 검색결과();
    if (!groups.length) return `<p class="empty-state">검색 결과가 없어요</p>`;
    return 묶음목록HTML(groups);
  }

  // 🔴 스크롤은 「사람이 탭을 눌렀을 때」만 위로 보낸다. 첫 렌더는 페이지가 뜨는 중이라
  //    다른 탭(레시피)을 보고 있을 수 있고, 거기서 스크롤을 건드리면 남의 화면을 움직인다.
  function render(scrollTop) {
    renderTabs();
    renderHead();
    const t = TABS[cur];
    // 🔴 전골은 목록이 아니라 냄비를 고르는 화면이다 — 검색창·개수를 감춘다(2026-08-03 사용자 확정).
    //    🔴 pageEl 은 이 모듈 밖(위쪽 IIFE)의 변수라 여기서 쓰면 안 된다 — 쓰면 렌더가 통째로 멈춘다.
    //    🔴 이름을 'mn-pot' 으로 쓰면 안 된다 — 그건 냄비 그림(.mn-pot)의 클래스라
    //       .page 가 그 규칙(폭·모양)을 통째로 뒤집어써서 화면이 194px 로 쪼그라든다(실제로 그랬다).
    document.querySelector('.page').classList.toggle('mn-pot-tab', !!t.pot);
    $('#mnBody').innerHTML = t.pot ? renderPot()
      : 검색중() ? renderSearch()
      : t.all ? renderAllMenus()
      : renderMenuList(t);
    $('#potIcon').classList.toggle('has-item', !!count());
    if (scrollTop) window.scrollTo({ top: 0, behavior: 'instant' });   // smooth 를 확실히 우회
  }

  // 🔴 담기·빼기는 **다시 그리지 않는다**(2026-08-04 사용자 지적) — `#mnBody` 를 통째로 새로 쓰면
  //    그 안의 <img> 가 전부 새로 만들어져 그림 64장이 한꺼번에 깜빡였다.
  //    바뀌는 것은 카드의 테두리(is-on)와 냄비 아이콘뿐이라 클래스만 갈아 끼운다.
  //    (레시피 탭이 browseCardCache 로 푼 것과 같은 문제다)
  function refreshCards() {
    document.querySelectorAll('#mnBody .mn-card[data-menu]').forEach((el) => {
      el.classList.toggle('is-on', picked.has(el.dataset.menu));
    });
    $('#potIcon').classList.toggle('has-item', !!count());
    // 🔴 저장은 여기와 refreshPot 두 곳에서만 부른다 — 담고 빼는 자리 일곱 곳이 전부 둘 중 하나를
    //    거치기 때문이다(담기·빼기·칸 수·칸 빼기·목록 ✕·전체 지우기). 자리마다 넣으면 하나를 빠뜨린다.
    saveMenu();
  }
  // 전골 화면 — 냄비만 다시 그린다. 아래 육수 카드 12장은 손대지 않는다.
  // 🔴 냄비 **안쪽까지** 통째로 다시 쓰면 안 된다(2026-08-04 사용자 지적) — `innerHTML` 을 새로 쓰면
  //    이미 떠 있던 칸 그림의 <img> 가 버려지고 새로 만들어져서, 육수를 담을 때마다 **먼저 담긴 칸이
  //    다시 받아지며 깜빡였다.** 아래 육수 카드 12장에서 고쳤던 것과 같은 문제인데 냄비 안쪽엔
  //    안 고쳐져 있었다. 그래서 여기서는 **칸 수가 바뀔 때만** 통째로 그리고, 그 밖에는 갈아 끼운다.
  function refreshPot() {
    const inner = $('.mn-pot-inner');
    if (!inner || +inner.dataset.cells !== cells) {
      // 칸 수(한 칸·두 칸·네 칸)가 바뀌면 칸 자체가 늘고 줄어 구조가 달라진다 — 이때만 다시 그린다
      const top = $('#mnPotTop');
      if (top) top.innerHTML = renderPotTop();
    } else {
      updateCells(inner);
      const list = $('.mn-pot-list');
      if (list) list.innerHTML = renderPotRows();   // 그림이 없는 줄이라 다시 써도 안 깜빡인다
    }
    refreshBrothNums();          // 아래 육수 카드의 번호도 같이 맞춘다(카드는 다시 안 그린다)
    $('#potIcon').classList.toggle('has-item', !!count());
    saveMenu();                  // 저장하는 두 자리 중 하나(refreshCards 주석 참고)
  }
  // 칸 하나하나를 견줘 바뀐 것만 손댄다. 🔴 그림이 그대로면 <img> 를 건드리지 않는다 —
  //    src 를 같은 값으로 다시 넣기만 해도 브라우저가 다시 받아 깜빡인다.
  function updateCells(inner) {
    inner.querySelectorAll('.mn-cell').forEach((cell, i) => {
      const b = broths[i];
      const img = cell.querySelector('img');
      if (b) {
        const src = CELL_IMG(b);
        if (!img) cell.innerHTML = `<img src="${src}" alt="">`;
        else if (img.getAttribute('src') !== src) img.setAttribute('src', src);
        cell.classList.add('is-filled');
        cell.dataset.cell = i;
      } else {
        if (img) cell.innerHTML = '';
        cell.classList.remove('is-filled');
        delete cell.dataset.cell;   // 빈 칸은 눌러도 뺄 게 없다
      }
    });
  }

  // 담은 줄의 그림 24px. 🔴 카드용 그림(IMG)을 쓴다 — 목록 카드가 이미 받아 둔 파일이라 새로 안 받는다.
  //    전골도 카드용이다(냄비 칸의 `-타일`이 아니다 — 그건 담는 순간 따로 받는 파일이다).
  //    그림이 없는 항목은 자리만 비운다(지금은 130장 다 있지만 데이터에 없음 표시가 남아 있을 수 있다).
  const 줄그림 = (n, 있나) => (있나 ? `<img src="${IMG(n)}" alt="">` : '');

  function renderSheet() {
    const rows = [];
    if (broths.length) {
      rows.push(`<p class="mn-sheet-group">전골 ${potLabel(cells)}</p>`);
      // 🔴 몇 번 칸에 담은 건지 번호를 붙인다(2026-08-04 사용자 확정). 같은 육수를 두 칸에 담으면
      //    똑같은 줄이 두 개 나란히 보여서 「왜 두 번 있지」가 됐다 — 번호가 그 답이다.
      //    규격은 냄비 아래 목록·육수 카드 배지와 **같은 한 곳**을 쓴다(styles.css 「칸 번호 규격」).
      broths.forEach((b, i) => rows.push(
        `<div class="mn-sheet-item"><b class="mn-sheet-num">${i + 1}</b>` +
        `${줄그림(b, (D.broths.find((x) => x.n === b) || {}).img)}${b}` +
        `<button class="mn-sheet-x" data-rm-broth="${i}">✕</button></div>`));
    }
    // 담은 목록도 화면 분류대로 묶는다 — 어느 탭에서 담았는지 그대로 보이게.
    // 🔴 소제목은 상위 한 단이다(2026-08-04 사용자 지적). 옛 코드는 「육류 › 내장류」처럼 하위까지
    //    적었는데, 그건 상위가 `육류`이던 4분류 시절 것이다. 오늘 8분류로 다시 묶으면서
    //    「내장 › 내장류」처럼 같은 말이 두 번 나오는 자리가 됐고, 하위는 애초에 화면에서
    //    걷어낸 단이다(2026-08-03 확정). 검색 결과 소제목과 같은 규칙을 쓴다.
    분류탭().forEach((t) => {
      const on = 상위메뉴(t).filter((it) => picked.has(it.n));
      if (!on.length) return;
      rows.push(`<p class="mn-sheet-group">${t.name}</p>`);
      on.forEach((it) => rows.push(
        `<div class="mn-sheet-item">${줄그림(it.n, it.img)}${it.n}` +
        `<button class="mn-sheet-x" data-rm="${it.n}">✕</button></div>`));
    });
    // 🔴 안내(2026-08-04 사용자 확정) — 경고가 아니라 **쓰는 법**을 말한다.
    //    「매장에서 주문」이라는 말 자체가 「여기서 주문되는 게 아니다」를 전한다.
    //    분명한 고지(「하이디라오 주문과는 연동되지 않아요」)는 메뉴 탭 푸터가 맡는다 — 역할을 나눴다.
    //    ⚠️ 「담아두고」가 성립하려면 저장이 있어야 한다 — 그래서 같은 날 이 기기 저장을 붙였다(위 saveMenu).
    //    담은 게 없을 때는 안 보여준다 — 빈 화면에 안내만 남으면 이상하다.
    //    🔴 마침표를 안 쓴다 — 앱의 다른 문구도 안 쓴다(「아직 담은 것이 없어요」·푸터 안내).
    //    🔴 둘째 줄이 「일부 매장」 꼬리표를 대신한다(2026-08-04 사용자 확정).
    //       메뉴 카드의 꼬리표를 여기로 옮기지 **않는다** — 그 꼬리표의 근거는 2026-08-02 한 시점의
    //       조회값이고(13곳이 아니면 「일부 매장」), 하루 만에 차돌박이가 1곳 → 13곳이 된 적이 있다.
    //       47개에 개별 딱지를 붙이면 틀릴 수 있는 단정을 47번 하는 것이고, 이 한 줄이면 아는 만큼만 말한다.
    //       「판매하지 않는」은 품절이든 원래 안 팔든 둘 다 덮는다 — 우리 데이터가 그 둘을 못 가린다.
    //       「매장 사정에 따라」는 앱이 이미 쓰는 말이다(매장 탭 푸터).
    if (rows.length) rows.push(
      `<p class="mn-sheet-note">여기에 담아두고 매장에서 편하게 주문해보세요<br>매장 사정에 따라 판매하지 않는 메뉴가 있을 수 있어요</p>`);
    $('#mnSheetBody').innerHTML = rows.length ? rows.join('')
      : `<p class="mn-sheet-empty">아직 담은 것이 없어요</p>`;
  }

  // 🔴 창이 떠 있는 동안 상단바 냄비를 눌린 모습(빨강)으로 둔다(2026-08-04 사용자 확정) —
  //    「이 창이 이 아이콘에서 나왔다」가 보여야 한다. 표시는 CSS 가 하고 여기선 클래스만 붙인다.
  function openSheet() {
    renderSheet();
    sheetOverlay.classList.add('open');
    sheetOverlay.setAttribute('aria-hidden', 'false');
    $('#potToggleBtn').classList.add('is-open');
    // 🔴 뒤 화면이 밀리지 않게 잠근다(2026-08-04 사용자 지적) — 예전엔 시트를 열고 밀면
    //    뒤 목록이 400px 그대로 움직였다. body 가 아니라 html 에 건다 — body 를 스크롤
    //    컨테이너로 만들면 상단바 sticky 가 깨진다(레시피 상세·가챠와 같은 방식).
    document.documentElement.style.overflow = 'hidden';
  }
  function closeSheet() {
    sheetOverlay.classList.remove('open');
    sheetOverlay.setAttribute('aria-hidden', 'true');
    $('#potToggleBtn').classList.remove('is-open');
    document.documentElement.style.overflow = '';
  }

  document.addEventListener('click', (e) => {
    // 🔴 반드시 메뉴 탭줄 안으로 좁힌다 — .tab-btn 은 레시피·매장 탭도 쓰는 이름이다.
    //    🔴 두 곳을 다 적는다 — 전골은 탭줄 밖(#mnPotTab)에 있다(2026-08-05). 여기를 빠뜨리면
    //       전골을 눌러도 아무 일도 안 일어난다.
    const tab = e.target.closest('#mnTabs .tab-btn, #mnPotTab .tab-btn');
    if (tab) {
      // 🔴 레시피 탭과 같다(2026-08-03 사용자 확정):
      //    같은 탭을 누르면 아무 일도 하지 않고(밑줄이 다시 그려지는 것을 막는다),
      //    다른 탭이면 목록이 통째로 바뀌므로 맨 위로 간다.
      const i = +tab.dataset.i;
      if (i === cur) return;
      cur = i;
      // 🔴 분류를 누르면 검색을 지운다 — 검색은 8개 분류를 가로지르므로(위 「검색」 절), 검색을 켠 채
      //    분류를 눌러도 결과가 안 바뀐다. 그러면 밑줄만 움직이고 목록은 그대로여서 고장으로 보인다.
      //    「이 분류를 보겠다」는 뜻으로 받아 검색을 끄고 그 분류를 보여준다.
      clearSearch();
      return render(true);
    }

    // 🔴 아래 넷은 render() 를 부르지 않는다(2026-08-04) — 통째로 다시 그리면 그림이 깜빡인다.
    const seg = e.target.closest('[data-pot]');
    if (seg) {
      cells = +seg.dataset.pot;
      if (broths.length > cells) broths = broths.slice(0, cells);   // 칸이 줄면 뒤에서 덜어낸다
      return refreshPot();
    }

    // 냄비 칸을 누르거나 오른쪽 목록의 ✕ 를 눌러 뺀다
    const cell = e.target.closest('[data-cell]');
    if (cell) {
      const i = +cell.dataset.cell;
      if (i < broths.length) { broths.splice(i, 1); return refreshPot(); }
      return;
    }

    // 🔴 육수는 중복해서 담을 수 있다 — 다시 눌러도 빠지지 않고 다음 칸에 또 들어간다.
    //    빼는 것은 냄비 칸을 눌러서 한다(위). 안 그러면 「2칸에 같은 육수」를 만들 방법이 없다.
    const bc = e.target.closest('[data-broth]');
    if (bc) {
      // 🔴 냄비가 찼으면 냄비를 다시 그리지 않는다(2026-08-04 사용자 지적) — 예전엔 담기지 않는데도
      //    refreshPot() 을 불러서, 연타하면 바뀐 게 없는데 냄비가 깜빡였다.
      //    대신 토스트로 알린다(2026-08-04 사용자 확정) — 아무 반응이 없으면 고장으로 보인다.
      //    확대 모달이 없어진 지금은 **이 토스트가 「더는 못 담는다」를 알리는 유일한 자리**다.
      if (broths.length >= cells) {
        if (window.showToast) window.showToast(냄비참);
        return;
      }
      broths.push(bc.dataset.broth);
      타일미리받기();      // 첫 담기 뒤 나머지 타일을 뒤에서 받아 둔다(위 주석 참고)
      return refreshPot();
    }

    // 🔴 반드시 `.mn-card` 안으로 좁힌다 — 위 #mnTabs .tab-btn 과 같은 이유다.
    //    범위 없이 `[data-menu]` 만 찾으면 목록 밖에 있는 것까지 담기 처리로 빨려 들어간다.
    const mc = e.target.closest('.mn-card[data-menu]');
    if (mc) { toggle(mc.dataset.menu); return refreshCards(); }

    // 🔴 냄비 아이콘은 여닫이다(2026-08-04 사용자 요청) — 열려 있을 때 다시 누르면 닫힌다.
    //    창이 떠 있는 동안 이 아이콘은 빨갛게(is-open) 눌린 모습이라, 다시 누르면 풀리는 게 맞다.
    if (e.target.closest('#potToggleBtn')) {
      return sheetOverlay.classList.contains('open') ? closeSheet() : openSheet();
    }
    // 어두운 배경이나 X 를 누르면 닫는다(시트 안쪽을 눌렀을 때는 안 닫힌다)
    if (e.target.closest('#mnSheetClose') || e.target === sheetOverlay) return closeSheet();
    if (e.target.closest('#mnSheetClear')) {
      picked.clear(); broths = []; renderSheet(); refreshCards(); return refreshPot();
    }
    const rm = e.target.closest('[data-rm]');
    if (rm) { picked.delete(rm.dataset.rm); renderSheet(); return refreshCards(); }
    const rmb = e.target.closest('[data-rm-broth]');
    if (rmb) { broths.splice(+rmb.dataset.rmBroth, 1); renderSheet(); return refreshPot(); }
  });

  // ── 검색창 배선 ── 레시피 탭(searchInput/searchClear)과 같은 방식이다.
  //    ✕ 는 CSS 가 `.search-box.has-value` 일 때만 보여준다 — 클래스를 반드시 같이 갈아 끼운다.
  function clearSearch() {
    query = '';
    if (searchInput) searchInput.value = '';
    if (searchBox) searchBox.classList.remove('has-value');
  }
  const 전체메뉴자리 = TABS.findIndex((t) => t.all);
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      query = e.target.value;
      searchBox.classList.toggle('has-value', query.length > 0);
      // 🔴 치기 시작하면 「전체메뉴」 탭으로 옮긴다(2026-08-04 사용자 확정).
      //    검색은 분류를 가로지르는데 밑줄이 「고기」에 남아 있으면 결과에 해산물·완자가 섞여 나와
      //    규칙이 어긋나 보인다. 이 앱엔 「활성 탭 없음」 상태가 없어서(레시피 탭도 검색 중 「전체」가
      //    활성이다) 밑줄만 떼는 대신, 실제로 전부에 해당하는 탭으로 보낸다.
      //    ⚠️ 그래서 검색을 지우면 원래 보던 분류가 아니라 전체메뉴에 남는다 — 아는 값이다.
      if (query.trim() && cur !== 전체메뉴자리) cur = 전체메뉴자리;
      // 🔴 render() 를 쓴다(refreshCards 가 아니다) — 목록에 뜨는 카드가 통째로 바뀌는 일이다.
      render();
    });
  }
  const searchClearBtn = $('#mnSearchClear');
  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      clearSearch();
      render();
      searchInput.focus();
    });
  }

  // Esc — 앱의 다른 시트·모달과 같게. 이제 이 탭에 떠 있는 것은 담은 목록 하나뿐이다.
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (sheetOverlay.classList.contains('open')) closeSheet();
  });

  loadMenu();   // 🔴 render() 보다 먼저 — 되살린 담은 것·육수·칸 수가 첫 화면에 그대로 나와야 한다
  render();
})();
