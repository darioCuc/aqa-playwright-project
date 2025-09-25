import { Page } from '@playwright/test';

export class ProductPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  productTitle = () => this.page.locator('.product-information h2');
  productPrice = () => this.page.locator('.product-information span span');
  addToCartButton = () => this.page.locator('button.cart');
  quantityInput = () => this.page.locator('input#quantity');
  productImage = () => this.page.locator('[data-qa="product-image"], .product-details img, .view-product img').first();
  productDescription = () => this.page.locator('.product-information p');
  availabilityStatus = () => this.page.locator('.product-information p:has-text("Availability")');
  
  // Review section elements
  reviewSection = () => this.page.locator('.category-tab');
  reviewNameInput = () => this.page.locator('input[placeholder="Your Name"]');
  reviewEmailInput = () => this.page.locator('input[placeholder="Email Address"]');
  reviewTextArea = () => this.page.locator('textarea[placeholder="Add Review Here!"]');
  reviewSubmitButton = () => this.page.locator('button#button-review');
  reviewSuccessMessage = () => this.page.locator('#review-section .alert-success, .category-tab .alert-success').first();
  writeReviewText = () => this.page.locator('text=Write Your Review');
  
  // Product details
  productCategory = () => this.page.locator('.product-information p').first();
  productCondition = () => this.page.locator('.product-information p:has-text("Condition"), .product-information p:has-text("condition")');
  productBrand = () => this.page.locator('.product-information p:has-text("Brand"), .product-information p:has-text("brand")');

  async isProductPageLoaded(): Promise<boolean> {
    return await this.productTitle().isVisible() &&
           await this.productPrice().isVisible() &&
           await this.addToCartButton().isVisible();
  }

  async addToCart(quantity: number = 1) {
    await this.quantityInput().fill(quantity.toString());
    await this.addToCartButton().click();
  }

  async getProductTitle(): Promise<string | null> {
    return await this.productTitle().textContent();
  }

  async getProductPrice(): Promise<string | null> {
    return await this.productPrice().textContent();
  }

  async getProductDescription(): Promise<string | null> {
    return await this.productDescription().textContent();
  }

  async isProductAvailable(): Promise<boolean> {
    const availability = await this.availabilityStatus().textContent();
    return availability?.toLowerCase().includes('in stock') || false;
  }

  async verifyProductPageLoaded(): Promise<boolean> {
    return await this.productTitle().isVisible() && 
           await this.productPrice().isVisible() &&
           await this.addToCartButton().isVisible();
  }

  async takeProductScreenshot() {
    const productTitle = await this.getProductTitle();
    const screenshotName = `product-${productTitle?.replace(/\s+/g, '-').toLowerCase()}`;
    await this.page.screenshot({ path: `screenshots/${screenshotName}.png` });
  }

  // New methods for comprehensive product functionality

  async isProductDetailVisible(): Promise<boolean> {
    return await this.productTitle().isVisible() &&
           await this.productPrice().isVisible() &&
           await this.productCategory().isVisible() &&
           await this.availabilityStatus().isVisible();
  }

  async submitReview(name: string, email: string, review: string): Promise<void> {
    // Scroll to review section to ensure it's visible
    await this.reviewSection().scrollIntoViewIfNeeded();
    
    await this.reviewNameInput().fill(name);
    await this.reviewEmailInput().fill(email);
    await this.reviewTextArea().fill(review);
    await this.reviewSubmitButton().click();
  }

  async getReviewSuccessMessage(): Promise<string> {
    return await this.reviewSuccessMessage().textContent() || '';
  }

  async isWriteReviewVisible(): Promise<boolean> {
    return await this.writeReviewText().isVisible();
  }

  async setQuantity(quantity: number): Promise<void> {
    await this.quantityInput().clear();
    await this.quantityInput().fill(quantity.toString());
  }

  async addToCartFromDetail(): Promise<void> {
    await this.addToCartButton().click();
  }

  async getProductCategory(): Promise<string> {
    return await this.productCategory().textContent() || '';
  }

  async getProductCondition(): Promise<string> {
    const conditionText = await this.productCondition().textContent();
    return conditionText?.replace('Condition:', '').trim() || '';
  }

  async getProductBrand(): Promise<string> {
    const brandText = await this.productBrand().textContent();
    return brandText?.replace('Brand:', '').trim() || '';
  }

  async getQuantityValue(): Promise<number> {
    const quantityStr = await this.quantityInput().inputValue();
    return parseInt(quantityStr) || 1;
  }

  async isProductImageVisible(): Promise<boolean> {
    return await this.productImage().isVisible();
  }

  async verifyAllProductDetails(): Promise<boolean> {
    return await this.isProductDetailVisible() &&
           await this.isProductImageVisible() &&
           await this.getProductCategory() !== '' &&
           await this.getProductBrand() !== '';
  }

  async clickReviewTab(): Promise<void> {
    const reviewTab = this.page.locator('a[href="#reviews"]');
    await reviewTab.click();
  }

  /**
   * Assert that product detail page is loaded with all required information
   */
  async assertProductDetailPageLoaded(): Promise<void> {
    // Check if basic product page is loaded
    const isLoaded = await this.isProductPageLoaded();
    if (!isLoaded) {
      throw new Error('Product detail page not loaded - basic elements not visible');
    }

    // Verify all required product details are visible
    const productTitle = await this.getProductTitle();
    if (!productTitle) {
      throw new Error('Product name not visible');
    }

    const productPrice = await this.getProductPrice();
    if (!productPrice) {
      throw new Error('Product price not visible');
    }

    const productCategory = await this.getProductCategory();
    if (!productCategory) {
      throw new Error('Product category not visible');
    }

    // Availability might not always be present, so make it optional
    const isAvailabilityVisible = await this.availabilityStatus().isVisible();
    if (isAvailabilityVisible) {
      console.log('Product availability information found');
    } else {
      console.log('Product availability information not found (this is acceptable)');
    }

    // Check for condition and brand information (may not always be present)
    const productCondition = await this.getProductCondition();
    const productBrand = await this.getProductBrand();
    
    if (!productCondition && !productBrand) {
      console.log('Neither condition nor brand information found - checking if any product details exist');
      // At least some product information should be present
      const allProductInfo = await this.page.locator('.product-information p').allTextContents();
      if (allProductInfo.length === 0) {
        throw new Error('No product details found');
      }
    }

    const isImageVisible = await this.isProductImageVisible();
    if (!isImageVisible) {
      throw new Error('Product image not visible');
    }

    console.log(`Product details verified: ${productTitle}, ${productCategory}, ${productPrice}, ${productCondition}, ${productBrand}`);
  }

  /**
   * Assert that review submission was successful
   */
  async assertReviewSubmitted(): Promise<void> {
    const successMessage = await this.getReviewSuccessMessage();
    if (!successMessage || !successMessage.toLowerCase().includes('thank you for your review')) {
      throw new Error('Review submission failed - success message not found or incorrect');
    }
    console.log(`Review submitted successfully: ${successMessage}`);
  }
} 