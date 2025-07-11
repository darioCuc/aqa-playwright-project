import { Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Wait for a selector to be visible and enabled before clicking.
   * Adds robustness beyond Playwright's default click.
   */
  async safeClick(selector: string) {
    await this.page.waitForSelector(selector, { state: 'visible' });
    await this.page.click(selector);
  }

  /**
   * Get trimmed text content, or null if not found.
   */
  async getTrimmedText(selector: string): Promise<string | null> {
    const text = await this.page.textContent(selector);
    return text?.trim() ?? null;
  }

  /**
   * Click an element and wait for navigation to complete.
   */
  async clickAndWaitForNavigation(selector: string) {
    await Promise.all([
      this.page.waitForNavigation(),
      this.page.click(selector),
    ]);
  }
} 