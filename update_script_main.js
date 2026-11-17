const fs = require('fs');

let code = fs.readFileSync('assets/framerusercontent.com/sites/oMyeNIrYwrAPBFlyQ0rhP/script_main.BycT4FBw.mjs.backup', 'utf8');

// Replace main hydration:
const mainTarget = '`framerHydrateV2`in e.dataset?W(!0,e):W(!1,e)';
code = code.replace(mainTarget, 'initAjuNaaji(e)');

// Replace badge hydration:
const badgeTarget = 'X&&i(()=>{v(document.getElementById(`__framer-badge-container`),f(m,{},f(p(()=>import(`./PX9hIOIVM.811x1yg8.mjs`)))))})';
code = code.replace(badgeTarget, 'X&&i(()=>{/* badge handled in footer */})');

const initFn = `function initAjuNaaji(root) {
  try {
    document.dispatchEvent(new CustomEvent('framer:pageview', { detail: { framerLocale: null } }));
  } catch(e) {}

  // 1. Sticky Navigation
  const header = document.getElementById('site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('nav-scrolled');
      } else {
        header.classList.remove('nav-scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 2. Mobile Menu Drawer
  const hamburger = document.getElementById('mobile-hamburger');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('drawer-close');

  function openMenu() {
    if (drawer) {
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
    }
    if (hamburger) {
      hamburger.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (drawer) {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
    }
    if (hamburger) {
      hamburger.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (drawer && drawer.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  }

  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) {
      closeMenu();
    }
  });

  if (drawer) {
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) {
        closeMenu();
      }
    });
  }

  // 3. Scroll Reveal & Botanical Blooming (Plays once on scroll)
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          entry.target.classList.add('is-bloomed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal-on-scroll, .animated-botanical-trigger').forEach(el => {
      observer.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal-on-scroll, .animated-botanical-trigger').forEach(el => {
      el.classList.add('is-visible');
      el.classList.add('is-bloomed');
    });
  }

  // 4. Live Countdown Timer (02 January 2027 at 11:00 AM IST)
  const targetDate = new Date('2027-01-02T11:00:00+05:30').getTime();
  function updateCountdown() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minutesEl = document.getElementById('cd-minutes');
    const secondsEl = document.getElementById('cd-seconds');

    if (diff <= 0) {
      if (daysEl) daysEl.innerText = '00';
      if (hoursEl) hoursEl.innerText = '00';
      if (minutesEl) minutesEl.innerText = '00';
      if (secondsEl) secondsEl.innerText = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}
`;

fs.writeFileSync('assets/framerusercontent.com/sites/oMyeNIrYwrAPBFlyQ0rhP/script_main.BycT4FBw.mjs', initFn + '\n' + code);
console.log('Successfully updated script_main.BycT4FBw.mjs!');
