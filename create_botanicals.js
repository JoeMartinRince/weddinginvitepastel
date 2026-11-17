// create_botanicals.js
// Generates optimized inline SVGs for botanical vine growth, leaf unfolding, and flower blooming

function makeFlower(cx, cy, scale = 1, delay = 1.2) {
  // 5 petals + central gold stamen
  const petalPaths = [];
  for (let i = 0; i < 5; i++) {
    const angle = (i * 72) * (Math.PI / 180);
    const px = cx + Math.cos(angle) * 7 * scale;
    const py = cy + Math.sin(angle) * 7 * scale;
    // Organic oval petal
    petalPaths.push(`
      <ellipse class="blossom-petal" cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="${(5.5 * scale).toFixed(1)}" ry="${(3.8 * scale).toFixed(1)}" transform="rotate(${i * 72}, ${px.toFixed(1)}, ${py.toFixed(1)})" fill="#FFFFFF" stroke="#E6EDE4" stroke-width="0.6"/>
    `);
  }
  return `
    <g class="botanical-blossom" style="transform-origin: ${cx}px ${cy}px; --bloom-delay: ${delay}s;">
      ${petalPaths.join('')}
      <circle class="blossom-center" cx="${cx}" cy="${cy}" r="${(2.5 * scale).toFixed(1)}" fill="#B69A70"/>
      <circle cx="${cx}" cy="${cy}" r="${(1.2 * scale).toFixed(1)}" fill="#F8F7F1"/>
    </g>
  `;
}

function makeLeaf(cx, cy, angle, scale = 1, delay = 0.8) {
  // Leaf pointing at angle with transform-origin at (cx, cy)
  return `
    <g class="botanical-leaf" style="transform-origin: ${cx}px ${cy}px; --leaf-delay: ${delay}s;">
      <g transform="rotate(${angle}, ${cx}, ${cy})">
        <path d="M ${cx} ${cy} C ${cx + 10 * scale} ${cy - 8 * scale}, ${cx + 22 * scale} ${cy - 5 * scale}, ${cx + 26 * scale} ${cy} C ${cx + 22 * scale} ${cy + 5 * scale}, ${cx + 10 * scale} ${cy + 8 * scale}, ${cx} ${cy} Z" fill="#8FA88D" opacity="0.9"/>
        <line x1="${cx}" y1="${cy}" x2="${cx + 22 * scale}" y2="${cy}" stroke="#B69A70" stroke-width="0.6" stroke-linecap="round" opacity="0.65"/>
      </g>
    </g>
  `;
}

// 1. Hero Left Vine SVG
function getHeroLeftVine() {
  const stemD = "M 10 10 C 45 35, 90 40, 130 65 C 165 85, 185 125, 215 160 C 235 185, 260 205, 290 220";
  const branch1D = "M 85 40 C 105 25, 130 18, 155 20";
  const branch2D = "M 150 75 C 175 60, 205 65, 225 80";
  const branch3D = "M 200 140 C 220 130, 245 135, 265 150";

  return `
  <svg class="botanical-vine-svg hero-vine-left" viewBox="0 0 320 260" xmlns="http://www.w3.org/2000/svg">
    <!-- Main stem -->
    <path class="botanical-stem stem-main" d="${stemD}" fill="none" stroke="#8FA88D" stroke-width="1.8" stroke-linecap="round"/>
    <!-- Branches -->
    <path class="botanical-stem stem-sub-1" d="${branch1D}" fill="none" stroke="#8FA88D" stroke-width="1.3" stroke-linecap="round"/>
    <path class="botanical-stem stem-sub-2" d="${branch2D}" fill="none" stroke="#8FA88D" stroke-width="1.3" stroke-linecap="round"/>
    <path class="botanical-stem stem-sub-3" d="${branch3D}" fill="none" stroke="#8FA88D" stroke-width="1.3" stroke-linecap="round"/>
    <!-- Leaves -->
    ${makeLeaf(50, 30, -35, 0.9, 0.4)}
    ${makeLeaf(95, 32, -65, 1.0, 0.7)}
    ${makeLeaf(135, 20, -10, 0.85, 0.9)}
    ${makeLeaf(110, 52, 45, 0.95, 0.8)}
    ${makeLeaf(165, 95, 60, 1.0, 1.1)}
    ${makeLeaf(185, 65, -20, 0.9, 1.0)}
    ${makeLeaf(215, 75, 25, 0.85, 1.3)}
    ${makeLeaf(225, 170, 75, 1.0, 1.4)}
    ${makeLeaf(250, 140, 15, 0.85, 1.5)}
    ${makeLeaf(285, 215, 40, 0.95, 1.7)}
    <!-- Flowers -->
    ${makeFlower(155, 20, 1.1, 1.3)}
    ${makeFlower(225, 80, 0.95, 1.6)}
    ${makeFlower(265, 150, 1.05, 1.9)}
    ${makeFlower(290, 220, 1.15, 2.2)}
  </svg>
  `;
}

