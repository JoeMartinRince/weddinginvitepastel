/**
 * Verification of Botanical Motion System as requested in PART 6
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9411;
const URL = 'http://localhost:8080/';
const OUT = __dirname;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const chrome = spawn(CHROME, [
    '--headless=new',
    '--remote-debugging-port=' + PORT,
    '--user-data-dir=' + require('os').tmpdir() + '\\chrome-bms-' + Date.now(),
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

  // Override reduced-motion to ensure motion is enabled during test
  await send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }]
  });

  console.log('\n=== TESTING PART 6 REQUIREMENTS ===\n');

  // 1. Desktop Test (1440px)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440, height: 900, deviceScaleFactor: 1, mobile: false
  });

  await send('Page.navigate', { url: URL });
  await sleep(3000);

  // Evaluate window.__botanicalMotionStatus
  const statusRes = await send('Runtime.evaluate', {
    expression: 'JSON.stringify(window.__botanicalMotionStatus)',
    returnByValue: true
  });

  console.log('window.__botanicalMotionStatus:');
  const status = JSON.parse(statusRes.result.value || '{}');
  console.log(JSON.stringify(status, null, 2));

  let passed = 0;
  let total = 0;

  function assert(name, condition) {
    total++;
    if (condition) {
      console.log(`[PASS] ${name}`);
      passed++;
    } else {
      console.error(`[FAIL] ${name}`);
    }
  }

  assert('initialized: true', status.initialized === true);
  assert('sections: at least 4', status.sections >= 4);
  assert('vinePaths: greater than 0', status.vinePaths > 0);
  assert('leaves: greater than 0', status.leaves > 0);
  assert('flowerPetals: greater than 0', status.flowerPetals > 0);
  assert('fallingPetals: greater than 0', status.fallingPetals > 0);
  assert('revealElements: greater than 0', status.revealElements > 0);

  // Check initial visible overlays (hero is in view)
  const initialVisibleOverlays = await send('Runtime.evaluate', {
    expression: 'document.querySelectorAll(".botanical-overlay.is-visible").length',
    returnByValue: true
  });
  console.log(`Initial visible overlays: ${initialVisibleOverlays.result.value}`);
  assert('Initial visible overlays >= 1', initialVisibleOverlays.result.value >= 1);

  // Capture Hero animation screenshot
  const heroShot = await send('Page.captureScreenshot', { format: 'png' });
  if (heroShot.data) {
    fs.writeFileSync(path.join(OUT, 'botanical_motion_hero_desktop.png'), Buffer.from(heroShot.data, 'base64'));
    console.log('📸 Captured botanical_motion_hero_desktop.png');
  }

  // Scroll down to invitation / timeline
  console.log('\nScrolling down to test scroll-triggered reveals...');
  await send('Runtime.evaluate', {
    expression: 'window.scrollTo({top: 1200, behavior: "instant"})',
    returnByValue: false
  });
  await sleep(1000);

  const scrollVisibleOverlays = await send('Runtime.evaluate', {
    expression: 'document.querySelectorAll(".botanical-overlay.is-visible").length',
    returnByValue: true
  });
  console.log(`Visible overlays after scroll: ${scrollVisibleOverlays.result.value}`);
  assert('Visible overlays increased on scroll', scrollVisibleOverlays.result.value > initialVisibleOverlays.result.value);

  const revealItemsVisible = await send('Runtime.evaluate', {
    expression: 'document.querySelectorAll("[data-reveal].is-visible").length',
    returnByValue: true
  });
  console.log(`Visible [data-reveal] items after scroll: ${revealItemsVisible.result.value}`);
  assert('Visible [data-reveal] items > 0', revealItemsVisible.result.value > 0);

  // Capture scroll-triggered vine reveal screenshot
  const scrollShot = await send('Page.captureScreenshot', { format: 'png' });
  if (scrollShot.data) {
    fs.writeFileSync(path.join(OUT, 'botanical_motion_scroll_reveal.png'), Buffer.from(scrollShot.data, 'base64'));
    console.log('📸 Captured botanical_motion_scroll_reveal.png');
  }

  // Check horizontal overflow
  const overflowCheck = await send('Runtime.evaluate', {
    expression: 'document.documentElement.scrollWidth <= window.innerWidth',
    returnByValue: true
  });
  assert('No horizontal overflow on desktop', overflowCheck.result.value === true);

  // Test across all 6 viewports
  const viewports = [
    { width: 360, height: 740, mobile: true, label: '360' },
    { width: 390, height: 844, mobile: true, label: '390' },
    { width: 430, height: 932, mobile: true, label: '430' },
    { width: 768, height: 1024, mobile: true, label: '768' },
    { width: 1024, height: 768, mobile: false, label: '1024' },
    { width: 1440, height: 900, mobile: false, label: '1440' },
  ];

  console.log('\nTesting across all 6 target breakpoints...');
  for (const vp of viewports) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width, height: vp.height, deviceScaleFactor: vp.mobile ? 2 : 1, mobile: vp.mobile
    });
    await send('Page.navigate', { url: URL });
    await sleep(2000);

    const vpOverflow = await send('Runtime.evaluate', {
      expression: 'document.documentElement.scrollWidth <= window.innerWidth + 1',
      returnByValue: true
    });

    const vpHeroShot = await send('Page.captureScreenshot', { format: 'png' });
    if (vpHeroShot.data) {
      fs.writeFileSync(path.join(OUT, `botanical_motion_${vp.label}_hero.png`), Buffer.from(vpHeroShot.data, 'base64'));
    }

    assert(`Viewport ${vp.label}px no overflow & rendered`, vpOverflow.result.value === true);
  }

  assert('Zero console errors throughout test', errors.length === 0);

  console.log(`\n====================================`);
  console.log(`BOTANICAL MOTION TEST: ${passed}/${total} PASSED`);
  console.log(`====================================\n`);

  ws.close();
  chrome.kill();
  process.exit(passed === total ? 0 : 1);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
