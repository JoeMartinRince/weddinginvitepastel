/**
 * HoverBloom Engine — Custom Wedding Palette Edition
 * Tailored exclusively for Aju & Naaji Wedding Website
 *
 * Exact Color Palette:
 *   Flower Petals:
 *     - Primary: #F8F7F1 (Warm Ivory)
 *     - Secondary: #DCE7D8 (Very Pale Sage)
 *     - Subtle Accent: #EDF2E8 (Pale Sage Accent)
 *   Leaves:
 *     - Primary: #8FA88D (Muted Sage Green)
 *     - Secondary: #A8BDA7 (Soft Pale Sage)
 *     - Dark Details: #70896F (Deep Sage Veins)
 *   Stems:
 *     - Base: #70896F
 *     - Alt: #8FA88D
 *   Flower Centres:
 *     - Core & Stamens: #B69A70 (Antique Gold)
 *
 * Retains 100% of original HoverBloom growth physics, canvas mechanics,
 * velocity response, and interactive blooming triggers.
 * Zero red, pink, purple, or neon colors.
 */

(function (global) {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // EXACT WEDDING PALETTE DEFINITIONS (HSL & HEX)
  const COLOR_PETAL_PRIMARY = { h: 51, s: 32, l: 96, hex: "#F8F7F1" };   // Warm Ivory
  const COLOR_PETAL_SECONDARY = { h: 104, s: 25, l: 88, hex: "#DCE7D8" }; // Very Pale Sage
  const COLOR_PETAL_ACCENT = { h: 90, s: 26, l: 93, hex: "#EDF2E8" };    // Pale Sage Accent

  const COLOR_LEAF_PRIMARY = { h: 116, s: 14, l: 61, hex: "#8FA88D" };   // Muted Sage
  const COLOR_LEAF_SECONDARY = { h: 117, s: 15, l: 70, hex: "#A8BDA7" }; // Soft Pale Sage
  const COLOR_LEAF_DARK = { h: 118, s: 11, l: 49, hex: "#70896F" };      // Deep Sage Details

  const COLOR_STEM_BASE = { h: 118, s: 11, l: 49, hex: "#70896F" };      // Stem Dark
  const COLOR_STEM_ALT = { h: 116, s: 14, l: 61, hex: "#8FA88D" };       // Stem Light

  const COLOR_FLOWER_CENTER = { h: 36, s: 33, l: 58, hex: "#B69A70" };   // Antique Gold

  const PETAL_OPTIONS = [COLOR_PETAL_PRIMARY, COLOR_PETAL_SECONDARY, COLOR_PETAL_ACCENT];

  function clamp01(v) {
    return Math.max(0, Math.min(1, v));
  }

  function pick(arr) {
    return arr[(Math.random() * arr.length) | 0];
  }

  function hslStr(c, a) {
    const hh = ((c.h % 360) + 360) % 360;
    return `hsla(${hh}, ${Math.max(0, Math.min(100, c.s))}%, ${Math.max(0, Math.min(100, c.l))}%, ${Math.max(0, Math.min(1, a))})`;
  }

  class HoverBloomInstance {
    constructor(hostEl, options = {}) {
      this.host = hostEl;
      this.options = Object.assign(
        {
          growthMode: "creep", // "upright" or "creep"
          spawnRate: 10,
          maxBlooms: 55,
          resetOnLeave: false,
          bloomScale: 0.95,
          blur: 0.45,
          watercolor: 0.85,
          trailFade: 0.04,
          interactive: true,
          autoSproutOnScroll: true
        },
        options
      );

      this.running = false;
      this.raf = null;
      this.size = { w: 0, h: 0, dpr: 1 };
      this.hover = false;
      this.lastPointer = null;
      this.spawnAcc = 0;
      this.stems = [];
      this.blooms = [];

      this.initDOM();
      if (!reducedMotion) {
        this.bindEvents();
      }
    }

    initDOM() {
      // Wrapper overlay positioned behind text (z-index: 1)
      this.container = document.createElement("div");
      this.container.className = "hover-bloom-canvas-wrap";
      this.container.style.cssText =
        "position:absolute;inset:0;pointer-events:none;z-index:1;overflow:hidden;border-radius:inherit;";
      this.container.setAttribute("aria-hidden", "true");

      // Display canvas
      this.canvas = document.createElement("canvas");
      this.canvas.className = "hover-bloom-canvas";
      this.canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;";
      this.container.appendChild(this.canvas);

      // Offscreen accumulation canvas
      this.paintCanvas = document.createElement("canvas");

      this.dctx = this.canvas.getContext("2d", { alpha: true });
      this.pctx = this.paintCanvas.getContext("2d", { alpha: true });

      this.host.style.position = this.host.style.position || "relative";
      this.host.insertBefore(this.container, this.host.firstChild);

      this.resize();

      if (window.ResizeObserver) {
        this.ro = new ResizeObserver(() => this.resize());
        this.ro.observe(this.host);
      }
    }

    resize() {
      const rect = this.host.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

      if (this.size.w === w && this.size.h === h && this.size.dpr === dpr) return;

      this.size = { w, h, dpr };
      this.canvas.width = Math.floor(w * dpr);
      this.canvas.height = Math.floor(h * dpr);

      const prevW = this.paintCanvas.width;
      const prevH = this.paintCanvas.height;
      const snapshot = document.createElement("canvas");
      snapshot.width = prevW;
      snapshot.height = prevH;
      const snapCtx = snapshot.getContext("2d");
      if (snapCtx && prevW > 0 && prevH > 0) {
        snapCtx.drawImage(this.paintCanvas, 0, 0);
      }

      this.paintCanvas.width = Math.floor(w * dpr);
      this.paintCanvas.height = Math.floor(h * dpr);

      if (this.pctx) {
        this.pctx.setTransform(1, 0, 0, 1, 0, 0);
        this.pctx.scale(dpr, dpr);
        this.pctx.lineCap = "round";
        this.pctx.lineJoin = "round";
        this.pctx.globalCompositeOperation = "source-over";

        if (prevW > 0 && prevH > 0 && snapCtx) {
          const dx = (w * dpr - prevW) * 0.5;
          const dy = h * dpr - prevH;
          this.pctx.setTransform(1, 0, 0, 1, 0, 0);
          this.pctx.drawImage(snapshot, dx, dy);
          this.pctx.setTransform(1, 0, 0, 1, 0, 0);
          this.pctx.scale(dpr, dpr);
        }
      }
    }

    spawnStemAt(x, y, intensity = 0.5) {
      const { w, h } = this.size;
      if (w <= 0 || h <= 0) return;

      const maxB = Math.max(1, this.options.maxBlooms);
      if (this.stems.length + this.blooms.length >= maxB) {
        this.stems.splice(0, Math.max(0, this.stems.length - (maxB - 1)));
        this.blooms.splice(0, Math.max(0, this.blooms.length - (maxB - 1)));
      }

      // Pick strictly between Primary Ivory #F8F7F1 (70%) and Pale Sage #DCE7D8 (30%)
      const petalColor = Math.random() < 0.7 ? COLOR_PETAL_PRIMARY : COLOR_PETAL_SECONDARY;

      const scale = Math.max(0.2, this.options.bloomScale) * (0.65 + Math.random() * 0.5) * (0.8 + intensity * 0.5);
      const isCreep = this.options.growthMode === "creep";
      const targetA = isCreep ? (Math.random() < 0.5 ? -Math.PI * 0.2 : -Math.PI * 0.8) : -Math.PI / 2;
      const len = (h * (isCreep ? 0.22 : 0.14) + Math.random() * (h * 0.18) + 35) * (0.65 + scale);
      const angle = targetA + (Math.random() - 0.5) * (isCreep ? 0.75 : 0.6);

      const stem = {
        id: `${Date.now()}-${Math.random()}`,
        x: Math.max(w * 0.02, Math.min(w * 0.98, x + (Math.random() - 0.5) * 12)),
        y: Math.max(h * 0.05, Math.min(h * 0.98, y + 8 + Math.random() * 14)),
        targetLen: len,
        grown: 0,
        speed: 1.8 + Math.random() * 2.2,
        a: angle,
        targetA,
        segs: [{ x, y, a: angle }],
        done: false,
        hasFlower: false,
        type: (Math.random() * 6) | 0,
        scale,
        petalColor
      };

      this.stems.push(stem);
      this.ensureLoop();
    }

    addBloom(x, y, type, scale, petalColor) {
      const b = {
        id: `${Date.now()}-${Math.random()}`,
        x,
        y,
        age: 0,
        maxAge: 70 + Math.random() * 60,
        type,
        scale,
        petalColor
      };
      this.blooms.push(b);
    }

    drawBlob(ctx, x, y, r, c, a, angle = 0, stretch = 1.6) {
      const jitter = r * 0.2;
      for (let i = 0; i < 2; i++) {
        const jx = (Math.random() - 0.5) * jitter;
        const jy = (Math.random() - 0.5) * jitter;
        const rr = Math.max(0.6, r * (0.75 + Math.random() * 0.5));
        const rx = rr * stretch;
        const ry = rr * (0.55 + Math.random() * 0.55);
        const aa = angle + (Math.random() - 0.5) * 0.35;
        ctx.beginPath();
        ctx.ellipse(x + jx, y + jy, rx, ry, aa, 0, Math.PI * 2);
        ctx.fillStyle = hslStr(
          { h: c.h + (Math.random() * 4 - 2), s: c.s, l: c.l + (Math.random() * 4 - 2) },
          a
        );
        ctx.fill();
      }
    }

    stroke(ctx, x1, y1, x2, y2, c, w, a) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = hslStr(
        { h: c.h + (Math.random() * 4 - 2), s: c.s, l: c.l + (Math.random() * 4 - 2) },
        a
      );
      ctx.lineWidth = Math.max(0.2, w * (0.8 + Math.random() * 0.5));
      ctx.stroke();
    }

    stepStem(s) {
      const stepSize = 5;
      const steps = Math.max(1, Math.floor(s.speed));
      for (let k = 0; k < steps; k++) {
        if (s.grown >= s.targetLen) {
          s.done = true;
          break;
        }
        const last = s.segs[s.segs.length - 1];
        let a = last.a;
        a += ((s.targetA ?? -Math.PI / 2) - a) * 0.04 + (Math.random() - 0.5) * 0.12;
        const nx = last.x + Math.cos(a) * stepSize;
        const ny = last.y + Math.sin(a) * stepSize;
        s.segs.push({ x: nx, y: ny, a });
        s.grown += stepSize;
      }
      if (s.grown >= s.targetLen) s.done = true;
    }

    drawStem(ctx, s) {
      const segs = s.segs;
      if (segs.length < 2) return;

      // Exact stems palette: #70896F and #8FA88D
      const stemBase = COLOR_STEM_BASE; // #70896F
      const stemAlt = COLOR_STEM_ALT;   // #8FA88D

      const maxI = segs.length - 1;
      const total = Math.max(1, Math.floor(s.targetLen / 5));
      const start = Math.max(1, maxI - 4);

      for (let i = start; i <= maxI; i++) {
        const prev = segs[i - 1];
        const cur = segs[i];
        const t = i / total;
        const w = (2.6 * (1 - t) + 0.8) * s.scale;

        // Base stem line in #70896F
        this.stroke(ctx, prev.x, prev.y, cur.x, cur.y, stemBase, w, 0.22);
        // Subtle highlight stroke in #8FA88D
        this.stroke(ctx, prev.x, prev.y, cur.x, cur.y, stemAlt, w * 0.7, 0.18);

        // Branching leaves
        const leafChance = s.targetA > -1.2 ? 0.18 : 0.09;
        if (i > 5 && i < maxI - 3 && Math.random() < leafChance) {
          const a = cur.a + (Math.random() < 0.5 ? -1 : 1) * (0.6 + Math.random() * 0.7);
          const len = (10 + Math.random() * 20) * s.scale;
          const tipX = cur.x + Math.cos(a) * len;
          const tipY = cur.y + Math.sin(a) * len;

          // Leaves: Primary #8FA88D, Secondary #A8BDA7, Dark details #70896F
          const leafColor = Math.random() < 0.6 ? COLOR_LEAF_PRIMARY : COLOR_LEAF_SECONDARY;
          this.drawBlob(ctx, (cur.x + tipX) * 0.5, (cur.y + tipY) * 0.5, (4 + Math.random() * 4) * s.scale, leafColor, 0.16, a, 2.2);
          this.stroke(ctx, cur.x, cur.y, tipX, tipY, COLOR_LEAF_DARK, Math.max(0.4, w * 0.35), 0.25);
        }
      }
    }

    drawBloom(ctx, b) {
      b.age += 1;
      const t = clamp01(b.age / 60);
      const bloom = 0.15 + t * 0.85;
      const persist = !this.options.resetOnLeave;
      const fadeOut = persist ? 1 : clamp01((b.maxAge - b.age) / 20);

      // Flower petals palette
      const petalBase = b.petalColor || COLOR_PETAL_PRIMARY; // #F8F7F1
      const petalOutline = COLOR_LEAF_SECONDARY;             // #A8BDA7 for subtle delicate sage edge
      const centerGold = COLOR_FLOWER_CENTER;               // #B69A70 (antique gold)

      const s = b.scale;
      const headX = b.x + (Math.random() - 0.5) * 0.2;
      const headY = b.y - (8 + Math.random() * 6) * s * bloom;

      const creep = b.type <= 3;
      const petalCount = creep
        ? b.type === 0 ? 16 : b.type === 1 ? 6 : b.type === 2 ? 10 : 8
        : b.type === 1 ? 5 : b.type === 4 ? 12 : b.type === 3 ? 9 : 7;
      const radius = (creep ? 7.5 : 10) * s * bloom + (b.type === 0 ? 4 * s * bloom : 0);
      const spread = creep ? (b.type === 1 ? 1.25 : 1) : (b.type === 2 ? 0.75 : 1);

      for (let i = 0; i < petalCount; i++) {
        if (Math.random() > 0.8) continue;
        const baseA = creep && b.type === 1
          ? -Math.PI / 2 + (i % 2 === 0 ? -0.45 : 0.45) + (Math.random() - 0.5) * 0.25
          : -Math.PI / 2 + (Math.PI * 2 * i) / petalCount;
        const a = baseA + (Math.random() - 0.5) * 0.35;
        const dist = radius * (0.75 + Math.random() * 0.85) * spread;
        const px = headX + Math.cos(a) * dist;
        const py = headY + Math.sin(a) * dist;
        const stretch = (creep ? 2.2 : 1.6) + Math.random() * (creep ? 1 : 0.9);

        // 1. Delicate sage under-layer contour so ivory petals pop against ivory paper
        this.drawBlob(
          ctx,
          (px + headX) * 0.5,
          (py + headY) * 0.5,
          radius * 0.48,
          petalOutline,
          fadeOut * 0.07 * (0.7 + this.options.watercolor * 0.7),
          a + 0.08,
          stretch * 1.05
        );

        // 2. Main petal fill in #F8F7F1 (warm ivory) with subtle pale sage variations
        const currentPetalColor =
          (i % 3 === 0) ? COLOR_PETAL_SECONDARY : (i % 5 === 0) ? COLOR_PETAL_ACCENT : petalBase;

        this.drawBlob(
          ctx,
          px,
          py,
          radius * (0.58 + Math.random() * 0.22),
          currentPetalColor,
          fadeOut * 0.12 * (0.6 + this.options.watercolor * 0.8),
          a,
          stretch
        );
      }

      // 3. Flower Centre Core in #B69A70 (Antique Gold)
      const core = (4.5 + Math.random() * 2.5) * s * bloom;
      this.drawBlob(ctx, headX, headY + 1 * s, core, centerGold, fadeOut * 0.15 * (0.7 + this.options.watercolor * 0.8), 0, 1.2);

      // 4. Subtle pollen stamens radiating from centre in #B69A70
      if (b.age > 10) {
        for (let i = 0; i < 6; i++) {
          if (Math.random() > 0.55) continue;
          const aa = Math.random() * Math.PI * 2;
          const dd = (1.5 + Math.random() * 4.5) * s * bloom;
          const dx = headX + Math.cos(aa) * dd;
          const dy = headY + Math.sin(aa) * dd;
          this.drawBlob(ctx, dx, dy, (1.2 + Math.random() * 1.6) * s * bloom, centerGold, fadeOut * 0.18, aa, 1);
        }
      }
    }

    render() {
      const { w, h, dpr } = this.size;
      if (w <= 0 || h <= 0) return;

      const pctx = this.pctx;
      const dctx = this.dctx;
      if (!pctx || !dctx) return;

      const persist = !this.options.resetOnLeave;

      if (!persist) {
        pctx.save();
        pctx.globalCompositeOperation = "source-over";
        pctx.fillStyle = "#F8F7F1";
        pctx.globalAlpha = Math.max(0.02, clamp01(this.options.trailFade) * 0.35);
        pctx.setTransform(1, 0, 0, 1, 0, 0);
        pctx.scale(dpr, dpr);
        pctx.fillRect(0, 0, w, h);
        pctx.restore();
      }

      // Step & draw stems
      for (const s of this.stems) {
        if (!s.done) {
          this.stepStem(s);
          this.drawStem(pctx, s);
        } else if (!s.hasFlower) {
          const segs = s.segs;
          const anchor = segs[Math.max(1, segs.length - 2)];
          this.addBloom(anchor.x, anchor.y, s.type, Math.max(0.2, s.scale * (0.8 + Math.random() * 0.5)), s.petalColor);

          if (segs.length > 18 && Math.random() > 0.55) {
            const node = segs[Math.max(5, segs.length - (10 + ((Math.random() * 10) | 0)))];
            const side = Math.random() < 0.5 ? -1 : 1;
            const a = node.a + side * (0.85 + Math.random() * 0.5);
            const budX = node.x + Math.cos(a) * (10 + Math.random() * 12) * s.scale;
            const budY = node.y + Math.sin(a) * (10 + Math.random() * 12) * s.scale;
            this.addBloom(budX, budY, (s.type + 1 + ((Math.random() * 3) | 0)) % 6, Math.max(0.18, s.scale * 0.7), COLOR_PETAL_SECONDARY);
          }
          s.hasFlower = true;
        }
      }

      // Draw blooms
      let anyBloomAlive = false;
      for (let i = 0; i < this.blooms.length; i++) {
        const b = this.blooms[i];
        if (b.age < b.maxAge) {
          this.drawBloom(pctx, b);
          anyBloomAlive = true;
        }
      }

      // Blit to display canvas with watercolor post-processing filter
      dctx.setTransform(1, 0, 0, 1, 0, 0);
      dctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      dctx.scale(dpr, dpr);

      const blurPx = Math.max(0, this.options.blur);
      const wc = clamp01(this.options.watercolor);
      dctx.filter = `blur(${blurPx * (0.5 + wc * 0.9)}px) contrast(${1.02 + wc * 0.08}) saturate(${1.05 + wc * 0.15})`;
      dctx.globalAlpha = 1;
      dctx.drawImage(this.paintCanvas, 0, 0, w * dpr, h * dpr, 0, 0, w, h);
      dctx.filter = "none";

      this.stems = this.stems.filter((s) => !(s.done && s.hasFlower));
      if (this.blooms.length > this.options.maxBlooms) {
        this.blooms.splice(0, this.blooms.length - this.options.maxBlooms);
      }

      const shouldContinue = this.hover || this.stems.length > 0 || anyBloomAlive;
      if (shouldContinue) {
        this.raf = requestAnimationFrame(() => this.render());
      } else {
        this.running = false;
        this.raf = null;
      }
    }

    ensureLoop() {
      if (this.running) return;
      this.running = true;
      this.raf = requestAnimationFrame(() => this.render());
    }

    bindEvents() {
      if (!this.options.interactive) return;

      const onEnter = () => {
        this.hover = true;
        this.ensureLoop();
      };

      const onLeave = () => {
        this.hover = false;
        this.lastPointer = null;
        this.spawnAcc = 0;
      };

      const onMove = (e) => {
        const rect = this.host.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const now = performance.now ? performance.now() : Date.now();
        const last = this.lastPointer;
        let intensity = 0.35;

        if (last) {
          const dt = Math.max(1, now - last.t);
          const dx = x - last.x;
          const dy = y - last.y;
          const speed = Math.sqrt(dx * dx + dy * dy) / dt;
          intensity = clamp01(0.25 + speed * 3.2);
        }

        this.lastPointer = { x, y, t: now };

        const rate = Math.max(0, this.options.spawnRate);
        const dt = last ? Math.max(0, now - last.t) / 1000 : 1 / 60;
        this.spawnAcc += rate * dt;

        while (this.spawnAcc >= 1) {
          this.spawnAcc -= 1;
          this.spawnStemAt(x + (Math.random() - 0.5) * 10, y + (Math.random() - 0.5) * 10, intensity);
        }

        this.ensureLoop();
      };

      const onDown = (e) => {
        const rect = this.host.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.spawnStemAt(x, y, 0.9);
        this.ensureLoop();
      };

      this.host.addEventListener("pointerenter", onEnter, { passive: true });
      this.host.addEventListener("pointerleave", onLeave, { passive: true });
      this.host.addEventListener("pointermove", onMove, { passive: true });
      this.host.addEventListener("pointerdown", onDown, { passive: true });

      // Keyboard accessibility
      this.host.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          const { w, h } = this.size;
          this.spawnStemAt(w * 0.5, h * 0.7, 0.8);
          this.ensureLoop();
        }
      });

      // Ambient auto-sprout when section enters view
      if (this.options.autoSproutOnScroll && "IntersectionObserver" in window) {
        const obs = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const { w, h } = this.size;
                if (w > 0 && h > 0) {
                  this.spawnStemAt(w * 0.15, h * 0.85, 0.6);
                  this.spawnStemAt(w * 0.85, h * 0.85, 0.6);
                }
                obs.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.25 }
        );
        obs.observe(this.host);
      }
    }
  }

  // Global initializer
  function initHoverBloom() {
    if (reducedMotion) {
      console.info("[HoverBloom] prefers-reduced-motion active, motion disabled.");
      return;
    }

    const instances = [];

    // 1. Hero Section Decoration (.hero-arch-card)
    const heroCard = document.querySelector(".hero-arch-card");
    if (heroCard) {
      instances.push(
        new HoverBloomInstance(heroCard, {
          growthMode: "creep",
          spawnRate: 10,
          maxBlooms: 50,
          bloomScale: 0.9,
          watercolor: 0.85
        })
      );
    }

    // 2. Invitation Floral Decoration (.invitation-box)
    const invitationBox = document.querySelector(".invitation-box");
    if (invitationBox) {
      instances.push(
        new HoverBloomInstance(invitationBox, {
          growthMode: "creep",
          spawnRate: 8,
          maxBlooms: 45,
          bloomScale: 0.85,
          watercolor: 0.85
        })
      );
    }

    // 3. Closing Invitation Ornament (.closing-box)
    const closingBox = document.querySelector(".closing-box");
    if (closingBox) {
      instances.push(
        new HoverBloomInstance(closingBox, {
          growthMode: "upright",
          spawnRate: 8,
          maxBlooms: 40,
          bloomScale: 0.85,
          watercolor: 0.85
        })
      );
    }

    window.__hoverBloomInstances = instances;
    window.__hoverBloomStatus = {
      initialized: true,
      instanceCount: instances.length,
      palette: {
        petals: ["#F8F7F1", "#DCE7D8", "#EDF2E8"],
        leaves: ["#8FA88D", "#A8BDA7", "#70896F"],
        stems: ["#70896F", "#8FA88D"],
        centres: ["#B69A70"]
      },
      targets: ["Hero Arch Card", "Invitation Box", "Closing Box"]
    };

    console.info("[HoverBloom] Initialized with custom wedding palette:", window.__hoverBloomStatus);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHoverBloom, { once: true });
  } else {
    initHoverBloom();
  }

  global.HoverBloomInstance = HoverBloomInstance;
})(window);
