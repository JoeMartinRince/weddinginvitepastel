(() => {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let initialized = false;

  const svgMarkup = `
    <svg
      viewBox="0 0 320 720"
      preserveAspectRatio="xMidYMin meet"
      xmlns="${SVG_NS}"
      aria-hidden="true"
    >
      <g fill="none" stroke="#8FA88D"
         stroke-width="1.7"
         stroke-linecap="round"
         stroke-linejoin="round">

        <path class="draw-path" data-draw data-order="0"
          d="M18 -10 C75 65 28 118 88 178
             S145 260 105 330
             S48 430 104 500
             S150 615 122 730" />

        <path class="draw-path" data-draw data-order="1"
          d="M66 125 C115 112 130 85 137 48" />

        <path class="draw-path" data-draw data-order="2"
          d="M98 214 C48 204 30 177 24 150" />

        <path class="draw-path" data-draw data-order="3"
          d="M112 345 C169 320 185 285 184 250" />

        <path class="draw-path" data-draw data-order="4"
          d="M75 448 C28 426 18 398 24 370" />

        <path class="draw-path" data-draw data-order="5"
          d="M117 542 C166 527 188 493 190 462" />

      </g>

      <!-- Leaves: each unfolds independently -->
      <g transform="translate(72 115) rotate(-42)">
        <path class="botanical-leaf" style="--delay:1.0s"
          d="M0 0 C-25 -16 -40 -43 -32 -60
             C-9 -55 7 -29 0 0Z"/>
      </g>

      <g transform="translate(92 180) rotate(35)">
        <path class="botanical-leaf" style="--delay:1.4s"
          d="M0 0 C24 -18 39 -43 32 -59
             C8 -53 -7 -29 0 0Z"/>
      </g>

      <g transform="translate(106 280) rotate(-35)">
        <path class="botanical-leaf" style="--delay:2.0s"
          d="M0 0 C-25 -16 -40 -43 -32 -60
             C-9 -55 7 -29 0 0Z"/>
      </g>

      <g transform="translate(82 385) rotate(38)">
        <path class="botanical-leaf" style="--delay:2.5s"
          d="M0 0 C24 -18 39 -43 32 -59
             C8 -53 -7 -29 0 0Z"/>
      </g>

      <g transform="translate(98 490) rotate(-40)">
        <path class="botanical-leaf" style="--delay:3.0s"
          d="M0 0 C-25 -16 -40 -43 -32 -60
             C-9 -55 7 -29 0 0Z"/>
      </g>

      <g transform="translate(128 575) rotate(35)">
        <path class="botanical-leaf" style="--delay:3.4s"
          d="M0 0 C24 -18 39 -43 32 -59
             C8 -53 -7 -29 0 0Z"/>
      </g>

      <!-- First flower -->
      <g transform="translate(137 48)">
        <g transform="rotate(0)">
          <path class="flower-petal" style="--delay:3.4s"
            d="M0 0 C-8 -8 -7 -23 0 -29
               C7 -23 8 -8 0 0Z"/>
        </g>
        <g transform="rotate(72)">
          <path class="flower-petal" style="--delay:3.6s"
            d="M0 0 C-8 -8 -7 -23 0 -29
               C7 -23 8 -8 0 0Z"/>
        </g>
        <g transform="rotate(144)">
          <path class="flower-petal" style="--delay:3.8s"
            d="M0 0 C-8 -8 -7 -23 0 -29
               C7 -23 8 -8 0 0Z"/>
        </g>
        <g transform="rotate(216)">
          <path class="flower-petal" style="--delay:4.0s"
            d="M0 0 C-8 -8 -7 -23 0 -29
               C7 -23 8 -8 0 0Z"/>
        </g>
        <g transform="rotate(288)">
          <path class="flower-petal" style="--delay:4.2s"
            d="M0 0 C-8 -8 -7 -23 0 -29
               C7 -23 8 -8 0 0Z"/>
        </g>
        <circle class="flower-center" cx="0" cy="0" r="3"/>
      </g>

      <!-- Second small flower -->
      <g transform="translate(190 462) scale(.72)">
        <g transform="rotate(0)">
          <path class="flower-petal" style="--delay:4.0s"
            d="M0 0 C-8 -8 -7 -23 0 -29
               C7 -23 8 -8 0 0Z"/>
        </g>
        <g transform="rotate(72)">
          <path class="flower-petal" style="--delay:4.2s"
            d="M0 0 C-8 -8 -7 -23 0 -29
               C7 -23 8 -8 0 0Z"/>
        </g>
        <g transform="rotate(144)">
          <path class="flower-petal" style="--delay:4.4s"
            d="M0 0 C-8 -8 -7 -23 0 -29
               C7 -23 8 -8 0 0Z"/>
        </g>
        <g transform="rotate(216)">
          <path class="flower-petal" style="--delay:4.6s"
            d="M0 0 C-8 -8 -7 -23 0 -29
               C7 -23 8 -8 0 0Z"/>
        </g>
        <g transform="rotate(288)">
          <path class="flower-petal" style="--delay:4.8s"
            d="M0 0 C-8 -8 -7 -23 0 -29
               C7 -23 8 -8 0 0Z"/>
        </g>
        <circle class="flower-center" cx="0" cy="0" r="3"/>
      </g>
    </svg>
  `;

  function createVine(side) {
    const vine = document.createElement("div");
    vine.className = `botanical-vine botanical-vine--${side}`;
    vine.setAttribute("aria-hidden", "true");
    vine.innerHTML = svgMarkup;

    vine.querySelectorAll("[data-draw]").forEach((path) => {
      try {
        const length = path.getTotalLength();
        path.style.setProperty("--draw-length", length);
        path.style.setProperty(
          "--draw-delay",
          `${Number(path.dataset.order || 0) * 0.42}s`
        );
      } catch (error) {
        console.warn("Could not measure botanical SVG path:", error);
      }
    });

    return vine;
  }

  // Falling pastel green petals generator
  function createPetals(container, count) {
    const mobile = window.matchMedia("(max-width: 600px)").matches;
    const numPetals = count || (mobile ? 8 : 16);

    // Curated pastel green palette
    const pastelGreenPalette = [
      { fill: "#C9D8C6", stroke: "#8FA88D", vein: "rgba(74, 102, 72, 0.4)" },
      { fill: "#D8E6D5", stroke: "#9EB99B", vein: "rgba(90, 115, 88, 0.35)" },
      { fill: "#BED6BC", stroke: "#7B9A78", vein: "rgba(65, 95, 62, 0.42)" },
      { fill: "#E2ECE0", stroke: "#A5C0A2", vein: "rgba(100, 125, 98, 0.3)" },
      { fill: "#B4CFB2", stroke: "#749471", vein: "rgba(55, 85, 52, 0.45)" }
    ];

    const shapes = [
      // Curved organic petal
      "M12 1 C22 9 22 22 13 32 C12 33 11 33 10 32 C1 22 1 9 11 1 C11.3 0.6 11.7 0.6 12 1Z",
      // Rounded garden petal
      "M12 2 C20 8 23 20 14 31 C12 33 10 33 8 30 C1 21 3 9 11 2 Z",
      // Fluted notched petal
      "M12 1 C18 6 22 15 17 26 C15 30 11 33 9 31 C4 26 2 17 7 8 C8 5 11 2 12 1Z"
    ];

    for (let i = 0; i < numPetals; i++) {
      const petal = document.createElement("span");
      petal.className = "botanical-petal";

      const left = ((i / numPetals) * 100 + (Math.sin(i * 1.9) * 4) + 2) % 96;
      const size = 11 + (i % 4) * 2.5; // 11px to 18.5px
      const duration = 14 + (i % 5) * 2.2; // 14s to 22.8s
      const delay = -(i * (duration / numPetals)); // Staggered negative delays so petals are already mid-flight
      const drift = (i % 2 === 0 ? 1 : -1) * (24 + (i % 3) * 12);
      const spin = (i % 2 === 0 ? 1 : -1) * (180 + (i % 4) * 45);

      const color = pastelGreenPalette[i % pastelGreenPalette.length];
      const shape = shapes[i % shapes.length];

      petal.style.setProperty("--left", `${left.toFixed(1)}%`);
      petal.style.setProperty("--size", `${size}px`);
      petal.style.setProperty("--duration", `${duration.toFixed(1)}s`);
      petal.style.setProperty("--delay", `${delay.toFixed(1)}s`);
      petal.style.setProperty("--drift", `${drift}px`);
      petal.style.setProperty("--spin", `${spin}deg`);
      petal.style.setProperty("--petal-fill", color.fill);
      petal.style.setProperty("--petal-stroke", color.stroke);
      petal.style.setProperty("--petal-vein", color.vein);

      petal.innerHTML = `
        <svg viewBox="0 0 24 34" aria-hidden="true">
          <path class="petal-body" d="${shape}" fill="${color.fill}" stroke="${color.stroke}" stroke-width="0.75"/>
          <path class="petal-vein" d="M11.5 5 C12.2 13 11 21 11.5 27" fill="none" stroke="${color.vein}" stroke-width="0.5"/>
        </svg>
      `;

      container.appendChild(petal);
    }
  }

  function initPetalStream() {
    if (reducedMotion) return;
    let stream = document.getElementById("botanical-petal-stream");
    if (!stream) {
      stream = document.createElement("div");
      stream.id = "botanical-petal-stream";
      stream.className = "petal-stream";
      stream.setAttribute("aria-hidden", "true");
      document.body.appendChild(stream);
      createPetals(stream, window.matchMedia("(max-width: 600px)").matches ? 8 : 16);
    }
  }

  function initializeSection(section) {
    if (section.dataset.botanicalInitialized === "true") return null;

    section.dataset.botanicalInitialized = "true";
    section.classList.add("has-botanical");

    const overlay = document.createElement("div");
    overlay.className = "botanical-overlay";
    overlay.setAttribute("aria-hidden", "true");

    const variant = section.dataset.botanical;

    const sides =
      variant === "hero" || variant === "closing"
        ? ["left", "right"]
        : ["left"];

    sides.forEach((side) => overlay.appendChild(createVine(side)));

    if (variant === "hero" && !reducedMotion) {
      const layer = document.createElement("div");
      layer.className = "petal-layer";
      layer.setAttribute("aria-hidden", "true");
      createPetals(layer, window.matchMedia("(max-width: 600px)").matches ? 5 : 8);
      overlay.appendChild(layer);
    }

    section.insertBefore(overlay, section.firstChild);

    return overlay;
  }

  function initialize() {
    if (initialized) return true;

    const sections = [
      ...document.querySelectorAll("[data-botanical]")
    ];

    if (!sections.length) return false;

    const overlays = [];

    sections.forEach((section) => {
      const overlay = initializeSection(section);
      if (overlay) overlays.push(overlay);
    });

    // Initialize full-page falling petal stream
    initPetalStream();

    const revealElements = [
      ...document.querySelectorAll("[data-reveal]")
    ];

    revealElements.forEach((element) => {
      const delay = Number(element.dataset.revealDelay || 0);
      element.style.setProperty("--reveal-delay", `${delay}ms`);
    });

    if (
      reducedMotion ||
      !("IntersectionObserver" in window)
    ) {
      overlays.forEach((element) =>
        element.classList.add("is-visible")
      );

      revealElements.forEach((element) =>
        element.classList.add("is-visible")
      );
    } else {
      const botanicalObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -8% 0px"
        }
      );

      overlays.forEach((element) =>
        botanicalObserver.observe(element)
      );

      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -8% 0px"
        }
      );

      revealElements.forEach((element) =>
        revealObserver.observe(element)
      );
    }

    /* Only enable hidden initial scroll styles after setup succeeds */
    document.documentElement.classList.add("motion-ready");

    const vinePaths = document.querySelectorAll(
      ".botanical-vine [data-draw]"
    ).length;

    const leaves = document.querySelectorAll(
      ".botanical-leaf"
    ).length;

    const flowers = document.querySelectorAll(
      ".flower-petal"
    ).length;

    const petals = document.querySelectorAll(
      ".botanical-petal"
    ).length;

    window.__botanicalMotionStatus = {
      initialized: true,
      sections: sections.length,
      vinePaths,
      leaves,
      flowerPetals: flowers,
      fallingPetals: petals,
      revealElements: revealElements.length,
      reducedMotion
    };

    console.info(
      "[Aju & Naaji] Botanical animations initialized:",
      window.__botanicalMotionStatus
    );

    initialized = true;
    return true;
  }

  function boot() {
    if (initialize()) return;

    /* Wait for Framer-rendered DOM if necessary */
    const waiter = new MutationObserver(() => {
      if (initialize()) waiter.disconnect();
    });

    waiter.observe(document.documentElement, {
      childList: true,
      subtree: true
    });

    window.setTimeout(() => waiter.disconnect(), 10000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, {
      once: true
    });
  } else {
    boot();
  }
})();
