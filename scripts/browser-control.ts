import { chromium, firefox, webkit } from '@playwright/test';

(async () => {
  console.log('Starting browser control session...');
  
  // Launch browser with full control
  const browser = await chromium.launch({ 
    headless: false,
    devtools: true,
    args: ['--start-maximized']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    permissions: ['geolocation', 'notifications']
  });
  
  const page = await context.newPage();
  
  // Enable console logging from browser
  page.on('console', msg => console.log('Browser:', msg.text()));
  page.on('pageerror', error => console.log('Page Error:', error.message));
  
  console.log('Browser launched. You can now navigate and interact.');
  console.log('Use page variable to control the browser.');
  
  // Keep browser open
  await browser.close();
})();