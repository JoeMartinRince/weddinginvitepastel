const { spawn } = require('child_process');
const fs = require('fs');

const url = process.argv[2] || 'http://localhost:8080/index.html';
const outFile = process.argv[3] || 'screenshot.png';
const width = parseInt(process.argv[4] || '1440', 10);
const height = parseInt(process.argv[5] || '900', 10);
const fullPage = process.argv[6] === 'full';

async function main() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=' + process.env.TEMP + '\\chrome-ss-' + Date.now(),
    '--disable-gpu',
    `--window-size=${width},${height}`,
    url
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const res = await fetch('http://127.0.0.1:9222/json/list');
    const targets = await res.json();
    const page = targets.find(t => t.type === 'page');
    if (!page) {
      console.error('No page target found');
      chrome.kill();
      process.exit(1);
    }

    const ws = new WebSocket(page.webSocketDebuggerUrl);
    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));
      ws.send(JSON.stringify({
        id: 2,
        method: 'Emulation.setDeviceMetricsOverride',
        params: {
          width: width,
          height: height,
          deviceScaleFactor: 1,
          mobile: width < 768
        }
      }));
      setTimeout(() => {
        const screenshotParams = { format: 'png' };
        if (fullPage) {
          screenshotParams.captureBeyondViewport = true;
        }
        ws.send(JSON.stringify({ id: 3, method: 'Page.captureScreenshot', params: screenshotParams }));
      }, 1500);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === 3 && data.result?.data) {
        fs.writeFileSync(outFile, Buffer.from(data.result.data, 'base64'));
        console.log(`Saved screenshot to ${outFile} (${fs.statSync(outFile).size} bytes)`);
        ws.close();
        chrome.kill();
        process.exit(0);
      }
    };

    setTimeout(() => {
      console.error('Timeout waiting for screenshot');
      ws.close();
      chrome.kill();
      process.exit(1);
    }, 10000);
  } catch (err) {
    console.error('Error:', err);
    chrome.kill();
    process.exit(1);
  }
}

main();
