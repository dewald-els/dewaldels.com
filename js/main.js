(() => {
  'use strict';

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
