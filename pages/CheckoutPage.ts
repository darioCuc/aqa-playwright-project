import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  addressSection = () => this.page.locator('.checkout-information');
  placeOrderButton = () => this.page.getByRole('link', { name: 'Place Order' });
  orderConfirmation = () => this.page.locator('.order-confirmation');
  
  // Address sections
  deliveryAddressSection = () => this.page.locator('#address_delivery');
  billingAddressSection = () => this.page.locator('#address_invoice');
  
  // Order review
  orderReviewSection = () => this.page.locator('#cart_info');
  commentTextArea = () => this.page.locator('textarea[name="message"]');
  
  // Payment elements
  nameOnCardInput = () => this.page.locator('input[data-qa="name-on-card"]');
  cardNumberInput = () => this.page.locator('input[data-qa="card-number"]');
  cvcInput = () => this.page.locator('input[data-qa="cvc"]');
  expiryMonthInput = () => this.page.locator('input[data-qa="expiry-month"]');
  expiryYearInput = () => this.page.locator('input[data-qa="expiry-year"]');
  payAndConfirmButton = () => this.page.locator('button[data-qa="pay-button"]');
  
  // Order success elements
  orderSuccessMessage = () => this.page.locator('h2[data-qa="order-placed"]');
  downloadInvoiceButton = () => this.page.locator('a[href*="download_invoice"]');
  continueButton = () => this.page.locator('a[data-qa="continue-button"]');

  async isCheckoutPageLoaded(): Promise<boolean> {
    return await this.addressSection().isVisible() &&
           await this.placeOrderButton().isVisible();
  }

  async placeOrder() {
    await this.placeOrderButton().click();
  }

  async isOrderConfirmed(): Promise<boolean> {
    return await this.orderConfirmation().isVisible();
  }

  // New methods for comprehensive checkout functionality

  async getDeliveryAddress(): Promise<string> {
    return await this.deliveryAddressSection().textContent() || '';
  }

  async getBillingAddress(): Promise<string> {
    return await this.billingAddressSection().textContent() || '';
  }

  async enterComment(comment: string): Promise<void> {
    await this.commentTextArea().fill(comment);
  }

  async fillPaymentDetails(paymentData: {
    nameOnCard: string;
    cardNumber: string;
    cvc: string;
    expirationMonth: string;
    expirationYear: string;
  }): Promise<void> {
    await this.nameOnCardInput().fill(paymentData.nameOnCard);
    await this.cardNumberInput().fill(paymentData.cardNumber);
    await this.cvcInput().fill(paymentData.cvc);
    await this.expiryMonthInput().fill(paymentData.expirationMonth);
    await this.expiryYearInput().fill(paymentData.expirationYear);
  }

  async confirmPayment(): Promise<void> {
    await this.payAndConfirmButton().click();
  }

  async getOrderSuccessMessage(): Promise<string> {
    return await this.orderSuccessMessage().textContent() || '';
  }

  async isOrderSuccessful(): Promise<boolean> {
    try {
      // Wait for the page to finish loading first
      await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 });
      
      // Wait for success message to appear
      await this.orderSuccessMessage().waitFor({ state: 'visible', timeout: 10000 });
      
      return await this.orderSuccessMessage().isVisible();
    } catch (error) {
      // Check if we're on the payment_done page as additional confirmation
      const currentUrl = this.page.url();
      if (currentUrl.includes('/payment_done/')) {
        return true;
      }
      return false;
    }
  }

  async downloadInvoice(): Promise<void> {
    // Start waiting for download before clicking
    const downloadPromise = this.page.waitForEvent('download');
    await this.downloadInvoiceButton().click();
    const download = await downloadPromise;
    
    // Verify download was successful
    const suggestedFilename = download.suggestedFilename();
    if (!suggestedFilename) {
      throw new Error('Download failed - no filename suggested');
    }
    
    console.log(`Invoice downloaded successfully: ${suggestedFilename}`);
  }

  async clickContinueAfterOrder(): Promise<void> {
    await this.continueButton().click();
  }

  async verifyAddressDetails(expectedAddress: {
    firstName: string;
    lastName: string;
    company?: string;
    address: string;
    city: string;
    state: string;
    zipcode: string;
  }): Promise<boolean> {
    const deliveryAddress = await this.getDeliveryAddress();
    const billingAddress = await this.getBillingAddress();
    
    const addressChecks = [
      deliveryAddress.includes(expectedAddress.firstName),
      deliveryAddress.includes(expectedAddress.lastName),
      deliveryAddress.includes(expectedAddress.address),
      deliveryAddress.includes(expectedAddress.city),
      billingAddress.includes(expectedAddress.firstName),
      billingAddress.includes(expectedAddress.lastName)
    ];
    
    return addressChecks.every(check => check);
  }

  async getOrderTotal(): Promise<string> {
    const totalElement = this.page.locator('.cart_total_price');
    return await totalElement.textContent() || '';
  }

  async getOrderItems(): Promise<string[]> {
    const itemElements = this.page.locator('#cart_info_table .cart_description h4');
    return await itemElements.allTextContents();
  }

  async isPaymentSectionVisible(): Promise<boolean> {
    return await this.nameOnCardInput().isVisible() &&
           await this.cardNumberInput().isVisible();
  }

  async navigateToCheckout(): Promise<void> {
    await this.page.goto('/checkout');
  }

  async waitForOrderCompletion(): Promise<void> {
    await this.page.waitForSelector('.alert-success, .order-placed', { timeout: 10000 });
  }

  /**
   * Assert that checkout page is loaded successfully
   */
  async assertCheckoutPageLoaded(): Promise<void> {
    const isLoaded = await this.isCheckoutPageLoaded();
    if (!isLoaded) {
      throw new Error('Checkout page not loaded - address section or place order button not visible');
    }
  }

  /**
   * Assert that address details match expected information
   */
  async assertAddressDetailsMatch(expectedAddress: any): Promise<void> {
    // Check if delivery address section is visible
    const deliveryVisible = await this.deliveryAddressSection().isVisible();
    const billingVisible = await this.billingAddressSection().isVisible();
    
    if (!deliveryVisible || !billingVisible) {
      throw new Error('Address sections not visible on checkout page');
    }

    // Get address texts for verification
    const deliveryText = await this.deliveryAddressSection().textContent() || '';
    const billingText = await this.billingAddressSection().textContent() || '';

    // Verify key address components are present
    if (!deliveryText.includes(expectedAddress.firstName) || !deliveryText.includes(expectedAddress.lastName)) {
      throw new Error(`Delivery address missing expected name: ${expectedAddress.firstName} ${expectedAddress.lastName}`);
    }

    if (!billingText.includes(expectedAddress.firstName) || !billingText.includes(expectedAddress.lastName)) {
      throw new Error(`Billing address missing expected name: ${expectedAddress.firstName} ${expectedAddress.lastName}`);
    }
  }

  /**
   * Add comment and proceed to place order
   */
  async addCommentAndPlaceOrder(comment: string): Promise<void> {
    await this.commentTextArea().fill(comment);
    await this.placeOrderButton().click();
  }

  /**
   * Complete payment process
   */
  async completePayment(paymentData: any): Promise<void> {
    await this.fillPaymentDetails(paymentData);
    await this.confirmPayment();
  }

  /**
   * Assert that order was placed successfully
   */
  async assertOrderSuccessful(): Promise<void> {
    const isSuccessful = await this.isOrderSuccessful();
    if (!isSuccessful) {
      throw new Error('Order success message not visible - order may have failed');
    }
  }

  /**
   * Assert that invoice download completed successfully
   */
  async assertInvoiceDownloaded(): Promise<void> {
    try {
      await this.downloadInvoice();
      console.log(`Invoice download verified successfully`);
    } catch (error) {
      throw new Error(`Invoice download assertion failed: ${error}`);
    }
  }
} 