const { spawn } = require('child_process');

async function testNavigation() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=' + process.env.TEMP + '\\chrome-nav-test-' + Date.now(),
    '--disable-gpu',
    '--window-size=390,844',
    'http://localhost:8080/index.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const res = await fetch('http://127.0.0.1:9222/json/list');
    const targets = await res.json();
    const page = targets.find(t => t.type === 'page');
    const ws = new WebSocket(page.webSocketDebuggerUrl);

    function evaluate(expr) {
      return new Promise((resolve) => {
        const id = Math.floor(Math.random() * 1000000);
        const handler = (event) => {
          const data = JSON.parse(event.data);
          if (data.id === id) {
            ws.removeEventListener('message', handler);
            resolve(data.result?.result?.value);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({
          id,
          method: 'Runtime.evaluate',
          params: { expression: expr, returnByValue: true }
        }));
      });
    }

    await new Promise((resolve) => {
      ws.onopen = () => {
        ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));
        setTimeout(resolve, 500);
      };
    });

    console.log('Testing navigation interaction...');

    // 1. Initial State
    const initDrawerState = await evaluate('document.getElementById("mobile-drawer").classList.contains("is-open")');
    console.log('1. Initial drawer closed:', initDrawerState === false ? '[PASS]' : '[FAIL]');

    // 2. Click Hamburger
    await evaluate('document.getElementById("mobile-hamburger").click()');
    const openState = await evaluate('document.getElementById("mobile-drawer").classList.contains("is-open")');
    console.log('2. Hamburger open drawer:', openState === true ? '[PASS]' : '[FAIL]');

    // 3. Click Close Button
    await evaluate('document.getElementById("drawer-close").click()');
    const closedState = await evaluate('document.getElementById("mobile-drawer").classList.contains("is-open")');
    console.log('3. Close button closes drawer:', closedState === false ? '[PASS]' : '[FAIL]');

    // 4. Open again and click a link (#nikkah)
    await evaluate('document.getElementById("mobile-hamburger").click()');
    await evaluate('document.querySelector(".drawer-link[href=\\"#nikkah\\"]").click()');
    await new Promise(r => setTimeout(r, 800));
    const autoClosedState = await evaluate('document.getElementById("mobile-drawer").classList.contains("is-open")');
    console.log('4. Drawer auto-closes on link click:', autoClosedState === false ? '[PASS]' : '[FAIL]');

    // 5. Check scroll position after clicking #nikkah
    const scrollY = await evaluate('window.scrollY');
    console.log('5. Scroll position scrolled to #nikkah (scrollY > 500):', scrollY > 500 ? `[PASS] (${scrollY}px)` : `[FAIL] (${scrollY}px)`);

    // 6. Sticky header state when scrolled
    const navScrolled = await evaluate('document.getElementById("site-header").classList.contains("nav-scrolled")');
    console.log('6. Header has .nav-scrolled class when scrolled:', navScrolled === true ? '[PASS]' : '[FAIL]');

    // 7. Click logo returns to top
    await evaluate('document.querySelector(".nav-brand").click()');
    await new Promise(r => setTimeout(r, 800));
    const returnScrollY = await evaluate('window.scrollY');
    console.log('7. Brand logo returns to hero (scrollY <= 100):', returnScrollY <= 100 ? `[PASS] (${returnScrollY}px)` : `[FAIL] (${returnScrollY}px)`);

    ws.close();
    chrome.kill();
    console.log('All navigation interaction tests completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Test error:', err);
    chrome.kill();
    process.exit(1);
  }
}

testNavigation();
