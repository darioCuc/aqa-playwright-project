import { Page } from '@playwright/test';

/**
 * Helper class for handling consent modals and privacy banners
 * Centralized location for all consent-related logic
 */
export class ConsentHelper {
  constructor(private page: Page) {}

  /**
   * Automatically dismiss consent modal if it appears
   */
  async dismissConsentModal(): Promise<boolean> {
    try {
      // Wait briefly for modal to appear
      await this.page.waitForTimeout(1000);
      
      // Look for the specific "Consent" button
      const consentButton = this.page.locator('button:has-text("Consent")');
      
      if (await consentButton.isVisible({ timeout: 3000 })) {
        await consentButton.click();
        console.log('✅ Consent modal dismissed');
        await this.page.waitForTimeout(500);
        return true;
      }
      
      return false;
    } catch (error) {
      console.log('ℹ️ No consent modal found');
      return false;
    }
  }

  /**
   * Set consent cookies to prevent future modals
   */
  async setConsentCookies(): Promise<void> {
    await this.page.context().addCookies([
      {
        name: 'consent',
        value: 'granted', 
        domain: 'automationexercise.com',
        path: '/'
      }
    ]);
  }

  /**
   * Check if consent modal is currently visible
   */
  async isConsentModalVisible(): Promise<boolean> {
    try {
      const modal = this.page.locator('[role="dialog"], .modal');
      return await modal.isVisible({ timeout: 1000 });
    } catch {
      return false;
    }
  }

  /**
   * Navigate and handle consent in one action
   */
  async navigateWithConsentHandling(url: string): Promise<void> {
    await this.page.goto(url);
    await this.dismissConsentModal();
  }
} 