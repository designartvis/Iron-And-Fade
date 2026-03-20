/* ============================================================
   IRON & FADE — main.js
   Scroll animations, nav behavior, mobile drawer
   ============================================================ */

(function () {
  'use strict';

  /* ── Nav: scroll state ─────────────────────────────────── */
  const nav = document.getElementById('nav');

  function updateNav() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ── Mobile Hamburger Drawer ───────────────────────────── */
  const hamburger = document.getElementById('nav-hamburger');
  const drawer = document.getElementById('nav-drawer');
  const drawerLinks = drawer.querySelectorAll('.drawer-link');

  function closeDrawer() {
    hamburger.classList.remove('open');
    drawer.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  /* Close drawer on outside click */
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !drawer.contains(e.target)) {
      closeDrawer();
    }
  });

  /* ── Hero parallax & load-in ───────────────────────────── */
  const heroBg = document.getElementById('hero-bg');

  window.addEventListener('load', () => {
    if (heroBg) heroBg.classList.add('loaded');
  });

  window.addEventListener('scroll', () => {
    if (!heroBg) return;
    const scrollY = window.scrollY;
    const heroH = document.getElementById('hero').offsetHeight;
    if (scrollY < heroH) {
      heroBg.style.transform = `scale(1) translateY(${scrollY * 0.28}px)`;
    }
  }, { passive: true });

  /* ── Scroll Reveal Intersection Observer ──────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => observer.observe(el));

  /* ── Smooth scroll for anchor links ───────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 72; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── Active nav link highlighting ─────────────────────── */
  const sections = document.querySelectorAll('section[id], div[id="trust-bar"]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function highlightNav() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.style.opacity = '0.7';
      link.style.color = '';
      const href = link.getAttribute('href').replace('#', '');
      if (href === current || (current === 'hero' && href === 'about')) {
        link.style.opacity = '1';
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  /* ── Counter animation for stats ──────────────────────── */
  function animateCounter(el, target, duration = 1200) {
    const start = performance.now();
    const isPlus = el.textContent.includes('+');

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current + (isPlus ? '+' : '');
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const statNums = document.querySelectorAll('.stat-num');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const raw = el.textContent.replace('+', '').trim();
        const target = parseInt(raw, 10);
        if (!isNaN(target)) animateCounter(el, target);
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => statObserver.observe(el));

})();
