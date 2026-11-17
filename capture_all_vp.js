/**
 * Full Multi-viewport screenshot capture for Aju & Naaji wedding site
 * Captures all 6 viewports: 360px, 390px, 430px, 768px, 1024px, 1440px
 * With animations enabled (overrides prefers-reduced-motion)
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9399;
const URL = 'http://localhost:8080/';
const OUT = __dirname;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

const VIEWPORTS = [
  { width: 360, height: 740, mobile: true, label: '360' },
  { width: 390, height: 844, mobile: true, label: '390' },
  { width: 430, height: 932, mobile: true, label: '430' },
  { width: 768, height: 1024, mobile: true, label: '768' },
  { width: 1024, height: 768, mobile: false, label: '1024' },
  { width: 1440, height: 900, mobile: false, label: '1440' },
];

async function run() {
  const chrome = spawn(CHROME, [
    '--headless=new',
    '--remote-debugging-port=' + PORT,
    '--user-data-dir=' + require('os').tmpdir() + '\\chrome-all-vp-' + Date.now(),
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

  // Override reduced motion so animations render
  await send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }]
  });

  for (const vp of VIEWPORTS) {
    console.log(`Capturing viewport ${vp.label} (${vp.width}x${vp.height})...`);

    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.mobile ? 2 : 1,
      mobile: vp.mobile,
    });

    await send('Page.navigate', { url: URL });
    await sleep(3500);

    // Hero viewport
    const heroShot = await send('Page.captureScreenshot', { format: 'png', quality: 90 });
    if (heroShot.data) {
      const f = path.join(OUT, `v3_final_${vp.label}_hero.png`);
      fs.writeFileSync(f, Buffer.from(heroShot.data, 'base64'));
      console.log(`  📸 Hero: v3_final_${vp.label}_hero.png (${fs.statSync(f).size} bytes)`);
    }

    // Full page
    const fullShot = await send('Page.captureScreenshot', {
      format: 'png', quality: 90, captureBeyondViewport: true
    });
    if (fullShot.data) {
      const f = path.join(OUT, `v3_final_${vp.label}_full.png`);
      fs.writeFileSync(f, Buffer.from(fullShot.data, 'base64'));
      console.log(`  📸 Full: v3_final_${vp.label}_full.png (${fs.statSync(f).size} bytes)`);
    }
  }

  console.log('\nAll 6 viewports captured successfully!');
  ws.close();
  chrome.kill();
}

run().catch(e => { console.error('Fatal:', e); process.exit(1); });
