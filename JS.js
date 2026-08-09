(function () {
  'use strict';

  // ── Lenis smooth scroll ──
  var lenis = new Lenis({
    duration: 1.2,
    easing: function (t) {
      return Math.min(1, 1.001 - Math.pow(2, -10 * t));
    }
  });

  gsap.registerPlugin(ScrollTrigger);

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(function (time) {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // ── Smooth anchor scrolling via Lenis ──
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (href === '#') {
        e.preventDefault();
        lenis.scrollTo(0);
        return;
      }
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80 });
      }
    });
  });

  // ── Text split utility ──
  function splitWords(el) {
    var text = el.textContent.trim();
    el.innerHTML = text.split(/\s+/).map(function (w) {
      return '<span class="word"><span class="word-inner">' + w + '</span></span>';
    }).join(' ');
    return el.querySelectorAll('.word-inner');
  }

  // ── Preloader ──
  var preloader = document.getElementById('preloader');

  function startSite() {
    // Preloader exit
    gsap.to(preloader, {
      yPercent: -100,
      duration: 0.8,
      ease: 'power3.inOut',
      delay: 0.3,
      onComplete: function () {
        preloader.remove();
      }
    });

    // Hero animations (timed to overlap with preloader exit)
    var headlineWords = splitWords(document.querySelector('.hero-headline'));

    gsap.from(headlineWords, {
      yPercent: 120,
      duration: 1,
      stagger: 0.04,
      ease: 'power3.out',
      delay: 0.85
    });

    gsap.from('.hero-sub', {
      opacity: 0,
      y: 24,
      duration: 0.7,
      ease: 'power2.out',
      delay: 1.5
    });

    gsap.from('.hero-scroll-cue', {
      opacity: 0,
      duration: 0.5,
      delay: 1.8
    });

    gsap.from('#hero-canvas', {
      opacity: 0,
      scale: 0.9,
      duration: 1,
      ease: 'power2.out',
      delay: 0.9
    });
  }

  if (document.readyState === 'complete') {
    startSite();
  } else {
    window.addEventListener('load', startSite);
  }

  // ── Parallax on hero shapes ──
  // Removed legacy shape parallax animations.

  // ── Nav hide on scroll down, show on scroll up ──
  var header = document.querySelector('.site-header');
  var lastScrollY = 0;

  lenis.on('scroll', function (e) {
    var y = e.scroll;
    if (y > 100) {
      if (y > lastScrollY + 5) {
        header.classList.add('nav-hidden');
      } else if (y < lastScrollY - 5) {
        header.classList.remove('nav-hidden');
      }
    } else {
      header.classList.remove('nav-hidden');
    }
    lastScrollY = y;
  });

  // ── Section label reveals ──
  gsap.utils.toArray('.section-label').forEach(function (el) {
    gsap.from(el, {
      opacity: 0,
      x: -30,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  // ── Project reveals ──
  gsap.utils.toArray('.project').forEach(function (project) {
    var tl = gsap.timeline({
      scrollTrigger: { trigger: project, start: 'top 78%' }
    });

    var body = project.querySelector('.project-body');
    var visual = project.querySelector('.project-visual');

    if (body) {
      tl.from(body, { opacity: 0, y: 50, duration: 0.8, ease: 'power2.out' });
    }
    if (visual) {
      tl.from(visual, { opacity: 0, scale: 0.92, duration: 0.8, ease: 'power2.out' }, '-=0.4');
    }
  });

  // ── Approach items ──
  gsap.utils.toArray('.approach-item').forEach(function (item, i) {
    gsap.from(item, {
      opacity: 0,
      y: 40,
      duration: 0.7,
      delay: i * 0.12,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.approach-grid', start: 'top 80%' }
    });
  });

  // ── Tools strip ──
  gsap.from('.tool-name', {
    opacity: 0,
    y: 20,
    duration: 0.5,
    stagger: 0.06,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.tools-strip', start: 'top 85%' }
  });

  // ── About ──
  gsap.from('.about-inner', {
    opacity: 0,
    y: 50,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.about', start: 'top 70%' }
  });

  // ── Contact ──
  var contactHeading = document.querySelector('.contact-heading');
  if (contactHeading) {
    var contactWords = splitWords(contactHeading);
    gsap.from(contactWords, {
      yPercent: 120,
      duration: 0.9,
      stagger: 0.06,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.contact', start: 'top 75%' }
    });
  }

  gsap.from('.contact-text', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.contact-text', start: 'top 88%' }
  });

  gsap.from('.contact-email', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    delay: 0.12,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.contact-email', start: 'top 90%' }
  });

  gsap.from('.contact-social', {
    opacity: 0,
    duration: 0.5,
    delay: 0.2,
    scrollTrigger: { trigger: '.contact-social', start: 'top 92%' }
  });

  // ── Mobile navigation ──
  var navToggle = document.getElementById('navToggle');
  var navOverlay = document.getElementById('navOverlay');

  function openNav() {
    navToggle.setAttribute('aria-expanded', 'true');
    navOverlay.classList.add('open');
    navOverlay.setAttribute('aria-hidden', 'false');
    lenis.stop();
  }

  function closeNav() {
    navToggle.setAttribute('aria-expanded', 'false');
    navOverlay.classList.remove('open');
    navOverlay.setAttribute('aria-hidden', 'true');
    lenis.start();
  }

  navToggle.addEventListener('click', function () {
    navToggle.getAttribute('aria-expanded') === 'true' ? closeNav() : openNav();
  });

  navOverlay.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navOverlay.classList.contains('open')) {
      closeNav();
      navToggle.focus();
    }
  });

})();
