(() => {
  const CATS = ['전체', '소스', '육수', '밥', '면', '기타'];

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
    '다진 마늘', '다진 파', '양파', '태국고추', '산고추/고추장아찌', '셀러리', '고수', '와사비',
    // 5) 가루류
    '땅콩가루', '마라시즈닝/고춧가루', '참깨',
    // 6) 기름류
    '고추기름', '산초기름',
    // 7) 간·기타
    '설탕', '소금', '미원', '만구향',
  ];
  const ORDER_ITEMS = ['공깃밥', '날계란', '생면', '팡가시우메기', '우유/청유 마라훠궈', '토마토탕훠궈'];  // 직원에게 주문하는 항목 (order 에 쓰는 이름)
  const UNITS = ['스푼', '국자', '티스푼', '바퀴', '개', '공기', '접시', '인분', '넉넉하게', '적당히', '한 꼬집'];  // 정식 단위 (국자=탕 국물 뜰 때)

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
    { id: 's1', date: '2021-12-26', cat: '소스', emoji: '🥣', img: 'assets/cards/건희소스(단)_2021.jpg?v=3', imgFit: 'cover', imgBg: '#A8CCDC', tint: 'linear-gradient(160deg,#FDECD9,#F8D9BE)', name: '건희소스', ver: '달달 · 2021', source: '버블 건희', star: true, desc: '<b>원어스</b>의 <b>건희</b>가 즐겨 먹는 콤보 소스 중 단맛 버전으로, 대한민국에서 가장 유명한 국민 소스이다.',
      ings: [['땅콩참깨소스', '1', '스푼'], ['스위트칠리소스', '2.5', '스푼'], ['다진 마늘', '0.5', '스푼'], ['다진 파', '0.5', '스푼'], ['참깨', '1', '티스푼'], ['땅콩가루', '1', '티스푼'], ['마라시즈닝/고춧가루', '0.5', '티스푼'], ['고추기름', '1', '티스푼'], ['설탕', '0.3', '티스푼'], ['매운소고기소스', '0.5', '티스푼']],
      steps: [],
      tip: '너무 달면 설탕과 스위트칠리소스를 취향에 맞게 조절하기' },
    { id: 's16', date: '2021-12-26', cat: '소스', emoji: '🥣', img: 'assets/cards/건희소스(짠)_2021.jpg?v=4', imgFit: 'cover', imgBg: '#A8CCDC', tint: 'linear-gradient(160deg,#FDECD9,#F8D9BE)', name: '건희소스', ver: '짭짤 · 2021', source: '버블 건희', star: true, desc: '<b>원어스</b>의 <b>건희</b>가 즐겨 먹는 콤보 소스 중 짠맛 버전으로, 단맛 버전과 번갈아 먹으면 질리지 않고 단짠단짠으로 즐길 수 있다고 한다.',
      ings: [['소금', '3', '티스푼'], ['참기름', '3', '스푼'], ['고추기름', '0.5', '스푼'], ['다진 마늘', '1', '스푼'], ['참깨', '1', '티스푼'], ['마라시즈닝/고춧가루', '1', '티스푼']],
      steps: [],
      tip: '' },
    { id: 's4', date: '2026-01-27', cat: '소스', emoji: '🥣', img: 'assets/cards/화령소스.jpg?v=2', imgFit: 'cover', tint: 'linear-gradient(160deg,#F5E1C8,#E8C79A)', name: '화령소스', source: '네이버블로그 sjsilver23', desc: '하이디라오 부산역점 직원이 네이버 블로거인 <b>지금이네(sjsilver23)</b>에게 가져다준 소스로, 너무 맛있어서 레시피를 손민수했다고 한다.',
      ings: [['땅콩참깨소스', '0.25', '스푼'], ['스위트칠리소스', '3.5~4', '스푼'], ['튀긴대두', '2~3', '스푼'], ['참기름', '0.5', '스푼'], ['고추기름', '0.5', '스푼'], ['양파', '3', '스푼'], ['다진 파', '3', '스푼'], ['다진 마늘', '1', '스푼']],
      steps: [],
      tip: '튀긴대두, 다진 마늘, 다진 파, 양파는 많으면 많을수록 맛있음' },
    { id: 's2', date: '2022-01-22', cat: '소스', emoji: '🥣', img: 'assets/cards/쑨디2호소스_2022.jpg?v=3', imgFit: 'cover', tint: 'linear-gradient(160deg,#FBDCD3,#F5B8A8)', name: '쑨디2호소스', ver: '2022', source: '트위터 @deeplovehalf', desc: '트위터리안 <b>쑨디</b>가 트위터에 공개한 소스로, 1호는 없지만 멋있어 보여서 이름을 쑨디2호소스라고 지었다.',
      ings: [['매운소고기소스(건더기만)', '0.5', '스푼'], ['청유훠궈소스(건더기만)', '0.5', '스푼'], ['땅콩가루', '', '넉넉하게'], ['다진 파', '', '넉넉하게'], ['다진 마늘', '0.5', '스푼'], ['스위트칠리소스', '0.5', '스푼'], ['굴소스', '0.5', '스푼'], ['땅콩참깨소스', '0.25', '스푼']],
      steps: [],
      tip: '' },
    { id: 's3', date: '2024-07-28', cat: '소스', emoji: '🥣', img: 'assets/cards/쑨디2호소스_2024.jpg?v=3', imgFit: 'cover', tint: 'linear-gradient(160deg,#FFE0C2,#F8B888)', name: '쑨디2호소스', ver: '2024', source: 'YouTube 쑨디', desc: '쑨디2호소스의 개발자인 <b>쑨디</b>가 과거 트위터에 공개한 레시피에 일부 오류가 있어서, 유튜브를 통해 정정한 소스이다.',
      ings: [['땅콩참깨소스', '0.5', '스푼'], ['다진 파', '', '넉넉하게'], ['스위트칠리소스', '0.5', '스푼'], ['다진 마늘', '3', '스푼'], ['굴소스', '1', '스푼'], ['매운소고기소스(건더기만)', '1', '스푼'], ['청유훠궈소스(건더기만)', '2', '스푼'], ['땅콩가루', '2', '스푼'], ['만구향', '1', '스푼']],
      steps: [],
      tip: '' },
    { id: 's5', date: '2025-04-11', cat: '소스', emoji: '🥣', img: 'assets/cards/영지소스_2025.jpg?v=4', imgFit: 'cover', tint: 'linear-gradient(160deg,#F5E6D3,#E8C9A0)', name: '영지소스', ver: '2025', source: 'YouTube 채널십오야', star: true, desc: '<b>나영석의 보글보글</b> 촬영 중 <b>이영지</b>가 공개한 소스로, <b>나영석</b>이 <u>그룹 활동을 하고 있음에도 불구하고 솔로 가수가 되기 위해 노력하고 있는 느낌의 소스다</u>라고 했다.',
      ings: [['땅콩참깨소스', '2', '스푼'], ['스위트칠리소스', '1.5', '스푼'], ['태국고추', '2', '스푼'], ['마라시즈닝/고춧가루', '1.5', '스푼'], ['다진 파', '1.5', '스푼'], ['다진 마늘', '1', '스푼'], ['참기름', '2', '바퀴'], ['간장소스', '1', '바퀴'], ['오향우육/다진 고기', '1.5', '스푼'], ['참깨', '', '적당히'], ['설탕', '', '한 꼬집'], ['땅콩가루', '', '한 꼬집']],
      steps: [],
      tip: '' },
    { id: 's7', date: '2025-04-11', cat: '소스', emoji: '🥣', img: 'assets/cards/마크소스.jpg?v=3', imgFit: 'cover', tint: 'linear-gradient(160deg,#FDEBD0,#F5C99B)', name: '마크소스', source: 'YouTube 채널십오야', star: true, desc: '<b>나영석의 보글보글</b> 촬영 중 <b>마크</b>가 최초로 공개한 소스로, <b>나영석</b>이 <u>그룹 활동에 최적화된 소스다</u>라고 했다.',
      ings: [['땅콩참깨소스', '2', '스푼'], ['다진 마늘', '1.5', '스푼'], ['양파', '1.5', '스푼'], ['굴소스', '1', '스푼'], ['태국고추', '1', '스푼'], ['간장소스', '2', '스푼'], ['오향우육/다진 고기', '', '적당히'], ['다진 파', '', '적당히'], ['땅콩가루', '', '적당히'], ['마라시즈닝/고춧가루', '', '적당히']],
      steps: [],
      tip: '' },
    { id: 's14', date: '2026-05-18', cat: '소스', emoji: '🥣', img: 'assets/cards/라젤소스.jpg?v=2', imgFit: 'cover', tint: 'linear-gradient(160deg,#EAF3D8,#C9DFA0)', name: '라젤소스', source: 'YouTube 라젤Razel', desc: '유튜버 <b>라젤</b>이 본인의 이름을 붙인 간장 베이스 소스로, 건희소스와 번갈아 먹으면 질리지 않게 먹을 수 있다고 한다.',
      ings: [['양파', '', '넉넉하게'], ['간장소스', '2', '스푼'], ['다진 마늘', '1', '스푼'], ['다진 파', '1', '스푼'], ['고추기름', '1', '스푼'], ['마라시즈닝/고춧가루', '1', '스푼'], ['중국식초', '1', '스푼'], ['참기름', '0.5', '스푼'], ['태국고추', '', '넉넉하게']],
      steps: [],
      tip: '' },
    { id: 's15', date: '2026-05-18', cat: '소스', emoji: '🥣', img: 'assets/cards/라젤 아는 동생소스.jpg?v=2', imgFit: 'cover', tint: 'linear-gradient(160deg,#F3E8D6,#DCC39E)', name: '라젤 아는 동생소스', nameHtml: '라젤<span class="name-sub">(이 아는 동생)</span>소스', source: 'YouTube 라젤Razel', desc: '유튜버 <b>라젤</b>이 <u>아는 동생이 진짜 건강하게 츠묵고 산다</u>며 소개한 소스이다.',
      ings: [['참기름', '2', '스푼'], ['소금', '0.5', '스푼'], ['다진 마늘', '1', '스푼'], ['다진 파', '1', '스푼'], ['태국고추', '1', '스푼']],
      steps: [],
      tip: '' },
    { id: 's17', date: '2026-06-09', cat: '소스', emoji: '🥣', img: 'assets/cards/세훈소스(간장).jpg?v=1', imgFit: 'cover', tint: 'linear-gradient(160deg,#EFE3CE,#DBC5A0)', name: '세훈소스', ver: '간장', source: 'YouTube 밥은영', star: true, desc: '유튜브 <b>밥은영</b> 촬영 중 <b>엑소</b>의 <b>세훈</b>이 공개한 소스이다.',
      order: [['우유/청유 마라훠궈', '1', '스푼']],
      ings: [['간장소스', '3', '스푼'], ['다진 파', '2', '스푼'], ['다진 마늘', '3', '스푼'], ['양파', '3', '스푼'], ['고수', '2', '스푼'], ['태국고추', '', '적당히']],
      steps: [],
      tip: '홍탕 1스푼은 취향에 맞게 넣기' },
    { id: 's18', date: '2026-06-09', cat: '소스', emoji: '🥣', img: 'assets/cards/세훈소스(마장).jpg?v=1', imgFit: 'cover', tint: 'linear-gradient(160deg,#F6EEDD,#E7D6BA)', name: '세훈소스', ver: '마장', source: 'YouTube 밥은영', star: true, desc: '유튜브 <b>밥은영</b> 촬영 중 <b>엑소</b>의 <b>세훈</b>이 공개한 소스로, <u>정통파들은 소스바 대신 홍탕에 있는 고추기름을 넣는다</u>라고 했다.',
      order: [['우유/청유 마라훠궈', '1', '국자']],
      ings: [['땅콩참깨소스', '3', '스푼'], ['다진 파', '3', '스푼'], ['양파', '2', '스푼'], ['고수', '1', '스푼'], ['다진 마늘', '0.5', '스푼']],
      steps: [],
      tip: '' },
    { id: 's19', date: '2026-06-09', cat: '소스', emoji: '🥣', img: 'assets/cards/박은영소스(참기름).jpg?v=1', imgFit: 'cover', tint: 'linear-gradient(160deg,#F7EFD8,#EBDBB0)', name: '박은영소스', ver: '참기름', source: 'YouTube 밥은영', star: true, desc: '유튜브 <b>밥은영</b> 촬영 중 <b>박은영</b> 셰프가 공개한 소스이다.',
      ings: [['참기름', '4', '스푼'], ['중국식초', '1', '스푼'], ['다진 마늘', '2', '스푼'], ['소금', '', '한 꼬집']],
      steps: [],
      tip: '' },
    { id: 's20', date: '2026-06-09', cat: '소스', emoji: '🥣', img: 'assets/cards/박은영소스(마장).jpg?v=1', imgFit: 'cover', tint: 'linear-gradient(160deg,#F6DFC8,#ECBE96)', name: '박은영소스', ver: '마장', source: 'YouTube 밥은영', star: true, desc: '유튜브 <b>밥은영</b> 촬영 중 <b>박은영</b> 셰프가 공개한 소스로, <u>핫바리들은 잘 모르는 두 가지 소스(부추 소스, 홍두부 소스)가 들어가야 된다</u>라고 했다.',
      order: [['우유/청유 마라훠궈', '1', '스푼']],
      ings: [['땅콩참깨소스', '3', '스푼'], ['중국식초', '2', '스푼'], ['산초기름', '1', '스푼'], ['다진 파', '2', '스푼'], ['다진 마늘', '1', '스푼'], ['땅콩가루', '1', '스푼'], ['태국고추', '1', '스푼'], ['라조장', '1', '스푼'], ['부추소스', '1', '스푼'], ['발효두부소스', '0.33', '스푼']],
      steps: [],
      tip: '부추 소스, 홍두부 소스가 소스바에 없는 경우에는 하이디라오 직원분께 요청하기' },
    { id: 's21', date: '2025-04-26', cat: '소스', emoji: '🥣', img: 'assets/cards/장하오소스.jpg?v=1', imgFit: 'cover', tint: 'linear-gradient(160deg,#F2EEE6,#E2DACB)', name: '장하오소스', source: 'MBC 전지적 참견 시점', star: true, desc: '<b>전지적 참견 시점</b> 촬영 중 <b>제로베이스원</b>의 <b>장하오</b>가 멤버들과 함께 하이디라오에 방문했을 때 공개한 소스이다.',
      ings: [['다진 파', '1', '스푼'], ['양파', '0.5', '스푼'], ['다진 마늘', '0.5', '스푼'], ['발효콩장', '1', '스푼'], ['참기름', '2', '스푼'], ['굴소스', '1', '스푼'], ['간장소스', '0.5', '스푼'], ['오향우육/다진 고기', '1', '스푼'], ['발효두부소스', '2', '스푼'], ['버섯소스', '1', '스푼'], ['매운소고기소스', '1', '스푼'], ['태국고추', '', '적당히'], ['고수', '', '적당히'], ['참깨', '', '적당히'], ['중국식초', '', '적당히']],
      steps: [],
      tip: '태국고추, 고수, 참깨, 중국식초는 취향에 맞게 넣기' },
    { id: 's22', date: '2026-05-25', cat: '소스', emoji: '🥣', img: 'assets/cards/수코소스.jpg?v=2', imgFit: 'cover', tint: 'linear-gradient(160deg,#EAF3E0,#CFE3BC)', name: '수코소스', source: 'YouTube sookoh 수코', desc: '유튜버 <b>수코</b>가 혼자 상하이에 있는 하이디라오 와이탄점에 방문해서 공개한 소스이다.',
      ings: [['다진 파', '2', '스푼'], ['참기름', '2', '스푼'], ['다진 마늘', '1', '스푼'], ['소금', '0.5', '스푼'], ['고수', '', '적당히'], ['셀러리', '', '적당히']],
      steps: [],
      tip: '고수와 셀러리는 취향에 맞게 넣기' },
    { id: 's23', date: '2023-09-01', cat: '소스', emoji: '🥣', img: 'assets/cards/영지소스(악마).jpg?v=1', imgFit: 'cover', tint: 'linear-gradient(160deg,#F8D6CC,#EDA893)', name: '영지소스', ver: '악마 · 2023', source: 'Instagram @youngji_02', star: true, desc: '<b>이영지</b>가 인스타그램 스토리를 통해서 공개한 소스로, 매운 재료들만 넣어서 만들었기 때문에 마성의 악마소스라고 소개했다.',
      ings: [['스위트칠리소스', '3', '스푼'], ['태국고추', '3', '스푼'], ['마라시즈닝/고춧가루', '3', '스푼']],
      steps: [],
      tip: '' },
    { id: 's24', date: '2025-10-07', cat: '소스', emoji: '🥣', img: 'assets/cards/김풍소스.jpg?v=1', imgFit: 'cover', tint: 'linear-gradient(160deg,#F4E7D6,#E4CBA6)', name: '김풍소스', source: 'YouTube 라꼰즈', star: true, desc: '<b>김풍</b> 작가가 <b>파김치갱</b> 멤버들과 함께 하이디라오에서 회식을 하며 공개한 소스로, <u>이 소스 천만 소스 간다</u>라며 소개했다.',
      ings: [['땅콩참깨소스', '2', '스푼'], ['발효콩장', '1', '스푼'], ['중국식초', '1', '스푼'], ['굴소스', '1', '스푼'], ['칠리갈릭소스', '1', '스푼'], ['간장소스', '1', '스푼'], ['다진 파', '', '적당히'], ['양파', '', '적당히']],
      steps: [],
      tip: '' },
    { id: 's25', date: '2025-02-28', cat: '소스', emoji: '🥣', img: 'assets/cards/우기소스.jpg?v=1', imgFit: 'cover', tint: 'linear-gradient(160deg,#F0EFD9,#D6D4A2)', name: '우기소스', source: 'YouTube 미연zip MIYEON', star: true, desc: '<b>(여자)아이들</b> <b>미연</b>의 유튜브 촬영 중 같은 멤버 <b>우기</b>가 공개한 소스로, 자막으로 안내된 레시피와 실제 제조 과정이 달라 영상을 직접 판독해 만든 그대로 옮겨 적었다.',
      ings: [['땅콩참깨소스', '2', '스푼'], ['중국식초', '5', '스푼'], ['다진 파', '1', '스푼'], ['다진 마늘', '1', '스푼'], ['고수', '1', '스푼'], ['땅콩가루', '1', '스푼']],
      steps: [],
      tip: '' },
    { id: 's26', date: '2024-10-01', cat: '소스', emoji: '🥣', img: 'assets/cards/건희소스_2024.jpg?v=1', imgFit: 'cover', tint: 'linear-gradient(160deg,#FDECD9,#F8D9BE)', name: '건희소스', ver: '2024', source: 'Instagram @in2yourblue', star: true, desc: '<b>원어스</b>의 <b>건희</b>가 인스타그램 스토리를 통해서 공개한 소스로, <u>님들 나 대단한 소스를 하나 더 만들어냄</u>이라며 소개했다.',
      ings: [['양파', '3', '스푼'], ['다진 파', '1', '스푼'], ['태국고추', '', '적당히'], ['간장소스', '2', '스푼'], ['중국식초', '0.7~1', '티스푼'], ['다진 마늘', '0.5', '티스푼'], ['굴소스', '0.3', '티스푼'], ['고추기름', '0.3', '스푼'], ['참깨', '', '적당히']],
      steps: [],
      tip: '태국고추는 취향에 맞게 넣고, 홍탕에서 건진 고기, 푸주, 새우 완자를 소스에 절여진 양파와 함께 먹는게 포인트' },
    { id: 's27', date: '2025-03-27', cat: '소스', emoji: '🥣', img: 'assets/cards/건희소스_2025.jpg?v=1', imgFit: 'cover', tint: 'linear-gradient(160deg,#FDECD9,#F8D9BE)', name: '건희소스', ver: '달달 · 2025', source: 'YouTube 다비드 봉', star: true, desc: '<b>원어스</b>의 <b>건희</b>가 단맛 버전을 리뉴얼해 공개한 소스로, <u>입맛이 바뀌어서 조금 달라졌다</u>라며 설탕을 빼는 등 기존 레시피에서 단맛을 많이 낮췄다.',
      ings: [['땅콩참깨소스', '1', '스푼'], ['스위트칠리소스', '1', '스푼'], ['다진 파', '1', '스푼'], ['다진 마늘', '1', '스푼'], ['고추기름', '0.5', '스푼'], ['매운소고기소스', '0.5', '스푼'], ['굴소스', '0.5', '스푼'], ['태국고추', '0.5', '스푼'], ['땅콩가루', '0.5', '스푼'], ['참깨', '0.5', '스푼']],
      steps: [],
      tip: '' },
    { id: 'r1', date: '2025-01-16', cat: '밥', emoji: '🍚', img: 'assets/cards/메기살덮밥.jpg?v=2', imgFit: 'cover', tint: 'linear-gradient(160deg,#FFF6DC,#FCE4AE)', name: '메기살덮밥', source: 'X @dduuuu__', desc: '홍탕에 익힌 메기살을 특제소스에 비빈 밥에 얹어 먹는 히든 메뉴이다.',
      order: [['우유/청유 마라훠궈', '', ''], ['팡가시우메기', '1', '접시'], ['공깃밥', '1', '공기']],
      ings: [['참기름', '1', '스푼'], ['간장소스', '1', '스푼'], ['굴소스', '0.5', '스푼'], ['중국식초', '0.5', '스푼'], ['다진 파', '1', '스푼']],
      steps: [
        '소스바에서 소스를 만든다',
        '메기살은 마라훠궈 국물에 넣어 익히고, 공깃밥에는 소스를 부어 비빈다',
        '충분히 익힌 메기살을 밥에 얹어 으깨 먹는다',
      ],
      tip: '느끼한 것 같으면 홍탕 국물 1숟가락을 밥에 추가하기' },
    { id: 'r2', cat: '밥', emoji: '🍚', img: 'assets/cards/토마토달걀밥.jpg', imgFit: 'cover', tint: 'linear-gradient(160deg,#FFE9E0,#FFC9B8)', name: '토마토달걀밥', source: 'Gemini AI', desc: '녹진하게 끓인 토마토탕에 달걀물을 풀어, 밥에 끼얹어 비벼 먹는 히든 메뉴.',
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
    { id: 'n1', cat: '면', emoji: '🍜', img: 'assets/cards/토마토에그누들.jpg', imgFit: 'cover', tint: 'linear-gradient(160deg,#FFECDD,#FFC2A6)', name: '토마토에그누들', source: 'Gemini AI', desc: '녹진하게 끓인 토마토탕에 달걀물을 풀고 생면을 익혀 먹는 히든 메뉴.',
      order: [['토마토탕훠궈', '', ''], ['날계란', '1', '개'], ['생면', '1', '인분']],
      ings: [['오향우육/다진 고기', '2', '스푼'], ['다진 파', '2', '스푼']],
      steps: [
        '토마토탕이 녹진(꾸덕)해질 때까지 충분히 끓여준다',
        '소스바에서 소스를 만든다',
        '날계란에 물을 조금 섞어 풀어준 뒤, 녹진해진 토마토탕 위에 구멍 뚫린 국자를 대고 계란물을 천천히 부어준다',
        '계란이 잘 익도록 국자로 탕을 잘 저어준다',
        '맑은탕에 생면을 넣고 살짝 익힌 뒤, 토마토탕으로 옮겨 타지 않게 저으면서 잘 익혀준다',
        '면이 다 익으면 소스그릇에 토마토계란탕을 끼얹고 면을 건져 먹는다',
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

  let activeCat = '전체';
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
    document.querySelectorAll('.like-btn').forEach((btn) => {
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
      // 집계가 바뀔 때마다(내가/남이 눌렀든) 실시간으로 화면 숫자 갱신
      likesRef.on('value', (snapshot) => {
        likeCounts = snapshot.val() || {};
        saveLikes();
        refreshLikeCounts();
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

  const tabsEl = document.getElementById('tabs');
  const tabsUnderline = document.getElementById('tabsUnderline');
  const gridEl = document.getElementById('recipeGrid');
  const countEl = document.getElementById('countNum');
  const searchInput = document.getElementById('searchInput');
  const searchIcon = document.getElementById('searchIcon');
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

  function renderTabs() {
    tabsEl.querySelectorAll('.tab-btn').forEach((btn) => btn.remove());
    CATS.forEach((cat) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tab-btn' + (cat === activeCat ? ' active' : '');
      btn.textContent = cat;
      btn.addEventListener('click', () => {
        activeCat = cat;
        // 카테고리를 고르면 검색·즐겨찾기 모드에서 빠져나옴(카테고리와 독립이므로 함께 켜두면 혼란)
        if (showFavoritesOnly) {
          showFavoritesOnly = false;
          favToggleBtn.classList.remove('active');
        }
        if (query) {
          query = '';
          searchInput.value = '';
          searchBox.classList.remove('has-value');
        }
        renderTabs();
        renderGrid();
      });
      tabsEl.appendChild(btn);
    });
    const activeBtn = tabsEl.querySelector('.tab-btn.active');
    if (activeBtn) {
      tabsUnderline.style.width = `${activeBtn.offsetWidth}px`;
      tabsUnderline.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
    }
  }

  function getFiltered() {
    const q = query.trim();
    // 검색·즐겨찾기는 카테고리와 독립 — 둘 중 하나라도 켜지면 전체에서 필터함
    const ignoreCat = showFavoritesOnly || q;
    let filtered = RECIPES.filter((r) => ignoreCat || activeCat === '전체' || r.cat === activeCat);
    if (showFavoritesOnly) {
      filtered = filtered.filter((r) => favorites.has(r.id));
    }
    if (q) {
      filtered = filtered.filter((r) =>
        r.name.includes(q) || r.ings.some((i) => i[0].includes(q))
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

  function renderGrid() {
    const filtered = getFiltered();
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

  function renderIngList(el, items) {
    el.innerHTML = '';
    items.forEach((i) => {
      const row = document.createElement('div');
      row.className = 'ing-row';
      row.innerHTML = `
        <span class="ing-name">${i[0]}</span>
        <span class="ing-amt">${i[1]}</span>
        <span class="ing-unit">${i[2]}</span>
      `;
      el.appendChild(row);
    });
  }

  let currentModalRecipe = null;

  function openModal(r) {
    currentModalRecipe = r;
    syncTopbarH(); // 모바일 전체화면 패널이 상단바 바로 아래에서 시작하도록 열 때마다 재측정
    document.body.style.overflow = 'hidden';

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
    document.getElementById('modalDesc').innerHTML = r.desc; // desc는 고유명사 <b> 강조 등 제한적 HTML 허용(작성자 데이터)
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

    renderIngList(document.getElementById('modalIngs'), sortIngs(r.ings));

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
    document.body.style.overflow = '';
    modalOverlay.classList.remove('open');
  }

  modalOverlay.addEventListener('click', closeModal);
  modalScroll.addEventListener('click', (e) => e.stopPropagation());
  modalClose.addEventListener('click', closeModal);

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
  // 상세가 열린 채 상단바(탭·검색·즐겨찾기 등)를 누르면 상세를 닫고 그 동작을 그대로 실행
  topbarEl.addEventListener('click', () => {
    if (modalOverlay.classList.contains('open')) closeModal();
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
    // 검색은 카테고리와 독립 — 검색 시작하면 탭을 '전체'로 되돌려 켜진 탭과 결과를 일치시킴
    if (query.trim() && activeCat !== '전체') {
      activeCat = '전체';
      renderTabs();
    }
    renderGrid();
  });
  searchIcon.addEventListener('click', () => searchInput.focus());
  favToggleBtn.addEventListener('click', () => {
    showFavoritesOnly = !showFavoritesOnly;
    favToggleBtn.classList.toggle('active', showFavoritesOnly);
    // 즐겨찾기도 카테고리와 독립 — 켤 때 탭을 '전체'로 되돌림
    if (showFavoritesOnly && activeCat !== '전체') {
      activeCat = '전체';
      renderTabs();
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
    document.body.style.overflow = 'hidden';
    // 첫 뽑기에서도 카드가 흰 네모로 안 뜨게, 소스 이미지를 미리 받아둔다(한 번만)
    if (!gachaPreloaded) {
      gachaPreloaded = true;
      GACHA_POOL.forEach((r) => { const im = new Image(); im.src = r.img; });
    }
    gachaToStart();
    gachaOverlay.classList.add('open');
  }

  function closeGacha() {
    document.body.style.overflow = '';
    gachaOverlay.classList.remove('open');
  }

  gachaBtn.addEventListener('click', openGacha);
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

  renderTabs();
  renderGrid();

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

  // 플로팅 버튼(공유/설치)이 카드 하단과 푸터 사이 여백의 "중앙"에 오도록.
  // 여백(.main 아래쪽)을 플로터 높이 + 위아래 간격만큼 확보한 뒤, 푸터가 보이면 그만큼 위로 밀어 올림
  const floatingActions = document.getElementById('floatingActions');
  const footerEl = document.querySelector('.footer');
  const mainEl = document.querySelector('.main');
  const FLOATING_GAP = 20;

  function updateFloatingActionsDock() {
    if (window.innerWidth > 640) {
      floatingActions.style.bottom = '';
      mainEl.style.paddingBottom = '';
      return;
    }
    const faHeight = floatingActions.getBoundingClientRect().height;
    // 카드-푸터 사이 여백 = 플로터 높이 + 위아래 각 FLOATING_GAP → 플로터가 그 중앙에 위치
    const pad = `${Math.round(faHeight + FLOATING_GAP * 2)}px`;
    if (mainEl.style.paddingBottom !== pad) {
      mainEl.style.paddingBottom = pad;
    }
    const footerVisible = window.innerHeight - footerEl.getBoundingClientRect().top;
    floatingActions.style.bottom = footerVisible > 0 ? `${FLOATING_GAP + footerVisible}px` : '';
  }

  window.addEventListener('scroll', updateFloatingActionsDock, { passive: true });
  window.addEventListener('resize', updateFloatingActionsDock);
  updateFloatingActionsDock();

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

  // ADD TO HOME SCREEN (iOS Safari — no install API exists, so we guide manually)
  const a2hsBtn = document.getElementById('a2hsBtn');
  const a2hsOverlay = document.getElementById('a2hsOverlay');
  const a2hsClose = document.getElementById('a2hsClose');
  const topInstallBtn = document.getElementById('topInstallBtn');

  if (a2hsBtn && isIosSafariNotInstalled()) {
    a2hsBtn.style.display = 'flex';
    topInstallBtn.style.display = 'flex';
    const openA2hsOverlay = () => a2hsOverlay.classList.add('open');
    a2hsBtn.addEventListener('click', openA2hsOverlay);
    topInstallBtn.addEventListener('click', openA2hsOverlay);
    a2hsOverlay.addEventListener('click', (e) => {
      if (e.target === a2hsOverlay) a2hsOverlay.classList.remove('open');
    });
    a2hsClose.addEventListener('click', () => a2hsOverlay.classList.remove('open'));
  }

  // INSTALL APP (Android Chrome/삼성 인터넷 — 표준 설치 프롬프트 이용)
  const androidInstallBtn = document.getElementById('androidInstallBtn');
  let deferredInstallPrompt = null;

  window.addEventListener('beforeinstallprompt', (e) => {
    if (isInAppBrowser || isStandalone) return;
    e.preventDefault();
    deferredInstallPrompt = e;
    androidInstallBtn.style.display = 'flex';
    topInstallBtn.style.display = 'flex';
  });

  async function promptAndroidInstall() {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    androidInstallBtn.style.display = 'none';
    topInstallBtn.style.display = 'none';
  }

  androidInstallBtn.addEventListener('click', promptAndroidInstall);
  topInstallBtn.addEventListener('click', () => {
    if (deferredInstallPrompt) promptAndroidInstall();
  });

  window.addEventListener('appinstalled', () => {
    androidInstallBtn.style.display = 'none';
    topInstallBtn.style.display = 'none';
  });

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
})();
