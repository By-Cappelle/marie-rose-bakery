/**
 * Marie-Rose Bakery Café — Main JavaScript
 * Cappelle Design Studio
 */

(function () {
  'use strict';

  const header = document.getElementById('site-header');
  const navToggle = document.getElementById('nav-toggle');
  const siteNav = document.getElementById('site-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const yearEl = document.getElementById('year');
  const revealElements = document.querySelectorAll('.reveal');

  /* --- Current year --- */
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* --- Header scroll state --- */
  function updateHeader() {
    if (!header) return;
    const scrolled = window.scrollY > 60;
    header.classList.toggle('site-header--scrolled', scrolled);
  }

  let ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        updateHeader();
        updateActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  updateHeader();

  /* --- Mobile navigation --- */
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      const isOpen = siteNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- Active nav link on scroll --- */
  const sections = document.querySelectorAll('section[id]');
  const hero = document.querySelector('.hero');

  function updateActiveNav() {
    if (!sections.length || !navLinks.length) return;

    const headerOffset = header ? header.offsetHeight : 0;
    const scrollPos = window.scrollY + headerOffset + 100;
    const firstSectionTop = sections[0].offsetTop;
    const inHero = hero
      ? window.scrollY + headerOffset < firstSectionTop - 80
      : window.scrollY < 80;

    let activeId = null;

    if (!inHero) {
      sections.forEach(function (section) {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          activeId = id;
        }
      });
    }

    navLinks.forEach(function (link) {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + activeId);
    });
  }

  updateActiveNav();

  /* --- Scroll reveal --- */
  if (revealElements.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* --- Hero reveal on load --- */
  const heroReveals = document.querySelectorAll('.hero .reveal');
  if (heroReveals.length) {
    requestAnimationFrame(function () {
      heroReveals.forEach(function (el) {
        el.classList.add('is-visible');
      });
    });
  }

  /* --- Smooth scroll for anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const offset = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top: top,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      });
    });
  });

})();