// 2. Hero Right Vine SVG (Mirror-flowered)
function getHeroRightVine() {
  const stemD = "M 310 10 C 275 35, 230 40, 190 65 C 155 85, 135 125, 105 160 C 85 185, 60 205, 30 220";
  const branch1D = "M 235 40 C 215 25, 190 18, 165 20";
  const branch2D = "M 170 75 C 145 60, 115 65, 95 80";
  const branch3D = "M 120 140 C 100 130, 75 135, 55 150";

  return `
  <svg class="botanical-vine-svg hero-vine-right" viewBox="0 0 320 260" xmlns="http://www.w3.org/2000/svg">
    <!-- Main stem -->
    <path class="botanical-stem stem-main" d="${stemD}" fill="none" stroke="#8FA88D" stroke-width="1.8" stroke-linecap="round"/>
    <!-- Branches -->
    <path class="botanical-stem stem-sub-1" d="${branch1D}" fill="none" stroke="#8FA88D" stroke-width="1.3" stroke-linecap="round"/>
    <path class="botanical-stem stem-sub-2" d="${branch2D}" fill="none" stroke="#8FA88D" stroke-width="1.3" stroke-linecap="round"/>
    <path class="botanical-stem stem-sub-3" d="${branch3D}" fill="none" stroke="#8FA88D" stroke-width="1.3" stroke-linecap="round"/>
    <!-- Leaves -->
    ${makeLeaf(270, 30, -145, 0.9, 0.4)}
    ${makeLeaf(225, 32, -115, 1.0, 0.7)}
    ${makeLeaf(185, 20, -170, 0.85, 0.9)}
    ${makeLeaf(210, 52, 135, 0.95, 0.8)}
    ${makeLeaf(155, 95, 120, 1.0, 1.1)}
    ${makeLeaf(135, 65, -160, 0.9, 1.0)}
    ${makeLeaf(105, 75, 155, 0.85, 1.3)}
    ${makeLeaf(95, 170, 105, 1.0, 1.4)}
    ${makeLeaf(70, 140, 165, 0.85, 1.5)}
    ${makeLeaf(35, 215, 140, 0.95, 1.7)}
    <!-- Flowers -->
    ${makeFlower(165, 20, 1.1, 1.3)}
    ${makeFlower(95, 80, 0.95, 1.6)}
    ${makeFlower(55, 150, 1.05, 1.9)}
    ${makeFlower(30, 220, 1.15, 2.2)}
  </svg>
  `;
}

// 3. Card Corner Sprig SVG (Compact, for invitation/event cards)
function getCornerSprig(isFlipped = false) {
  const transform = isFlipped ? 'transform="scale(-1, 1) translate(-140, 0)"' : '';
  return `
  <svg class="botanical-vine-svg card-corner-vine ${isFlipped ? 'vine-flipped' : ''}" viewBox="0 0 140 120" xmlns="http://www.w3.org/2000/svg">
    <g ${transform}>
      <path class="botanical-stem stem-main" d="M 10 10 C 35 25, 65 30, 90 55 C 105 70, 115 95, 125 115" fill="none" stroke="#8FA88D" stroke-width="1.5" stroke-linecap="round"/>
      <path class="botanical-stem stem-sub-1" d="M 55 28 C 70 18, 90 18, 105 25" fill="none" stroke="#8FA88D" stroke-width="1.1" stroke-linecap="round"/>
      ${makeLeaf(35, 20, -30, 0.8, 0.3)}
      ${makeLeaf(70, 20, -50, 0.85, 0.5)}
      ${makeLeaf(75, 45, 50, 0.85, 0.7)}
      ${makeLeaf(105, 75, 65, 0.9, 0.9)}
      ${makeLeaf(115, 100, 20, 0.75, 1.1)}
      ${makeFlower(105, 25, 0.9, 0.8)}
      ${makeFlower(125, 115, 0.95, 1.3)}
    </g>
  </svg>
  `;
}

// 4. Closing Garland Banner SVG
function getClosingGarland() {
  return `
  <svg class="botanical-vine-svg closing-garland-svg" viewBox="0 0 460 80" xmlns="http://www.w3.org/2000/svg">
    <!-- Left vine curling to center -->
    <path class="botanical-stem stem-main" d="M 20 45 C 70 20, 130 55, 180 35 C 205 25, 220 38, 230 40" fill="none" stroke="#8FA88D" stroke-width="1.5" stroke-linecap="round"/>
    <!-- Right vine curling to center -->
    <path class="botanical-stem stem-main" d="M 440 45 C 390 20, 330 55, 280 35 C 255 25, 240 38, 230 40" fill="none" stroke="#8FA88D" stroke-width="1.5" stroke-linecap="round"/>
    
    <!-- Leaves Left -->
    ${makeLeaf(60, 32, -40, 0.85, 0.4)}
    ${makeLeaf(110, 48, 45, 0.9, 0.7)}
    ${makeLeaf(155, 42, -25, 0.85, 1.0)}
    ${makeLeaf(195, 30, 30, 0.8, 1.2)}
    
    <!-- Leaves Right -->
    ${makeLeaf(400, 32, -140, 0.85, 0.4)}
    ${makeLeaf(350, 48, 135, 0.9, 0.7)}
    ${makeLeaf(305, 42, -155, 0.85, 1.0)}
    ${makeLeaf(265, 30, 150, 0.8, 1.2)}
    
    <!-- Blossoms -->
    ${makeFlower(80, 25, 0.9, 0.7)}
    ${makeFlower(175, 35, 1.0, 1.2)}
    ${makeFlower(230, 40, 1.2, 1.6)}
    ${makeFlower(285, 35, 1.0, 1.2)}
    ${makeFlower(380, 25, 0.9, 0.7)}
  </svg>
  `;
}

module.exports = {
  getHeroLeftVine,
  getHeroRightVine,
  getCornerSprig,
  getClosingGarland
};
