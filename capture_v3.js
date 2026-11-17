/**
 * Multi-viewport screenshot capture for Aju & Naaji wedding site
 * Captures: 360px, 390px, 430px, 768px, 1024px, 1440px
 * With animations enabled (overrides prefers-reduced-motion)
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9388;
const URL = 'http://localhost:8080/';
const OUT = __dirname;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

const VIEWPORTS = [
  { width: 390, height: 844, mobile: true, label: 'mobile_390' },
  { width: 1440, height: 900, mobile: false, label: 'desktop_1440' },
  { width: 768, height: 1024, mobile: true, label: 'tablet_768' },
];

async function run() {
  const chrome = spawn(CHROME, [
    '--headless=new',
    '--remote-debugging-port=' + PORT,
    '--user-data-dir=' + require('os').tmpdir() + '\\chrome-ss3-' + Date.now(),
    '--disable-gpu', '--no-sandbox',
    '--window-size=1440,900',
    URL,
  ], { stdio: 'pipe' });

  await sleep(2500);

  const r = await fetch('http://127.0.0.1:' + PORT + '/json/list');
  const targets = await r.json();
  const page = targets.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res) => { ws.onopen = res; });

  let cdpId = 1;
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

  await send('Page.enable');
  await send('Runtime.enable');

  // Override reduced motion
  await send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }]
  });

  for (const vp of VIEWPORTS) {
    console.log(`\nCapturing ${vp.label} (${vp.width}x${vp.height})...`);

    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.mobile ? 2 : 1,
      mobile: vp.mobile,
    });

    await send('Page.navigate', { url: URL });
    // Wait for animations to start
    await sleep(3500);

    // Hero viewport screenshot
    const heroShot = await send('Page.captureScreenshot', { format: 'png', quality: 90 });
    if (heroShot.data) {
      const f = path.join(OUT, `v3_${vp.label}_hero.png`);
      fs.writeFileSync(f, Buffer.from(heroShot.data, 'base64'));
      console.log(`  📸 Hero: ${path.basename(f)} (${fs.statSync(f).size} bytes)`);
    }

    // Full page screenshot
    const fullShot = await send('Page.captureScreenshot', {
      format: 'png', quality: 90, captureBeyondViewport: true
    });
    if (fullShot.data) {
      const f = path.join(OUT, `v3_${vp.label}_full.png`);
      fs.writeFileSync(f, Buffer.from(fullShot.data, 'base64'));
      console.log(`  📸 Full: ${path.basename(f)} (${fs.statSync(f).size} bytes)`);
    }

    // Mid-page (scroll to invitation section)
    await send('Runtime.evaluate', { expression: `window.scrollTo({top: 1000, behavior: 'instant'})`, returnByValue: false });
    await sleep(800);
    const midShot = await send('Page.captureScreenshot', { format: 'png', quality: 90 });
    if (midShot.data) {
      const f = path.join(OUT, `v3_${vp.label}_mid.png`);
      fs.writeFileSync(f, Buffer.from(midShot.data, 'base64'));
      console.log(`  📸 Mid: ${path.basename(f)} (${fs.statSync(f).size} bytes)`);
    }
  }

  console.log('\n✅ All screenshots captured!');
  ws.close();
  chrome.kill();
}

run().catch(e => { console.error('Fatal:', e); process.exit(1); });
