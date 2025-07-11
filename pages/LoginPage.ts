import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  emailInput = () => this.page.locator('input[data-qa="login-email"]');
  passwordInput = () => this.page.locator('input[data-qa="login-password"]');
  loginButton = () => this.page.locator('button[data-qa="login-button"]');
  errorMessage = () => this.page.locator('.login-form p');

  async navigateTo() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput().fill(email);
    await this.passwordInput().fill(password);
    await this.loginButton().click();
  }

  async getErrorMessage(): Promise<string | null> {
    return await this.errorMessage().textContent();
  }

  async isLoginFormVisible(): Promise<boolean> {
    return await this.emailInput().isVisible() &&
           await this.passwordInput().isVisible() &&
           await this.loginButton().isVisible();
  }
} 