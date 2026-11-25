const fs = require('fs');
const { spawn } = require('child_process');

async function runQA() {
  console.log('=== STARTING QUALITY ASSURANCE VERIFICATION ===');
  let failures = 0;

  const html = fs.readFileSync('index.html', 'utf8');

  // 1. Check prohibited strings
  const forbidden = [
    'Isabela', 'Mateo', 'Fiesole', 'Villa Sorella', 'Tuscany',
    'Prosecco', '20 June 2027', 'Florence', 'Bologna', 'Pensione Aurora',
    'Rossi', 'Bianchi', 'Design by Flo', 'designbyflor.art',
    'AN INTIMATE CELEBRATION ACROSS TWO HISTORIC CITIES OF KERALA',
    'Kozhikode, Kerala', 'Kannur, Kerala', 'FIND THE CELEBRATION'
  ];

  for (const term of forbidden) {
    if (html.toLowerCase().includes(term.toLowerCase())) {
      console.error(`[FAIL] Found forbidden term "${term}" in index.html!`);
      failures++;
    } else {
      console.log(`[PASS] Prohibited term absent: "${term}"`);
    }
  }

  // 2. Check required client details
  const required = [
    'AJU',
    'NAAJI',
    '02 JANUARY 2027',
    '#AJUNAAJI',
    'TOGETHER WITH OUR FAMILIES, WE JOYFULLY INVITE YOU TO CELEBRATE THE WEDDING OF AJU & NAJI.',
    'ABDUL NASER AM & NAJUMUNISHA',
    'ABDUL RAUF CH & RUBEENA LV',
    'THE CELEBRATIONS',
    'TWO DAYS. TWO GATHERINGS. ONE JOYFUL OCCASION.',
    'NIKKAH',
    '11:00 AM – 3:00 PM',
    'ROYAL ALLIANCE AUDITORIUM',
    'KADALUNDI ROAD, MANNARPADAM, FEROKE, KOZHIKODE, 673631',
    'https://maps.app.goo.gl/1vAmSiUuUUooR2TE8',
    'RECEPTION',
    '03 January 2027',
    '11:30 AM – 8:00 PM',
    'GROOM\'S RESIDENCE',
    'RUBEENAS CHILLIKUNNU ROAD, CHALAD, KANNUR 14',
    'https://maps.google.com/?q=11.876903,75.353790',
    'WE LOOK FORWARD TO CELEBRATING WITH YOU',
    '02 JANUARY 2027 · 11:00 AM IST'
  ];

  for (const req of required) {
    // case insensitive check or loose
    if (html.includes(req) || html.includes(req.replace(/&/g, '&amp;')) || html.includes(req.replace(/'/g, '&#39;'))) {
      console.log(`[PASS] Found required content: "${req.slice(0, 40)}..."`);
    } else {
      console.error(`[FAIL] Missing required content: "${req}"`);
      failures++;
    }
  }

  // 3. Check image files referenced in HTML
  const imgMatches = Array.from(html.matchAll(/src=["']([^"']+\.(?:png|jpg|jpeg|svg|webp))["']/gi));
  console.log(`Checking ${imgMatches.length} referenced image paths...`);
  for (const m of imgMatches) {
    const src = m[1];
    if (fs.existsSync(src)) {
      const sz = fs.statSync(src).size;
      if (sz > 0) {
        console.log(`[PASS] Image exists (${sz} bytes): ${src}`);
      } else {
        console.error(`[FAIL] Image is 0 bytes: ${src}`);
        failures++;
      }
    } else {
      console.error(`[FAIL] Referenced image not found on disk: ${src}`);
      failures++;
    }
  }

  // 4. Verify in Browser via CDP for console errors and live text
  console.log('Testing live page in Chrome via CDP...');
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=' + process.env.TEMP + '\\chrome-qa-' + Date.now(),
    '--disable-gpu',
    'http://localhost:8080/index.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  let consoleErrors = [];
  try {
    const res = await fetch('http://127.0.0.1:9222/json/list');
    const targets = await res.json();
    const page = targets.find(t => t.type === 'page');
    const ws = new WebSocket(page.webSocketDebuggerUrl);

    await new Promise((resolve) => {
      ws.onopen = () => {
        ws.send(JSON.stringify({ id: 1, method: 'Console.enable' }));
        ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
        setTimeout(resolve, 2500);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.method === 'Console.messageAdded' && data.params.message.level === 'error') {
          consoleErrors.push(data.params.message.text);
        }
        if (data.method === 'Runtime.exceptionThrown') {
          const exc = data.params.exceptionDetails;
          console.log('Exception details:', JSON.stringify(exc));
          consoleErrors.push(exc.exception?.description || exc.text);
        }
      };
    });

    if (consoleErrors.length === 0) {
      console.log('[PASS] Zero browser console errors detected on page load!');
    } else {
      console.error('[FAIL] Console errors detected:', consoleErrors);
      failures++;
    }

    ws.close();
    chrome.kill();
  } catch (err) {
    console.error('[FAIL] Browser test failed:', err);
    chrome.kill();
    failures++;
  }

  console.log('====================================');
  console.log(`QA COMPLETED WITH ${failures} FAILURE(S).`);
  console.log('====================================');
  process.exit(failures > 0 ? 1 : 0);
}

runQA();
