/**
 * LensCore — script.js
 * Premium business website interactions
 */

'use strict';

/* ============================================================
   UTILITY
   ============================================================ */
const $ = (id) => document.getElementById(id);
const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


/* ============================================================
   1. NAVIGATION — scroll state + mobile menu
   ============================================================ */
(function initNav() {
  const nav        = $('nav');
  const hamburger  = $('nav-hamburger');
  const mobileMenu = $('nav-mobile');
  const mobileLinks = qsa('a', mobileMenu);

  // Scroll-based nav glass effect
  function onScroll() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle
  function toggleMenu(open) {
    hamburger.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    toggleMenu(!isOpen);
  });

  // Close mobile menu when a link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      toggleMenu(false);
    }
  });
})();


/* ============================================================
   2. SCROLL REVEAL — intersection observer
   ============================================================ */
(function initReveal() {
  const els = qsa('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach(el => observer.observe(el));
})();


/* ============================================================
   3. HERO — ensure video plays
   ============================================================ */
(function initHeroVideo() {
  const video = $('hero-video');
  if (!video) return;

  // Attempt play (some browsers require it explicitly)
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Autoplay was prevented — video will still load visibly
      // User interaction will trigger play
      document.addEventListener('click', () => video.play(), { once: true });
      document.addEventListener('touchstart', () => video.play(), { once: true });
    });
  }
})();


/* ============================================================
   4. TECHNOLOGY — accordion pillars
   ============================================================ */
(function initTechAccordion() {
  const pillars = qsa('.tech-pillar');
  const caption = $('tech-caption');

  const captions = {
    'tech-sensor':     'BSI CMOS Sensor Array — Individual Calibration',
    'tech-autofocus':  'Phase-Detect Array — 95% Coverage',
    'tech-processing': 'Vega V Engine — 4.2B Operations per Second',
    'tech-optics':     'Aether Lens Coatings — Sub-micron Tolerance',
  };

  function openPillar(target) {
    pillars.forEach(p => {
      const isTarget = p === target;
      p.classList.toggle('active', isTarget);
      p.setAttribute('aria-expanded', String(isTarget));
    });
    if (caption && captions[target.id]) {
      caption.textContent = captions[target.id];
    }
  }

  pillars.forEach(pillar => {
    pillar.addEventListener('click', () => openPillar(pillar));
    pillar.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openPillar(pillar);
      }
    });
  });
})();





/* ============================================================
   6. CONTACT FORM — validation + feedback
   ============================================================ */
(function initContactForm() {
  const form   = $('contact-form');
  const status = $('form-status');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const first   = $('contact-first').value.trim();
    const last    = $('contact-last').value.trim();
    const email   = $('contact-email').value.trim();
    const subject = $('contact-subject').value;
    const message = $('contact-message').value.trim();

    if (!first || !last) {
      showStatus('Please enter your full name.', true);
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus('Please enter a valid email address.', true);
      return;
    }
    if (!subject) {
      showStatus('Please select a subject.', true);
      return;
    }
    if (message.length < 10) {
      showStatus('Please enter a message (minimum 10 characters).', true);
      return;
    }

    // Simulate submission
    const submitBtn = $('contact-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    setTimeout(() => {
      showStatus('Thank you. Your message has been received. A specialist will respond within one business day.', false);
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }, 1200);
  });

  function showStatus(msg, isError) {
    status.textContent = msg;
    status.style.color = isError ? '#e05555' : 'var(--gold)';
    setTimeout(() => { status.textContent = ''; }, 7000);
  }
})();


/* ============================================================
   7. SMOOTH ANCHOR SCROLL (with nav offset)
   ============================================================ */
(function initSmoothScroll() {
  const NAV_H = 80;
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href').slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_H;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ============================================================
   8. PRODUCT CARD — keyboard accessibility
   ============================================================ */
(function initProductCards() {
  qsa('.product-card[tabindex="0"]').forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        // Future: navigate to product page
        card.style.outline = '2px solid var(--gold)';
        setTimeout(() => { card.style.outline = ''; }, 600);
      }
    });
  });
})();


/* ============================================================
   9. PARALLAX — subtle hero text drift on scroll
   ============================================================ */
(function initParallax() {
  const heroContent = qs('.hero-content');
  const heroScroll  = qs('.hero-scroll');
  if (!heroContent) return;

  function onScroll() {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      const drift = y * 0.22;
      heroContent.style.transform = `translateY(${drift}px)`;
      heroContent.style.opacity   = 1 - (y / (window.innerHeight * 0.75));
      if (heroScroll) {
        heroScroll.style.opacity = 1 - (y / 200);
      }
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ============================================================
   10. FOOTER — dynamic copyright year
   ============================================================ */
(function initFooter() {
  const el = $('footer-copy');
  if (el) {
    el.innerHTML = `&copy; ${new Date().getFullYear()} LensCore Corporation. All rights reserved.`;
  }
})();


/* ============================================================
   11. COLLECTION CARDS — tabindex link activation
   ============================================================ */
(function initCollectionCards() {
  qsa('.collection-card[tabindex="0"]').forEach(card => {
    const link = qs('.collection-link', card);
    card.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter') && link) {
        link.click();
      }
    });
    card.addEventListener('mouseenter', () => {
      if (link) link.setAttribute('tabindex', '0');
    });
    card.addEventListener('mouseleave', () => {
      if (link) link.setAttribute('tabindex', '-1');
    });
  });
})();
