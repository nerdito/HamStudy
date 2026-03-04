const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Capture console errors
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
    await page.goto('http://localhost:5173/HamStudy/', { waitUntil: 'networkidle' });
    console.log('Page loaded');
    
    // Click Practice
    await page.click('text=Practice');
    await page.waitForTimeout(2000);
    
    console.log('Clicked Practice');
    
    // Check for errors
    if (errors.length > 0) {
      console.log('ERRORS FOUND:');
      errors.forEach(e => console.log('- ' + e));
    } else {
      console.log('No errors found!');
    }
    
    // Get page content
    const content = await page.content();
    console.log('Page has content:', content.length, 'bytes');
    
  } catch (e) {
    console.log('Error:', e.message);
  }
  
  await browser.close();
})();
