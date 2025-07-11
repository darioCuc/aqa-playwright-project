import { BasePage } from './BasePage';

export class TestCasesPage extends BasePage {
  // Page elements
  testCasesHeader = () => this.page.locator('h2:has-text("Test Cases"), .title:has-text("Test Cases")');
  testCasesList = () => this.page.locator('.test-cases-list, .panel-group');
  testCaseItem = () => this.page.locator('.panel, .test-case-item');
  backToHomeLink = () => this.page.locator('a[href="/"]');
  
  // Individual test case elements
  testCaseTitle = () => this.page.locator('.panel-title, .test-case-title');
  testCaseDescription = () => this.page.locator('.panel-body, .test-case-description');
  
  // Navigation breadcrumb
  breadcrumb = () => this.page.locator('.breadcrumb, .nav-breadcrumb');

  async navigateTo(): Promise<void> {
    await this.page.goto('/test_cases');
  }

  async isTestCasesPageLoaded(): Promise<boolean> {
    return await this.testCasesHeader().isVisible();
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async getTestCasesHeaderText(): Promise<string> {
    return await this.testCasesHeader().textContent() || '';
  }

  async isTestCasesListVisible(): Promise<boolean> {
    const panelGroupCount = await this.page.locator('.panel-group').count();
    return panelGroupCount >= 26;
  }

  async getTestCasesCount(): Promise<number> {
    return await this.testCaseItem().count();
  }

  async clickTestCase(index: number): Promise<void> {
    await this.testCaseItem().nth(index).click();
  }

  async getTestCaseTitle(index: number): Promise<string> {
    const testCase = this.testCaseItem().nth(index);
    const title = testCase.locator(this.testCaseTitle().filter({}));
    return await title.textContent() || '';
  }

  async getTestCaseDescription(index: number): Promise<string> {
    const testCase = this.testCaseItem().nth(index);
    const description = testCase.locator(this.testCaseDescription().filter({}));
    return await description.textContent() || '';
  }

  async backToHome(): Promise<void> {
    await this.backToHomeLink().click();
  }

  async isBreadcrumbVisible(): Promise<boolean> {
    return await this.breadcrumb().isVisible();
  }

  async verifyTestCasesPageElements(): Promise<boolean> {
    return await this.isTestCasesPageLoaded() &&
           await this.isTestCasesListVisible();
  }

  async getAllTestCaseTitles(): Promise<string[]> {
    return await this.testCaseTitle().allTextContents();
  }

  async searchTestCase(searchTerm: string): Promise<number[]> {
    const titles = await this.getAllTestCaseTitles();
    const matchingIndices: number[] = [];
    
    titles.forEach((title, index) => {
      if (title.toLowerCase().includes(searchTerm.toLowerCase())) {
        matchingIndices.push(index);
      }
    });
    
    return matchingIndices;
  }

  async isTestCaseExpanded(index: number): Promise<boolean> {
    const testCase = this.testCaseItem().nth(index);
    const description = testCase.locator(this.testCaseDescription().filter({}));
    return await description.isVisible();
  }

  async expandTestCase(index: number): Promise<void> {
    const isExpanded = await this.isTestCaseExpanded(index);
    if (!isExpanded) {
      await this.clickTestCase(index);
    }
  }

  async collapseTestCase(index: number): Promise<void> {
    const isExpanded = await this.isTestCaseExpanded(index);
    if (isExpanded) {
      await this.clickTestCase(index);
    }
  }

  async getCurrentPageUrl(): Promise<string> {
    return this.page.url();
  }

  async verifyTestCasesPageUrl(): Promise<boolean> {
    const url = await this.getCurrentPageUrl();
    return url.includes('/test_cases');
  }
} 