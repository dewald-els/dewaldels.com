(() => {
  'use strict';

  // ─── THEME TOGGLE ───────────────────────────────────
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const themeMenu = document.getElementById('theme-menu');
  const themeOpts = themeMenu.querySelectorAll('.theme-opt');
  const darkQuery = matchMedia('(prefers-color-scheme: dark)');

  const applyTheme = (pref) => {
    const dark = pref === 'system' ? darkQuery.matches : pref === 'dark';
    root.dataset.pref = pref;
    root.dataset.theme = dark ? 'dark' : 'light';
    document.querySelector('meta[name="theme-color"]').content = dark ? '#16181c' : '#f6f4ef';
    themeOpts.forEach((o) => o.setAttribute('aria-checked', String(o.dataset.themeOpt === pref)));
  };

  const toggleThemeMenu = (open) => {
    themeMenu.classList.toggle('hidden', !open);
    themeToggle.setAttribute('aria-expanded', String(open));
  };

  applyTheme(root.dataset.pref || 'system');

  themeToggle.addEventListener('click', () => toggleThemeMenu(themeMenu.classList.contains('hidden')));

  themeOpts.forEach((o) => o.addEventListener('click', () => {
    const pref = o.dataset.themeOpt;
    applyTheme(pref);
    try { pref === 'system' ? localStorage.removeItem('theme') : localStorage.setItem('theme', pref); } catch (e) {}
    toggleThemeMenu(false);
    themeToggle.focus();
  }));

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.theme-switch')) toggleThemeMenu(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !themeMenu.classList.contains('hidden')) {
      toggleThemeMenu(false);
      themeToggle.focus();
    }
  });

  // Follow live system changes while on System
  darkQuery.addEventListener('change', () => {
    if (root.dataset.pref === 'system') applyTheme('system');
  });

  // ─── MOBILE MENU TOGGLE ─────────────────────────────
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuOpen = document.getElementById('menu-open');
  const menuClose = document.getElementById('menu-close');

  const openMenu = () => {
    mobileMenu.classList.remove('hidden');
    mobileMenu.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuOpen.classList.add('hidden');
    menuClose.classList.remove('hidden');
    const firstLink = mobileMenu.querySelector('a');
    if (firstLink) firstLink.focus();
  };

  const closeMenu = (returnFocus = true) => {
    mobileMenu.classList.add('hidden');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuOpen.classList.remove('hidden');
    menuClose.classList.add('hidden');
    if (returnFocus) menuToggle.focus();
  };

  const isMenuOpen = () => !mobileMenu.classList.contains('hidden');

  menuToggle.addEventListener('click', () => {
    isMenuOpen() ? closeMenu(false) : openMenu();
  });

  // Close mobile menu on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen()) {
      closeMenu();
    }
  });

  // Focus trap inside mobile menu
  mobileMenu.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;

    const focusableElements = mobileMenu.querySelectorAll('a');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else if (document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  });

  // Close mobile menu when clicking a link
  document.querySelectorAll('.mobile-nav-link').forEach((link) => {
    link.addEventListener('click', () => closeMenu(false));
  });

  // ─── ACTIVE NAV LINK ON SCROLL ──────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
  );

  sections.forEach((section) => sectionObserver.observe(section));
})();
