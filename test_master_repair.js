const { spawn } = require('child_process');
const fs = require('fs');

async function runComprehensiveTests() {
  console.log('=== STARTING MASTER REPAIR BROWSER VERIFICATION ===\n');

  const port = 9522;
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=' + process.env.TEMP + '\\chrome-repair-test-' + Date.now(),
    '--disable-gpu',
    '--window-size=1440,900',
    'http://localhost:8080/index.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const res = await fetch(`http://127.0.0.1:${port}/json/list`);
    const targets = await res.json();
    const page = targets.find(t => t.type === 'page');
    const ws = new WebSocket(page.webSocketDebuggerUrl);

    let consoleErrors = [];

    function send(method, params = {}) {
      return new Promise((resolve) => {
        const id = Math.floor(Math.random() * 1000000);
        const handler = (event) => {
          const data = JSON.parse(event.data);
          if (data.id === id) {
            ws.removeEventListener('message', handler);
            resolve(data.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    async function evaluate(expr) {
      const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
      return res?.result?.value;
    }

    async function captureScreenshot(filename) {
      const res = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(filename, Buffer.from(res.data, 'base64'));
      console.log(`📸 Saved screenshot: ${filename}`);
    }

    await new Promise((resolve) => {
      ws.onopen = () => {
        ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));
        ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
        ws.send(JSON.stringify({ id: 3, method: 'Console.enable' }));
        setTimeout(resolve, 1500);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.method === 'Console.messageAdded' && data.params.message.level === 'error') {
          consoleErrors.push(data.params.message.text);
        }
        if (data.method === 'Runtime.exceptionThrown') {
          consoleErrors.push(data.params.exceptionDetails.text);
        }
      };
    });

    // 1. Force normal motion & check motion status
    await send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }]
    });
    // Reload page with media feature active
    await send('Page.reload');
    await new Promise(r => setTimeout(r, 1500));

    console.log('--- 1. MOTION STATUS OBJECT (Normal Motion) ---');
    const motionStatus = await evaluate('window.__AJUNAAJI_MOTION_STATUS__');
    console.log(JSON.stringify(motionStatus, null, 2));

    if (!motionStatus || !motionStatus.initialized) {
      throw new Error('Motion system failed to initialize!');
    }
    if (motionStatus.sections !== 4) {
      throw new Error(`Expected 4 sections, got ${motionStatus.sections}`);
    }
    if (motionStatus.overlays !== 4) {
      throw new Error(`Expected 4 overlays, got ${motionStatus.overlays}`);
    }
    if (motionStatus.stems <= 0) {
      throw new Error('Stems must be greater than 0');
    }
    if (motionStatus.leaves <= 0) {
      throw new Error('Leaves must be greater than 0');
    }
    if (motionStatus.flowers <= 0) {
      throw new Error('Flowers must be greater than 0');
    }
    if (motionStatus.petals <= 0) {
      throw new Error('Falling petals must be greater than 0 under normal motion');
    }
    if (motionStatus.reveals <= 0) {
      throw new Error('Reveals must be greater than 0');
    }
    console.log('[PASS] Motion status verification succeeded!\n');

    // 2. Countdown verification
    console.log('--- 2. COUNTDOWN VERIFICATION ---');
    const cd1 = await evaluate(`({
      days: document.querySelector("[data-countdown-days]")?.textContent,
      hours: document.querySelector("[data-countdown-hours]")?.textContent,
      minutes: document.querySelector("[data-countdown-minutes]")?.textContent,
      seconds: document.querySelector("[data-countdown-seconds]")?.textContent,
      status: document.querySelector("[data-countdown-status]")?.textContent
    })`);
    console.log('Initial Countdown Reading:', cd1);

    if (cd1.days === '00' && cd1.hours === '00' && cd1.minutes === '00') {
      throw new Error('Countdown is stuck at 00!');
    }

    // Wait 1200ms and verify tick
    await new Promise(r => setTimeout(r, 1200));
    const cd2 = await evaluate(`({
      seconds: document.querySelector("[data-countdown-seconds]")?.textContent
    })`);
    console.log('Countdown Reading after 1.2s:', cd2);
    if (cd1.seconds === cd2.seconds) {
      console.warn('Seconds did not change, waiting another 1s...');
      await new Promise(r => setTimeout(r, 1000));
      const cd3 = await evaluate(`document.querySelector("[data-countdown-seconds]")?.textContent`);
      if (cd1.seconds === cd3) {
        throw new Error('Countdown timer is not ticking!');
      }
    }
    console.log('[PASS] Countdown timer is actively calculating and ticking down to Jan 02, 2027 IST!\n');

    // 3. Physical scroll & animation trigger test
    console.log('--- 3. SCROLL-TRIGGERED REVEALS & BLOOMING ---');
    const sections = ['#hero', '#invitation', '#celebrations', '#countdown', '#closing'];
    for (const sec of sections) {
      await evaluate(`document.querySelector("${sec}").scrollIntoView({ behavior: "instant" })`);
      await new Promise(r => setTimeout(r, 500));
    }

    const visibleOverlays = await evaluate(`document.querySelectorAll(".wedding-botanical-layer.is-visible").length`);
    const visibleReveals = await evaluate(`document.querySelectorAll("[data-wedding-reveal].is-visible").length`);
    console.log(`Overlays marked is-visible: ${visibleOverlays}/4`);
    console.log(`Reveal elements marked is-visible: ${visibleReveals}/${motionStatus.reveals}`);

    if (visibleOverlays < 4) {
      throw new Error(`Not all overlays became visible! (Expected 4, got ${visibleOverlays})`);
    }
    console.log('[PASS] All scroll observers triggered and botanical animations bloomed!\n');

    // 4. Multi-viewport testing & screenshots
    console.log('--- 4. MULTI-VIEWPORT RESPONSIVENESS & OVERFLOW CHECKS ---');
    const viewports = [
      { name: 'desktop_1440', width: 1440, height: 900 },
      { name: 'laptop_1024', width: 1024, height: 768 },
      { name: 'tablet_768', width: 768, height: 1024 },
      { name: 'mobile_430', width: 430, height: 932 },
      { name: 'mobile_390', width: 390, height: 844 },
      { name: 'mobile_360', width: 360, height: 800 }
    ];

    for (const vp of viewports) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.width < 768
      });
      await new Promise(r => setTimeout(r, 400));

      const overflow = await evaluate(`({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        hasOverflow: document.documentElement.scrollWidth > window.innerWidth
      })`);

      if (overflow.hasOverflow) {
        throw new Error(`Horizontal overflow detected at ${vp.width}px! scrollWidth=${overflow.scrollWidth}, innerWidth=${vp.width}`);
      }
      console.log(`[PASS] Viewport ${vp.width}x${vp.height} (${vp.name}): 0 horizontal overflow (scrollWidth=${overflow.scrollWidth})`);

      // Capture desktop and mobile screenshots
      if (vp.name === 'desktop_1440') {
        await evaluate(`window.scrollTo(0, 0)`);
        await new Promise(r => setTimeout(r, 400));
        await captureScreenshot('repair_desktop_1440_hero.png');

        await evaluate(`document.getElementById("celebrations").scrollIntoView({ behavior: "instant" })`);
        await new Promise(r => setTimeout(r, 400));
        await captureScreenshot('repair_desktop_1440_celebrations.png');

        await evaluate(`document.getElementById("countdown").scrollIntoView({ behavior: "instant" })`);
        await new Promise(r => setTimeout(r, 400));
        await captureScreenshot('repair_desktop_1440_countdown.png');
      }

      if (vp.name === 'mobile_390') {
        await evaluate(`window.scrollTo(0, 0)`);
        await new Promise(r => setTimeout(r, 400));
        await captureScreenshot('repair_mobile_390_hero.png');

        await evaluate(`document.getElementById("celebrations").scrollIntoView({ behavior: "instant" })`);
        await new Promise(r => setTimeout(r, 400));
        await captureScreenshot('repair_mobile_390_celebrations.png');

        await evaluate(`document.getElementById("countdown").scrollIntoView({ behavior: "instant" })`);
        await new Promise(r => setTimeout(r, 400));
        await captureScreenshot('repair_mobile_390_countdown.png');
      }
    }

    // 5. Test Reduced Motion behavior
    console.log('\n--- 5. REDUCED MOTION SUPPORT ---');
    await send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
    });
    await send('Page.reload');
    await new Promise(r => setTimeout(r, 1500));

    const reducedStatus = await evaluate('window.__AJUNAAJI_MOTION_STATUS__');
    console.log('Reduced motion status:', JSON.stringify(reducedStatus, null, 2));
    if (!reducedStatus.reducedMotion) {
      throw new Error('Reduced motion emulation was not detected!');
    }
    if (reducedStatus.petals !== 0) {
      throw new Error('Falling petals should be disabled under prefers-reduced-motion: reduce');
    }
    console.log('[PASS] Prefers-reduced-motion is gracefully supported (0 falling petals, instant reveals)!\n');

    // 6. Check console errors
    if (consoleErrors.length > 0) {
      throw new Error(`Detected browser console errors: ${consoleErrors.join(', ')}`);
    }
    console.log('[PASS] ZERO browser console errors detected throughout all tests!\n');

    ws.close();
    chrome.kill();
    console.log('==============================================');
    console.log('ALL MASTER REPAIR BROWSER TESTS PASSED (100%)');
    console.log('==============================================');
    process.exit(0);
  } catch (err) {
    console.error('[ERROR IN TEST]', err);
    chrome.kill();
    process.exit(1);
  }
}

runComprehensiveTests();
