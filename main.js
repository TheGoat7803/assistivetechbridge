/* ============================================================
   AssistiveTech Bridge — main.js
   Premium interactions: dark mode, scroll, reveal, nav, form
   ============================================================ */

(function () {
  'use strict';

  /* ---------- DARK MODE ---------- */
  const DARK_KEY = 'atb-dark-mode';
  const body     = document.body;

  function applyDark(isDark) {
    body.classList.toggle('dark-mode', isDark);
  }

  function initDarkMode() {
    const stored = localStorage.getItem(DARK_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored !== null ? stored === 'true' : prefersDark;
    applyDark(initial);

    const toggle = document.getElementById('darkToggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      const isDark = body.classList.toggle('dark-mode');
      localStorage.setItem(DARK_KEY, isDark);
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (localStorage.getItem(DARK_KEY) === null) {
        applyDark(e.matches);
      }
    });
  }

  /* ---------- STICKY HEADER ---------- */
  function initStickyHeader() {
    const header = document.getElementById('site-header');
    if (!header) return;

    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- MOBILE MENU ---------- */
  function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const menu   = document.getElementById('mobileMenu');
    if (!toggle || !menu) return;

    let isOpen = false;

    function openMenu() {
      isOpen = true;
      toggle.classList.add('open');
      menu.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      menu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      isOpen = false;
      toggle.classList.remove('open');
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', () => isOpen ? closeMenu() : openMenu());

    menu.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) closeMenu();
    });
  }

  /* ---------- SCROLL REVEAL ---------- */
  function initScrollReveal() {
    const targets = document.querySelectorAll('.reveal-up, .reveal-section');
    if (!targets.length) return;

    // Respect reduced-motion
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      targets.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach(el => observer.observe(el));
  }

  /* ---------- PAGE TRANSITIONS ---------- */
  function initPageTransitions() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);

    // Fade in on load
    window.addEventListener('load', () => {
      overlay.classList.remove('leaving');
    });

    // Fade out on internal navigation
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      // Only internal relative links
      if (!