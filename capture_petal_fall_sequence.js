/**
 * Capture multi-stage falling petals sequence
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9422;
const URL = 'http://localhost:8080/';
const OUT = __dirname;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const chrome = spawn(CHROME, [
    '--headless=new',
    '--remote-debugging-port=' + PORT,
    '--user-data-dir=' + require('os').tmpdir() + '\\chrome-petals-' + Date.now(),
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

  await send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }]
  });

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440, height: 900, deviceScaleFactor: 1, mobile: false
  });

  await send('Page.navigate', { url: URL });
  await sleep(1500);

  // Capture frame 1: Hero with pastel green petals
  let shot1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(OUT, 'pastel_petals_hero_1.png'), Buffer.from(shot1.data, 'base64'));
  console.log('📸 pastel_petals_hero_1.png saved');

  await sleep(2500);
  let shot2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(OUT, 'pastel_petals_hero_2.png'), Buffer.from(shot2.data, 'base64'));
  console.log('📸 pastel_petals_hero_2.png saved');

  // Scroll down to Invitation section
  await send('Runtime.evaluate', {
    expression: 'window.scrollTo({top: 900, behavior: "instant"})',
    returnByValue: false
  });
  await sleep(1000);
  let shot3 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(OUT, 'pastel_petals_invitation.png'), Buffer.from(shot3.data, 'base64'));
  console.log('📸 pastel_petals_invitation.png saved');

  // Scroll down to Celebrations timeline
  await send('Runtime.evaluate', {
    expression: 'window.scrollTo({top: 1900, behavior: "instant"})',
    returnByValue: false
  });
  await sleep(1000);
  let shot4 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(OUT, 'pastel_petals_celebrations.png'), Buffer.from(shot4.data, 'base64'));
  console.log('📸 pastel_petals_celebrations.png saved');

  // Mobile viewport test (390px)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390, height: 844, deviceScaleFactor: 2, mobile: true
  });
  await send('Page.navigate', { url: URL });
  await sleep(2000);
  let shot5 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(OUT, 'pastel_petals_mobile_390.png'), Buffer.from(shot5.data, 'base64'));
  console.log('📸 pastel_petals_mobile_390.png saved');

  ws.close();
  chrome.kill();
  console.log('Done capturing pastel green falling petals sequence!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
