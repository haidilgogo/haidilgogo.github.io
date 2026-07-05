(() => {
  const CATS = ['전체', '소스', '육수', '밥', '면', '기타'];

  const EMOJI = {
    '마장(참깨)': '🥜', '마장': '🥜', '굴소스': '🦪', '사테소스': '🥜', '고추기름': '🛢️',
    '다진마늘': '🧄', '고수': '🌿', '부추': '🌿', '청양고추': '🌶️', '파': '🌿',
    '식초': '🧴', '간장': '🍶', '땅콩분태': '🥜', '공깃밥': '🍚', '계란': '🥚',
    '김가루': '🍙', '토마토육수': '🍅', '치즈': '🧀', '면': '🍜', '숙주': '🌱',
    '마라육수': '🌶️', '토마토탕': '🍅', '완자': '🍡', '팽이버섯': '🍄', '청경채': '🥬',
    '마라탕': '🌶️', '백탕': '🍲', '소고기': '🥩', '배추': '🥬', '버섯탕': '🍄',
    '두부': '⬜', '아이스크림': '🍨', '과일': '🍓', '견과': '🥜', '우유(육수바)': '🥛',
    '땅콩참깨소스': '🥜', '스위트칠리소스': '🌶️', '다진파': '🌿', '깨': '⚪', '땅콩가루': '🥜',
    '마라시즈닝': '🌶️', '설탕': '🍬', '매운소고기': '🥩',
    '참기름': '🫗', '중국식초': '🧴', '팡가시우메기': '🐟',
    '날계란': '🥚', '오향우육(다진고기)': '🥩', '생면': '🍜',
  };

  const RECIPES = [
    { id: 's1', cat: '소스', emoji: '🥣', img: 'assets/recipe card_건희소스.png', imgBg: '#A8CCDC', tint: 'linear-gradient(160deg,#FDECD9,#F8D9BE)', name: '건희소스', source: '버블 건희(ONEUS)', desc: '아이돌 그룹 \'ONEUS\'의 \'건희\'가 버블에 공개한 소스로, 현 시점 대한민국에서 가장 유명한 소스이다.',
      ings: [['땅콩참깨소스', '1', '스푼'], ['스위트칠리소스', '2.5', '스푼'], ['다진마늘', '0.5', '스푼'], ['다진파', '0.5', '집게'], ['깨', '1', '티스푼'], ['땅콩가루', '1', '티스푼'], ['마라시즈닝(고춧가루)', '0.5', '티스푼'], ['고추기름', '1', '티스푼'], ['설탕', '0.3', '티스푼'], ['매운소고기', '0.5', '티스푼']],
      steps: [],
      tip: '너무 달면 스위트칠리소스는 1스푼으로 줄이기' },
    { id: 's4', cat: '소스', emoji: '🥣', img: 'assets/recipe card_화령소스.jpg', imgFit: 'cover', tint: 'linear-gradient(160deg,#F5E1C8,#E8C79A)', name: '화령소스', source: '네이버블로그 sjsilver23', desc: '하이디라오 부산역점 직원이 네이버 블로거인 지금이네(sjsilver23)에게 가져다준 소스로 그 포스팅을 \'이예지\'가 발견하면서 알려진 소스이다.',
      ings: [['땅콩참깨소스', '0.25', '스푼'], ['스위트칠리소스', '3.5~4', '스푼'], ['튀긴대두', '2~3', '스푼'], ['참기름', '0.5', '스푼'], ['고추기름', '0.5', '스푼'], ['양파', '3', '스푼'], ['다진파', '3', '집게'], ['다진마늘', '1', '스푼']],
      steps: [],
      tip: '튀긴대두, 양파, 다진파, 다진마늘은 많으면 많을수록 맛있음' },
    { id: 's2', cat: '소스', emoji: '🥣', img: 'assets/recipe card_쑨디2호소스.png', imgBg: '#161D25', tint: 'linear-gradient(160deg,#FBDCD3,#F5B8A8)', name: '쑨디2호소스', source: 'X 쑨디', desc: '트위터리안 \'쑨디\'가 2022년 트위터(현재: X)에 공개한 소스로 정식 명칭은 쑨디2호소스(1호는 없지만 멋있어 보여서 그냥 이름을 2호라고 지었다고 함)이다.',
      ings: [['매운소고기 - 건더기만', '0.5', '스푼'], ['청유훠궈소스 - 건더기만', '0.5', '스푼'], ['땅콩가루', '', '넉넉하게'], ['다진파', '', '넉넉하게'], ['다진마늘', '0.5', '스푼'], ['스위트칠리소스', '0.5', '스푼'], ['굴소스', '0.5', '스푼'], ['땅콩참깨소스', '0.25', '스푼']],
      steps: [],
      tip: '' },
    { id: 's3', cat: '소스', emoji: '🥣', img: 'assets/recipe card_쑨디소스(2024ver.).jpg', imgFit: 'cover', imgPosition: 'left 45%', tint: 'linear-gradient(160deg,#FFE0C2,#F8B888)', name: '쑨디2호소스(2024ver.)', source: 'YouTube 쑨디', desc: '쑨디2호소스의 개발자인 \'쑨디\'가 트위터(현재: X)에 공개한 레시피에 일부 오류가 있어서 본인의 유튜브를 통해 공식적으로 정정한 소스이다.',
      ings: [['땅콩참깨소스', '0.5', '스푼'], ['다진파', '', '넉넉하게'], ['스위트칠리소스', '0.5', '스푼'], ['다진마늘', '3', '스푼'], ['굴소스', '1', '스푼'], ['매운소고기 - 건더기만', '1', '스푼'], ['청유훠궈소스 - 건더기만', '2', '스푼'], ['땅콩가루', '2', '스푼'], ['만구향', '1', '스푼']],
      steps: [],
      tip: '' },
    { id: 's5', cat: '소스', emoji: '🥣', img: 'assets/recipe card_영지소스.jpg', imgFit: 'cover', imgPosition: 'right 12%', tint: 'linear-gradient(160deg,#F5E6D3,#E8C9A0)', name: '영지소스', source: 'YouTube 채널십오야', desc: '유튜브 채널 \'채널십오야\'의 나영석의 보글보글 촬영 중 \'이영지\'가 공개한 소스이다.',
      ings: [['땅콩참깨소스', '2', '스푼'], ['스위트칠리소스', '1.5', '스푼'], ['태국고추', '2', '스푼'], ['마라시즈닝(고춧가루)', '1.5', '스푼'], ['다진파', '1.5', '집게'], ['다진마늘', '1', '스푼'], ['참기름', '2', '바퀴'], ['간장소스', '1', '바퀴'], ['오향우육(다진고기)', '1.5', '스푼'], ['깨', '', '적당히'], ['설탕', '', '한 꼬집'], ['땅콩가루', '', '한 꼬집']],
      steps: [],
      tip: '' },
    { id: 'r1', cat: '밥', emoji: '🍚', tint: 'linear-gradient(160deg,#FFF6DC,#FCE4AE)', name: '메기살덮밥', desc: '마라훠궈 국물에 익힌 메기살을 특제소스에 비빈 밥에 얹어 먹는 히든 메뉴.',
      order: [['팡가시우메기', '1', '접시'], ['공깃밥', '1', '공기']],
      ings: [['참기름', '1', '스푼'], ['간장소스', '1', '스푼'], ['굴소스', '0.5', '스푼'], ['중국식초', '0.5', '스푼'], ['다진파', '1', '집게'], ['다진마늘', '0.5', '스푼']],
      steps: [
        '소스바에서 소스를 만든다',
        '메기살은 마라훠궈 국물에 넣어 익히고, 공깃밥에는 소스를 부어 비빈다',
        '충분히 익힌 메기살을 밥에 얹어 으깨 먹는다',
      ],
      tip: '느끼하면 마라훠궈 국물을 밥에 조금 섞어주기' },
    { id: 'r2', cat: '밥', emoji: '🍚', tint: 'linear-gradient(160deg,#FFE9E0,#FFC9B8)', name: '토마토계란국밥', desc: '녹진하게 끓인 토마토탕에 계란물을 풀어, 밥에 끼얹어 비벼 먹는 히든 메뉴.',
      order: [['날계란', '1', '개'], ['공깃밥', '1', '공기']],
      ings: [['참기름', '0.5', '스푼'], ['오향우육(다진고기)', '2', '스푼'], ['다진파', '2', '집게']],
      steps: [
        '토마토탕이 녹진(꾸덕)해질 때까지 충분히 끓여준다',
        '소스바에서 소스를 만든다',
        '날계란에 물을 조금 섞어 풀어준 뒤, 녹진해진 토마토탕 위에 구멍 뚫린 국자를 대고 계란물을 천천히 부어준다',
        '계란이 잘 익도록 국자로 탕을 잘 저어준다',
        '소스가 담긴 밥에 토마토계란탕을 끼얹어 비벼 먹는다',
      ],
      tip: '토마토탕 안에 토마토를 국자로 으깨주기' },
    { id: 'n1', cat: '면', emoji: '🍜', tint: 'linear-gradient(160deg,#FFECDD,#FFC2A6)', name: '토마토에그누들', desc: '녹진하게 끓인 토마토탕에 계란물을 풀고 생면을 익혀 먹는 히든 메뉴.',
      order: [['날계란', '1', '개'], ['생면', '1', '인분']],
      ings: [['오향우육(다진고기)', '2', '스푼'], ['다진파', '2', '집게']],
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

  let activeCat = '전체';
  let query = '';

  const tabsEl = document.getElementById('tabs');
  const tabsUnderline = document.getElementById('tabsUnderline');
  const gridEl = document.getElementById('recipeGrid');
  const countEl = document.getElementById('countNum');
  const searchInput = document.getElementById('searchInput');
  const searchIcon = document.getElementById('searchIcon');
  const searchClear = document.getElementById('searchClear');
  const searchBox = document.querySelector('.search-box');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalScroll = document.getElementById('recipe-modal-scroll');
  const modalClose = document.getElementById('modalClose');

  function renderTabs() {
    tabsEl.querySelectorAll('.tab-btn').forEach((btn) => btn.remove());
    CATS.forEach((cat) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tab-btn' + (cat === activeCat ? ' active' : '');
      btn.textContent = cat;
      btn.addEventListener('click', () => {
        activeCat = cat;
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
    let filtered = RECIPES.filter((r) => activeCat === '전체' || r.cat === activeCat);
    const q = query.trim();
    if (q) {
      filtered = filtered.filter((r) =>
        r.name.includes(q) || r.desc.includes(q) || r.ings.some((i) => i[0].includes(q))
      );
    }
    return filtered;
  }

  function renderGrid() {
    const filtered = getFiltered();
    countEl.textContent = filtered.length;
    gridEl.innerHTML = '';
    filtered.forEach((r) => {
      const card = document.createElement('div');
      card.className = 'recipe-card';
      card.innerHTML = `
        <div class="recipe-thumb" style="background:${r.img ? (r.imgBg || '#fff') : r.tint}">${r.img ? `<img class="recipe-thumb-img${r.imgFit === 'cover' ? ' recipe-thumb-img--cover' : ''}" src="${r.img}" alt="${r.name}"${r.imgPosition ? ` style="object-position:${r.imgPosition}"` : ''}><div class="recipe-thumb-overlay">${r.source ? `<div class="recipe-thumb-source">${r.source}</div>` : ''}</div>` : `<span>${r.emoji}</span>`}</div>
        <div class="recipe-body">
          <div class="recipe-cat-row">
            <span class="recipe-cat-label">${r.cat}</span>
          </div>
          <h3 class="recipe-name">${r.name}</h3>
          <p class="recipe-desc">${r.desc}</p>
        </div>
      `;
      card.addEventListener('click', () => openModal(r));
      gridEl.appendChild(card);
    });
  }

  function renderIngList(el, items, showEmoji = true) {
    el.innerHTML = '';
    items.forEach((i) => {
      const row = document.createElement('div');
      row.className = 'ing-row';
      const emojiHtml = showEmoji ? `<span class="ing-emoji">${EMOJI[i[0]] || '•'}</span>` : '';
      row.innerHTML = `
        ${emojiHtml}
        <span class="ing-name">${i[0]}</span>
        <span class="ing-amt">${i[1]}</span>
        <span class="ing-unit">${i[2]}</span>
      `;
      el.appendChild(row);
    });
  }

  function openModal(r) {
    document.body.style.overflow = 'hidden';
    document.getElementById('modalName').textContent = r.name;
    document.getElementById('modalCat').textContent = r.cat;
    document.getElementById('modalDesc').textContent = r.desc;

    const orderWrap = document.getElementById('modalOrderWrap');
    if (r.order && r.order.length > 0) {
      orderWrap.style.display = '';
      renderIngList(document.getElementById('modalOrder'), r.order, false);
    } else {
      orderWrap.style.display = 'none';
    }

    renderIngList(document.getElementById('modalIngs'), r.ings, false);

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

  searchInput.addEventListener('input', (e) => {
    query = e.target.value;
    searchBox.classList.toggle('has-value', query.length > 0);
    renderGrid();
  });
  searchIcon.addEventListener('click', () => searchInput.focus());
  searchClear.addEventListener('click', () => {
    query = '';
    searchInput.value = '';
    searchBox.classList.remove('has-value');
    renderGrid();
    searchInput.focus();
  });

  renderTabs();
  renderGrid();

  const ptrIndicator = document.getElementById('ptrIndicator');
  const ptrText = document.getElementById('ptrText');
  const ptrSuffix = document.getElementById('ptrSuffix');
  const ptrDots = document.getElementById('ptrDots');
  const ptrPage = document.querySelector('.page');
  const PTR_THRESHOLD = 65;
  const PTR_MAX = Math.round(window.innerHeight * 0.55);
  const PTR_SHOW_AT = 8;
  const PTR_EMOJI_RAMP = PTR_MAX * 0.55;
  const PTR_RELOAD_DELAY = 320;
  ptrSuffix.style.setProperty('--ptr-suffix-w', `${ptrSuffix.scrollWidth}px`);
  let ptrStartY = 0;
  let ptrPulling = false;
  let ptrDistance = 0;
  let emojiBurstTriggered = false;

  function triggerEmojiBurst() {
    emojiBurstTriggered = true;
    ptrIndicator.classList.add('emoji-burst');
    ptrIndicator.style.setProperty('--ptr-emoji-sp', '1.3');
    ptrIndicator.style.setProperty('--ptr-emoji-op', '0');
    ptrIndicator.style.setProperty('--ptr-emoji-rp', '1.3');
  }

  function setPtrTransform(dist) {
    ptrPage.style.transform = dist ? `translateY(${dist}px)` : '';
    const growProgress = Math.min(Math.max((dist - PTR_SHOW_AT) / (PTR_MAX - PTR_SHOW_AT), 0), 1);
    const scale = 0.7 + growProgress * 0.5;
    ptrIndicator.style.setProperty('--ptr-scale', scale.toFixed(3));
    ptrIndicator.style.setProperty('--ptr-y', `${dist * 0.3}px`);
    if (!emojiBurstTriggered) {
      const emojiProgress = Math.min(Math.max(dist / PTR_EMOJI_RAMP, 0), 1);
      const emojiRotProgress = Math.min(Math.max((emojiProgress - 0.25) / 0.75, 0), 1);
      ptrIndicator.style.setProperty('--ptr-emoji-sp', emojiProgress.toFixed(3));
      ptrIndicator.style.setProperty('--ptr-emoji-op', emojiProgress.toFixed(3));
      ptrIndicator.style.setProperty('--ptr-emoji-rp', emojiRotProgress.toFixed(3));
    }
    ptrIndicator.classList.toggle('visible', dist >= PTR_SHOW_AT);
  }

  function ptrStart(clientY, target) {
    if (window.scrollY > 0 || modalOverlay.classList.contains('open') || (target && target.closest('.tabs'))) {
      ptrPulling = false;
      return;
    }
    ptrStartY = clientY;
    ptrPulling = true;
    emojiBurstTriggered = false;
    ptrIndicator.classList.remove('settling', 'emoji-burst');
    ptrIndicator.classList.add('dragging');
    ptrDots.textContent = '';
    ptrPage.classList.remove('ptr-settling');
    ptrPage.classList.add('ptr-dragging');
  }

  function ptrMove(clientY) {
    if (!ptrPulling) return false;
    const delta = clientY - ptrStartY;
    if (delta <= 0) {
      ptrDistance = 0;
      setPtrTransform(0);
      ptrIndicator.classList.remove('ready');
      return false;
    }
    ptrDistance = Math.min(delta * 0.7, PTR_MAX);
    setPtrTransform(ptrDistance);
    ptrIndicator.classList.toggle('ready', ptrDistance >= PTR_THRESHOLD);
    if (!emojiBurstTriggered && ptrDistance >= PTR_EMOJI_RAMP) {
      triggerEmojiBurst();
    }
    return true;
  }

  function ptrEnd() {
    if (!ptrPulling) return;
    ptrPulling = false;
    ptrIndicator.classList.remove('dragging');
    ptrIndicator.classList.add('settling');
    ptrPage.classList.remove('ptr-dragging');
    ptrPage.classList.add('ptr-settling');
    if (ptrDistance >= PTR_THRESHOLD) {
      ptrIndicator.classList.add('loading');
      if (navigator.vibrate) navigator.vibrate(30);
      setPtrTransform(56);
      triggerEmojiBurst();
      ptrText.style.opacity = '0';
      let dotCount = 1;
      setInterval(() => {
        ptrDots.textContent = '.'.repeat(dotCount);
        dotCount = dotCount >= 5 ? 1 : dotCount + 1;
      }, 250);
      setTimeout(() => {
        location.href = location.pathname + '?_r=' + Date.now();
      }, PTR_RELOAD_DELAY);
    } else {
      setPtrTransform(0);
    }
    ptrDistance = 0;
  }

  document.addEventListener('touchstart', (e) => ptrStart(e.touches[0].clientY, e.target), { passive: true });
  document.addEventListener('touchmove', (e) => {
    if (ptrMove(e.touches[0].clientY)) e.preventDefault();
  }, { passive: false });
  document.addEventListener('touchend', ptrEnd);

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

  if (a2hsBtn && isIosSafariNotInstalled()) {
    a2hsBtn.style.display = 'flex';
    a2hsBtn.addEventListener('click', () => a2hsOverlay.classList.add('open'));
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
  });

  androidInstallBtn.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    androidInstallBtn.style.display = 'none';
  });

  window.addEventListener('appinstalled', () => {
    androidInstallBtn.style.display = 'none';
  });

  // 카카오톡 등 인앱 브라우저 안내
  const inappBanner = document.getElementById('inappBanner');
  const inappBannerText = document.getElementById('inappBannerText');
  const inappBannerClose = document.getElementById('inappBannerClose');
  const INAPP_DISMISS_KEY = 'inappBannerDismissed';

  if (isInAppBrowser && !isStandalone && !sessionStorage.getItem(INAPP_DISMISS_KEY)) {
    inappBannerText.textContent = isIos
      ? '카카오톡 등에서는 홈 화면 추가가 안 돼요. 오른쪽 위 \'⋯\'을 눌러 Safari로 열어주세요'
      : '카카오톡 등에서는 앱 설치가 안 돼요. 오른쪽 위 \'⋯\'을 눌러 기본 브라우저로 열어주세요';
    inappBanner.style.display = 'flex';
    document.body.style.paddingTop = inappBanner.offsetHeight + 'px';
    inappBannerClose.addEventListener('click', () => {
      inappBanner.style.display = 'none';
      document.body.style.paddingTop = '';
      sessionStorage.setItem(INAPP_DISMISS_KEY, '1');
    });
  }

  // 친구에게 공유
  const shareBtn = document.getElementById('shareBtn');
  const shareToast = document.getElementById('shareToast');
  let shareToastTimer = null;

  function showShareToast(text) {
    shareToast.textContent = text;
    shareToast.classList.add('show');
    clearTimeout(shareToastTimer);
    shareToastTimer = setTimeout(() => shareToast.classList.remove('show'), 2000);
  }

  shareBtn.addEventListener('click', async () => {
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
  });
})();
