/**
 * Aju & Naaji Wedding — Botanical Animation System
 * ─────────────────────────────────────────────────
 * Implements:
 *   1. SVG path-drawing vines (getTotalLength, real stroke-dashoffset)
 *   2. Leaf unfold & gentle sway
 *   3. Blossom bloom sequence
 *   4. Falling petal effect (hero)
 *   5. Scroll-reveal (Keluvi-inspired: blur-in + lift)
 *   6. Progressive timeline line draw
 *   7. Ambient floating particles (Quiet Magic)
 *   8. prefers-reduced-motion fallback
 *
 * Pointer-events: none on ALL decorative overlays.
 * No third-party libraries. Vanilla JS + CSS animations only.
 */

(function () {
  'use strict';

  /* ─── Reduced Motion Guard ──────────────────────────────────── */
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── 1. SVG STEM PATH DRAWING ─────────────────────────────── */
  function initStemDrawing() {
    // Fix every .botanical-stem path to use its real total length
    document.querySelectorAll('.botanical-stem').forEach(function (path) {
      try {
        var len = path.getTotalLength ? path.getTotalLength() : 450;
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
      } catch (e) {
        path.style.strokeDasharray = 450;
        path.style.strokeDashoffset = 450;
      }
    });

    if (reduced) {
      // Just reveal immediately — no motion
      document.querySelectorAll('.botanical-stem').forEach(function (p) {
        p.style.strokeDashoffset = 0;
      });
      document.querySelectorAll('.botanical-leaf, .botanical-blossom').forEach(function (el) {
        el.style.opacity = 1;
        el.style.transform = 'scale(1) rotate(0deg)';
      });
      return;
    }

    // Animate hero vines on page load (no scroll needed)
    var heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      // Small delay so browser has painted
      setTimeout(function () {
        triggerBotanicalGrowth(heroSection);
      }, 400);
    }

    // Scroll observer for other sections
    if ('IntersectionObserver' in window) {
      var vineObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            triggerBotanicalGrowth(entry.target);
            vineObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      document.querySelectorAll('.animated-botanical-trigger').forEach(function (el) {
        // Skip hero — already triggered above
        if (!el.classList.contains('hero-section')) {
          vineObs.observe(el);
        }
      });
    }
  }

  function triggerBotanicalGrowth(container) {
    if (!container) return;

    // Stems — staggered draw using real path length
    var stems = container.querySelectorAll('.botanical-stem');
    stems.forEach(function (stem, i) {
      var len = parseFloat(stem.style.strokeDasharray) || 450;
      var delays = [0.15, 0.55, 0.85, 1.15];
      var delay = (delays[i] || (0.15 + i * 0.3)) + 's';
      var dur = (stem.classList.contains('stem-main') ? 2.2 : 1.5) + 's';
      stem.style.transition = 'none';
      stem.style.strokeDashoffset = len;
      // Force reflow
      void stem.getBoundingClientRect();
      stem.style.transition = 'stroke-dashoffset ' + dur + ' cubic-bezier(0.25, 1, 0.5, 1) ' + delay;
      stem.style.strokeDashoffset = 0;
    });

    // Leaves
    var leaves = container.querySelectorAll('.botanical-leaf');
    leaves.forEach(function (leaf) {
      var delay = leaf.style.getPropertyValue('--leaf-delay') || '0.9s';
      leaf.style.transitionDelay = '0s'; // reset
      leaf.style.transform = 'scale(0) rotate(-25deg)';
      leaf.style.opacity = '0';
      leaf.style.transition = 'none';
      void leaf.getBoundingClientRect();
      leaf.style.transition =
        'transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) ' + delay +
        ', opacity 0.7s ease ' + delay;
      leaf.style.transform = 'scale(1) rotate(0deg)';
      leaf.style.opacity = '1';

      // After it's fully grown, add gentle sway via class
      var delayMs = parseFloat(delay) * 1000 + 1200;
      setTimeout(function () {
        leaf.classList.add('leaf-sway');
      }, delayMs);
    });

    // Blossoms
    var blossoms = container.querySelectorAll('.botanical-blossom');
    blossoms.forEach(function (b) {
      var delay = b.style.getPropertyValue('--bloom-delay') || '1.4s';
      b.style.transform = 'scale(0) rotate(-35deg)';
      b.style.opacity = '0';
      b.style.transition = 'none';
      void b.getBoundingClientRect();
      b.style.transition =
        'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) ' + delay +
        ', opacity 0.7s ease ' + delay;
      b.style.transform = 'scale(1) rotate(0deg)';
      b.style.opacity = '1';

      var delayMs = parseFloat(delay) * 1000 + 1300;
      setTimeout(function () {
        b.classList.add('blossom-breathe');
      }, delayMs);
    });
  }

  /* ─── 2. FALLING PETALS (Hero) ──────────────────────────────── */
  function initFallingPetals() {
    if (reduced) return;

    var hero = document.getElementById('hero');
    if (!hero) return;

    var isMobile = window.innerWidth < 768;
    var petalCount = isMobile ? 5 : 10;

    // SVG petal shapes
    var shapes = [
      // teardrop
      'M0,-8 C4,-8 7,-4 7,0 C7,5 4,8 0,8 C-4,8 -7,5 -7,0 C-7,-4 -4,-8 0,-8Z',
      // elongated oval
      'M0,-9 C3,-9 6,-5 6,0 C6,5 3,9 0,9 C-3,9 -6,5 -6,0 C-6,-5 -3,-9 0,-9Z',
      // rounded diamond
      'M0,-7 C3,-5 7,0 3,7 C1,9 -1,9 -3,7 C-7,0 -3,-5 0,-7Z',
    ];

    var petalColors = ['rgba(201,216,198,0.55)', 'rgba(248,247,241,0.7)', 'rgba(237,242,232,0.6)'];

    var wrap = document.createElement('div');
    wrap.id = 'petal-canvas';
    wrap.style.cssText = [
      'position:absolute',
      'inset:0',
      'pointer-events:none',
      'z-index:3',
      'overflow:hidden',
    ].join(';');
    hero.appendChild(wrap);

    for (var i = 0; i < petalCount; i++) {
      createPetal(wrap, shapes, petalColors, i, petalCount);
    }
  }

  function createPetal(container, shapes, colors, index, total) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var size = 10 + Math.random() * 10; // 10–20px
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('viewBox', '-10 -10 20 20');
    svg.style.cssText = [
      'position:absolute',
      'pointer-events:none',
      'will-change:transform,opacity',
    ].join(';');

    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', shapes[Math.floor(Math.random() * shapes.length)]);
    path.setAttribute('fill', colors[Math.floor(Math.random() * colors.length)]);
    svg.appendChild(path);
    container.appendChild(svg);

    animatePetal(svg, index, total);
  }

  function animatePetal(el, index, total) {
    var vw = window.innerWidth;
    var startX = Math.random() * vw;
    var startY = -20;
    var targetY = window.innerHeight + 30;
    var driftX = (Math.random() - 0.5) * 120;
    var dur = 14000 + Math.random() * 12000; // 14–26s
    var delay = (index / total) * 8000 + Math.random() * 4000;
    var rotStart = Math.random() * 360;
    var rotEnd = rotStart + (Math.random() > 0.5 ? 1 : -1) * (120 + Math.random() * 160);
    var opacity = 0.35 + Math.random() * 0.4;

    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var elapsed = ts - start;
      if (elapsed < delay) {
        el.style.opacity = 0;
        requestAnimationFrame(step);
        return;
      }
      var progress = Math.min((elapsed - delay) / dur, 1);
      var eased = progress; // linear fall

      var x = startX + driftX * Math.sin(progress * Math.PI * 1.5);
      var y = startY + (targetY - startY) * eased;
      var rot = rotStart + (rotEnd - rotStart) * progress;

      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.style.transform = 'rotate(' + rot + 'deg)';
      el.style.opacity = progress < 0.1
        ? (progress / 0.1) * opacity
        : progress > 0.85
          ? ((1 - progress) / 0.15) * opacity
          : opacity;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Reset for looping
        start = null;
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  /* ─── 3. SCROLL REVEAL (Keluvi-style) ──────────────────────── */
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything
      document.querySelectorAll('.anim-reveal').forEach(function (el) {
        el.classList.add('in-view');
      });
      return;
    }

    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.anim-reveal').forEach(function (el) {
      revealObs.observe(el);
    });
  }

  /* ─── 4. TIMELINE LINE DRAW ─────────────────────────────────── */
  function initTimelineDraw() {
    if (reduced) return;

    var grid = document.querySelector('.timeline-grid');
    if (!grid) return;

    // Find or create timeline SVG line
    var timelineLine = document.getElementById('timeline-draw-line');
    if (!timelineLine) return;

    var path = timelineLine.querySelector('path, line');
    if (!path) return;

    var len;
    try { len = path.getTotalLength(); } catch (e) { len = 400; }
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    path.style.transition = 'none';

    var lineObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          void path.getBoundingClientRect();
          path.style.transition = 'stroke-dashoffset 2.5s cubic-bezier(0.25, 1, 0.5, 1) 0.3s';
          path.style.strokeDashoffset = 0;
          lineObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    lineObs.observe(grid);
  }

  /* ─── 5. AMBIENT FLOATING PARTICLES ─────────────────────────── */
  function initParticles() {
    if (reduced) return;

    var isMobile = window.innerWidth < 768;
    var count = isMobile ? 4 : 8;

    var canvas = document.createElement('div');
    canvas.id = 'ambient-particles';
    canvas.style.cssText = [
      'position:fixed',
      'inset:0',
      'pointer-events:none',
      'z-index:0',
      'overflow:hidden',
    ].join(';');
    document.body.appendChild(canvas);

    var particleColors = [
      'rgba(201,216,198,0.35)',
      'rgba(237,242,232,0.4)',
      'rgba(182,154,112,0.15)',
    ];

    for (var i = 0; i < count; i++) {
      createParticle(canvas, particleColors, i);
    }
  }

  function createParticle(container, colors, index) {
    var el = document.createElement('div');
    var size = 2 + Math.random() * 4; // 2–6px
    el.style.cssText = [
      'position:absolute',
      'border-radius:50%',
      'pointer-events:none',
      'will-change:transform',
      'width:' + size + 'px',
      'height:' + size + 'px',
      'background:' + colors[index % colors.length],
    ].join(';');
    container.appendChild(el);

    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var x = Math.random() * vw;
    var y = Math.random() * vh;
    var dur = 25000 + Math.random() * 20000; // 25–45s per cycle
    var driftRadius = 40 + Math.random() * 60;

    var start = null;
    function step(ts) {
      if (start === null) start = ts - Math.random() * dur;
      var t = ((ts - start) % dur) / dur;
      var angle = t * Math.PI * 2;
      var cx = x + Math.sin(angle) * driftRadius;
      var cy = y + Math.cos(angle * 0.7) * driftRadius * 0.6;
      el.style.left = cx + 'px';
      el.style.top = cy + 'px';
      el.style.opacity = 0.3 + 0.4 * Math.sin(angle + Math.PI / 3);
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ─── 6. ADD REVEAL CLASSES TO DOM ELEMENTS ─────────────────── */
  function markRevealElements() {
    // Section headers
    document.querySelectorAll('.section-header').forEach(function (el, i) {
      el.classList.add('anim-reveal');
      el.style.transitionDelay = '0s';
    });

    // Invitation card
    var invCard = document.querySelector('.invitation-card-wrap');
    if (invCard) invCard.classList.add('anim-reveal');

    // Event cards (staggered)
    document.querySelectorAll('.event-card').forEach(function (card, i) {
      card.classList.add('anim-reveal');
      card.style.setProperty('--reveal-delay', (i * 0.12) + 's');
    });

    // Location cards
    document.querySelectorAll('.location-card').forEach(function (card, i) {
      card.classList.add('anim-reveal');
      card.style.setProperty('--reveal-delay', (i * 0.1) + 's');
    });

    // Timeline items
    document.querySelectorAll('.timeline-item').forEach(function (item, i) {
      item.classList.add('anim-reveal');
      item.style.setProperty('--reveal-delay', (i * 0.08) + 's');
    });

    // Countdown section
    var countdown = document.querySelector('.countdown-section');
    if (countdown) countdown.classList.add('anim-reveal');

    // Closing
    var closing = document.querySelector('.closing-section');
    if (closing) closing.classList.add('anim-reveal');
  }

  /* ─── INJECT REQUIRED STYLES ─────────────────────────────────── */
  function injectStyles() {
    var css = [
      /* Scroll reveal base state */
      '.anim-reveal{opacity:0;transform:translateY(24px);transition:opacity 0.75s cubic-bezier(0.16,1,0.3,1) var(--reveal-delay,0s),transform 0.75s cubic-bezier(0.16,1,0.3,1) var(--reveal-delay,0s);}',
      '.anim-reveal.in-view{opacity:1;transform:translateY(0);}',

      /* Hero arch card: focus-reveal (blur in) */
      '.hero-arch-card{animation:focusReveal 1.4s cubic-bezier(0.16,1,0.3,1) 0.2s both;}',
      '@keyframes focusReveal{from{opacity:0;filter:blur(10px);transform:translateY(20px);}to{opacity:1;filter:blur(0);transform:translateY(0);}}',

      /* Leaf sway (applied by JS after unfold completes) */
      '@keyframes leafSway{0%,100%{transform:scale(1) rotate(0deg);}50%{transform:scale(1.02) rotate(2deg);}}',
      '.leaf-sway{animation:leafSway 4.5s ease-in-out infinite;}',

      /* Blossom breathe */
      '@keyframes blossomBreathe{0%,100%{transform:scale(1);}50%{transform:scale(1.04);}}',
      '.blossom-breathe{animation:blossomBreathe 5s ease-in-out infinite;}',

      /* Reduced motion overrides */
      '@media(prefers-reduced-motion:reduce){',
      '.anim-reveal{opacity:1!important;transform:none!important;transition:none!important;}',
      '.hero-arch-card{animation:none!important;}',
      '.botanical-stem{transition:none!important;stroke-dashoffset:0!important;}',
      '.botanical-leaf,.botanical-blossom{transition:none!important;opacity:1!important;transform:scale(1) rotate(0deg)!important;}',
      '.leaf-sway,.blossom-breathe{animation:none!important;}',
      '}',
    ].join('');

    var style = document.createElement('style');
    style.id = 'anim-system-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* ─── ENTRY POINT ────────────────────────────────────────────── */
  function boot() {
    injectStyles();
    markRevealElements();
    initStemDrawing();
    initFallingPetals();
    initScrollReveal();
    initTimelineDraw();
    initParticles();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    // Already parsed — small rAF to let Framer runtime settle
    requestAnimationFrame(function () {
      requestAnimationFrame(boot);
    });
  }

})();
