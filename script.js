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
  };

  const RECIPES = [
    { id: 's1', cat: '소스', emoji: '🥣', img: 'assets/recipe card_건희소스.png', imgBg: '#A8CCDC', tint: 'linear-gradient(160deg,#FDECD9,#F8D9BE)', name: '건희소스', desc: '남자 아이돌 그룹 \'원어스\'의 \'건희\'가 즐겨 먹던 조합으로, 현시점 대한민국에서 가장 유명한 소스.',
      ings: [['땅콩참깨소스', '1', '스푼'], ['스위트칠리소스', '2.5', '스푼'], ['다진마늘', '0.5', '스푼'], ['다진파', '0.5', '집게'], ['깨', '1', '티스푼'], ['땅콩가루', '1', '티스푼'], ['마라시즈닝(고춧가루)', '0.5', '티스푼'], ['고추기름', '1', '티스푼'], ['설탕', '0.3', '티스푼'], ['매운소고기', '0.5', '티스푼']],
      steps: [],
      tip: '너무 달면 스위트칠리소스는 1스푼으로 줄이기' },
    { id: 's4', cat: '소스', emoji: '🥣', img: 'assets/recipe card_화령소스.jpg', imgFit: 'cover', tint: 'linear-gradient(160deg,#F5E1C8,#E8C79A)', name: '화령소스', desc: '\'화령\'이라는 하이디라오 직원이 한 네이버 블로거에게 쪽지로 전달해준 소스. 그 포스팅을 \'이예지\'가 우연히 발견하면서 알려지게 됨.',
      ings: [['땅콩참깨소스', '0.25', '스푼'], ['스위트칠리소스', '3.5~4', '스푼'], ['튀긴대두', '2~3', '스푼'], ['참기름', '0.5', '스푼'], ['고추기름', '0.5', '스푼'], ['양파', '3', '스푼'], ['다진파', '3', '집게'], ['다진마늘', '1', '스푼']],
      steps: [],
      tip: '튀긴대두, 양파, 다진파, 다진마늘은 많으면 많을수록 맛있음' },
    { id: 's2', cat: '소스', emoji: '🥣', img: 'assets/recipe card_쑨디2호소스.png', imgBg: '#161D25', tint: 'linear-gradient(160deg,#FBDCD3,#F5B8A8)', name: '쑨디2호소스', desc: '2022년 1월 2일에 트위터에 공개한 트위터리안 \'쑨디\'의 소스. 쑨디소스의 정식 명칭은 쑨디2호소스로, 1호는 없지만 멋있어 보여서 그냥 이름을 2호라고 지었다고 함.',
      ings: [['매운소고기 - 건더기만', '0.5', '스푼'], ['청유훠궈소스 - 건더기만', '0.5', '스푼'], ['땅콩가루', '', '넉넉하게'], ['다진파', '', '넉넉하게'], ['다진마늘', '0.5', '스푼'], ['스위트칠리소스', '0.5', '스푼'], ['굴소스', '0.5', '스푼'], ['땅콩참깨소스', '0.25', '스푼']],
      steps: [],
      tip: '' },
    { id: 's3', cat: '소스', emoji: '🥣', img: 'assets/recipe card_쑨디소스(2024ver.).jpg', imgFit: 'cover', imgPosition: 'left 45%', tint: 'linear-gradient(160deg,#FFE0C2,#F8B888)', name: '쑨디소스(2024ver.)', desc: '쑨디2호소스의 개발자인 \'쑨디\'가 레시피에 일부 오류가 있어서 본인의 유튜브를 통해 공식적으로 정정한 소스.',
      ings: [['땅콩참깨소스', '0.5', '스푼'], ['다진파', '', '넉넉하게'], ['스위트칠리소스', '0.5', '스푼'], ['다진마늘', '3', '스푼'], ['굴소스', '1', '스푼'], ['매운소고기 - 건더기만', '1', '스푼'], ['청유훠궈소스 - 건더기만', '2', '스푼'], ['땅콩가루', '2', '스푼'], ['만구향', '1', '스푼']],
      steps: [],
      tip: '' },
    { id: 's5', cat: '소스', emoji: '🥣', img: 'assets/recipe card_영지소스.jpg', imgFit: 'cover', imgPosition: 'right 12%', tint: 'linear-gradient(160deg,#F5E6D3,#E8C9A0)', name: '영지소스', desc: '유튜브 채널 \'채널십오야\'의 나영석의 보글보글 촬영 중 \'이영지\'가 공개한 소스.',
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
  ];

  let activeCat = '전체';
  let query = '';

  const tabsEl = document.getElementById('tabs');
  const gridEl = document.getElementById('recipeGrid');
  const countEl = document.getElementById('countNum');
  const searchInput = document.getElementById('searchInput');
  const searchIcon = document.getElementById('searchIcon');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalScroll = document.getElementById('recipe-modal-scroll');
  const modalClose = document.getElementById('modalClose');

  function renderTabs() {
    tabsEl.innerHTML = '';
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
        <div class="recipe-thumb" style="background:${r.img ? (r.imgBg || '#fff') : r.tint}">${r.img ? `<img class="recipe-thumb-img${r.imgFit === 'cover' ? ' recipe-thumb-img--cover' : ''}" src="${r.img}" alt="${r.name}"${r.imgPosition ? ` style="object-position:${r.imgPosition}"` : ''}>` : `<span>${r.emoji}</span>`}</div>
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
    document.getElementById('modalEmoji').textContent = r.emoji;
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
    renderGrid();
  });
  searchIcon.addEventListener('click', () => searchInput.focus());

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

  function ptrStart(clientY) {
    if (window.scrollY > 0 || modalOverlay.classList.contains('open')) {
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

  document.addEventListener('touchstart', (e) => ptrStart(e.touches[0].clientY), { passive: true });
  document.addEventListener('touchmove', (e) => {
    if (ptrMove(e.touches[0].clientY)) e.preventDefault();
  }, { passive: false });
  document.addEventListener('touchend', ptrEnd);
})();
