/* =============================================
   BESAGO — SHARED SCRIPTS
   Loaded synchronously before each page's
   inline script. Sets up all shared behaviour:
   cursor, nav, hamburger, theme cycling,
   scroll reveal.

   Page scripts can override _bsg.cycleStyle
   to plug in custom theme-switching logic
   (e.g. home.html's applyStyleTheme).
   ============================================= */
(function () {
  'use strict';

  /* ── FONT LOADING ── */
  var FONTS = {
    neon:  'Space+Mono:wght@400;700',
    ocean: 'Playfair+Display:ital,wght@0,700;1,400',
    ember: 'Bebas+Neue',
    sage:  'Lora:ital,wght@0,400;0,600;1,400'
  };
  var _FL = {};
  function _loadFont(st) {
    if (!FONTS[st] || _FL[st]) return;
    _FL[st] = 1;
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=' + FONTS[st] + '&display=swap';
    document.head.appendChild(l);
  }
  window._loadFont = _loadFont; /* expose for restore scripts */

  var html = document.documentElement;
  var STYLES = ['cyber', 'neon', 'ocean', 'ember', 'sage'];
  var stIdx = Math.max(0, STYLES.indexOf(html.dataset.st));

  /* ── SHARED STATE OBJECT ── */
  /* Page scripts can override _bsg.cycleStyle / _bsg.setStyle */
  var _bsg = {
    html: html,
    styles: STYLES,
    get styleIdx() { return stIdx; },
    set styleIdx(v) { stIdx = v; },
    cycleStyle: function () {
      stIdx = (stIdx + 1) % STYLES.length;
      html.dataset.st = STYLES[stIdx];
      localStorage.setItem('bsg-style', STYLES[stIdx]);
      _loadFont(STYLES[stIdx]);
    },
    setStyle: function (idx) {
      stIdx = ((idx % STYLES.length) + STYLES.length) % STYLES.length;
      html.dataset.st = STYLES[stIdx];
      localStorage.setItem('bsg-style', STYLES[stIdx]);
      _loadFont(STYLES[stIdx]);
    }
  };
  window._bsg = _bsg;

  /* ── CUSTOM CURSOR ── */
  var curDot  = document.getElementById('cursor');
  var curRing = document.getElementById('cursor-ring');
  _bsg.curDot  = curDot;
  _bsg.curRing = curRing;

  if (curDot && curRing) {
    var cx = 0, cy = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', function (e) {
      cx = e.clientX; cy = e.clientY;
      curDot.style.left = cx + 'px';
      curDot.style.top  = cy + 'px';
    });
    (function tick() {
      rx += (cx - rx) * 0.12;
      ry += (cy - ry) * 0.12;
      curRing.style.left = rx + 'px';
      curRing.style.top  = ry + 'px';
      requestAnimationFrame(tick);
    })();

    /* Hover enlargement — page scripts can call _bsg.addHoverTargets(selector) */
    function addHover(sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.addEventListener('mouseenter', function () {
          curDot.classList.add('hov');
          curRing.style.width = '54px';
          curRing.style.height = '54px';
        });
        el.addEventListener('mouseleave', function () {
          curDot.classList.remove('hov');
          curRing.style.width = '38px';
          curRing.style.height = '38px';
        });
      });
    }
    addHover('a, button');
    _bsg.addHoverTargets = addHover;
  }

  /* ── NAV SCROLL SHADOW ── */
  var nav = document.getElementById('mainNav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  /* ── STYLE CYCLE BUTTON ── */
  var navCycleBtn = document.getElementById('navCycleBtn');
  if (navCycleBtn) {
    navCycleBtn.addEventListener('click', function () { _bsg.cycleStyle(); });
  }

  /* ── DARK / LIGHT TOGGLE ── */
  var themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      html.dataset.theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('bsg-theme', html.dataset.theme);
    });
  }

  /* ── HAMBURGER / MOBILE NAV ── */
  var ham    = document.getElementById('hamBtn');
  var mobNav = document.getElementById('mobNav');
  if (ham && mobNav) {
    var overlay = mobNav.querySelector('.mob-nav-overlay');
    function toggleMob(open) {
      ham.classList.toggle('open', open);
      mobNav.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }
    ham.addEventListener('click', function () {
      toggleMob(!mobNav.classList.contains('open'));
    });
    if (overlay) overlay.addEventListener('click', function () { toggleMob(false); });
    mobNav.querySelectorAll('.mob-nav-links a').forEach(function (a) {
      a.addEventListener('click', function () { toggleMob(false); });
    });

    var mobTheme = document.getElementById('mobThemeBtn');
    if (mobTheme) {
      mobTheme.addEventListener('click', function () {
        html.dataset.theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('bsg-theme', html.dataset.theme);
      });
    }
    var mobCycle = document.getElementById('mobCycleBtn');
    if (mobCycle) {
      mobCycle.addEventListener('click', function () { _bsg.cycleStyle(); });
    }
  }

  /* ── SCROLL REVEAL ── */
  /* Adds .vis to any [data-r] element when it enters the viewport */
  var ro = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) e.target.classList.add('vis');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('[data-r]').forEach(function (el) { ro.observe(el); });

})();
