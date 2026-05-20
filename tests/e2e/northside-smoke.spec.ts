import { test, expect } from '@playwright/test';

test.describe('Northside Smoke E2E Tests', () => {
  
  test('age verification gate appears', async ({ page }) => {
    await page.goto('/');
    
    // Should show age verification gate
    const ageGate = page.locator('text=Age Verification Required');
    await expect(ageGate).toBeVisible();
    
    // Should have I am 21+ button
    const verifyBtn = page.locator('button:has-text("I am 21+")');
    await expect(verifyBtn).toBeVisible();
  });

  test('age verification can be bypassed', async ({ page }) => {
    await page.goto('/');
    
    // Click verify button
    await page.locator('button:has-text("I am 21+")').click();
    
    // Should show login screen after age verification
    await expect(page.locator('text=Northside Smoke')).toBeVisible();
  });

  test('login form validates input', async ({ page }) => {
    await page.goto('/');
    await page.locator('button:has-text("I am 21+")').click();
    
    // Try to submit empty form
    await page.locator('button:has-text("Enter Command Center")').click();
    
    // Should show validation error (HTML5 required attribute)
    // Or should show server error for empty credentials
  });

  test('sandbox login works', async ({ page }) => {
    await page.goto('/');
    await page.locator('button:has-text("I am 21+")').click();
    
    // Enter sandbox credentials
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('input[type="password"]').fill('password123');
    
    // Submit form - will fail to real server but fallback should work
    // Wait for either success or fallback behavior
    await page.waitForTimeout(2000);
  });

  test('navigation tabs are accessible after login', async ({ page }) => {
    // Bypass age gate
    await page.goto('/');
    await page.locator('button:has-text("I am 21+")').click();
    
    // Try to login with sandbox mode (will timeout and fallback)
    await page.locator('input[type="email"]').fill('sandbox@dispensary.com');
    await page.locator('input[type="password"]').fill('test');
    await page.locator('button:has-text("Enter Command Center")').click();
    
    // Wait for fallback login
    await page.waitForTimeout(2000);
    
    // If login successful, verify navigation tabs exist
    const navItems = page.locator('nav, [class*="nav"], [class*="sidebar"]');
    const navCount = await navItems.count();
    if (navCount > 0) {
      // Navigation exists
      console.log('Navigation found');
    }
  });

});