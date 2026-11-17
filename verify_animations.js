/**
 * Animation Verification via Chrome CDP (no puppeteer)
 * Tests that botanical animations actually run in a real browser.
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9333;
const URL = 'http://localhost:8080/';
const OUT = __dirname;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function sendCDP(ws, id, method, params = {}) {
  return new Promise((resolve, reject) => {
    const handler = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.id === id) {
          ws.removeEventListener('message', handler);
          if (data.error) reject(new Error(data.error.message));
          else resolve(data.result || {});
        }
      } catch (e) {}
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
    setTimeout(() => {
      ws.removeEventListener('message', handler);
      reject(new Error(`CDP timeout for ${method}`));
    }, 15000);
  });
}

async function evaluate(ws, id, expression) {
  const result = await sendCDP(ws, id, 'Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: false,
  });
  return result.result ? result.result.value : undefined;
}

async function screenshot(ws, id, filePath, fullPage = false) {
  const params = { format: 'png', quality: 90 };
  if (fullPage) params.captureBeyondViewport = true;
  const result = await sendCDP(ws, id, 'Page.captureScreenshot', params);
  if (result.data) {
    fs.writeFileSync(filePath, Buffer.from(result.data, 'base64'));
    console.log(`  📸 Saved: ${path.basename(filePath)} (${fs.statSync(filePath).size} bytes)`);
  }
}

async function main() {
  // Launch Chrome headless
  const chrome = spawn(CHROME, [
    '--headless=new',
    '--remote-debugging-port=' + PORT,
    '--user-data-dir=' + require('os').tmpdir() + '\\chrome-anim-' + Date.now(),
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=390,844',
    URL,
  ], { stdio: 'pipe' });

  chrome.on('error', e => { console.error('Chrome error:', e); process.exit(1); });

  await sleep(2500); // Wait for Chrome to start

  let ws;
  let cdpId = 1;
  const nextId = () => cdpId++;
  const errors = [];

  try {
    // Get CDP target
    const listRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
    const targets = await listRes.json();
    const page = targets.find(t => t.type === 'page');
    if (!page) throw new Error('No page target');

    ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
      setTimeout(() => reject(new Error('WS timeout')), 5000);
    });

    // Enable domains
    await sendCDP(ws, nextId(), 'Page.enable');
    await sendCDP(ws, nextId(), 'Runtime.enable');
    await sendCDP(ws, nextId(), 'Console.enable');

    // Collect console errors
    ws.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.method === 'Console.messageAdded' && data.params.message.level === 'error') {
          errors.push(data.params.message.text);
        }
      } catch (e) {}
    });

    // Set viewport
    await sendCDP(ws, nextId(), 'Emulation.setDeviceMetricsOverride', {
      width: 390, height: 844, deviceScaleFactor: 2, mobile: true,
    });

    // Navigate to page
    await sendCDP(ws, nextId(), 'Page.navigate', { url: URL });
    // Wait for load
    await sleep(3000);

    console.log('\n── ANIMATION DIAGNOSTICS ──────────────────────────────\n');

    // --- Check 1: animations.js style injected ---
    const hasStyle = await evaluate(ws, nextId(), `!!document.getElementById('anim-system-styles')`);
    const c1 = hasStyle === true;
    console.log(`[${c1 ? '✅ PASS' : '❌ FAIL'}] animations.js: style injected`);

    // --- Check 2: Stem dasharray (should be real path length, not 9999) ---
    const stemInfo = await evaluate(ws, nextId(), `JSON.stringify((function(){
      const s = document.querySelector('.botanical-stem');
      if (!s) return {found: false};
      return {
        found: true,
        dasharray: s.style.strokeDasharray,
        dashoffset: s.style.strokeDashoffset,
        total: document.querySelectorAll('.botanical-stem').length
      };
    })())`);
    const si = stemInfo ? JSON.parse(stemInfo) : {};
    const stemDa = parseFloat(si.dasharray) || 0;
    const c2 = si.found && stemDa > 50 && stemDa < 5000;
    console.log(`[${c2 ? '✅ PASS' : '❌ FAIL'}] Stems: real getTotalLength dasharray. Found: ${JSON.stringify(si)}`);

    // --- Check 3: Screenshot at t=0 (before hero animation fires) ---
    await screenshot(ws, nextId(), path.join(OUT, 'anim_t0_hero.png'));
    console.log('[INFO] t=0 screenshot taken');

    // Wait 2s for hero stem to animate
    await sleep(2000);

    // --- Check 4: Stem dashoffset should have changed ---
    const stemAfter = await evaluate(ws, nextId(), `JSON.stringify((function(){
      const s = document.querySelector('.botanical-stem.stem-main');
      if (!s) return null;
      return {
        dashoffset: s.style.strokeDashoffset,
        dasharray: s.style.strokeDasharray,
        transition: s.style.transition
      };
    })())`);
    const sa = stemAfter ? JSON.parse(stemAfter) : {};
    const stemOffset = parseFloat(sa.dashoffset) || 9999;
    const c4 = stemOffset < 100; // Should be near 0 after animation
    console.log(`[${c4 ? '✅ PASS' : '❌ FAIL'}] Stem at t+2s: dashoffset=${sa.dashoffset} (expect near 0). ${JSON.stringify(sa)}`);

    await screenshot(ws, nextId(), path.join(OUT, 'anim_t2_stem.png'));

    // --- Check 5: Leaves visible after animation ---
    await sleep(2000); // let leaf transitions complete
    const leafInfo = await evaluate(ws, nextId(), `JSON.stringify((function(){
      const leaves = document.querySelectorAll('.hero-section .botanical-leaf');
      let vis = 0;
      leaves.forEach(l => { if(parseFloat(l.style.opacity||0) > 0.5) vis++; });
      return {total: leaves.length, visible: vis};
    })())`);
    const li = leafInfo ? JSON.parse(leafInfo) : {};
    const c5 = li.visible > 0;
    console.log(`[${c5 ? '✅ PASS' : '⚠️ WARN'}] Hero leaves visible: ${JSON.stringify(li)}`);

    // --- Check 6: Petal canvas ---
    const hasPetals = await evaluate(ws, nextId(), `!!document.getElementById('petal-canvas')`);
    const c6 = hasPetals === true;
    console.log(`[${c6 ? '✅ PASS' : '❌ FAIL'}] Petal canvas: ${hasPetals}`);

    const petalCount = await evaluate(ws, nextId(), `(document.getElementById('petal-canvas')||{children:[]}).children.length`);
    console.log(`  Petals created: ${petalCount}`);

    // --- Check 7: Ambient particles ---
    const particles = await evaluate(ws, nextId(), `(document.getElementById('ambient-particles')||{children:[]}).children.length`);
    const c7 = particles > 0;
    console.log(`[${c7 ? '✅ PASS' : '❌ FAIL'}] Ambient particles: ${particles}`);

    // --- Check 8: .anim-reveal ---
    const revealCount = await evaluate(ws, nextId(), `document.querySelectorAll('.anim-reveal').length`);
    const c8 = revealCount > 0;
    console.log(`[${c8 ? '✅ PASS' : '❌ FAIL'}] .anim-reveal elements: ${revealCount}`);

    // --- Check 9: Scroll down and check in-view ---
    await evaluate(ws, nextId(), `window.scrollTo({top: 1200, behavior: 'instant'})`);
    await sleep(800);
    const inView = await evaluate(ws, nextId(), `document.querySelectorAll('.anim-reveal.in-view').length`);
    const c9 = inView > 0;
    console.log(`[${c9 ? '✅ PASS' : '❌ FAIL'}] .anim-reveal.in-view after scroll: ${inView}`);
    await screenshot(ws, nextId(), path.join(OUT, 'anim_scroll_reveal.png'));

    // --- Check 10: hero-arch-card animation ---
    await evaluate(ws, nextId(), `window.scrollTo({top: 0, behavior: 'instant'})`);
    await sleep(500);
    const cardAnim = await evaluate(ws, nextId(), `window.getComputedStyle(document.querySelector('.hero-arch-card')||document.body).animationName`);
    const c10 = cardAnim && cardAnim.includes('focusReveal');
    console.log(`[${c10 ? '✅ PASS' : '⚠️ WARN'}] hero-arch-card animationName: "${cardAnim}"`);

    // --- Full-page screenshot ---
    await screenshot(ws, nextId(), path.join(OUT, 'anim_hero_final.png'));

    // --- Scroll through all sections ---
    const scrollPositions = [0, 500, 1200, 2000, 3000, 4000];
    for (let i = 0; i < scrollPositions.length; i++) {
      await evaluate(ws, nextId(), `window.scrollTo({top: ${scrollPositions[i]}, behavior: 'instant'})`);
      await sleep(600);
    }
    await screenshot(ws, nextId(), path.join(OUT, 'anim_bottom.png'));

    // --- Console errors ---
    console.log(`\n[${errors.length === 0 ? '✅ PASS' : '❌ FAIL'}] Console errors: ${errors.length}`);
    if (errors.length) errors.forEach((e, i) => console.log(`  ${i+1}. ${e.substring(0, 200)}`));

    // --- Summary ---
    const passed = [c1, c2, c4, c5, c6, c7, c8, c9].filter(Boolean).length;
    const total = 8;
    console.log(`\n── RESULT: ${passed}/${total} checks passed ──────────────────`);

    ws.close();
    chrome.kill();
    process.exit(passed >= 7 ? 0 : 1);

  } catch (err) {
    console.error('Fatal error:', err.message);
    if (ws) ws.close();
    chrome.kill();
    process.exit(1);
  }
}

main();
