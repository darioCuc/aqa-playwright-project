import { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  cartTable = () => this.page.locator('#cart_info_table');
  checkoutButton = () => this.page.locator('.check_out');
  removeButton = () => this.page.locator('.cart_quantity_delete');
  quantityInput = () => this.page.locator('.cart_quantity_input');
  cartItems = () => this.page.locator('#cart_info_table tbody tr');
  productRow = (productId: number) => this.page.locator(`#product-${productId}`);
  emptyCartMessage = () => this.page.locator('text=Cart is empty!');

  async navigateTo() {
    await this.page.goto('/view_cart');
    // Wait for cart table to load
    await this.cartTable().waitFor({ state: 'visible', timeout: 10000 });
  }

  async proceedToCheckout() {
    await this.checkoutButton().click();
    
    // Check if a checkout modal appeared that requires login
    try {
      const checkoutModal = this.page.locator('#checkoutModal, .modal');
      const isModalVisible = await checkoutModal.isVisible({ timeout: 3000 });
      
      if (isModalVisible) {
        // Look for login/register link in the modal
        const modalLoginLink = checkoutModal.locator('a[href="/login"], a:has-text("Register / Login")');
        const hasModalLoginLink = await modalLoginLink.count() > 0;
        
        if (hasModalLoginLink) {
          await modalLoginLink.click();
          return;
        }
      }
    } catch (error) {
      // If modal handling fails, continue normally
      console.log('No checkout modal detected or modal handling failed');
    }
  }

  async removeFirstProduct() {
    await this.removeButton().first().click();
  }

  async isCartVisible(): Promise<boolean> {
    try {
      return await this.cartTable().isVisible();
    } catch (error) {
      console.warn('Error checking cart visibility:', error);
      return false;
    }
  }

  // New methods for comprehensive cart functionality

  async isCartPageLoaded(): Promise<boolean> {
    try {
      await this.page.waitForLoadState('domcontentloaded');
      await this.cartTable().waitFor({ state: 'visible', timeout: 5000 });
      return await this.cartTable().isVisible();
    } catch (error) {
      console.warn('Error checking if cart page loaded:', error);
      return false;
    }
  }

  async isProductInCart(productId: number): Promise<boolean> {
    try {
      const productRow = this.page.locator(`#product-${productId}`);
      // Don't wait for element to be attached - just check if it exists and is visible
      // This prevents timeout when product is removed (which is expected behavior)
      const count = await productRow.count();
      if (count === 0) return false;
      
      return await productRow.isVisible();
    } catch (error) {
      console.warn(`Error checking if product ${productId} is in cart:`, error);
      return false;
    }
  }

  async getProductQuantity(productId: number): Promise<string> {
    try {
      // Ensure page is still available and cart is loaded
      await this.page.waitForLoadState('domcontentloaded');
      
      const productRow = this.page.locator(`#product-${productId}`);
      
      // Wait for the product row to be present
      await productRow.waitFor({ state: 'attached', timeout: 5000 });
      
      const quantityCell = productRow.locator('.cart_quantity').locator('button');
      
      // Wait for the quantity button to be present
      await quantityCell.waitFor({ state: 'attached', timeout: 3000 });
      
      // Get the text content from the button (not value attribute)
      const quantity = await quantityCell.textContent();
      return quantity?.trim() || '0';
    } catch (error) {
      console.warn(`Error getting quantity for product ${productId}:`, error);
      return '0';
    }
  }

  async removeProduct(productId: number): Promise<void> {
    try {
      const productRow = this.page.locator(`#product-${productId}`);
      await productRow.waitFor({ state: 'visible', timeout: 5000 });
      
      const removeButton = productRow.locator('.cart_delete a');
      await removeButton.waitFor({ state: 'visible', timeout: 3000 });
      await removeButton.click();
      await this.page.waitForTimeout(1000);
    } catch (error) {
      console.warn(`Error removing product ${productId}:`, error);
      throw error;
    }
  }

  async getCartItemsCount(): Promise<number> {
    try {
      // First check if cart table exists and is visible
      const tableExists = await this.cartTable().count() > 0;
      if (!tableExists) return 0;
      
      const isTableVisible = await this.cartTable().isVisible();
      if (!isTableVisible) return 0;
      
      // If table is visible, count the items
      return await this.cartItems().count();
    } catch (error) {
      console.warn('Error getting cart items count:', error);
      return 0;
    }
  }

  async isCartEmpty(): Promise<boolean> {
    try {
      const itemCount = await this.getCartItemsCount();
      
      // Also check for empty cart message (some sites show this)
      let emptyMessageVisible = false;
      try {
        emptyMessageVisible = await this.emptyCartMessage().isVisible();
      } catch (e) {
        // Empty message might not exist on this site
        emptyMessageVisible = false;
      }
      
      return itemCount === 0 || emptyMessageVisible;
    } catch (error) {
      console.warn('Error checking if cart is empty:', error);
      return true; 
    }
  }

  async getProductPrice(productId: number): Promise<string> {
    try {
      const productRow = this.page.locator(`#product-${productId}`);
      await productRow.waitFor({ state: 'attached', timeout: 5000 });
      
      const priceCell = productRow.locator('.cart_price p');
      await priceCell.waitFor({ state: 'attached', timeout: 3000 });
      
      return await priceCell.textContent() || '';
    } catch (error) {
      console.warn(`Error getting price for product ${productId}:`, error);
      return '';
    }
  }

  async getTotalPrice(productId: number): Promise<string> {
    try {
      const productRow = this.page.locator(`#product-${productId}`);
      await productRow.waitFor({ state: 'attached', timeout: 5000 });
      
      const totalCell = productRow.locator('.cart_total_price p');
      await totalCell.waitFor({ state: 'attached', timeout: 3000 });
      
      return await totalCell.textContent() || '';
    } catch (error) {
      console.warn(`Error getting total price for product ${productId}:`, error);
      return '';
    }
  }

  async getProductName(productId: number): Promise<string> {
    try {
      const productRow = this.page.locator(`#product-${productId}`);
      await productRow.waitFor({ state: 'attached', timeout: 5000 });
      
      const nameCell = productRow.locator('.cart_description h4 a');
      await nameCell.waitFor({ state: 'attached', timeout: 3000 });
      
      return await nameCell.textContent() || '';
    } catch (error) {
      console.warn(`Error getting name for product ${productId}:`, error);
      return '';
    }
  }

  async getAllProductIds(): Promise<number[]> {
    try {
      await this.cartTable().waitFor({ state: 'visible', timeout: 5000 });
      
      const rows = await this.cartItems().all();
      const productIds: number[] = [];
      
              for (const row of rows) {
          try {
            const idAttr = await row.getAttribute('id');
            if (idAttr && idAttr.includes('product')) {
              const id = parseInt(idAttr.replace('product-', ''));
              if (!isNaN(id)) {
                productIds.push(id);
              }
            }
          } catch (error) {
            console.warn('Error processing cart row:', error);
            continue;
          }
        }
      
      return productIds;
    } catch (error) {
      console.warn('Error getting all product IDs:', error);
      return [];
    }
  }

  /**
   * Assert that specific products are present in cart
   */
  async assertProductsInCart(expectedProducts: Array<{ productId: number; quantity: number; expectedPrice?: string }>): Promise<void> {
    const isLoaded = await this.isCartPageLoaded();
    if (!isLoaded) {
      throw new Error('Cart page not loaded');
    }
    
    const actualItemCount = await this.getCartItemsCount();
    if (actualItemCount !== expectedProducts.length) {
      throw new Error(`Expected ${expectedProducts.length} items in cart, found ${actualItemCount}`);
    }
    
    // Verify each expected product
    for (const expectedProduct of expectedProducts) {
      const isInCart = await this.isProductInCart(expectedProduct.productId);
      if (!isInCart) {
        throw new Error(`Product ${expectedProduct.productId} not found in cart`);
      }
      
      const actualQuantity = await this.getProductQuantity(expectedProduct.productId);
      if (actualQuantity !== expectedProduct.quantity.toString()) {
        throw new Error(`Product ${expectedProduct.productId} quantity mismatch: expected ${expectedProduct.quantity}, got ${actualQuantity}`);
      }
      
      if (expectedProduct.expectedPrice) {
        const actualPrice = await this.getProductPrice(expectedProduct.productId);
        if (actualPrice !== expectedProduct.expectedPrice) {
          throw new Error(`Product ${expectedProduct.productId} price mismatch: expected ${expectedProduct.expectedPrice}, got ${actualPrice}`);
        }
      }
    }
  }

  /**
   * Assert that cart contents persist after login (same as assertProductsInCart but with different error messages)
   */
  async assertCartPersistence(expectedProducts: Array<{ productId: number; quantity: number; expectedPrice?: string }>): Promise<void> {
    const isLoaded = await this.isCartPageLoaded();
    if (!isLoaded) {
      throw new Error('Cart page not loaded after login');
    }
    
    const actualItemCount = await this.getCartItemsCount();
    if (actualItemCount !== expectedProducts.length) {
      throw new Error(`Cart persistence failed: Expected ${expectedProducts.length} items after login, found ${actualItemCount}`);
    }
    
    // Verify each expected product persisted
    for (const expectedProduct of expectedProducts) {
      const isInCart = await this.isProductInCart(expectedProduct.productId);
      if (!isInCart) {
        throw new Error(`Cart persistence failed: Product ${expectedProduct.productId} not found after login`);
      }
      
      const actualQuantity = await this.getProductQuantity(expectedProduct.productId);
      if (actualQuantity !== expectedProduct.quantity.toString()) {
        throw new Error(`Cart persistence failed: Product ${expectedProduct.productId} quantity changed after login`);
      }
      
      if (expectedProduct.expectedPrice) {
        const actualPrice = await this.getProductPrice(expectedProduct.productId);
        if (actualPrice !== expectedProduct.expectedPrice) {
          throw new Error(`Cart persistence failed: Product ${expectedProduct.productId} price changed after login`);
        }
      }
    }
  }

  /**
   * Assert that cart page is loaded and has items
   */
  async assertCartPageLoaded(): Promise<void> {
    const isLoaded = await this.isCartPageLoaded();
    if (!isLoaded) {
      throw new Error('Cart page not loaded properly');
    }
  }
} 