(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===== Flip cards ===== */
  document.querySelectorAll('.card[data-flip]').forEach((card) => {
    card.addEventListener('click', () => {
      const flipped = card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', String(flipped));
    });
  });

  /* ===== Jak se hraje: tabs + steps ===== */
  const STEPS = {
    basic: [
      { title: 'Otoč kartu', body: 'Vezmi vrchní kartu z balíčku a otoč ji lícem nahoru.' },
      { title: 'Porovnej rychlost', body: 'Každý ukáže svoje zvíře. Kdo má víc km/h?' },
      { title: 'Vyšší bere', body: 'Rychlejší zvíře bere karty. Kdo jich nasbírá nejvíc, vyhrává.' }
    ],
    big: [
      { title: 'Otoč kartu', body: 'Každý odhalí svoje zvíře.' },
      { title: 'Hoď kostkou', body: 'Hoď kostkou a přičti ji ke stupni rychlosti ⚡ (1–5) na kartě. Najednou má naději i lenochod.' },
      { title: 'Vyšší bere', body: 'Kdo má po sečtení víc, bere kartu. A tím pádem to ani to nejrychlejší zvíře nemá vždycky jisté!' }
    ]
  };

  const tabBasic = document.getElementById('zk-tab-basic');
  const tabBig = document.getElementById('zk-tab-big');
  const stepsGrid = document.getElementById('steps-grid');
  const tabpanel = document.getElementById('zk-tabpanel');

  function renderSteps(mode) {
    stepsGrid.innerHTML = '';
    STEPS[mode].forEach((step, i) => {
      const card = document.createElement('div');
      card.className = 'zk-step';
      if (!reduceMotion) card.style.animationDelay = (i * 70) + 'ms';

      const num = document.createElement('div');
      num.className = 'zk-step__num';
      num.textContent = String(i + 1);

      const h3 = document.createElement('h3');
      h3.textContent = step.title;

      const p = document.createElement('p');
      p.textContent = step.body;

      card.append(num, h3, p);
      stepsGrid.append(card);
    });
  }

  function setMode(mode) {
    const isBig = mode === 'big';
    tabBasic.setAttribute('aria-selected', String(!isBig));
    tabBasic.tabIndex = isBig ? -1 : 0;
    tabBig.setAttribute('aria-selected', String(isBig));
    tabBig.tabIndex = isBig ? 0 : -1;
    tabpanel.setAttribute('aria-labelledby', isBig ? 'zk-tab-big' : 'zk-tab-basic');
    renderSteps(mode);
  }

  tabBasic.addEventListener('click', () => setMode('basic'));
  tabBig.addEventListener('click', () => setMode('big'));

  [tabBasic, tabBig].forEach((tab) => {
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const next = tab === tabBasic ? tabBig : tabBasic;
      next.click();
      next.focus();
    });
  });

  renderSteps('basic');

  /* ===== Teaser (bonus card) ===== */
  const teaserFan = document.getElementById('teaser-fan');
  const setPeek = (on) => teaserFan.classList.toggle('is-peeking', on);

  teaserFan.addEventListener('mouseenter', () => setPeek(true));
  teaserFan.addEventListener('mouseleave', () => setPeek(false));
  teaserFan.addEventListener('focus', () => setPeek(true));
  teaserFan.addEventListener('blur', () => setPeek(false));
  teaserFan.addEventListener('click', () => {
    teaserFan.classList.toggle('is-peeking');
  });

  /* ===== Scroll-reveal ===== */
  const revealEls = document.querySelectorAll('[data-reveal]');

  if (reduceMotion) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });

    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ===== Šest prostředí: vějíř karet (desktop) + stack (mobil) ===== */
  const CARDS = [
    { key: 'gepard', animal: 'Gepard', biome: 'Pláně', speed: 112, color: '#D17B22', icon: 'assets/icons/sprout.png', img: 'assets/cards/gepard.png' },
    { key: 'veverka', animal: 'Veverka', biome: 'Les', speed: 19, color: '#3C9353', icon: 'assets/icons/les.png', img: 'assets/cards/veverka.png' },
    { key: 'tulen', animal: 'Tuleň', biome: 'Voda', speed: 31, color: '#005F8F', icon: 'assets/icons/voda.png', img: 'assets/cards/tulen.png' },
    { key: 'kolibrik', animal: 'Kolibřík', biome: 'Vzduch', speed: 49, color: '#7F65A4', icon: 'assets/icons/vzduch.png', img: 'assets/cards/kolibrik.png' },
    { key: 'svist', animal: 'Svišť', biome: 'Hory', speed: 10, color: '#A64D2F', icon: 'assets/icons/hory.png', img: 'assets/cards/svist.png' },
    { key: 'ledni', animal: 'Lední medvěd', biome: 'Póly', speed: 40, color: '#00AFC8', icon: 'assets/icons/poly.png', img: 'assets/cards/ledni-medved.png' }
  ];
  const byKey = {};
  CARDS.forEach((c) => { byKey[c.key] = c; });

  function hexToRgba(hex, a) {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }

  function initProstredi() {
    const fanStage = document.getElementById('fan-stage');
    const mobileStage = document.getElementById('mobile-stage');
    const dotsWrap = document.getElementById('mobile-dots');
    if (!fanStage || !mobileStage || !dotsWrap) return;

    let orderDesktop = CARDS.map((c) => c.key);
    let orderMobile = CARDS.map((c) => c.key);
    let focusedDesktop = orderDesktop[0];
    let hoveredDesktop = null;

    const desktopButtons = {};
    const mobileButtons = {};
    const dotButtons = {};

    CARDS.forEach((c) => {
      const outer = document.createElement('div');
      outer.className = 'fan-card-outer';
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'fan-card';
      const img = document.createElement('img');
      img.src = c.img;
      img.alt = '';
      img.loading = 'lazy';
      btn.appendChild(img);
      outer.appendChild(btn);
      fanStage.appendChild(outer);
      desktopButtons[c.key] = btn;

      btn.addEventListener('click', () => bringToFront('desktop', c.key));
      btn.addEventListener('mouseenter', () => { hoveredDesktop = c.key; renderDesktop(); });
      btn.addEventListener('mouseleave', () => {
        if (hoveredDesktop === c.key) { hoveredDesktop = null; renderDesktop(); }
      });
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); moveFocus(1); }
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); moveFocus(-1); }
      });

      const mOuter = document.createElement('div');
      mOuter.className = 'mobile-card-outer';
      const mBtn = document.createElement('button');
      mBtn.type = 'button';
      mBtn.className = 'mobile-card';
      const mImg = document.createElement('img');
      mImg.src = c.img;
      mImg.alt = '';
      mImg.loading = 'lazy';
      mBtn.appendChild(mImg);
      mOuter.appendChild(mBtn);
      mobileStage.appendChild(mOuter);
      mobileButtons[c.key] = mBtn;

      mBtn.addEventListener('click', () => {
        if (orderMobile[0] === c.key) advanceMobile(1);
        else bringToFront('mobile', c.key);
      });
      mBtn.addEventListener('keydown', (e) => {
        if (orderMobile[0] !== c.key) return;
        if (e.key === 'ArrowLeft') { e.preventDefault(); advanceMobile(-1); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); advanceMobile(1); }
      });

      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'mobile-dot';
      dot.setAttribute('aria-label', 'Zobrazit prostředí ' + c.biome);
      dot.addEventListener('click', () => bringToFront('mobile', c.key));
      dotsWrap.appendChild(dot);
      dotButtons[c.key] = dot;
    });

    let touchX = null;
    mobileStage.addEventListener('touchstart', (e) => {
      touchX = (e.touches && e.touches[0]) ? e.touches[0].clientX : null;
    });
    mobileStage.addEventListener('touchend', (e) => {
      if (touchX == null) return;
      const endX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : touchX;
      const dx = endX - touchX;
      touchX = null;
      if (dx < -40) advanceMobile(1);
      else if (dx > 40) advanceMobile(-1);
    });

    function bringToFront(which, key) {
      if (which === 'desktop') {
        const i = orderDesktop.indexOf(key);
        if (i <= 0) return;
        const tmp = orderDesktop[0]; orderDesktop[0] = orderDesktop[i]; orderDesktop[i] = tmp;
        focusedDesktop = key;
        renderDesktop();
        desktopButtons[key].focus();
      } else {
        const i = orderMobile.indexOf(key);
        if (i <= 0) return;
        const tmp = orderMobile[0]; orderMobile[0] = orderMobile[i]; orderMobile[i] = tmp;
        renderMobile();
      }
    }

    function advanceMobile(dir) {
      if (dir === 1) orderMobile.push(orderMobile.shift());
      else orderMobile.unshift(orderMobile.pop());
      renderMobile();
    }

    function moveFocus(dir) {
      const cur = orderDesktop.indexOf(focusedDesktop);
      const next = Math.max(0, Math.min(orderDesktop.length - 1, cur + dir));
      focusedDesktop = orderDesktop[next];
      renderDesktop();
      desktopButtons[focusedDesktop].focus();
    }

    let lastLeaderKeyDesktop = null;
    let lastLeaderKeyMobile = null;

    function updateLeader(which) {
      const order = which === 'desktop' ? orderDesktop : orderMobile;
      const key = (which === 'desktop' && hoveredDesktop) ? hoveredDesktop : order[0];
      const lastKey = which === 'desktop' ? lastLeaderKeyDesktop : lastLeaderKeyMobile;
      if (key === lastKey) return;
      if (which === 'desktop') lastLeaderKeyDesktop = key; else lastLeaderKeyMobile = key;
      const c = byKey[key];
      const container = document.getElementById(which === 'desktop' ? 'fan-leader-desktop' : 'fan-leader-mobile');
      const icon = container.querySelector('.fan-leader__icon');
      const text = container.querySelector('.fan-leader__text');
      icon.style.backgroundColor = c.color;
      icon.style.webkitMaskImage = "url('" + c.icon + "')";
      icon.style.maskImage = "url('" + c.icon + "')";
      text.textContent = c.biome + ' · ' + c.animal;
      text.style.color = c.color;
      if (!reduceMotion) {
        container.classList.remove('fan-leader--anim');
        void container.offsetWidth;
        container.classList.add('fan-leader--anim');
      }
    }

    function renderDesktop() {
      CARDS.forEach((c) => {
        const slot = orderDesktop.indexOf(c.key);
        const hovered = hoveredDesktop === c.key;
        const side = slot === 0 ? 0 : (slot % 2 === 1 ? 1 : -1);
        const mag = Math.ceil(slot / 2);
        const rot = side * mag * 9;
        const tx = side * mag * 14;
        let ty = slot === 0 ? -8 : slot * 4 + 6;
        let scale = slot === 0 ? 1.04 : 1 - slot * 0.02;
        if (hovered) { ty -= 16; scale += 0.05; }
        const z = 100 - slot * 10;
        const darkA = Math.max(0.05, 0.26 - slot * 0.035);
        const blur = Math.max(10, 22 - slot * 1.8);
        const offY = Math.max(6, 15 - slot * 1.3);
        let filter = 'drop-shadow(0 ' + offY + 'px ' + blur + 'px rgba(20,60,58,' + darkA + '))';
        if (slot === 0 || hovered) {
          const glowA = hovered ? 0.4 : 0.26;
          filter += ' drop-shadow(0 ' + (hovered ? 22 : 16) + 'px ' + (hovered ? 34 : 26) + 'px ' + hexToRgba(c.color, glowA) + ')';
        }
        const btn = desktopButtons[c.key];
        btn.parentElement.style.zIndex = String(z);
        btn.style.transform = 'translateX(' + tx + 'px) translateY(' + ty + 'px) rotate(' + rot + 'deg) scale(' + scale + ')';
        btn.style.filter = filter;
        const isFront = slot === 0;
        btn.tabIndex = focusedDesktop === c.key ? 0 : -1;
        btn.setAttribute('aria-label', c.animal + ', prostředí ' + c.biome + ', rychlost ' + c.speed + ' km/h' + (isFront ? ', aktuálně vybraná' : ''));
      });
      updateLeader('desktop');
    }

    function renderMobile() {
      CARDS.forEach((c) => {
        const slot = orderMobile.indexOf(c.key);
        const tx = slot * 2;
        const ty = slot * 9;
        const scale = Math.max(0.8, 1 - slot * 0.035);
        const opacity = Math.max(0.35, 1 - slot * 0.15);
        const z = 100 - slot * 10;
        const darkA = Math.max(0.06, 0.2 - slot * 0.03);
        const blur = Math.max(8, 16 - slot * 1.4);
        const offY = Math.max(4, 11 - slot);
        const filter = 'drop-shadow(0 ' + offY + 'px ' + blur + 'px rgba(20,60,58,' + darkA + '))';
        const btn = mobileButtons[c.key];
        btn.parentElement.style.zIndex = String(z);
        btn.style.transform = 'translateX(' + tx + 'px) translateY(' + ty + 'px) scale(' + scale + ')';
        btn.style.opacity = String(opacity);
        btn.style.filter = filter;
        const isFront = slot === 0;
        btn.tabIndex = isFront ? 0 : -1;
        btn.setAttribute('aria-label', c.animal + ', prostředí ' + c.biome + ', rychlost ' + c.speed + ' km/h' + (isFront ? ', aktuálně nahoře' : ''));

        const dot = dotButtons[c.key];
        dot.style.background = isFront ? c.color : 'rgba(20,60,58,0.16)';
        dot.setAttribute('aria-current', isFront ? 'true' : 'false');
      });
      updateLeader('mobile');
    }

    renderDesktop();
    renderMobile();
  }

  initProstredi();
})();
