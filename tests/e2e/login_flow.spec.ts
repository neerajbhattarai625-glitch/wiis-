import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test('User can login and is redirected to the correct dashboard', async ({ page }) => {
        // Navigate to landing page
        await page.goto('http://localhost:5174/');

        // Choose Role (e.g., Citizen)
        const citizenCard = page.locator('h3:has-text("Citizen")').first();
        await citizenCard.click({ force: true });

        // Verify on login page
        await expect(page).toHaveURL(/.*login/);

        // Login as Citizen (Seed data)
        await page.fill('input[id="email"]', 'citizen@waste.com');
        await page.fill('input[id="password"]', 'citizen123');

        // Sign In
        await page.click('button:has-text("Sign In")');

        // Verify redirection to /citizen (wait for URL)
        await page.waitForURL(/.*citizen/, { timeout: 10000 });
        await expect(page.locator('h1')).toContainText('Dashboard');

        // Test Logout
        const logoutBtn = page.locator('button:has-text("Log out")');
        if (await logoutBtn.isVisible()) {
            await logoutBtn.click();
        } else {
            // Try clicking user profile first if in dropdown
            await page.click('button:has-text("Jane Citizen")');
            await page.click('span:has-text("Log out")');
        }

        // Should be back at landing page
        await expect(page).toHaveURL('http://localhost:5174/');
    });
});
