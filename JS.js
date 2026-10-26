(function () {
  "use strict";

  var root = document.documentElement;
  var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var preloader = document.getElementById("preloader");
  var navToggle = document.getElementById("navToggle");
  var navOverlay = document.getElementById("navOverlay");
  var header = document.querySelector(".site-header");
  var progress = document.getElementById("readingProgress");
  var lenis = null;
  var lastScrollY = 0;
  var started = false;
  var menuOpen = false;

  root.classList.add("js-motion");

  // Initialise smooth scrolling only when motion is allowed and the library loaded.
  if (!reducedMotion && typeof Lenis !== "undefined") {
    try {
      lenis = new Lenis({
        duration: 1.05,
        easing: function (t) {
          return Math.min(1, 1.001 - Math.pow(2, -10 * t));
        },
        smoothWheel: true,
        syncTouch: false
      });

      if (typeof gsap !== "undefined") {
        lenis.on("scroll", function () {
          if (typeof ScrollTrigger !== "undefined") ScrollTrigger.update();
        });
        gsap.ticker.add(function (time) {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      } else {
        var raf = function (time) {
          lenis.raf(time);
          window.requestAnimationFrame(raf);
        };
        window.requestAnimationFrame(raf);
      }
    } catch (error) {
      lenis = null;
    }
  }

  function scrollToTarget(target) {
    if (!target) return;
    if (lenis && !reducedMotion) {
      lenis.scrollTo(target, { offset: -88 });
    } else {
      target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    }
  }

  function closeNav() {
    if (!navToggle || !navOverlay) return;
    menuOpen = false;
    navToggle.setAttribute("aria-expanded", "false");
    navOverlay.classList.remove("open");
    navOverlay.setAttribute("aria-hidden", "true");
    if (lenis) {
      lenis.start();
    } else {
      document.body.style.overflow = "";
    }
  }

  function openNav() {
    if (!navToggle || !navOverlay) return;
    menuOpen = true;
    navToggle.setAttribute("aria-expanded", "true");
    navOverlay.classList.add("open");
    navOverlay.setAttribute("aria-hidden", "false");
    if (lenis) {
      lenis.stop();
    } else {
      document.body.style.overflow = "hidden";
    }
    var firstLink = navOverlay.querySelector("a");
    if (firstLink) firstLink.focus({ preventScroll: true });
  }

  if (navToggle && navOverlay) {
    navToggle.addEventListener("click", function () {
      menuOpen ? closeNav() : openNav();
    });

    navOverlay.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeNav();
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menuOpen) {
        closeNav();
        navToggle.focus({ preventScroll: true });
      }
    });
  }

  // Use the same anchor behaviour for mouse, touch and keyboard navigation.
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      var href = link.getAttribute("href");
      if (!href || href === "#") {
        event.preventDefault();
        if (lenis && !reducedMotion) lenis.scrollTo(0);
        else window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
        closeNav();
        return;
      }

      var target = document.getElementById(href.slice(1));
      if (target) {
        event.preventDefault();
        closeNav();
        scrollToTarget(target);
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, "", href);
        }
      }
    });
  });

  function updateScrollChrome() {
    var scrollY = window.scrollY || window.pageYOffset || 0;
    var maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

    if (progress) {
      progress.style.transform = "scaleX(" + Math.min(1, Math.max(0, scrollY / maxScroll)) + ")";
    }

    if (header && !menuOpen) {
      if (scrollY < 70 || scrollY < lastScrollY - 4) {
        header.classList.remove("nav-hidden");
      } else if (scrollY > lastScrollY + 7 && scrollY > 140) {
        header.classList.add("nav-hidden");
      }
    }
    lastScrollY = scrollY;
  }

  if (lenis) {
    lenis.on("scroll", updateScrollChrome);
  } else {
    window.addEventListener("scroll", updateScrollChrome, { passive: true });
  }
  window.addEventListener("resize", updateScrollChrome, { passive: true });

  function hidePreloader() {
    if (!preloader || preloader.dataset.dismissed === "true") return;
    preloader.dataset.dismissed = "true";

    if (!reducedMotion && typeof gsap !== "undefined") {
      gsap.to(preloader, {
        yPercent: -100,
        duration: 0.65,
        ease: "power3.inOut",
        onComplete: function () {
          if (preloader.parentNode) preloader.remove();
        }
      });
    } else {
      preloader.remove();
    }
  }

  function animatePortfolio() {
    if (started) return;
    started = true;
    hidePreloader();

    if (reducedMotion || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      root.classList.remove("js-motion");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    var intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    intro
      .from(".hero-kicker", { opacity: 0, y: 14, duration: 0.55 })
      .from(".hero-headline", { opacity: 0, y: 38, duration: 0.85 }, "-=0.22")
      .from(".hero-sub", { opacity: 0, y: 22, duration: 0.65 }, "-=0.42")
      .from(".hero-actions > *", { opacity: 0, y: 14, duration: 0.5, stagger: 0.1 }, "-=0.3")
      .from(".hero-footnote", { opacity: 0, duration: 0.45 }, "-=0.15");

    gsap.from(".scene-browser", {
      opacity: 0,
      y: 24,
      rotation: 1.5,
      duration: 0.95,
      ease: "power2.out",
      delay: 0.22
    });
    gsap.from(".scene-note", {
      opacity: 0,
      x: -16,
      rotation: -9,
      duration: 0.65,
      ease: "back.out(1.4)",
      delay: 0.45
    });
    gsap.from(".scene-shipped", {
      opacity: 0,
      x: 18,
      rotation: 8,
      duration: 0.65,
      ease: "back.out(1.4)",
      delay: 0.6
    });
    gsap.from(".scene-index, .scene-caption", {
      opacity: 0,
      duration: 0.6,
      stagger: 0.12,
      delay: 0.6
    });

    gsap.to(".scene-note", {
      y: -5,
      duration: 2.8,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: 1.2
    });
    gsap.to(".scene-shipped", {
      y: 6,
      duration: 3.2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: 1.4
    });
    gsap.to(".scene-orbit-one", {
      rotation: 4,
      duration: 22,
      ease: "none",
      repeat: -1,
      yoyo: true
    });
    gsap.to(".scene-orbit-two", {
      rotation: 31,
      duration: 28,
      ease: "none",
      repeat: -1,
      yoyo: true
    });

    function reveal(selector, options) {
      options = options || {};
      gsap.utils.toArray(selector).forEach(function (element) {
        gsap.fromTo(element,
          { opacity: 0, y: options.fromY || 26 },
          {
            opacity: 1,
            y: 0,
            duration: options.duration || 0.7,
            ease: options.ease || "power2.out",
            clearProps: "opacity,transform",
            scrollTrigger: {
              trigger: element,
              start: "top 86%",
              once: true
            }
          }
        );
      });
    }

    reveal(".journey-step", { fromY: 30, duration: 0.75 });
    reveal(".workflow-step", { fromY: 18, duration: 0.6 });
    reveal(".workflow-panel", { fromY: 28, duration: 0.8 });
    reveal(".approach-item", { fromY: 20, duration: 0.65 });

    gsap.from(".journey-endnote", {
      scrollTrigger: { trigger: ".journey-endnote", start: "top 90%", once: true },
      opacity: 0,
      x: -14,
      duration: 0.6
    });

    gsap.from(".workflow-loop-step", {
      scrollTrigger: { trigger: ".workflow-loop", start: "top 82%", once: true },
      opacity: 0,
      x: -10,
      stagger: 0.11,
      duration: 0.5
    });

    gsap.utils.toArray(".project").forEach(function (project) {
      var parts = project.querySelectorAll(".project-body, .project-visual");
      gsap.from(parts, {
        scrollTrigger: { trigger: project, start: "top 80%", once: true },
        opacity: 0,
        y: 24,
        stagger: 0.12,
        duration: 0.75,
        ease: "power2.out",
        clearProps: "opacity,transform"
      });
    });

    gsap.from(".tool-name", {
      scrollTrigger: { trigger: ".tools-strip", start: "top 90%", once: true },
      opacity: 0,
      y: 12,
      stagger: 0.07,
      duration: 0.45
    });

    gsap.from(".about-inner", {
      scrollTrigger: { trigger: ".about", start: "top 78%", once: true },
      opacity: 0,
      y: 28,
      duration: 0.8
    });

    gsap.from(".contact-inner > *", {
      scrollTrigger: { trigger: ".contact", start: "top 76%", once: true },
      opacity: 0,
      y: 22,
      stagger: 0.1,
      duration: 0.65,
      ease: "power2.out"
    });

    gsap.utils.toArray(".section-label").forEach(function (label) {
      gsap.from(label, {
        scrollTrigger: { trigger: label, start: "top 90%", once: true },
        opacity: 0,
        x: -12,
        duration: 0.45
      });
    });

    ScrollTrigger.refresh();
  }

  if (document.readyState === "complete") {
    animatePortfolio();
  } else {
    window.addEventListener("load", animatePortfolio, { once: true });
    // Do not leave the whole page covered if an external asset or font is slow.
    window.setTimeout(animatePortfolio, 1800);
  }
})();
