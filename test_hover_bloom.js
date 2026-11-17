/**
 * HoverBloom Integration Verification & Demonstration
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9433;
const URL = 'http://localhost:8080/';
const OUT = __dirname;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const chrome = spawn(CHROME, [
    '--headless=new',
    '--remote-debugging-port=' + PORT,
    '--user-data-dir=' + require('os').tmpdir() + '\\chrome-hb-' + Date.now(),
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
  });

  await send('Page.enable');
  await send('Runtime.enable');

  await send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }]
  });

  console.log('\n=== TESTING HOVERBLOOM INTEGRATION ===\n');

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440, height: 900, deviceScaleFactor: 1, mobile: false
  });

  await send('Page.navigate', { url: URL });
  await sleep(3000);

  // 1. Verify status object
  const statusRes = await send('Runtime.evaluate', {
    expression: 'JSON.stringify(window.__hoverBloomStatus)',
    returnByValue: true
  });
  console.log('window.__hoverBloomStatus:');
  const status = JSON.parse(statusRes.result.value || '{}');
  console.log(JSON.stringify(status, null, 2));

  if (!status.initialized) {
    console.error('HoverBloom failed to initialize!');
    process.exit(1);
  }

  // 2. Simulate hover on Hero Arch Card
  console.log('\nSimulating hover on Hero Arch Card...');
  await send('Runtime.evaluate', {
    expression: `(function() {
      const card = document.querySelector('.hero-arch-card');
      const rect = card.getBoundingClientRect();
      // Dispatch pointer events to bloom
      card.dispatchEvent(new PointerEvent('pointerenter'));
      card.dispatchEvent(new PointerEvent('pointerdown', { clientX: rect.left + 100, clientY: rect.top + 80, bubbles: true }));
      card.dispatchEvent(new PointerEvent('pointermove', { clientX: rect.left + 150, clientY: rect.top + 100, bubbles: true }));
      card.dispatchEvent(new PointerEvent('pointerdown', { clientX: rect.right - 100, clientY: rect.top + 80, bubbles: true }));
      card.dispatchEvent(new PointerEvent('pointermove', { clientX: rect.right - 140, clientY: rect.top + 110, bubbles: true }));
    })()`,
    returnByValue: false
  });
  await sleep(1500);

  // Capture Hero HoverBloom screenshot
  let heroShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(OUT, 'hoverbloom_hero_desktop.png'), Buffer.from(heroShot.data, 'base64'));
  console.log('📸 Captured hoverbloom_hero_desktop.png');

  // 3. Scroll to Invitation Box & simulate hover
  console.log('\nScrolling to Invitation Box & simulating hover...');
  await send('Runtime.evaluate', {
    expression: 'window.scrollTo({top: 950, behavior: "instant"})',
    returnByValue: false
  });
  await sleep(800);

  await send('Runtime.evaluate', {
    expression: `(function() {
      const box = document.querySelector('.invitation-box');
      const rect = box.getBoundingClientRect();
      box.dispatchEvent(new PointerEvent('pointerenter'));
      box.dispatchEvent(new PointerEvent('pointerdown', { clientX: rect.left + 80, clientY: rect.top + 50, bubbles: true }));
      box.dispatchEvent(new PointerEvent('pointermove', { clientX: rect.left + 120, clientY: rect.top + 70, bubbles: true }));
      box.dispatchEvent(new PointerEvent('pointerdown', { clientX: rect.right - 80, clientY: rect.top + 50, bubbles: true }));
    })()`,
    returnByValue: false
  });
  await sleep(1500);

  let invShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(OUT, 'hoverbloom_invitation_desktop.png'), Buffer.from(invShot.data, 'base64'));
  console.log('📸 Captured hoverbloom_invitation_desktop.png');

  // 4. Scroll to Closing Section & simulate hover
  console.log('\nScrolling to Closing Box & simulating hover...');
  await send('Runtime.evaluate', {
    expression: 'window.scrollTo({top: 4800, behavior: "instant"})',
    returnByValue: false
  });
  await sleep(800);

  await send('Runtime.evaluate', {
    expression: `(function() {
      const box = document.querySelector('.closing-box');
      const rect = box.getBoundingClientRect();
      box.dispatchEvent(new PointerEvent('pointerenter'));
      box.dispatchEvent(new PointerEvent('pointerdown', { clientX: rect.left + 100, clientY: rect.top + 40, bubbles: true }));
      box.dispatchEvent(new PointerEvent('pointerdown', { clientX: rect.right - 100, clientY: rect.top + 40, bubbles: true }));
    })()`,
    returnByValue: false
  });
  await sleep(1500);

  let closingShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(OUT, 'hoverbloom_closing_desktop.png'), Buffer.from(closingShot.data, 'base64'));
  console.log('📸 Captured hoverbloom_closing_desktop.png');

  // 5. Test on Mobile (390px)
  console.log('\nTesting HoverBloom on Mobile (390px)...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390, height: 844, deviceScaleFactor: 2, mobile: true
  });
  await send('Page.navigate', { url: URL });
  await sleep(2500);

  // Simulate touch tap on Hero card
  await send('Runtime.evaluate', {
    expression: `(function() {
      const card = document.querySelector('.hero-arch-card');
      const rect = card.getBoundingClientRect();
      card.dispatchEvent(new PointerEvent('pointerdown', { clientX: rect.left + 60, clientY: rect.top + 50, bubbles: true }));
      card.dispatchEvent(new PointerEvent('pointermove', { clientX: rect.left + 90, clientY: rect.top + 70, bubbles: true }));
    })()`,
    returnByValue: false
  });
  await sleep(1500);

  let mobileHeroShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(OUT, 'hoverbloom_hero_mobile.png'), Buffer.from(mobileHeroShot.data, 'base64'));
  console.log('📸 Captured hoverbloom_hero_mobile.png');

  // Check console errors
  console.log(`\nZero console errors check: ${errors.length === 0 ? 'PASS' : 'FAIL (' + errors.length + ')'}`);

  console.log('\n====================================');
  console.log('HOVERBLOOM INTEGRATION TEST COMPLETE!');
  console.log('====================================\n');

  ws.close();
  chrome.kill();
  process.exit(errors.length === 0 ? 0 : 1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
