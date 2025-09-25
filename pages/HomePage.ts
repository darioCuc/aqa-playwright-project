import { Page } from '@playwright/test';
import { ConsentHelper } from '../helpers/consent-helper';

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  navBar = () => this.page.locator('ul.nav.navbar-nav');
  featuredProducts = () => this.page.locator('.features_items').first();
  signupLoginLink = () => this.page.getByRole('link', { name: ' Signup / Login' }).first();
  productsLink = () => this.page.locator('a[href="/products"]');
  cartLink = () => this.page.getByRole('link', { name: ' Cart' }).first();
  contactLink = () => this.page.locator('a[href="/contact_us"]');
  logoutLink = () => this.page.getByRole('link', { name: ' Logout' });
  deleteAccountLink = () => this.page.getByRole('link', { name: ' Delete Account' });
  userName = () => this.page.locator('.shop-menu .fa-user + b');
  accountCreatedText = (userName: string) => this.page.getByText(`Logged in as ${userName}`);
  
  // Subscription elements
  subscriptionSection = () => this.page.locator('#footer .single-widget');
  subscriptionEmailInput = () => this.page.locator('input#susbscribe_email');
  subscribeButton = () => this.page.locator('button#subscribe');
  subscriptionSuccessMessage = () => this.page.locator('.alert-success');
  subscriptionHeader = () => this.page.locator('text=Subscription');
  
  // Recommended items section
  recommendedItemsSection = () => this.page.locator('.recommended_items');
  recommendedProducts = () => this.page.locator('.recommended_items .item');
  addToCartFromRecommended = () => this.page.locator('.recommended_items .add-to-cart');
  
  // Carousel
  carousel = () => this.page.locator('#slider');
  carouselNext = () => this.page.locator('.carousel-control.right');
  carouselPrev = () => this.page.locator('.carousel-control.left');
  
  // Test cases link
  testCasesLink = () => this.page.locator('li').getByRole('link', { name: ' Test Cases' });

  async navigateTo() {
    await this.page.goto('/');
    
    // Handle consent modal using dedicated helper
    const consentHelper = new ConsentHelper(this.page);
    await consentHelper.dismissConsentModal();
  }

  async goToLogin() {
    await this.signupLoginLink().click();
  }

  async goToProducts() {
    await this.productsLink().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async goToCart() {
    await this.cartLink().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async goToContact() {
    await this.contactLink().click();
  }

  async logout() {
    await this.logoutLink().click();
  }

  async deleteAccount() {
    await this.deleteAccountLink().click();
  }

  async isUserLoggedIn(expectedName: string): Promise<boolean> {
    // Check if logout and delete account buttons are present (indicators of logged-in state)
    const isLogoutVisible = await this.logoutLink().isVisible();
    const isDeleteAccountVisible = await this.deleteAccountLink().isVisible();
    const isAccountCreatedTextVisible = await this.accountCreatedText(expectedName).isVisible();
    
    // User is logged in if all three elements are present
    const isLoggedIn = isLogoutVisible && isDeleteAccountVisible && isAccountCreatedTextVisible;
    
    if (!isLoggedIn) return false;
    
    // If expected name is provided, verify it matches
    if (expectedName) {
      const name = await this.userName().textContent();
      return name?.trim() === expectedName;
    }
    
    return true;
  }

  async isHomePageLoaded(): Promise<boolean> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.navBar().waitFor({ state: 'visible' });
    await this.carousel().waitFor({ state: 'visible' });
    const title = await this.page.title();
    const isTitleCorrect = title === "Automation Exercise";
    const areElementsVisible = await this.navBar().isVisible() && await this.carousel().isVisible();
    
    return isTitleCorrect && areElementsVisible;
  }

  // New methods for comprehensive homepage functionality

  async scrollToSubscription(): Promise<void> {
    await this.subscriptionSection().scrollIntoViewIfNeeded();
  }

  async isSubscriptionSectionVisible(): Promise<boolean> {
    return await this.subscriptionHeader().isVisible();
  }

  async subscribeWithEmail(email: string): Promise<void> {
    await this.subscriptionEmailInput().fill(email);
    await this.subscribeButton().click();
  }

  async getSubscriptionSuccessMessage(): Promise<string> {
    return await this.subscriptionSuccessMessage().textContent() || '';
  }

  async isSubscriptionSuccessMessageVisible(): Promise<boolean> {
    return await this.subscriptionSuccessMessage().isVisible();
  }

  async isRecommendedItemsVisible(): Promise<boolean> {
    return await this.recommendedItemsSection().isVisible();
  }

  async addRecommendedItemToCart(index: number = 0): Promise<void> {
    const addToCartButton = this.addToCartFromRecommended().nth(index);
    await addToCartButton.click();
  }

  async getRecommendedItemsCount(): Promise<number> {
    return await this.recommendedProducts().count();
  }



  async goToTestCasesPage(): Promise<void> {
    await this.testCasesLink().click();
  }



  async assertHomePageLoaded(): Promise<void> {
    const isLoaded = await this.isHomePageLoaded();
    if (!isLoaded) {
      throw new Error('Home page is not loaded properly');
    }
  }

  /**
   * Assert that recommended items are visible on the page
   */
  async assertRecommendedItemsVisible(): Promise<void> {
    const isVisible = await this.isRecommendedItemsVisible();
    if (!isVisible) {
      throw new Error('Recommended items section not visible');
    }
    
    const itemsCount = await this.getRecommendedItemsCount();
    if (itemsCount === 0) {
      throw new Error('No recommended items found');
    }
  }

  /**
   * Assert that user is logged in with expected name
   */
  async assertUserLoggedIn(expectedName: string): Promise<void> {
    const isLoggedIn = await this.isUserLoggedIn(expectedName);
    if (!isLoggedIn) {
      throw new Error(`User "${expectedName}" is not logged in or name doesn't match`);
    }
  }
} 