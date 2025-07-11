import { expect } from '@playwright/test';

/**
 * E2E-specific validation helpers for complex page state verification
 * Handles multi-step validation flows for E2E testing scenarios
 */
export class E2EValidators {
  /**
   * Complex validation for complete cart state with multiple products
   */
  static async validateCartState(cartPage: any, expectedProducts: Array<{
    productId: number;
    name: string;
    quantity: number;
    expectedPrice?: string;
  }>): Promise<void> {
    expect(await cartPage.isCartPageLoaded(), 'Cart page not loaded').toBe(true);
    
    const actualItemCount = await cartPage.getCartItemsCount();
    expect(actualItemCount, `Expected ${expectedProducts.length} items in cart, found ${actualItemCount}`).toBe(expectedProducts.length);
    
    // Validate each expected product
    for (const expectedProduct of expectedProducts) {
      const isInCart = await cartPage.isProductInCart(expectedProduct.productId);
      expect(isInCart, `Product ${expectedProduct.productId} (${expectedProduct.name}) not found in cart`).toBe(true);
      
      if (isInCart) {
        const actualQuantity = await cartPage.getProductQuantity(expectedProduct.productId);
        expect(actualQuantity, `Product ${expectedProduct.name} quantity mismatch`).toBe(expectedProduct.quantity.toString());
        
        if (expectedProduct.expectedPrice) {
          const actualPrice = await cartPage.getProductPrice(expectedProduct.productId);
          expect(actualPrice, `Product ${expectedProduct.name} price mismatch`).toBe(expectedProduct.expectedPrice);
        }
      }
    }
  }

  /**
   * Comprehensive search results validation with multiple criteria
   */
  static async validateSearchResults(productPage: any, searchTerm: string, expectations: {
    shouldHaveResults: boolean;
    minimumResults?: number;
    shouldContainTerm?: boolean;
  }): Promise<void> {
    const isSearchResultsVisible = await productPage.isSearchResultsVisible();
    
    if (expectations.shouldHaveResults) {
      expect(isSearchResultsVisible, `No search results found for "${searchTerm}"`).toBe(true);
      
      const resultsText = await productPage.getSearchResultsText();
      expect(resultsText, 'Search results header not displayed correctly').toContain('SEARCHED PRODUCTS');
      
      if (expectations.minimumResults) {
        const productCount = await productPage.getProductCount();
        expect(productCount, `Expected at least ${expectations.minimumResults} results for "${searchTerm}"`).toBeGreaterThanOrEqual(expectations.minimumResults);
      }
      
      if (expectations.shouldContainTerm) {
        // Check if at least one product name contains the search term
        const productNames = await Promise.all(
          Array.from({ length: await productPage.getProductCount() }, (_, i) => productPage.getProductName(i))
        );
        
        const hasMatchingProduct = productNames.some(name => 
          name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        expect(hasMatchingProduct, `No products found containing "${searchTerm}" in their names`).toBe(true);
      }
    } else {
      expect(isSearchResultsVisible, `Expected no results for "${searchTerm}" but found some`).toBe(false);
    }
  }

  /**
   * Complete checkout validation with order and address verification
   */
  static async validateCheckoutComplete(checkoutPage: any, orderData: {
    expectedItems: string[];
    billingAddress?: any;
    deliveryAddress?: any;
  }): Promise<void> {
    // Verify order completion
    expect(await checkoutPage.isOrderSuccessful(), 'Order was not completed successfully').toBe(true);
    
    // Verify order items match expectations
    const actualItems = await checkoutPage.getOrderItems();
    for (const expectedItem of orderData.expectedItems) {
      expect(actualItems.some((item: string) => item.includes(expectedItem)), 
        `Expected item "${expectedItem}" not found in order`).toBe(true);
    }
    
    // Verify addresses if provided
    if (orderData.billingAddress || orderData.deliveryAddress) {
      const deliveryAddress = await checkoutPage.getDeliveryAddress();
      const billingAddress = await checkoutPage.getBillingAddress();
      
      if (orderData.deliveryAddress) {
        expect(deliveryAddress, 'Delivery address missing required information').toContain(orderData.deliveryAddress.firstName);
        expect(deliveryAddress, 'Delivery address missing required information').toContain(orderData.deliveryAddress.lastName);
      }
      
      if (orderData.billingAddress) {
        expect(billingAddress, 'Billing address missing required information').toContain(orderData.billingAddress.firstName);
        expect(billingAddress, 'Billing address missing required information').toContain(orderData.billingAddress.lastName);
      }
    }
  }

  /**
   * Assert that subscription section is visible in footer (works across all pages)
   */
  static async assertSubscriptionVisible(page: any): Promise<void> {
    const subscriptionText = page.locator('text=SUBSCRIPTION');
    const isVisible = await subscriptionText.isVisible();
    expect(isVisible, 'SUBSCRIPTION section not visible in footer').toBe(true);
    
    // Also verify the subscription input and button are present
    const subscriptionInput = page.locator('input#susbscribe_email');
    const subscribeButton = page.locator('button#subscribe');
    
    expect(await subscriptionInput.isVisible(), 'Subscription email input not visible').toBe(true);
    expect(await subscribeButton.isVisible(), 'Subscribe button not visible').toBe(true);
  }
} 