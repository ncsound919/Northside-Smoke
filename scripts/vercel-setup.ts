import { chromium } from "playwright";

const TARGET_URL = "https://vercel.com/tap919s-projects/northside-smoke/settings/environment-variables";

const ENV_VARS = [
  {
    key: "VITE_SUPABASE_URL",
    value: "https://sjvrbrlipftujrbznecq.supabase.co"
  },
  {
    key: "VITE_SUPABASE_ANON_KEY",
    value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqdnJicmxpcGZ0dWpyYnpuZWNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyOTkwNDQsImV4cCI6MjA5NDg3NTA0NH0.c8UrzS2eptb5swkz6TsXPVVO3F2_L7AYiAin3dFTTrA"
  },
  {
    key: "VITE_STRIPE_PUBLISHABLE_KEY",
    value: "pk_live_51T71enQrfNRBru0zxRRbzMKXKBSlkAeEAfGhwDEU1GWhVmho6PJsERgS6WS3la223BMdXMgRP3dvSFK7WcRAeUOh000KznDA8q"
  }
];

async function main() {
  console.log("🚀 Launching Vercel Environment Variables Auto-Configurator...");
  console.log("Please log in to Vercel when the browser opens.");
  
  const browser = await chromium.launch({
    headless: false,
    args: ["--start-maximized"]
  });
  
  const context = await browser.newContext({
    viewport: null
  });
  
  const page = await context.newPage();
  
  console.log(`\nNavigating to Vercel Settings: ${TARGET_URL}`);
  await page.goto(TARGET_URL);
  
  console.log("\nWaiting for you to log in and reach the Environment Variables page...");
  
  // Wait for the environment variables input form to become visible
  // We'll check for common Vercel inputs like placeholder="Key" or placeholder="Name"
  let envFormDetected = false;
  let nameInputSelector = "";
  let valueInputSelector = "";
  let addButtonSelector = "";
  
  const possibleNameSelectors = [
    'input[placeholder="Key"]',
    'input[placeholder="Name"]',
    'input[name="key"]',
    'input[name="name"]',
    '[data-testid="env-name-input"]'
  ];
  
  const possibleValueSelectors = [
    'textarea[placeholder="Value"]',
    'input[placeholder="Value"]',
    'textarea[name="value"]',
    '[data-testid="env-value-input"]'
  ];
  
  const possibleAddSelectors = [
    'button:has-text("Add")',
    'button:has-text("Save")',
    '[data-testid="env-add-button"]'
  ];

  while (!envFormDetected) {
    for (const nameSel of possibleNameSelectors) {
      if (await page.locator(nameSel).isVisible().catch(() => false)) {
        nameInputSelector = nameSel;
        envFormDetected = true;
        break;
      }
    }
    
    if (envFormDetected) {
      // Find matching value and add selectors
      for (const valSel of possibleValueSelectors) {
        if (await page.locator(valSel).isVisible().catch(() => false)) {
          valueInputSelector = valSel;
          break;
        }
      }
      for (const addSel of possibleAddSelectors) {
        if (await page.locator(addSel).isVisible().catch(() => false)) {
          addButtonSelector = addSel;
          break;
        }
      }
      break;
    }
    
    await page.waitForTimeout(1000);
  }
  
  console.log("🎉 Environment Variables form detected! Starting auto-fill...");
  
  for (const env of ENV_VARS) {
    console.log(`Adding ${env.key}...`);
    
    // Fill Key
    await page.fill(nameInputSelector, env.key);
    await page.waitForTimeout(500);
    
    // Fill Value
    await page.fill(valueInputSelector, env.value);
    await page.waitForTimeout(500);
    
    // Click Add
    await page.click(addButtonSelector);
    console.log(`✅ ${env.key} added.`);
    
    // Wait for form to clear or reset
    await page.waitForTimeout(1000);
  }
  
  console.log("\nAll environment variables have been added successfully!");
  console.log("You can now review and redeploy your project on Vercel.");
  console.log("Keeping browser open. Press Ctrl+C in terminal to exit.");
  
  await new Promise(() => {});
}

main().catch(console.error);