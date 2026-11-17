const { spawn } = require('child_process');
const fs = require('fs');

async function captureAll() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=' + process.env.TEMP + '\\chrome-final-suite-' + Date.now(),
    '--disable-gpu',
    '--window-size=1440,900',
    'http://localhost:8080/index.html'
  ]);

  await new Promise(r => setTimeout(r, 2200));

  try {
    const res = await fetch('http://127.0.0.1:9222/json/list');
    const targets = await res.json();
    const page = targets.find(t => t.type === 'page');
    const ws = new WebSocket(page.webSocketDebuggerUrl);

    function sendCommand(method, params = {}) {
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

    await new Promise((resolve) => {
      ws.onopen = async () => {
        await sendCommand('Page.enable');
        resolve();
      };
    });

    const shots = [
      { name: 'final_mobile_hero_390.png', w: 390, h: 844, full: false, mobile: true },
      { name: 'final_desktop_hero_1440.png', w: 1440, h: 900, full: false, mobile: false },
      { name: 'final_mobile_360_full.png', w: 360, h: 740, full: true, mobile: true },
      { name: 'final_mobile_390_full.png', w: 390, h: 844, full: true, mobile: true },
      { name: 'final_mobile_430_full.png', w: 430, h: 932, full: true, mobile: true },
      { name: 'final_tablet_768_full.png', w: 768, h: 1024, full: true, mobile: false },
      { name: 'final_laptop_1024_full.png', w: 1024, h: 768, full: true, mobile: false },
      { name: 'final_desktop_1440_full.png', w: 1440, h: 900, full: true, mobile: false }
    ];

    for (const s of shots) {
      console.log(`Setting metrics for ${s.name} (${s.w}x${s.h})...`);
      await sendCommand('Emulation.setDeviceMetricsOverride', {
        width: s.w,
        height: s.h,
        deviceScaleFactor: 1,
        mobile: s.mobile
      });
      // Scroll to trigger reveals and then back
      await sendCommand('Runtime.evaluate', {
        expression: 'window.scrollTo(0, 999999); setTimeout(() => window.scrollTo(0, 0), 200);'
      });
      // Wait for botanical blooming animation to complete
      await new Promise(r => setTimeout(r, 2200));

      console.log(`Capturing ${s.name}...`);
      const result = await sendCommand('Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: s.full
      });
      if (result?.data) {
        fs.writeFileSync(s.name, Buffer.from(result.data, 'base64'));
        console.log(`Saved ${s.name} (${fs.statSync(s.name).size} bytes)`);
      }
    }

    ws.close();
    chrome.kill();
    console.log('All final enhancement screenshots captured successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Capture error:', err);
    chrome.kill();
    process.exit(1);
  }
}

captureAll();
