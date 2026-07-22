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
    { region: '대구', name: '대구점',    addr: '대구 중구 동성로1길 15, 유니온스퀘어 2층',         hours: '10:00 – 05:00', tel: '053-428-7771' },
    { region: '제주', name: '제주점',    addr: '제주 제주시 연동4길 2, 제주볼튼호텔 5층',          hours: '10:00 – 03:00', tel: '064-747-8886' },
  ];

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
    { id: 's1', date: '2021-12-26', cat: '소스', emoji: '🥣', img: 'assets/cards/건희소스(단)_2021.jpg?v=3', imgFit: 'cover', imgBg: '#A8CCDC', tint: 'linear-gradient(160deg,#FDECD9,#F8D9BE)', name: '건희소스', ver: '달달 · 2021', source: '버블 건희', star: true, person: '건희', desc: '<b>원어스</b>의 <b>건희</b>가 즐겨 먹는 콤보 소스 중 단맛 버전으로, 대한민국에서 가장 유명한 국민 소스이다.',
      ings: [['땅콩참깨소스', '1', '스푼'], ['스위트칠리소스', '2.5', '스푼'], ['다진 마늘', '0.5', '스푼'], ['다진 파', '0.5', '스푼'], ['참깨', '1', '티스푼'], ['땅콩가루', '1', '티스푼'], ['마라시즈닝/고춧가루', '0.5', '티스푼'], ['고추기름', '1', '티스푼'], ['설탕', '0.3', '티스푼'], ['매운소고기소스', '0.5', '티스푼']],
      steps: [],
      tip: '너무 달면 설탕과 스위트칠리소스를 취향에 맞게 조절하기' },
    { id: 's16', date: '2021-12-26', cat: '소스', emoji: '🥣', img: 'assets/cards/건희소스(짠)_2021.jpg?v=4', imgFit: 'cover', imgBg: '#A8CCDC', tint: 'linear-gradient(160deg,#FDECD9,#F8D9BE)', name: '건희소스', ver: '짭짤 · 2021', source: '버블 건희', star: true, person: '건희', desc: '<b>원어스</b>의 <b>건희</b>가 즐겨 먹는 콤보 소스 중 짠맛 버전으로, 단맛 버전과 번갈아 먹으면 질리지 않고 단짠단짠으로 즐길 수 있다고 한다.',
      ings: [['소금', '3', '티스푼'], ['참기름', '3', '스푼'], ['고추기름', '0.5', '스푼'], ['다진 마늘', '1', '스푼'], ['참깨', '1', '티스푼'], ['마라시즈닝/고춧가루', '1', '티스푼']],
      steps: [],
      tip: '' },
    { id: 's4', date: '2026-01-27', cat: '소스', emoji: '🥣', img: 'assets/cards/화령소스.jpg?v=2', imgFit: 'cover', tint: 'linear-gradient(160deg,#F5E1C8,#E8C79A)', name: '화령소스', source: '네이버블로그 sjsilver23', desc: '하이디라오 부산역점 직원이 네이버 블로거인 <b>지금이네(sjsilver23)</b>에게 가져다준 소스로, 너무 맛있어서 레시피를 손민수했다고 한다.',
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
    { id: 's15', date: '2026-05-18', cat: '소스', emoji: '🥣', img: 'assets/cards/라젤 아는 동생소스.jpg?v=2', imgFit: 'cover', tint: 'linear-gradient(160deg,#F3E8D6,#DCC39E)', name: '라젤 아는 동생소스', nameHtml: '라젤<span class="name-sub">(이 아는 동생)</span>소스', source: 'YouTube 라젤Razel', person: '라젤', desc: '유튜버 <b>라젤</b>이 <u>아는 동생이 진짜 건강하게 츠묵고 산다</u>며 소개한 소스이다.',
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
    { id: 's19', date: '2026-06-09', cat: '소스', emoji: '🥣', img: 'assets/cards/박은영소스(참기름).jpg?v=1', imgFit: 'cover', tint: 'linear-gradient(160deg,#F7EFD8,#EBDBB0)', name: '박은영소스', ver: '참기름', source: 'YouTube 밥은영', star: true, person: '박은영', desc: '유튜브 <b>밥은영</b> 촬영 중 <b>박은영</b> 셰프가 공개한 소스이다.',
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
    { id: 's27', date: '2025-03-27', cat: '소스', emoji: '🥣', img: 'assets/cards/건희소스_2025.jpg?v=1', imgFit: 'cover', tint: 'linear-gradient(160deg,#FDECD9,#F8D9BE)', name: '건희소스', ver: '달달 · 2025', source: 'YouTube 다비드 봉', star: true, person: '건희', desc: '<b>원어스</b>의 <b>건희</b>가 단맛 버전을 리뉴얼해 공개한 소스로, <u>입맛이 바뀌어서 조금 달라졌다</u>라며 설탕을 빼는 등 기존 레시피에서 단맛을 많이 낮췄다.',
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
    { id: 'e3', cat: '히든메뉴', emoji: '🍢', img: 'assets/cards/유부 새우완자(업그레이드).jpg?v=1', imgFit: 'cover', tint: 'linear-gradient(160deg,#F5EFE4,#DCD2C0)', name: '유부 새우완자', ver: '업그레이드', source: 'YouTube 풍류천재 조서형', desc: '새우완자에 소스바 재료를 첨가하여 유부에 채워 넣고 국물에 익혀 먹는 히든 메뉴이다.',
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

  let activeCat = '전체';       // '전체'가 아니면 카테고리 전체보기(그리드 뷰) 상태
  let personFilter = null;      // 셀럽 레일에서 인물을 고르면 그 사람 레시피만(그리드 뷰)
  let query = '';
  let showFavoritesOnly = false;
  let sortMode = 'popular'; // 'popular'(좋아요) | 'recent'(날짜) | 'name'(가나다)
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
  let likeCounts;
  try {
    likeCounts = JSON.parse(localStorage.getItem(LIKE_COUNTS_KEY)) || {};
  } catch (err) {
    likeCounts = {};
  }
  function saveLikes() {
    try {
      localStorage.setItem(LIKED_KEY, JSON.stringify([...likedByMe]));
      localStorage.setItem(LIKE_COUNTS_KEY, JSON.stringify(likeCounts));
    } catch (err) {
      // 무시
    }
  }
  function getLikeCount(id) {
    return likeCounts[id] || 0;
  }

  // 화면에 그려진 하트 숫자들을 현재 likeCounts로 갱신 (active 상태는 기기별이라 건드리지 않음)
  function refreshLikeCounts() {
    // 그리드 카드(.like-btn)와 홈 인기소스 칩(.hp-like) 모두 갱신
    document.querySelectorAll('.like-btn, .hp-like').forEach((btn) => {
      const countEl = btn.querySelector('.like-count');
      if (countEl) countEl.textContent = getLikeCount(btn.dataset.id);
    });
  }

  // --- Firebase 실시간 DB 연결 ---
  let likesRef = null;
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
      // 집계가 바뀔 때마다(내가/남이 눌렀든) 실시간으로 화면 숫자 갱신.
      // 🐛 첫 로드 땐 좋아요가 아직 도착 전이라 인기순이 전부 0으로 정렬돼 어긋남(사실상 가나다순).
      //    Firebase에서 좋아요가 처음 오면, 인기순일 때 딱 한 번 재정렬해 바로잡는다.
      //    (cardCache 재사용이라 깜빡임 없음. 이후엔 숫자만 갱신 — 사용자가 좋아요 눌렀을 때 카드가 튀지 않게.)
      let likesInitialSorted = false;
      likesRef.on('value', (snapshot) => {
        likeCounts = snapshot.val() || {};
        saveLikes();
        if (!likesInitialSorted) {
          // 첫 도착: 인기순 그리드 재정렬 + 홈 인기소스 순위도 실데이터로 다시 그림
          if (sortMode === 'popular') renderGrid();
          if (typeof renderHomePopular === 'function') renderHomePopular();
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
    likeCounts[id] = Math.max(0, getLikeCount(id) + (liked ? -1 : 1));
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
  const sortDd = document.getElementById('sortDd');
  const sortDdBtn = document.getElementById('sortDdBtn');
  const sortDdMenu = document.getElementById('sortDdMenu');
  const sortDdCurrent = document.getElementById('sortDdCurrent');
  const homeBtn = document.getElementById('homeBtn');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalScroll = document.getElementById('recipe-modal-scroll');
  const modalClose = document.getElementById('modalClose');
  const modalFavBtn = document.getElementById('modalFavBtn');

  function getFiltered() {
    const q = query.trim();
    // 검색·즐겨찾기는 카테고리·인물과 독립 — 둘 중 하나라도 켜지면 전체에서 필터함
    const ignoreCat = showFavoritesOnly || q;
    let filtered = RECIPES.filter((r) => ignoreCat || activeCat === '전체' || r.cat === activeCat);
    if (!ignoreCat && personFilter) {
      filtered = filtered.filter((r) => r.person === personFilter);
    }
    if (showFavoritesOnly) {
      filtered = filtered.filter((r) => favorites.has(r.id));
    }
    if (q) {
      filtered = filtered.filter((r) =>
        r.name.includes(q) || (r.ings || []).some((i) => i[0].includes(q))
      );
    }
    // 정렬: 동점은 가나다순
    const byName = (a, b) => a.name.localeCompare(b.name, 'ko');
    const sorted = filtered.slice();
    if (sortMode === 'popular') {
      // 좋아요(하트) 많은 순, 동점은 가나다순
      sorted.sort((a, b) => getLikeCount(b.id) - getLikeCount(a.id) || byName(a, b));
    } else if (sortMode === 'recent') {
      // 최신순: 날짜(YYYY-MM-DD 문자열) 내림차순, 동점은 가나다순. 날짜 없는 건 맨 아래에 가나다순
      sorted.sort((a, b) => {
        const da = a.date || '';
        const db = b.date || '';
        if (da && db) return db.localeCompare(da) || byName(a, b);
        if (da) return -1;
        if (db) return 1;
        return byName(a, b);
      });
    } else if (sortMode === 'name') {
      // 가나다순: 한글 정렬
      sorted.sort(byName);
    }
    return sorted;
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

  // 카드 1장(그리드·가챠 결과 공용) — 완전히 같은 마크업/핸들러를 쓰므로 스타일이 항상 동일하다.
  function buildCard(r, opts) {
    opts = opts || {};
    const showSource = r.source && !opts.hideSource;
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.dataset.cat = r.cat; // 카테고리 프레임·배지 색 스위치 (CSS 변수 세트)
    card.innerHTML = `
        <span class="recipe-cat-label">${r.cat}</span>
        <button class="fav-star${favorites.has(r.id) ? ' active' : ''}" data-id="${r.id}" type="button" aria-label="즐겨찾기"><svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg></button>
        <div class="recipe-card-inner">
          <div class="recipe-thumb" style="background:${r.img ? (r.imgBg || '#fff') : r.tint}">${r.img ? `<img class="recipe-thumb-img${r.imgFit === 'cover' ? ' recipe-thumb-img--cover' : ''}" src="${r.img}" alt="${r.name}" draggable="false" loading="${opts.eager ? 'eager' : 'lazy'}"${r.imgPosition ? ` style="object-position:${r.imgPosition}"` : ''}><div class="recipe-thumb-overlay">${showSource ? `<div class="recipe-thumb-source">${sourceHtml(r.source)}</div>` : ''}</div>` : `<span>${r.emoji}</span>`}</div>
          <div class="recipe-body">
            <h3 class="recipe-name${r.name.length >= 10 ? ' recipe-name--long' : ''}${r.star ? ' has-star' : ''}">${r.star ? STAR_SVG : ''}${r.nameHtml || r.name}</h3>
            <span class="recipe-ver">${r.ver || ''}</span>
            <button class="like-btn${likedByMe.has(r.id) ? ' active' : ''}" data-id="${r.id}" type="button" aria-label="좋아요"><svg width="17" height="17" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg><span class="like-count">${getLikeCount(r.id)}</span></button>
          </div>
        </div>
      `;
    card.addEventListener('click', opts.onOpen || (() => openModal(r)));
    card.querySelector('.fav-star').addEventListener('click', (e) => {
      e.stopPropagation();
      const btn = e.currentTarget;
      if (favorites.has(r.id)) {
        favorites.delete(r.id);
      } else {
        favorites.add(r.id);
      }
      saveFavorites();
      if (showFavoritesOnly) {
        renderGrid();  // 즐겨찾기 화면에선 카드가 사라져야 하므로 재렌더
      } else {
        btn.classList.toggle('active', favorites.has(r.id));  // 그 외엔 별표만 토글(이미지 재로드 방지)
      }
    });
    card.querySelector('.like-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      const btn = e.currentTarget;
      toggleLike(r.id);
      btn.classList.toggle('active', likedByMe.has(r.id));
      btn.querySelector('.like-count').textContent = getLikeCount(r.id);
    });
    return card;
  }

  // 카드 DOM 캐시 — 레시피당 한 번만 생성하고 탭·정렬·검색 때는 같은 노드를 재배치만 한다.
  // 매번 새로 만들면 <img>가 재디코딩되어 썸네일이 깜빡이고 늦게 뜸(탭 이동 시 딜레이의 원인).
  const cardCache = new Map();

  // ── 이 달의 레시피(월간 히어로 카레셀) ── 매월 자동 교체(서버 없이 월 계산). 큰 이미지 히어로 3-5개를 가로 스와이프.
  const monthlyFeatureEl = document.getElementById('monthlyFeature');
  const mfScroll = document.getElementById('mfScroll');
  const mfDots = document.getElementById('mfDots');
  const MONTHLY_COUNT = 4;

  // 👉 나중에 "이 달의 레시피"를 직접 고르려면 아래 함수를 특정 레시피 배열 반환으로 바꾸면 됨
  //    (예: return ['건희소스','마라훠궈탕',...].map(n => RECIPES.find(r => r.name === n)).filter(Boolean);)
  function pickMonthlyFeatures() {
    const pool = RECIPES.filter((r) => r.img); // 히어로는 큰 이미지 필요
    if (!pool.length) return [];
    // 2026-01 기준 경과 월 → 매월 시작점 이동. step으로 골고루 뽑아 중복 없이 N개.
    const now = new Date();
    const monthIdx = (now.getFullYear() - 2026) * 12 + now.getMonth();
    const start = (((monthIdx * 13) % pool.length) + pool.length) % pool.length;
    const step = Math.max(1, Math.floor(pool.length / MONTHLY_COUNT));
    const out = [];
    for (let i = 0; i < Math.min(MONTHLY_COUNT, pool.length); i++) {
      out.push(pool[(start + i * step) % pool.length]);
    }
    return out;
  }

  let monthlyList = [];
  let monthlyUpdatePill = null; // 인디케이터 막대 재배치 함수(섹션 보일 때 호출)
  function initMonthlyFeature() {
    monthlyList = pickMonthlyFeatures();
    if (!monthlyList.length) { monthlyFeatureEl.hidden = true; return; }
    const total = monthlyList.length;
    mfScroll.innerHTML = monthlyList.map((r) => {
      // 히어로 전용 이미지(heroImg) 있으면 그걸, 없으면 카드 썸네일(img)로 폴백(2026-07-21)
      const heroImg = r.heroImg || r.img;
      // 이름 밑 부제(29CM식): 히어로용 짧은 카피 heroDesc 우선, 없으면 desc로 폴백(CSS가 1줄로 자름).
      // 👉 깔끔하려면 레시피마다 heroDesc를 짧게(예: "언제 어디로든 달릴 준비" 처럼) 써두면 됨.
      const tagline = r.heroDesc || r.desc;
      const desc = tagline ? '<div class="mf-desc">' + tagline + '</div>' : '';
      return '<button class="mf-hero" type="button" aria-label="' + r.name + ' 자세히 보기">'
        + '<img src="' + heroImg + '" alt="' + r.name + '" draggable="false">'
        + '<div class="mf-caption"><div class="mf-name">' + (r.nameHtml || r.name) + '</div>' + desc + '</div>'
        + '</button>';
    }).join('');
    // 뷰포트 고정 인디케이터: 작은 점 N개 + 스크롤에 실시간 연동해 미끄러지는 활성 막대(pill)
    mfDots.innerHTML = monthlyList.map(() => '<i></i>').join('') + '<b class="mf-dots-pill"></b>';
    mfDots.hidden = total <= 1;
    const heroes = [...mfScroll.querySelectorAll('.mf-hero')];
    heroes.forEach((el, i) => el.addEventListener('click', () => openModal(monthlyList[i])));
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

  function isHome() {
    return activeCat === '전체' && !personFilter && !query.trim() && !showFavoritesOnly;
  }
  function syncHome() {
    const home = isHome();
    viewRecipeEl.classList.toggle('is-home', home);
    // 검색은 메인(홈)에선 숨기고 전체보기 등 브라우즈 화면에서만 노출(2026-07-22 결정)
    searchBox.classList.toggle('search-box--hidden', home);
    if (home) searchBox.classList.remove('open'); // 숨길 때 펼침 상태도 접기
  }
  function browseTitle() {
    if (query.trim()) return '검색 결과';
    if (showFavoritesOnly) return '즐겨찾기';
    if (personFilter) return personFilter + ' 레시피';
    if (activeCat !== '전체') return activeCat;
    return '레시피';
  }
  // 홈 섹션(전체 ›·아바타)에서 그리드 뷰로 들어가거나(cat/person), 초기화해 홈으로 돌아옴
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
    renderGrid();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  function goHome() { enterBrowse('전체', null); }

  function syncMonthlyFeature() {
    // 홈에서만 노출 — 필터 중엔 결과에 집중
    monthlyFeatureEl.hidden = !isHome();
    // 보이게 된 직후 인디케이터 막대 재배치(숨김일 때 측정한 0값 교정)
    if (!monthlyFeatureEl.hidden && monthlyUpdatePill) monthlyUpdatePill();
  }

  function renderGrid() {
    syncHome();
    syncMonthlyFeature();
    const filtered = getFiltered();
    listTitleEl.textContent = browseTitle();
    countEl.textContent = filtered.length;
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
    filtered.forEach((r) => {
      let el = cardCache.get(r.id);
      if (!el) {
        el = buildCard(r);
        cardCache.set(r.id, el);
      } else {
        // 캐시된 카드가 그리드 밖에 있는 동안 모달 등에서 상태가 바뀌었을 수 있어 다시 동기화
        el.querySelector('.fav-star').classList.toggle('active', favorites.has(r.id));
        const lb = el.querySelector('.like-btn');
        lb.classList.toggle('active', likedByMe.has(r.id));
        lb.querySelector('.like-count').textContent = getLikeCount(r.id);
      }
      gridEl.appendChild(el);
    });
  }

  // ── 홈 섹션 렌더링(2026-07-21 7단 구조) ──
  // ② 셀럽 레일: person 필드로 그룹핑. 사진(assets/people/<이름>.jpg)이 없으면 이니셜 원으로 표시
  //    — img onerror가 스스로 제거되는 방식이라, 나중에 사진만 넣으면 자동으로 얼굴로 바뀜.
  const celebRailEl = document.getElementById('celebRail');
  const popularRailEl = document.getElementById('popularRail');
  const tangGridEl = document.getElementById('tangGrid');
  const hiddenGridEl = document.getElementById('hiddenGrid');
  const sauceGridEl = document.getElementById('sauceGrid');

  // 가로 레일 마우스 드래그 스크롤(데스크탑용). 트랙패드·휠로만 되던 걸 손으로 끌 수 있게.
  //  - 컨테이너에 한 번만 붙임(레일은 innerHTML만 다시 그려도 컨테이너 자체는 유지됨).
  //  - 4px 넘게 끌면 dragMoved → 캡처 단계에서 자식 카드 클릭(이동)을 무효화.
  function enableDragScroll(el) {
    if (!el) return;
    el.classList.add('drag-scroll');
    let down = false, startX = 0, startScroll = 0, moved = false;
    el.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
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
  // 회색(#5F5E5A) 제외 — 'seen=회색 링'과 헷갈려서 안 본 셀럽이 꺼져 보이는 착시 방지(2026-07-22). 대신 베리로즈.
  const CELEB_COLORS = ['#D85A30', '#B98A44', '#7C9A5A', '#993556', '#534AB7', '#185FA5', '#0F6E56', '#B85575', '#A3612E', '#3E7C8A', '#8A5FB0'];

  // 셀럽 레일 정렬 기준 = 인스타 팔로워 수(2026-07 웹 조사 대략치). 화면엔 숫자 안 보이고 순서만 결정.
  // 🔴 월 1회 정도 갱신. 대부분 개인계정 기준. 장하오는 개인계정이 없어 소속그룹 앤더블(@and2ble) 공식 기준.
  const CELEB_FOLLOWERS = {
    '세훈': 22000000,
    '마크': 13000000,
    '우기': 9000000,
    '이영지': 6000000,
    '장하오': 840000,
    '김풍': 290000,
    '박은영': 175000,
    '건희': 122000
  };

  // 본(터치한) 셀럽 = 회색 링 + 맨 뒤. 앱 내부 ‹ 뒤로가기 동안만 유지(메모리 Set).
  //  - 새로고침·재진입 → 스크립트 새로 실행돼 빈 Set → 그라데이션·팔로워순 원복.
  //  - 사파리 하단 뒤로가기는 bfcache로 옛 화면을 복원해 이전 seen이 되살아나므로 → pageshow(persisted)에서 초기화.
  let seenCelebs = new Set();
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) { seenCelebs.clear(); renderCelebRail(); }
  });

  function renderCelebRail() {
    const people = [];
    const byName = new Map();
    RECIPES.forEach((r) => {
      if (!r.person) return;
      if (!byName.has(r.person)) {
        byName.set(r.person, { name: r.person, count: 0, star: false });
        people.push(byName.get(r.person));
      }
      const p = byName.get(r.person);
      p.count++;
      if (r.star) p.star = true;
    });
    // 셀럽 레일은 연예인(star)만 노출 — 유튜버/크리에이터(쑨디·라젤·수코 등)는 제외(2026-07-22).
    // 레시피는 그대로 남아 전체보기·검색으로 접근 가능. 추후 크리에이터 별도 레일 분리 예정.
    // 팔로워 기준 기본 순서 → 그 순서로 색 고정(순서가 바뀌어도 사람별 색 유지)
    const base = people.filter((p) => p.star)
      .sort((a, b) => (CELEB_FOLLOWERS[b.name] || 0) - (CELEB_FOLLOWERS[a.name] || 0) || b.count - a.count);
    base.forEach((p, idx) => { p.color = CELEB_COLORS[idx % CELEB_COLORS.length]; });
    // 본(터치한) 셀럽은 회색 링(seen)만 표시하고 순서는 그대로 — 항상 팔로워순 고정(2026-07-22).
    const celebs = base;
    celebRailEl.innerHTML = celebs.map((p) => {
      const seenCls = seenCelebs.has(p.name) ? ' celeb--seen' : '';
      return '<button class="celeb' + seenCls + '" type="button" data-person="' + p.name + '">'
        + '<span class="celeb-img"><span class="celeb-face" style="background:' + p.color + '">' + p.name.charAt(0)
        + '<img src="assets/people/' + p.name + '.jpg" alt="" loading="lazy" draggable="false" onerror="this.remove()">'
        + '</span></span>'
        + '<span class="celeb-name">' + p.name + '</span></button>';
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

  function openStory(personName) {
    // 그 인물 레시피를 오래된→최신 순으로(스토리는 시간순이 자연스러움)
    storyList = RECIPES.filter((r) => r.person === personName)
      .slice()
      .sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    if (!storyList.length) return;
    storyIdx = 0;
    storyAvatarEl.innerHTML = '<img src="assets/people/' + personName + '.jpg" alt="" draggable="false" onerror="this.remove()">';
    storyNameEl.textContent = personName;
    // 각 세그먼트에 안쪽 채움 바(.story-seg-fill) — 현재 칸만 CSS 애니메이션으로 차오름
    storyProgress.innerHTML = storyList.map(() => '<span class="story-seg"><i class="story-seg-fill"></i></span>').join('');
    storyViewer.classList.remove('paused');
    renderStorySlide();
    document.documentElement.style.overflow = 'hidden';
    storyViewer.classList.add('open');
    storyViewer.setAttribute('aria-hidden', 'false');
  }

  function renderStorySlide() {
    const r = storyList[storyIdx];
    currentStoryRecipe = r;
    // 지난 칸=꽉(filled), 현재 칸=애니메이션(current). 애니메이션 재시작을 위해 current를 잠깐 뗐다 다시 붙임
    Array.from(storyProgress.children).forEach((seg, i) => {
      seg.classList.remove('current');
      seg.classList.toggle('filled', i < storyIdx);
    });
    const cur = storyProgress.children[storyIdx];
    if (cur) { void cur.offsetWidth; cur.classList.add('current'); } // reflow로 애니메이션 확실히 재시작
    const thumb = r.img
      ? '<img class="story-img" src="' + r.img + '" alt="' + r.name + '" draggable="false">'
      : '<span class="story-img story-img--emoji" style="background:' + r.tint + '">' + r.emoji + '</span>';
    storyBody.innerHTML = thumb
      + '<div class="story-rname">' + (r.nameHtml || r.name) + '</div>'
      + (r.ver ? '<div class="story-rver">' + r.ver + '</div>' : '')
      + (r.desc ? '<div class="story-desc">' + r.desc + '</div>' : '');
  }

  function storyNext() {
    if (storyIdx >= storyList.length - 1) closeStory();
    else { storyIdx++; renderStorySlide(); }
  }
  function storyPrev() {
    if (storyIdx > 0) { storyIdx--; renderStorySlide(); }
  }
  function closeStory() {
    storyViewer.classList.remove('open', 'paused');
    storyViewer.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
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

  document.getElementById('storyNext').addEventListener('click', () => { if (storyWasHold) { storyWasHold = false; return; } storyNext(); });
  document.getElementById('storyPrev').addEventListener('click', () => { if (storyWasHold) { storyWasHold = false; return; } storyPrev(); });
  document.getElementById('storyClose').addEventListener('click', closeStory);
  // CTA → 기존 레시피 상세 모달을 스토리 위(z 200>190)에 겹쳐 띄움. 모달 동안 자동재생 정지(closeModal에서 재개)
  document.getElementById('storyCta').addEventListener('click', () => {
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
  // 아래로 스와이프 → 닫기(모바일)
  let storyTouchY = null;
  storyViewer.addEventListener('touchstart', (e) => { storyTouchY = e.touches[0].clientY; }, { passive: true });
  storyViewer.addEventListener('touchend', (e) => {
    if (storyTouchY == null) return;
    if (e.changedTouches[0].clientY - storyTouchY > 70) closeStory();
    storyTouchY = null;
  }, { passive: true });

  // 홈 카드(클린 스타일) 공통 마크업 — 캐러셀·그리드가 함께 씀. 클릭은 컨테이너에서 data-id로 위임.
  function homeCardBody(r) {
    const thumb = r.img
      ? '<img src="' + r.img + '" alt="' + r.name + '" loading="lazy" draggable="false">'
      : '<span class="hc-emoji" style="background:' + r.tint + '">' + r.emoji + '</span>';
    return thumb;
  }
  // 이름(+버전)만 — 인기소스 카드용(출처는 상세 모달에서만 노출)
  function homeCardName(r) {
    return '<span class="hp-name">' + (r.nameHtml || r.name)
      + (r.ver ? '<span class="hp-ver">' + r.ver + '</span>' : '') + '</span>';
  }
  // 이름 + 출처 — 탕·히든 그리드용
  function homeCardMeta(r) {
    return homeCardName(r)
      + (r.source ? '<span class="hp-src">' + r.source + '</span>' : '');
  }
  function bindHomeCards(container) {
    container.querySelectorAll('[data-id]').forEach((btn) => {
      const r = RECIPES.find((x) => x.id === btn.dataset.id);
      if (r) btn.addEventListener('click', () => openModal(r));
    });
  }

  // 인기소스 순위 배지: 1위 = 빨강 북마크 리본 + 심플 왕관(글자 없음), 2~5위 = 검정 알약 'N위'
  function homeRankBadge(i) {
    if (i === 0) {
      return '<span class="hp-crown"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7l4 4 5-6 5 6 4-4v11H3z" fill="#F4C948"/></svg></span>';
    }
    return '<i class="hp-rank">' + (i + 1) + '위</i>';
  }

  // ③ 인기 소스: 좋아요순 상위 5개 캐러셀. 순서는 렌더 시점 고정(좋아요 눌러도 즉시 재정렬 안 함 —
  //    카드가 눈앞에서 튀지 않게. 숫자만 refreshLikeCounts로 갱신, 순서는 다음 방문 때 반영).
  function renderHomePopular() {
    const sauces = RECIPES.filter((r) => r.cat === '소스').slice()
      .sort((a, b) => getLikeCount(b.id) - getLikeCount(a.id) || a.name.localeCompare(b.name, 'ko'));
    const top = sauces.slice(0, 5);
    popularRailEl.innerHTML = top.map((r, i) =>
      '<button class="hp-card" type="button" data-id="' + r.id + '">'
      + '<span class="hp-thumb">' + homeRankBadge(i) + homeCardBody(r) + '</span>'
      + '<span class="hp-foot"><span class="hp-foot-txt"><span class="hp-name">' + (r.nameHtml || r.name) + '</span>'
      + (r.ver ? '<span class="hp-sub">' + r.ver + '</span>' : '') + '</span>'
      + '<i class="hp-like" data-id="' + r.id + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg><span class="like-count">' + getLikeCount(r.id) + '</span></i>'
      + '</span>'
      + '</button>'
    ).join('');
    bindHomeCards(popularRailEl);
  }

  // ⑤⑥ 탕·히든메뉴: 몇 개 안 되니 전부 2열 그리드로(전체보기 버튼 없음)
  function renderHomeCatGrid(cat, gridElement) {
    const list = RECIPES.filter((r) => r.cat === cat);
    gridElement.innerHTML = list.slice(0, 4).map((r) => // 홈은 4개만, 나머지는 '전체보기'로
      '<button class="hc-card" type="button" data-id="' + r.id + '">'
      + '<span class="hc-thumb">' + homeCardBody(r) + '</span>'
      + homeCardMeta(r) + '</button>'
    ).join('');
    bindHomeCards(gridElement);
  }
  // 컴팩트 리스트(탕·히든): 사진 + 이름 + 좋아요 행. 홈엔 3개만(나머지는 전체보기). 소스는 그리드 유지(주인공=비주얼).
  function renderHomeCatList(cat, listElement) {
    const list = RECIPES.filter((r) => r.cat === cat);
    listElement.innerHTML = list.slice(0, 3).map((r) =>
      '<button class="hc-row" type="button" data-id="' + r.id + '">'
      + '<span class="hc-row-thumb">' + homeCardBody(r) + '</span>'
      + '<span class="hc-row-name">' + (r.nameHtml || r.name) + '</span>'
      + '<span class="hc-row-like"><svg viewBox="0 0 24 24" width="21" height="21" fill="none" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg><span class="hc-row-like-n">' + getLikeCount(r.id) + '</span></span>'
      + '</button>'
    ).join('');
    bindHomeCards(listElement);
  }
  function renderHomeSections() {
    renderCelebRail();
    renderHomePopular();
    renderHomeCatList('탕', tangGridEl);
    renderHomeCatList('히든메뉴', hiddenGridEl);
    renderHomeCatGrid('소스', sauceGridEl);
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

  function openModal(r) {
    // 카드는 레시피 섹션에만 있음 — iOS 클릭 지연 등으로 카드 클릭이 다른 섹션 전환 뒤 늦게 도착해
    // "메뉴/매장 위에 레시피 모달이 뜨는" desync(모달·섹션 어긋남)를 원천 차단(2026-07-21).
    if (pageEl.dataset.section !== 'recipe') return;
    currentModalRecipe = r;
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
    modalFavBtn.classList.toggle('active', favorites.has(r.id));
    modalLikeBtn.classList.toggle('active', likedByMe.has(r.id));
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
    modalOverlay.classList.add('open');
    modalScroll.scrollTop = 0; // 데스크톱 스크롤 컨테이너
    document.getElementById('modalCard').scrollTop = 0; // 모바일 스크롤 컨테이너(카드 본체)
  }

  function closeModal() {
    modalOverlay.classList.remove('open', 'from-story');
    // 스토리 위에서 열렸던 모달이면: 스크롤 잠금 유지 + 스토리 자동재생 재개. 아니면 잠금 해제
    if (storyViewer.classList.contains('open')) {
      storyViewer.classList.remove('paused');
    } else {
      document.documentElement.style.overflow = '';
    }
  }

  modalOverlay.addEventListener('click', closeModal);
  modalScroll.addEventListener('click', (e) => e.stopPropagation());
  modalClose.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal(); });

  // 모달 하단 좋아요 — 그리드 카드의 하트 숫자도 재렌더 없이 동기화(이미지 깜빡임 방지)
  const modalLikeBtn = document.getElementById('modalLikeBtn');
  const modalLikeCount = document.getElementById('modalLikeCount');
  modalLikeBtn.addEventListener('click', () => {
    if (!currentModalRecipe) return;
    const id = currentModalRecipe.id;
    toggleLike(id);
    modalLikeBtn.classList.toggle('active', likedByMe.has(id));
    modalLikeCount.textContent = getLikeCount(id);
    const gridBtn = document.querySelector('.recipe-grid .like-btn[data-id="' + id + '"]');
    if (gridBtn) {
      gridBtn.classList.toggle('active', likedByMe.has(id));
      gridBtn.querySelector('.like-count').textContent = getLikeCount(id);
    }
  });

  // 모바일 전체화면 상세: 오버레이가 상단바 아래에서 시작하도록 실제 높이를 CSS 변수로 전달
  const topbarEl = document.querySelector('.topbar');
  function syncTopbarH() {
    document.documentElement.style.setProperty('--topbar-h', topbarEl.offsetHeight + 'px');
  }
  syncTopbarH();
  window.addEventListener('resize', syncTopbarH);

  // 데스크톱 우클릭으로 이미지 저장·복사 막기 — 사이트 모든 <img>(로고·카드/모달 썸네일·발도장 스티커 등)에
  // 컨텍스트 메뉴 차단. 문서 위임이라 나중에 동적 생성되는 이미지도 자동 적용.
  // ⚠️ 완벽한 보호 아님(개발자도구·네트워크 탭으로 우회 가능) — 무심코 저장하는 것만 억제.
  document.addEventListener('contextmenu', (e) => {
    if (e.target && e.target.tagName === 'IMG') e.preventDefault();
  });

  // 상세/모달이 열린 채 상단바(탭·검색·즐겨찾기 등)를 누르면 닫고 그 동작을 그대로 실행
  // (발도장 보기 모달도 지역 탭 누르면 닫히고 그 지역으로 필터 — 레시피 상세와 동일 규칙)
  topbarEl.addEventListener('click', () => {
    if (modalOverlay.classList.contains('open')) closeModal();
    if (stampViewOverlay.classList.contains('open')) closeStampView();
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
    modalFavBtn.classList.toggle('active', favorites.has(id));
    renderGrid();
  });

  searchInput.addEventListener('input', (e) => {
    query = e.target.value;
    searchBox.classList.toggle('has-value', query.length > 0);
    // 검색은 카테고리·인물과 독립 — 검색 시작하면 전체보기·인물 보기에서 빠져나옴
    if (query.trim() && (activeCat !== '전체' || personFilter)) {
      activeCat = '전체';
      personFilter = null;
    }
    renderGrid();
  });
  // ── 검색 토글(2026-07-21) ── 돋보기(searchToggle)는 박스 밖에 상시 표시 = "다시 누르면 접히는 버튼"임을 인지시킴.
  // 열기=박스 펼침+포커스 / 닫기=돋보기 다시 탭(검색어도 리셋). blur 자동접힘은 비어있고 포커스도 없을 때만.
  const searchToggle = document.getElementById('searchToggle');
  function openSearch() {
    searchBox.classList.add('open');
    searchToggle.setAttribute('aria-label', '검색 닫기');
    searchInput.focus();
  }
  function closeSearch() { // 돋보기 다시 탭 = 명시적 닫기(검색어 리셋 후 접힘)
    query = '';
    searchInput.value = '';
    searchBox.classList.remove('open', 'has-value');
    searchToggle.setAttribute('aria-label', '검색 열기');
    searchInput.blur();
    renderGrid();
  }
  function collapseSearch() {
    // blur 자동 접힘: 비어 있고 포커스도 없을 때만 → X(지우기)로 지운 직후엔 재포커스 상태라 안 접힘(글씨만 지워짐)
    if (query.trim()) return;
    if (document.activeElement === searchInput) return;
    searchBox.classList.remove('open');
    searchToggle.setAttribute('aria-label', '검색 열기');
  }
  searchToggle.addEventListener('click', () => {
    if (searchBox.classList.contains('open')) closeSearch();
    else openSearch();
  });
  // blur 직후 ✕(지우기) 클릭이 씹히지 않게 살짝 늦춰 접음
  searchInput.addEventListener('blur', () => setTimeout(collapseSearch, 150));
  favToggleBtn.addEventListener('click', () => {
    showFavoritesOnly = !showFavoritesOnly;
    favToggleBtn.classList.toggle('active', showFavoritesOnly);
    // 즐겨찾기도 카테고리·인물과 독립 — 켤 때 전체보기·인물 보기에서 빠져나옴
    if (showFavoritesOnly && (activeCat !== '전체' || personFilter)) {
      activeCat = '전체';
      personFilter = null;
    }
    renderGrid();
  });
  const SORT_LABELS = { popular: '♥️ 인기순', recent: '🕐 최신순', name: '🔤 가나다순' };
  function openSortMenu(open) {
    sortDd.classList.toggle('open', open);
    sortDdBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  function setSort(mode) {
    sortMode = mode;
    sortDdCurrent.textContent = SORT_LABELS[mode];
    sortDdMenu.querySelectorAll('.sort-dd-item').forEach((it) => {
      it.classList.toggle('active', it.dataset.sort === mode);
    });
    renderGrid();
  }
  sortDdBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openSortMenu(!sortDd.classList.contains('open'));
  });
  sortDdMenu.querySelectorAll('.sort-dd-item').forEach((it) => {
    it.addEventListener('click', () => {
      setSort(it.dataset.sort);
      openSortMenu(false);
    });
  });
  // 바깥 클릭 시 닫기
  document.addEventListener('click', (e) => {
    if (!sortDd.contains(e.target)) openSortMenu(false);
  });

  // ===== 오늘의 소스 가챠 =====
  const gachaBtn = document.getElementById('gachaBtn');
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
  const gachaAgain = document.getElementById('gachaAgain');
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
    gachaPull.style.display = 'inline-block';
    gachaPull.style.pointerEvents = 'auto';
  }

  function gachaPullOnce() {
    gachaResetBowl();
    gachaPull.style.pointerEvents = 'none';
    gachaAgain.style.pointerEvents = 'none';
    // 결과를 미리 뽑아 이미지를 먼저 로드해둔다(카드가 흰 네모로 잠깐 보이는 현상 방지)
    let i;
    do { i = Math.floor(Math.random() * GACHA_POOL.length); } while (i === gachaLast && GACHA_POOL.length > 1);
    gachaLast = i;
    const r = GACHA_POOL[i];
    gachaPicked = r;
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
      // 메인 화면 카드와 완전히 동일한 마크업을 재사용(buildCard).
      // 카드는 opacity 0(리셋 상태)로 먼저 그려두고, 이미지가 실제로 로드된 뒤에만 공개한다.
      // → 캐시 여부와 무관하게 카드가 흰 네모로 먼저 뜨는 현상 방지.
      gachaResult.innerHTML = '';
      // eager: 결과 카드는 바로 보여야 하므로 지연 로딩 없이 즉시 로드(딜레이 방지, 이미지는 openGacha 때 프리로드됨)
      gachaResult.appendChild(buildCard(r, { hideSource: true, eager: true, onOpen: () => { closeGacha(); openModal(r); } }));
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
        gachaAgain.style.pointerEvents = 'auto';
      };
      const cardImg = gachaResult.querySelector('.recipe-thumb-img');
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

  let gachaPreloaded = false;
  function openGacha() {
    document.documentElement.style.overflow = 'hidden'; // body 아닌 html에 — 상단바 sticky 유지 (openModal 주석 참고)
    // 첫 뽑기에서도 카드가 흰 네모로 안 뜨게, 소스 이미지를 미리 받아둔다(한 번만)
    if (!gachaPreloaded) {
      gachaPreloaded = true;
      GACHA_POOL.forEach((r) => { const im = new Image(); im.src = r.img; });
    }
    gachaToStart();
    gachaOverlay.classList.add('open');
  }

  function closeGacha() {
    document.documentElement.style.overflow = '';
    gachaOverlay.classList.remove('open');
  }

  gachaBtn.addEventListener('click', openGacha);
  // 홈 맨 아래 '운명의 소스 뽑기'도 같은 가챠를 연다
  const homeRandomBtn = document.getElementById('homeRandomBtn');
  if (homeRandomBtn) homeRandomBtn.addEventListener('click', openGacha);

  // 초심자 가이드 패널(뼈대) — 배너 클릭으로 열고, X·바깥 클릭으로 닫음
  const guideOverlay = document.getElementById('guideOverlay');
  document.getElementById('homeGuide').addEventListener('click', () => { guideOverlay.hidden = false; });
  document.getElementById('guideClose').addEventListener('click', () => { guideOverlay.hidden = true; });
  guideOverlay.addEventListener('click', (e) => { if (e.target === guideOverlay) guideOverlay.hidden = true; });
  gachaPull.addEventListener('click', gachaPullOnce);
  gachaAgain.addEventListener('click', gachaPullOnce);
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
    renderGrid();
    searchInput.focus();
  });

  // ===== 섹션(뷰) 전환: 레시피 · 메뉴 · 매장 · 스탬프 =====
  const pageEl = document.querySelector('.page');
  const sectionTitleEl = document.getElementById('sectionTitle');
  const tabbarEl = document.getElementById('tabbar');
  const tabbarIndicator = document.getElementById('tabbarIndicator');
  const SECTION_TITLES = { menu: '메뉴', store: '매장', stamp: '발도장' };
  let activeSection = 'recipe';

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
    if (!SECTION_TITLES[name] && name !== 'recipe') return;
    activeSection = name;
    // 뷰 보이기/숨기기
    document.querySelectorAll('.view').forEach((v) => {
      v.hidden = v.id !== 'view-' + name;
    });
    // 상단바: 레시피만 탭·검색 노출, 그 외엔 섹션 제목으로 교체
    pageEl.dataset.section = name;
    sectionTitleEl.textContent = SECTION_TITLES[name] || '';
    // 하단 탭바 활성 표시
    tabbarEl.querySelectorAll('.tabbar-btn').forEach((btn) => {
      const on = btn.dataset.section === name;
      btn.classList.toggle('active', on);
      if (on) btn.setAttribute('aria-current', 'page');
      else btn.removeAttribute('aria-current');
    });
    // 상세가 열려 있으면 닫기, 스크롤은 맨 위로
    if (modalOverlay.classList.contains('open')) closeModal();
    // 스크롤만 맨 위로 — 이 프로그램 스크롤이 축소/펼침 판정에 끼어들지 않게 다음 스크롤 이벤트 1회 무시.
    // (iOS는 같은 점프에도 스크롤 이벤트가 여러 번 오지만, 아래에서 이미 펼친 뒤라 나머지는 무해한 no-op)
    ignoreScrollOnce = true;
    // 전역 scroll-behavior:smooth를 우회해 즉시 맨 위로.
    // 부드러운 스크롤이면 수백 ms 동안 iOS 주소창 변화 → resize → placeIndicator 스냅이
    // 진행 중인 원 슬라이드를 죽여서 "어떨 땐 애니메이션 없는" 복불복이 생김.
    const se = document.scrollingElement || document.documentElement;
    se.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    se.style.scrollBehavior = '';
    lastScrollY = 0;
    requestAnimationFrame(() => { ignoreScrollOnce = false; });
    // 탭 전환은 항상 바를 펼침(상태 플래그 정리).
    // 과거엔 축소 상태 전환 시 스냅으로 우회했지만(iOS 합성기 레이스), 축소 시각효과(compact CSS)를
    // 제거해 바 좌표가 더는 변하지 않으므로 항상 v178 슬라이드(실기기 검증본)로 통일.
    setCompact(false, { silent: true, instant: true });
    slideIndicator(tabbarEl.querySelector('.tabbar-btn.active'));
    // 매장으로 오면 지역 탭 밑줄 위치 잡기 — 방금 display:flex로 바뀐 직후라 offsetWidth 읽으면
    // 강제 리플로우로 즉시 정확. rAF는 폰트 로드 등으로 폭이 미세하게 바뀔 때 보정용.
    if (name === 'store') { updateStoreUnderline(); requestAnimationFrame(updateStoreUnderline); }
    if (name === 'stamp') { updateStampUnderline(); requestAnimationFrame(updateStampUnderline); }
    syncTopbarH();
  }

  tabbarEl.querySelectorAll('.tabbar-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (suppressClick) return; // 드래그로 끝난 제스처의 잔여 click 무시
      switchSection(btn.dataset.section);
    });
  });
  pageEl.dataset.section = 'recipe';

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
    }
  }
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
        a.innerHTML = '<span class="store-i">📍</span><span class="store-addr">' + addr + '</span>';
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
        h.innerHTML = '<span class="store-i">🕐</span><span>' + s.hours + '</span>';
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
        if (s.addr) {
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
          [
            { label: '네이버지도', img: 'assets/icons/navermap.png?v=1', href: 'https://map.naver.com/p/search/' + q },
            { label: '카카오맵',   img: 'assets/icons/kakaomap.png?v=1', href: 'https://map.kakao.com/?q=' + q },
          ].forEach((o) => {
            const a = document.createElement('a');
            a.className = 'map-dd-item';
            a.href = o.href;
            a.target = '_blank';
            a.rel = 'noopener';
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
        if (s.tel) {
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

  // ===== 발도장 (방문 스티커 기록장) =====
  // 저장 = 이 기기 localStorage에만(즐겨찾기와 동일, 로그인 없음). 나중에 서버 이전이 쉽게
  // 버전 있는 JSON 한 덩어리로 보관: { version: 1, stamps: { 지점명: { date, memo } } }
  const STAMPS_KEY = 'haidilao_stamps';
  // 스티커 그림이 준비된 지점(assets/stickers/). 그림 없는 지점은 자리표시 카드(🐾)로
  // 나오고, 새 그림이 생기면 여기에 한 줄 추가만 하면 됨.
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
  function buildStampCard(name, opts) {
    const card = document.createElement('div');
    const img = STAMP_IMGS[name];
    if (img) {
      // 스티커 이미지엔 지점명이 이미 구워져 있음 → 앱 밴드 오버레이 안 붙임.
      // loading: 기록 그리드 카드는 lazy(화면 밖은 스크롤 시 로드). 수정 슬롯·찍기(pop)는
      // 반드시 즉시 보여야 하는 초점 이미지라 eager — lazy면 시트 슬라이드 중 로드가 미뤄져
      // 스티커가 한 박자 늦게 떴음(opts.eager로 지정).
      const loading = opts && opts.eager ? 'eager' : 'lazy';
      card.innerHTML = '<img src="' + img + '" alt="' + name + ' 스티커" loading="' + loading + '">';
    } else {
      // 아직 그림 없는 지점 = 자리표시 카드에만 이름 밴드 표시
      card.innerHTML = '<div class="stamp-ph"><span>🐾</span></div>';
      const band = document.createElement('div');
      band.className = 'stamp-band';
      band.textContent = name;
      card.appendChild(band);
    }
    return card;
  }

  // ── 발도장 지역 탭 — 매장 지역 탭과 동일 형태·같은 고정 목록(방문 여부와 무관하게 항상 전부 표시) ──
  let activeStampRegion = '전국';
  const stampTabsEl = document.getElementById('stampTabs');
  const stampUnderline = document.getElementById('stampTabsUnderline');
  const STAMP_REGION_OF = {}; // 지점명 → 지역 (필터용)
  STORES.forEach((s) => { STAMP_REGION_OF[s.name] = s.region; });
  function updateStampUnderline() {
    if (!stampTabsEl || !stampUnderline) return;
    const active = stampTabsEl.querySelector('.tab-btn.active');
    // 발도장 섹션이 숨겨져 있으면 offsetWidth=0 → 위치 못 잡으므로, 보일 때(switchSection) 다시 호출됨
    if (active && active.offsetWidth) {
      stampUnderline.style.width = active.offsetWidth + 'px';
      stampUnderline.style.transform = 'translateX(' + active.offsetLeft + 'px)';
    }
  }
  function renderStampTabs() {
    if (!stampTabsEl) return;
    stampTabsEl.querySelectorAll('.tab-btn').forEach((b) => b.remove());
    ['전국'].concat(storeRegions()).forEach((reg) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tab-btn' + (reg === activeStampRegion ? ' active' : '');
      btn.textContent = reg;
      btn.addEventListener('click', () => {
        // 입력 시트가 열려 있으면 지역 탭 무시 — 작성 중 목록이 뒤에서 바뀌어
        // "저장했는데 안 보임"(다른 지역 필터) 같은 혼란 방지. 시트 닫고 나서 이동.
        if (stampSheetOverlay.classList.contains('open')) return;
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
  // 스티커 <img>가 매번 재생성돼 재디코딩·깜빡이던 것 방지(레시피 그리드 cardCache와 같은 원리).
  // 수정으로 내용이 바뀐 카드는 저장 시 이 캐시에서 지워 새로 그림.
  const stampCardCache = new Map();
  function buildStampRecCard(rec) {
    // 컴팩트 가로 카드: [작은 스티커] 날짜 → 매장명 — 리스트는 색인만(상세는 탭 → 보기 모달)
    const card = document.createElement('div');
    card.className = 'stamp-rec';
    card.setAttribute('role', 'button');
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
    // 동행 — 있을 때만. 카드엔 프리셋이면 그 값, 직접 입력(프리셋에 없는 값)이면 '기타'(상세는 보기 모달에 실제 값).
    if (rec.with) {
      const w = document.createElement('div');
      w.className = 'stamp-rec-with';
      w.textContent = COMPANIONS.includes(rec.with) ? rec.with : '기타';
      info.appendChild(w);
    }
    card.appendChild(info);
    card.addEventListener('click', () => openStampView(rec.id)); // 탭 → 보기 모달(수정/삭제는 거기서)
    return card;
  }

  function renderStamps() {
    const grid = document.getElementById('stampGrid');
    if (!grid) return;
    const showAll = activeStampRegion === '전국';
    const list = stampData.records
      .filter((r) => showAll || STAMP_REGION_OF[r.name] === activeStampRegion)
      .slice();
    // "다녀온 매장 N곳" = 고유 매장 수(같은 매장 여러 번 기록해도 1곳으로 셈 — 라벨과 의미 일치)
    document.getElementById('stampCountNum').textContent = new Set(list.map((r) => r.name)).size;
    // 일기라 최신이 먼저: 날짜 최근순, 같은 날짜면 나중에 기록한 것(addedAt)이 위.
    // addedAt 없는 옛 기록은 0 취급 → 같은 날짜 안에서 맨 아래(정렬 안 깨짐).
    list.sort((a, b) => {
      if ((a.date || '') !== (b.date || '')) return (a.date || '') < (b.date || '') ? 1 : -1;
      return (b.addedAt || 0) - (a.addedAt || 0);
    });
    // 빈 상태 — 기록이 아예 없으면 첫 기록 유도, 지역 필터만 비면 그 지역 안내
    if (!list.length) {
      const empty = document.createElement('div');
      empty.className = 'stamp-empty';
      const anyAtAll = stampData.records.length > 0;
      empty.innerHTML = '<span class="stamp-empty-paw">🐾</span>' + (anyAtAll
        ? '아직 ' + activeStampRegion + '엔 발도장이 없어요'
        : '아직 발도장이 없어요<br>✏️ 기록하기로 첫 방문을 남겨보세요');
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
    // 삭제된 기록의 캐시 정리(메모리 누수·오래된 카드 재사용 방지)
    const liveIds = new Set(stampData.records.map((r) => r.id));
    stampCardCache.forEach((_, id) => { if (!liveIds.has(id)) stampCardCache.delete(id); });
  }

  // ── 발도장 입력 시트: 점선 슬롯 → 지점 선택 → "발도장 찍기" → 스티커 탁!(stampPop) ──
  const stampSheetOverlay = document.getElementById('stampSheetOverlay');
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
  // 발도장 = 방문 기록이라 미래 날짜는 무의미 → 오늘 이후 선택 금지. max로 달력에서 미래를 비활성화하고,
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
  }
  function closeStampSheet() {
    if (stampAnimating) return; // 찍히는 중엔 닫기 무시(연출 보장)
    stampSheetOverlay.classList.remove('open');
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
  document.getElementById('stampSheetClose').addEventListener('click', closeStampSheet);
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

  // ── 발도장 보기 모달 (카드 탭 시, 읽기 전용 + 수정/삭제) ──
  const stampViewOverlay = document.getElementById('stampViewOverlay');
  const stampViewSticker = document.getElementById('stampViewSticker');
  const stampViewInfo = document.getElementById('stampViewInfo');
  const stampViewClose = document.getElementById('stampViewClose');
  const stampViewEdit = document.getElementById('stampViewEdit');
  const stampViewDelete = document.getElementById('stampViewDelete');
  let stampViewId = null;         // 보고 있는 기록 id
  let stampViewDeleteArmed = false; // 삭제 두 번 눌러 확인용

  function resetStampViewDelete() {
    stampViewDeleteArmed = false;
    stampViewDelete.textContent = '삭제';
    stampViewDelete.classList.remove('armed');
    clearTimeout(stampViewDelete._t);
  }
  function openStampView(id) {
    const rec = stampData.records.find((r) => r.id === id);
    if (!rec) return;
    stampViewId = id;
    // 스티커(크게, 즉시 로드)
    const sticker = buildStampCard(rec.name, { eager: true });
    sticker.className = 'stamp-view-card';
    stampViewSticker.innerHTML = '';
    stampViewSticker.appendChild(sticker);
    // 정보 — 날짜·매장은 항상, 동행·메모는 입력했을 때만
    const rows = [['날짜', fmtStampDateKr(rec.date)], ['매장', rec.name]];
    if (rec.with) rows.push(['동행', rec.with]);
    if (rec.memo) rows.push(['메모', rec.memo]);
    stampViewInfo.innerHTML = rows
      .map((r) => '<div class="stamp-view-row"><span class="stamp-view-label">' + r[0] + '</span><span class="stamp-view-val"></span></div>')
      .join('');
    // 값은 사용자 입력이라 textContent로(안전) 채움
    stampViewInfo.querySelectorAll('.stamp-view-val').forEach((el, i) => { el.textContent = rows[i][1]; });
    resetStampViewDelete();
    stampViewOverlay.classList.add('open');
  }
  function closeStampView() {
    stampViewOverlay.classList.remove('open');
    resetStampViewDelete();
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
    saveStamps();
    closeStampView();
    renderStamps();
  });

  // 상단바 ✏️ 기록하기(발도장 섹션 전용) → 새로 찍기 시트
  const stampWriteBtn = document.getElementById('stampWriteBtn');
  if (stampWriteBtn) stampWriteBtn.addEventListener('click', () => {
    if (stampSheetOverlay.classList.contains('open')) return; // 이미 작성 중이면 무시 — 다시 누르면 입력 리셋되던 것 방지
    openStampSheet();
  });

  // 그리드 뷰 헤더 ‹(뒤로) + 인기소스 '전체 ›' → 홈/전체보기 전환
  document.getElementById('browseBack').addEventListener('click', goHome);
  // 탕·히든·소스 섹션 '전체보기' → 해당 카테고리 그리드 뷰 (인기소스의 구 전체보기 버튼은 소스 섹션으로 이관·제거됨)
  document.getElementById('tangMore').addEventListener('click', () => enterBrowse('탕'));
  document.getElementById('hiddenMore').addEventListener('click', () => enterBrowse('히든메뉴'));
  document.getElementById('sauceMore').addEventListener('click', () => enterBrowse('소스'));

  renderHomeSections();
  initMonthlyFeature();
  renderGrid();
  renderStoreTabs();
  renderStores();
  renderStampTabs();
  renderStamps();
  window.addEventListener('resize', updateStoreUnderline);
  window.addEventListener('resize', updateStampUnderline);

  // 초기 빨간 원 위치 잡기(레이아웃·폰트 로드 후 다시 한 번)
  requestAnimationFrame(placeIndicator);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeIndicator);

  // 첫 화면 렌더 후, 브라우저가 한가할 때 나머지 카드 이미지를 "한 장씩 순차" 프리로드.
  // 스크롤 시 lazy 로딩 딜레이가 안 보이게 미리 받아두되, 한 장씩이라 다른 요청을 막지 않음
  // (카드가 늘어도 줄만 길어질 뿐 부하 없음. 수백 장 규모가 되면 앞쪽 N장 제한 고려).
  function preloadCardImages() {
    const srcs = RECIPES.filter((r) => r.img).map((r) => r.img);
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

  // 썸네일 이미지 우클릭 저장/복사 방지
  document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.recipe-thumb-img')) e.preventDefault();
  });

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
  function showInstallBtns() {
    topInstallBtn.style.display = 'flex';
    // 탭줄 아이콘은 인라인만 걷어내면 CSS가 표시를 결정(모바일 flex / 데스크탑 none — 공유 버튼과 동일 규칙)
    tabsInstallBtns.forEach((b) => { b.style.display = ''; });
  }
  function hideInstallBtns() {
    installBtns.forEach((b) => { b.style.display = 'none'; });
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

  function showShareToast(text) {
    shareToast.textContent = text;
    shareToast.classList.add('show');
    clearTimeout(shareToastTimer);
    shareToastTimer = setTimeout(() => shareToast.classList.remove('show'), 2000);
  }

  async function shareSite() {
    const shareData = { title: document.title, url: location.origin + location.pathname };
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
  const stampShareBtn = document.getElementById('stampShareBtn'); // 발도장 섹션(모바일) 공유 버튼
  if (stampShareBtn) stampShareBtn.addEventListener('click', shareSite);
})();
