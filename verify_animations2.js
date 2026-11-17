/**
 * Full Animation Verification — overrides prefers-reduced-motion for testing
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9377;
const URL = 'http://localhost:8080/';
const OUT = __dirname;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  const chrome = spawn(CHROME, [
    '--headless=new',
    '--remote-debugging-port=' + PORT,
    '--user-data-dir=' + require('os').tmpdir() + '\\chrome-anim2-' + Date.now(),
    '--disable-gpu', '--no-sandbox',
    '--window-size=390,844',
    URL,
  ], { stdio: 'pipe' });

  await sleep(2500);
  const r = await fetch('http://127.0.0.1:' + PORT + '/json/list');
  const targets = await r.json();
  const page = targets.find(t => t.type === 'page');
  if (!page) { chrome.kill(); throw new Error('No page'); }

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; setTimeout(rej, 5000); });

  let cdpId = 1;
  const errors = [];

  function send(method, params) {
    return new Promise((res) => {
      const myId = cdpId++;
      const h = (e) => {
        const d = JSON.parse(e.data);
        if (d.id === myId) { ws.removeEventListener('message', h); res(d.result || {}); }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id: myId, method, params: params || {} }));
    });
  }

  ws.addEventListener('message', (e) => {
    const d = JSON.parse(e.data);
    if (d.method === 'Runtime.exceptionThrown') {
      errors.push('JS Error: ' + (d.params.exceptionDetails.text || JSON.stringify(d.params)));
    }
    if (d.method === 'Log.entryAdded' && d.params.entry.level === 'error') {
      errors.push('Log Error: ' + d.params.entry.text);
    }
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Log.enable');

  // ✨ Override prefers-reduced-motion to 'no-preference' for testing
  await send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }]
  });

  // Set viewport
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390, height: 844, deviceScaleFactor: 2, mobile: true,
  });

  // Reload page with the override active
  await send('Page.navigate', { url: URL });
  await sleep(3500);

  console.log('\n── ANIMATION VERIFICATION (motion enabled) ──────────────\n');

  // Check 1: style injected
  const hasStyle = await send('Runtime.evaluate', {
    expression: `!!document.getElementById('anim-system-styles')`, returnByValue: true
  });
  const c1 = hasStyle.result && hasStyle.result.value === true;
  console.log(`[${c1 ? '✅ PASS' : '❌ FAIL'}] animations.js: style injected`);

  // Check 2: Petal canvas
  const hasPetals = await send('Runtime.evaluate', {
    expression: `!!document.getElementById('petal-canvas')`, returnByValue: true
  });
  const c2 = hasPetals.result && hasPetals.result.value === true;
  const petalCount = await send('Runtime.evaluate', {
    expression: `(document.getElementById('petal-canvas')||{children:[]}).children.length`, returnByValue: true
  });
  console.log(`[${c2 ? '✅ PASS' : '❌ FAIL'}] Petal canvas: ${hasPetals.result ? hasPetals.result.value : '?'} | Petals: ${petalCount.result ? petalCount.result.value : '?'}`);

  // Check 3: Ambient particles
  const hasParticles = await send('Runtime.evaluate', {
    expression: `(document.getElementById('ambient-particles')||{children:[]}).children.length`, returnByValue: true
  });
  const c3 = hasParticles.result && hasParticles.result.value > 0;
  console.log(`[${c3 ? '✅ PASS' : '❌ FAIL'}] Ambient particles: ${hasParticles.result ? hasParticles.result.value : '?'}`);

  // Check 4: Stems have real length
  const stemInfo = await send('Runtime.evaluate', {
    expression: `JSON.stringify((function() {
      var s = document.querySelector('.botanical-stem.stem-main');
      if (!s) return {found: false};
      return {dasharray: s.style.strokeDasharray, dashoffset: s.style.strokeDashoffset, count: document.querySelectorAll('.botanical-stem').length};
    })())`, returnByValue: true
  });
  const si = stemInfo.result ? JSON.parse(stemInfo.result.value) : {};
  const stemDa = parseFloat(si.dasharray) || 0;
  const c4 = si.found !== false && stemDa > 50 && stemDa < 5000;
  console.log(`[${c4 ? '✅ PASS' : '❌ FAIL'}] Stem real length: ${JSON.stringify(si)}`);

  // Screenshot at t=0 (animation already started — after 3.5s)
  await send('Page.captureScreenshot', { format: 'png' }).then(r => {
    if (r.data) fs.writeFileSync(path.join(OUT, 'motion_t0_hero.png'), Buffer.from(r.data, 'base64'));
  });
  console.log('📸 motion_t0_hero.png saved');

  // Check 5: Leaves visible
  const leafInfo = await send('Runtime.evaluate', {
    expression: `JSON.stringify((function(){
      var leaves = document.querySelectorAll('.hero-section .botanical-leaf');
      var vis = 0;
      leaves.forEach(function(l){if(parseFloat(l.style.opacity||0)>0.5) vis++;});
      return {total: leaves.length, visible: vis};
    })())`, returnByValue: true
  });
  const li = leafInfo.result ? JSON.parse(leafInfo.result.value) : {};
  const c5 = li.visible > 0;
  console.log(`[${c5 ? '✅ PASS' : '⚠️  WARN'}] Leaves visible: ${JSON.stringify(li)}`);

  // Check 6: .anim-reveal
  const reveals = await send('Runtime.evaluate', {
    expression: `document.querySelectorAll('.anim-reveal').length`, returnByValue: true
  });
  const c6 = reveals.result && reveals.result.value > 0;
  console.log(`[${c6 ? '✅ PASS' : '❌ FAIL'}] .anim-reveal elements: ${reveals.result ? reveals.result.value : '?'}`);

  // Scroll and check
  await send('Runtime.evaluate', { expression: `window.scrollTo({top: 1500, behavior: 'instant'})`, returnByValue: false });
  await sleep(900);
  const inView = await send('Runtime.evaluate', {
    expression: `document.querySelectorAll('.anim-reveal.in-view').length`, returnByValue: true
  });
  const c7 = inView.result && inView.result.value > 0;
  console.log(`[${c7 ? '✅ PASS' : '❌ FAIL'}] .in-view after scroll: ${inView.result ? inView.result.value : '?'}`);

  await send('Page.captureScreenshot', { format: 'png' }).then(r => {
    if (r.data) fs.writeFileSync(path.join(OUT, 'motion_scroll.png'), Buffer.from(r.data, 'base64'));
  });
  console.log('📸 motion_scroll.png saved');

  // Reset scroll and final hero screenshot
  await send('Runtime.evaluate', { expression: `window.scrollTo({top: 0, behavior: 'instant'})`, returnByValue: false });
  await sleep(400);
  await send('Page.captureScreenshot', { format: 'png' }).then(r => {
    if (r.data) fs.writeFileSync(path.join(OUT, 'motion_hero_final.png'), Buffer.from(r.data, 'base64'));
  });
  console.log('📸 motion_hero_final.png saved');

  // Error check
  console.log(`\n[${errors.length === 0 ? '✅ PASS' : '❌ FAIL'}] JS Errors: ${errors.length}`);
  if (errors.length) errors.forEach(e => console.log('  ' + e.substring(0, 150)));

  const passed = [c1, c2, c3, c4, c5, c6, c7].filter(Boolean).length;
  console.log(`\n── RESULT: ${passed}/7 passed ─────────────────────────────\n`);

  ws.close();
  chrome.kill();
  process.exit(passed >= 6 ? 0 : 1);
}

run().catch(e => { console.error('Fatal:', e); process.exit(1); });
