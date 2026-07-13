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
})();
