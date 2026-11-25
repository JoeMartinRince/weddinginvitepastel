(() => {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const initialized = new WeakSet();

  function svgElement(name, attributes = {}) {
    const element = document.createElementNS(SVG_NS, name);

    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });

    return element;
  }

  function createBotanicalSVG() {
    const svg = svgElement("svg", {
      viewBox: "0 0 190 720",
      preserveAspectRatio: "none",
      "aria-hidden": "true"
    });

    const stems = [
      "M 12 -10 C 65 70 28 140 90 215 S 135 330 90 410 S 150 540 120 710",
      "M 55 125 C 100 115 120 82 125 45",
      "M 85 205 C 42 195 24 168 18 145",
      "M 95 350 C 150 325 165 290 168 260",
      "M 80 460 C 35 440 20 410 25 385"
    ];

    stems.forEach((d, index) => {
      const path = svgElement("path", {
        d,
        class: "wedding-stem",
        "data-stem": "",
      });

      path.style.setProperty(
        "--path-delay",
        `${index * 350}ms`
      );

      svg.appendChild(path);
    });

    const leafPositions = [
      [55, 115, -35],
      [75, 185, 35],
      [93, 280, -40],
      [80, 390, 35],
      [105, 500, -35],
      [125, 590, 35]
    ];

    leafPositions.forEach(([x, y, angle], index) => {
      const wrapper = svgElement("g", {
        transform: `translate(${x} ${y}) rotate(${angle})`
      });

      const leaf = svgElement("g", {
        class: "wedding-leaf"
      });

      leaf.style.setProperty(
        "--delay",
        `${1100 + index * 350}ms`
      );

      const shape = svgElement("path", {
        d: "M 0 0 C -20 -12 -32 -35 -25 -49 C -7 -45 7 -23 0 0 Z",
        fill: "#A8BDA7",
        stroke: "#70896F",
        "stroke-width": ".8"
      });

      leaf.appendChild(shape);
      wrapper.appendChild(leaf);
      svg.appendChild(wrapper);
    });

    function addFlower(x, y, delay) {
      const flower = svgElement("g", {
        transform: `translate(${x} ${y})`
      });

      [0, 72, 144, 216, 288].forEach((angle, index) => {
        const rotation = svgElement("g", {
          transform: `rotate(${angle})`
        });

        const petal = svgElement("ellipse", {
          class: "wedding-flower-petal",
          cx: 0,
          cy: -7,
          rx: 3.7,
          ry: 7
        });

        petal.style.setProperty(
          "--delay",
          `${delay + index * 130}ms`
        );

        rotation.appendChild(petal);
        flower.appendChild(rotation);
      });

      flower.appendChild(svgElement("circle", {
        class: "wedding-flower-center",
        cx: 0,
        cy: 0,
        r: 2.6
      }));

      svg.appendChild(flower);
    }

    addFlower(125, 45, 2800);
    addFlower(168, 260, 3400);

    return svg;
  }

  function createVine(side) {
    const wrapper = document.createElement("div");
    wrapper.className = `wedding-vine ${side}`;

    const svg = createBotanicalSVG();

    wrapper.appendChild(svg);

    return wrapper;
  }

  function createPetals(layer) {
    if (reducedMotion) return;

    for (let i = 0; i < 5; i++) {
      const petal = document.createElement("span");

      petal.className = "wedding-falling-petal";

      petal.style.setProperty("--left", `${10 + i * 19}%`);
      petal.style.setProperty("--size", `${8 + (i % 3) * 2}px`);
      petal.style.setProperty("--duration", `${14 + i * 2}s`);
      petal.style.setProperty("--delay", `${-i * 3}s`);
      petal.style.setProperty("--drift", `${i % 2 ? "-22px" : "24px"}`);
      petal.style.setProperty("--rotation", `${i % 2 ? "-220deg" : "240deg"}`);

      layer.appendChild(petal);
    }
  }

  function initializeSection(section) {
    if (initialized.has(section)) return;

    initialized.add(section);

    const layer = document.createElement("div");
    layer.className = "wedding-botanical-layer";
    layer.setAttribute("aria-hidden", "true");

    const type = section.dataset.weddingBotanical;

    layer.appendChild(createVine("left"));

    if (type === "hero" || type === "closing") {
      layer.appendChild(createVine("right"));
    }

    if (type === "hero") {
      const petals = document.createElement("div");
      petals.className = "wedding-petal-layer";

      createPetals(petals);
      layer.appendChild(petals);
    }

    section.insertBefore(layer, section.firstChild);

    layer.querySelectorAll("[data-stem]").forEach((path) => {
      const length = path.getTotalLength();

      path.style.setProperty(
        "--path-length",
        `${length}`
      );

      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
    });

    return layer;
  }

  /* ==========================================
     PART B: WEDDING COUNTDOWN (UTC+05:30 IST)
     ========================================== */
  const NIKKAH_TARGET = new Date("2027-01-02T11:00:00+05:30").getTime();

  function updateWeddingCountdown() {
    const now = Date.now();
    const remaining = NIKKAH_TARGET - now;

    const days = document.querySelector("[data-countdown-days]");
    const hours = document.querySelector("[data-countdown-hours]");
    const minutes = document.querySelector("[data-countdown-minutes]");
    const seconds = document.querySelector("[data-countdown-seconds]");

    if (!days || !hours || !minutes || !seconds) {
      console.error("Countdown elements are missing.");
      return;
    }

    if (remaining <= 0) {
      days.textContent = "00";
      hours.textContent = "00";
      minutes.textContent = "00";
      seconds.textContent = "00";

      const status = document.querySelector("[data-countdown-status]");

      if (status) {
        status.textContent = "THE NIKKAH CELEBRATION HAS BEGUN";
      }

      return;
    }

    const totalSeconds = Math.floor(remaining / 1000);

    const d = Math.floor(totalSeconds / 86400);
    const h = Math.floor((totalSeconds % 86400) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    days.textContent = String(d).padStart(2, "0");
    hours.textContent = String(h).padStart(2, "0");
    minutes.textContent = String(m).padStart(2, "0");
    seconds.textContent = String(s).padStart(2, "0");
  }

  /* ==========================================
     STARTUP & OBSERVERS
     ========================================== */
  function start() {
    const sections = [
      ...document.querySelectorAll("[data-wedding-botanical]")
    ];

    const overlays = sections
      .map(initializeSection)
      .filter(Boolean);

    const revealElements = [
      ...document.querySelectorAll("[data-wedding-reveal]")
    ];

    revealElements.forEach((element, index) => {
      element.style.setProperty(
        "--reveal-delay",
        `${Math.min(index % 4, 3) * 120}ms`
      );
    });

    if (reducedMotion || !("IntersectionObserver" in window)) {
      overlays.forEach(el => el.classList.add("is-visible"));
      revealElements.forEach(el => el.classList.add("is-visible"));
    } else {
      const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      }, {
        threshold: 0.08,
        rootMargin: "0px 0px -5% 0px"
      });

      overlays.forEach(el => sectionObserver.observe(el));

      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      }, {
        threshold: 0.08
      });

      revealElements.forEach(el => revealObserver.observe(el));
    }

    document.documentElement.classList.add("wedding-motion-ready");

    // Initialize countdown
    updateWeddingCountdown();
    setInterval(updateWeddingCountdown, 1000);

    window.__AJUNAAJI_MOTION_STATUS__ = {
      initialized: true,
      sections: sections.length,
      overlays: overlays.length,
      stems: document.querySelectorAll("[data-stem]").length,
      leaves: document.querySelectorAll(".wedding-leaf").length,
      flowers: document.querySelectorAll(".wedding-flower-petal").length,
      petals: document.querySelectorAll(".wedding-falling-petal").length,
      reveals: revealElements.length,
      reducedMotion
    };

    console.info(
      "[Aju Naaji motion status]",
      window.__AJUNAAJI_MOTION_STATUS__
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
