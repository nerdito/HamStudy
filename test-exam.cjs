const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('Opening app...');
  await page.goto('http://localhost:5173/HamStudy/');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Click Practice Exam button
  console.log('Clicking Practice Exam...');
  await page.click('text=Practice Exam');
  
  // Wait for license selection
  await page.waitForSelector('text=Select License Class', { timeout: 10000 });
  
  // Select Technician license (small pool for faster test)
  console.log('Selecting Technician license...');
  await page.click('text=Technician');
  
  // Wait for exam to start
  await page.waitForSelector('text=Question', { timeout: 10000 });
  
  console.log('Exam started. Answering all 35 questions...');
  
  // Answer all 35 questions
  for (let i = 0; i < 35; i++) {
    // Wait for question to load and answer buttons to be visible
    await page.waitForSelector('.answer-button', { timeout: 5000 });
    
    // Get current question number
    const questionText = await page.locator('.question-counter').textContent();
    console.log(`Q${i+1}: ${questionText}`);
    
    // Click first answer button
    const answerButtons = await page.locator('.answer-button').all();
    if (answerButtons.length > 0) {
      await answerButtons[0].click({ force: true });
    }
    
    // Wait for page to update and advance
    await page.waitForTimeout(800);
  }
  
  // Wait for results
  console.log('Waiting for results...');
  await page.waitForSelector('text=Exam Complete', { timeout: 20000 });
  
  // Get results
  const scoreText = await page.locator('.score-percentage').textContent();
  const correctText = await page.locator('.correct-count').textContent();
  const wrongText = await page.locator('.wrong-count').textContent();
  
  console.log('\n=== RESULTS ===');
  console.log('Score:', scoreText);
  console.log('Correct:', correctText);
  console.log('Wrong:', wrongText);
  
  const score = parseInt(scoreText);
  if (score === 0) {
    console.log('\n❌ BUG: Score is 0% - answers not recorded!');
    process.exit(1);
  } else if (score > 0) {
    console.log('\n✅ FIXED: Score shows', score + '%');
    process.exit(0);
  }
  
  await browser.close();
})();
