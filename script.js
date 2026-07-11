(() => {
  const CATS = ['전체', '소스', '육수', '밥', '면', '기타'];

  // ── 정식 재료·단위 목록 (하이디라오 소스바 — 지점별 포함 실제로 있는 것만) ──
  // 레시피의 ings/order/단위는 아래 목록 안에서만 써야 이름이 어긋나지 않아요.
  // 진짜 새 재료라면 → 먼저 아래 목록에 추가한 뒤 레시피에 쓰세요.
  // 목록에 없는 이름을 쓰면 사이트 로딩 시 브라우저 콘솔(F12)에 경고가 떠요.
  // SAUCE_BAR 배열 순서 = 재료 "서빙 순서"이기도 함. 레시피 ings는 화면에 렌더될 때
  // 이 순서로 자동 정렬됨(아래 sortIngs). 그러니 새 재료는 알맞은 그룹 위치에 넣을 것.
  // ('[건더기만]' 짝은 원본과 의도적으로 구분된 별개 항목이니 합치지 말 것. [대괄호]=변형·옵션 규칙.)
  const SAUCE_BAR = [                       // 소스바 재료 (레시피의 ings 에 쓰는 이름)
    // 1) 베이스 소스
    '땅콩참깨소스', '스위트칠리소스', '고추귀리소스', '칠리갈릭소스', '부추소스', '버섯소스', '사차장', '발효콩장', '발효두부소스', '청유훠궈소스',
    // 2) 액체 양념
    '굴소스', '간장소스', '중국식초',
    // 3) 고기·건더기
    '매운소고기소스', '매운소고기소스[건더기만]', '청유훠궈소스[건더기만]', '오향우육(다진고기)', '튀긴대두',
    // 4) 채소·향신
    '다진마늘', '다진파', '다진양파', '태국고추', '산고추', '셀러리', '고수', '와사비',
    // 5) 가루류
    '땅콩가루', '마라시즈닝(고춧가루)', '참깨',
    // 6) 기름류
    '고추기름', '산초기름', '참기름',
    // 7) 간·기타
    '설탕', '소금', '미원', '만구향',
  ];
  const ORDER_ITEMS = ['공깃밥', '날계란', '생면', '팡가시우메기'];  // 직원에게 주문하는 항목 (order 에 쓰는 이름)
  const UNITS = ['스푼', '티스푼', '집게', '바퀴', '개', '공기', '접시', '인분', '넉넉하게', '적당히', '한 꼬집'];  // 정식 단위

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
    { id: 's1', date: '2021-12-26', cat: '소스', emoji: '🥣', img: 'assets/cards/건희소스[단]_2021.jpg?v=2', imgFit: 'cover', imgBg: '#A8CCDC', tint: 'linear-gradient(160deg,#FDECD9,#F8D9BE)', name: '건희소스[단]', ver: '2021', source: '버블 건희(ONEUS)', desc: '아이돌 그룹 \'ONEUS\'의 \'건희\'가 버블에 공개한 소스로, 현 시점 대한민국에서 가장 유명한 소스이다.',
      ings: [['땅콩참깨소스', '1', '스푼'], ['스위트칠리소스', '2.5', '스푼'], ['다진마늘', '0.5', '스푼'], ['다진파', '0.5', '스푼'], ['참깨', '1', '티스푼'], ['땅콩가루', '1', '티스푼'], ['마라시즈닝(고춧가루)', '0.5', '티스푼'], ['고추기름', '1', '티스푼'], ['설탕', '0.3', '티스푼'], ['매운소고기소스', '0.5', '티스푼']],
      steps: [],
      tip: '너무 달면 스위트칠리소스는 1스푼으로 줄이기' },
    { id: 's16', date: '2021-12-26', cat: '소스', emoji: '🥣', img: 'assets/cards/건희소스[짠]_2021.jpg?v=2', imgFit: 'cover', imgBg: '#A8CCDC', tint: 'linear-gradient(160deg,#FDECD9,#F8D9BE)', name: '건희소스[짠]', ver: '2021', source: '버블 건희(ONEUS)', desc: '아이돌 그룹 \'ONEUS\'의 \'건희\'가 버블에 공개한 소스의 짠맛 버전. 단맛 없이 고소하고 짭짤하게 즐기는 스타일이다.',
      ings: [['소금', '3', '티스푼'], ['참기름', '3', '스푼'], ['고추기름', '0.5', '스푼'], ['다진마늘', '1', '스푼'], ['참깨', '1', '티스푼'], ['마라시즈닝(고춧가루)', '1', '티스푼']],
      steps: [],
      tip: '' },
    { id: 's4', date: '2026-01-27', cat: '소스', emoji: '🥣', img: 'assets/cards/화령소스.jpg', imgFit: 'cover', tint: 'linear-gradient(160deg,#F5E1C8,#E8C79A)', name: '화령소스', source: '네이버블로그 sjsilver23', desc: '하이디라오 부산역점 직원이 네이버 블로거인 지금이네(sjsilver23)에게 가져다준 소스로 그 포스팅을 \'이예지\'가 발견하면서 알려진 소스이다.',
      ings: [['땅콩참깨소스', '0.25', '스푼'], ['스위트칠리소스', '3.5~4', '스푼'], ['튀긴대두', '2~3', '스푼'], ['참기름', '0.5', '스푼'], ['고추기름', '0.5', '스푼'], ['다진양파', '3', '스푼'], ['다진파', '3', '스푼'], ['다진마늘', '1', '스푼']],
      steps: [],
      tip: '튀긴대두, 양파, 다진파, 다진마늘은 많으면 많을수록 맛있음' },
    { id: 's2', date: '2022-01-22', cat: '소스', emoji: '🥣', img: 'assets/cards/쑨디2호소스_2022.jpg', imgFit: 'cover', tint: 'linear-gradient(160deg,#FBDCD3,#F5B8A8)', name: '쑨디2호소스', ver: '2022', source: 'X @deeplovehalf', desc: '트위터리안 \'쑨디\'가 2022년 트위터(현재: X)에 공개한 소스로 정식 명칭은 쑨디2호소스(1호는 없지만 멋있어 보여서 그냥 이름을 2호라고 지었다고 함)이다.',
      ings: [['매운소고기소스[건더기만]', '0.5', '스푼'], ['청유훠궈소스[건더기만]', '0.5', '스푼'], ['땅콩가루', '', '넉넉하게'], ['다진파', '', '넉넉하게'], ['다진마늘', '0.5', '스푼'], ['스위트칠리소스', '0.5', '스푼'], ['굴소스', '0.5', '스푼'], ['땅콩참깨소스', '0.25', '스푼']],
      steps: [],
      tip: '' },
    { id: 's3', date: '2024-07-28', cat: '소스', emoji: '🥣', img: 'assets/cards/쑨디2호소스_2024.jpg', imgFit: 'cover', tint: 'linear-gradient(160deg,#FFE0C2,#F8B888)', name: '쑨디2호소스', ver: '2024', source: 'YouTube 쑨디', desc: '쑨디2호소스의 개발자인 \'쑨디\'가 트위터(현재: X)에 공개한 레시피에 일부 오류가 있어서 본인의 유튜브를 통해 공식적으로 정정한 소스이다.',
      ings: [['땅콩참깨소스', '0.5', '스푼'], ['다진파', '', '넉넉하게'], ['스위트칠리소스', '0.5', '스푼'], ['다진마늘', '3', '스푼'], ['굴소스', '1', '스푼'], ['매운소고기소스[건더기만]', '1', '스푼'], ['청유훠궈소스[건더기만]', '2', '스푼'], ['땅콩가루', '2', '스푼'], ['만구향', '1', '스푼']],
      steps: [],
      tip: '' },
    { id: 's5', date: '2025-04-11', cat: '소스', emoji: '🥣', img: 'assets/cards/영지소스_2025.jpg?v=2', imgFit: 'cover', tint: 'linear-gradient(160deg,#F5E6D3,#E8C9A0)', name: '영지소스', ver: '2025', source: 'YouTube 채널십오야', desc: '유튜브 채널 \'채널십오야\'의 나영석의 보글보글 촬영 중 \'이영지\'가 공개한 소스이다.',
      ings: [['땅콩참깨소스', '2', '스푼'], ['스위트칠리소스', '1.5', '스푼'], ['태국고추', '2', '스푼'], ['마라시즈닝(고춧가루)', '1.5', '스푼'], ['다진파', '1.5', '스푼'], ['다진마늘', '1', '스푼'], ['참기름', '2', '바퀴'], ['간장소스', '1', '바퀴'], ['오향우육(다진고기)', '1.5', '스푼'], ['참깨', '', '적당히'], ['설탕', '', '한 꼬집'], ['땅콩가루', '', '한 꼬집']],
      steps: [],
      tip: '' },
    { id: 's7', date: '2025-04-11', cat: '소스', emoji: '🥣', img: 'assets/cards/마크소스.jpg', imgFit: 'cover', tint: 'linear-gradient(160deg,#FDEBD0,#F5C99B)', name: '마크소스', source: 'YouTube 채널십오야', desc: '유튜브 채널 \'채널십오야\'의 나영석의 보글보글 촬영 중 \'마크\'가 공개한 소스이다.',
      ings: [['땅콩참깨소스', '2', '스푼'], ['다진마늘', '1.5', '스푼'], ['다진양파', '1.5', '스푼'], ['굴소스', '1', '스푼'], ['태국고추', '1', '스푼'], ['간장소스', '2', '스푼'], ['오향우육(다진고기)', '', '적당히'], ['다진파', '', '적당히'], ['땅콩가루', '', '적당히'], ['마라시즈닝(고춧가루)', '', '적당히']],
      steps: [],
      tip: '' },
    { id: 's14', date: '2026-05-18', cat: '소스', emoji: '🥣', img: 'assets/cards/라젤소스.jpg', imgFit: 'cover', tint: 'linear-gradient(160deg,#EAF3D8,#C9DFA0)', name: '라젤소스', source: 'YouTube 라젤Razel', desc: '유튜브 채널 \'라젤Razel\'에서 라젤이 좋아한다며 공개한 간장 베이스 소스이다.',
      ings: [['다진양파', '', '넉넉하게'], ['간장소스', '2', '스푼'], ['다진마늘', '1', '스푼'], ['다진파', '1', '스푼'], ['고추기름', '1', '스푼'], ['마라시즈닝(고춧가루)', '1', '스푼'], ['중국식초', '1', '스푼'], ['참기름', '0.5', '스푼'], ['태국고추', '', '넉넉하게']],
      steps: [],
      tip: '' },
    { id: 's15', date: '2026-05-18', cat: '소스', emoji: '🥣', img: 'assets/cards/라젤 아는 동생소스.jpg', imgFit: 'cover', tint: 'linear-gradient(160deg,#F3E8D6,#DCC39E)', name: '라젤 아는 동생소스', source: 'YouTube 라젤Razel', desc: '유튜브 채널 \'라젤Razel\'에서 라젤이 \'아는 동생이 이렇게 먹는다\'며 소개한 소스이다.',
      ings: [['참기름', '2', '스푼'], ['소금', '0.5', '스푼'], ['다진마늘', '1', '스푼'], ['다진파', '1', '스푼'], ['태국고추', '1', '스푼']],
      steps: [],
      tip: '' },
    { id: 'r1', date: '2025-01-16', cat: '밥', emoji: '🍚', img: 'assets/cards/메기살덮밥.jpg', imgFit: 'cover', tint: 'linear-gradient(160deg,#FFF6DC,#FCE4AE)', name: '메기살덮밥', source: 'X @dduuuu__', desc: '마라훠궈 국물에 익힌 메기살을 특제소스에 비빈 밥에 얹어 먹는 히든 메뉴로 X에서 #초콜렛밥 이라는 해시태그가 걸려있다.',
      order: [['팡가시우메기', '1', '접시'], ['공깃밥', '1', '공기']],
      ings: [['참기름', '1', '스푼'], ['간장소스', '1', '스푼'], ['굴소스', '0.5', '스푼'], ['중국식초', '0.5', '스푼'], ['다진파', '1', '스푼']],
      steps: [
        '소스바에서 소스를 만든다',
        '메기살은 마라훠궈 국물에 넣어 익히고, 공깃밥에는 소스를 부어 비빈다',
        '충분히 익힌 메기살을 밥에 얹어 으깨 먹는다',
      ],
      tip: '느끼한 것 같으면 마라훠궈 국물 1숟가락을 밥에 추가하기' },
    { id: 'r2', cat: '밥', emoji: '🍚', img: 'assets/cards/토마토달걀밥.jpg', imgFit: 'cover', tint: 'linear-gradient(160deg,#FFE9E0,#FFC9B8)', name: '토마토달걀밥', source: 'Gemini AI', desc: '녹진하게 끓인 토마토탕에 달걀물을 풀어, 밥에 끼얹어 비벼 먹는 히든 메뉴.',
      order: [['날계란', '1', '개'], ['공깃밥', '1', '공기']],
      ings: [['참기름', '0.5', '스푼'], ['오향우육(다진고기)', '2', '스푼'], ['다진파', '2', '스푼']],
      steps: [
        '토마토탕이 녹진(꾸덕)해질 때까지 충분히 끓여준다',
        '소스바에서 소스를 만든다',
        '날계란에 물을 조금 섞어 풀어준 뒤, 녹진해진 토마토탕 위에 구멍 뚫린 국자를 대고 계란물을 천천히 부어준다',
        '계란이 잘 익도록 국자로 탕을 잘 저어준다',
        '소스가 담긴 밥에 토마토계란탕을 끼얹어 비벼 먹는다',
      ],
      tip: '토마토탕 안에 토마토를 국자로 으깨주기' },
    { id: 'n1', cat: '면', emoji: '🍜', img: 'assets/cards/토마토에그누들.jpg', imgFit: 'cover', tint: 'linear-gradient(160deg,#FFECDD,#FFC2A6)', name: '토마토에그누들', source: 'Gemini AI', desc: '녹진하게 끓인 토마토탕에 달걀물을 풀고 생면을 익혀 먹는 히든 메뉴.',
      order: [['날계란', '1', '개'], ['생면', '1', '인분']],
      ings: [['오향우육(다진고기)', '2', '스푼'], ['다진파', '2', '스푼']],
      steps: [
        '토마토탕이 녹진(꾸덕)해질 때까지 충분히 끓여준다',
        '소스바에서 소스를 만든다',
        '날계란에 물을 조금 섞어 풀어준 뒤, 녹진해진 토마토탕 위에 구멍 뚫린 국자를 대고 계란물을 천천히 부어준다',
        '계란이 잘 익도록 국자로 탕을 잘 저어준다',
        '맑은탕에 생면을 넣고 살짝 익힌 뒤, 토마토탕으로 옮겨 타지 않게 저으면서 잘 익혀준다',
        '면이 다 익으면 소스그릇에 토마토계란탕을 끼얹고 면을 건져 먹는다',
      ],
      tip: '토마토탕 안에 토마토를 국자로 으깨주기' },
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
      const card = document.createElement('div');
      card.className = 'recipe-card';
      card.innerHTML = `
        <div class="recipe-thumb" style="background:${r.img ? (r.imgBg || '#fff') : r.tint}">${r.img ? `<img class="recipe-thumb-img${r.imgFit === 'cover' ? ' recipe-thumb-img--cover' : ''}" src="${r.img}" alt="${r.name}" draggable="false" loading="lazy"${r.imgPosition ? ` style="object-position:${r.imgPosition}"` : ''}><div class="recipe-thumb-overlay">${r.source ? `<div class="recipe-thumb-source">${r.source}</div>` : ''}</div>` : `<span>${r.emoji}</span>`}<button class="fav-star${favorites.has(r.id) ? ' active' : ''}" data-id="${r.id}" type="button" aria-label="즐겨찾기"><svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg></button></div>
        <div class="recipe-body">
          <div class="recipe-cat-row">
            <span class="recipe-cat-label">${r.cat}</span>
            <h3 class="recipe-name${r.name.length >= 10 ? ' recipe-name--long' : ''}">${r.name}</h3>
            <span class="recipe-ver">${r.ver || ''}</span>
          </div>
          <button class="like-btn${likedByMe.has(r.id) ? ' active' : ''}" data-id="${r.id}" type="button" aria-label="좋아요"><svg width="17" height="17" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg><span class="like-count">${getLikeCount(r.id)}</span></button>
        </div>
      `;
      card.addEventListener('click', () => openModal(r));
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
      gridEl.appendChild(card);
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
    document.body.style.overflow = 'hidden';
    document.getElementById('modalName').textContent = r.name;
    document.getElementById('modalCat').textContent = r.cat;
    document.getElementById('modalDesc').textContent = r.desc;
    modalFavBtn.classList.toggle('active', favorites.has(r.id));

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

    modalOverlay.classList.add('open');
    modalScroll.scrollTop = 0;
  }

  function closeModal() {
    document.body.style.overflow = '';
    modalOverlay.classList.remove('open');
  }

  modalOverlay.addEventListener('click', closeModal);
  modalScroll.addEventListener('click', (e) => e.stopPropagation());
  modalClose.addEventListener('click', closeModal);
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
      const ver = r.ver ? '<div class="gacha-card-ver">' + r.ver + '</div>' : '';
      // 카드는 opacity 0(리셋 상태)로 먼저 그려두고, 이미지가 실제로 로드된 뒤에만 공개한다.
      // → 캐시 여부와 무관하게 카드가 흰 네모로 먼저 뜨는 현상 방지.
      gachaResult.innerHTML =
        '<div class="gacha-card">' +
        '<div class="gacha-card-thumb" style="background:' + (r.imgBg || '#fff') + '"><img src="' + r.img + '" alt="' + r.name + '" style="object-position:' + (r.imgPosition || 'center') + '" draggable="false"></div>' +
        '<div class="gacha-card-body"><span class="gacha-card-cat">소스</span><div class="gacha-card-name">' + r.name + '</div>' + ver + '</div>' +
        '</div>';
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
      const cardImg = gachaResult.querySelector('.gacha-card-thumb img');
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
  const shareBtn = document.getElementById('shareBtn');
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

  shareBtn.addEventListener('click', shareSite);
  topShareBtn.addEventListener('click', shareSite);
})();
