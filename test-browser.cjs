const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  page.on('pageerror', err => {
    errors.push(err.message);
  });
  
  try {
    await page.goto('http://localhost:5173/HamStudy/', { waitUntil: 'networkidle', timeout: 30000 });
    console.log('1. Page loaded');
    
    await page.click('a[href="#/practice"]');
    await page.waitForTimeout(1000);
    console.log('2. Clicked Practice');
    
    await page.waitForSelector('.license-button');
    console.log('3. License buttons visible');
    
    await page.click('.license-button:first-child');
    await page.waitForTimeout(2000);
    console.log('4. Clicked license');
    
    if (errors.length > 0) {
      console.log('ERRORS:');
      errors.forEach(e => console.log('- ' + e));
    } else {
      console.log('SUCCESS: No errors!');
    }
    
    await page.screenshot({ path: 'screenshot.png' });
    console.log('Screenshot saved');
    
  } catch (e) {
    console.log('Error:', e.message);
  }
  
  await browser.close();
})();
