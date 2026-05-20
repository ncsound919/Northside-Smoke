import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL || "http://localhost:3005";
const TEST_EMAIL = "test@example.com";
const TEST_PASSWORD = "password123";

async function main() {
  console.log("🎭 Starting Northside Smoke Automated Browser Control\n");
  console.log(`Target URL: ${BASE_URL}\n`);
  
  const browser = await chromium.launch({ 
    headless: false,
    devtools: true,
    args: ["--start-maximized"]
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  try {
    console.log(`🚀 Navigating to ${BASE_URL}...`);
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");
    console.log("✅ Page loaded.");
    
    // --- Age Verification Gate Handling ---
    const ageGateSelector = 'button:has-text("I am 21+")';
    try {
      await page.waitForSelector(ageGateSelector, { state: "visible", timeout: 5000 });
      console.log("Age gate detected. Proceeding...");
      await page.click(ageGateSelector);
      await page.waitForSelector(ageGateSelector, { state: "hidden", timeout: 5000 });
      console.log("Age verification passed.");
    } catch (error) {
      console.log("No age gate detected or it disappeared quickly.");
    }

    // --- Login Form Handling ---
    const loginButtonSelector = 'button:has-text("Enter Command Center")';
    const emailInputSelector = 'input[type="email"]';
    const passwordInputSelector = 'input[type="password"]';

    await page.waitForSelector(emailInputSelector, { state: "visible", timeout: 10000 });
    await page.fill(emailInputSelector, TEST_EMAIL);
    await page.fill(passwordInputSelector, TEST_PASSWORD);
    await page.click(loginButtonSelector);

    console.log("✅ Login initiated.");
  } catch (error: any) {
    console.error("❌ Error during automated browser control:", error.message);
  } finally {
    console.log("\nSession complete. Browser remains open for inspection.");
  }
}

main();