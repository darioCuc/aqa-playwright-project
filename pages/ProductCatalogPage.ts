import { Page } from '@playwright/test';
import { ConsentHelper } from '../helpers/consent-helper';
import { expect } from '@playwright/test';

export class ProductCatalogPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  productList = () => this.page.locator('.features_items');
  searchInput = () => this.page.locator('input#search_product');
  searchButton = () => this.page.locator('button#submit_search');
  productItem = () => this.page.locator('.productinfo.text-center');
  addToCartButton = () => this.page.locator('.add-to-cart');
  viewProductButton = () => this.page.locator('a[href*="/product_details/"]');
  continueShoppingButton = () => this.page.locator('button[data-dismiss="modal"]');
  viewCartButton = () => this.page.getByRole('link', { name: 'View Cart' });
  addedToCartModal = () => this.page.locator('.modal-content');
  searchResultsHeader = () => this.page.locator('h2.title.text-center');
  categorySection = () => this.page.locator('.left-sidebar #accordian');
  brandSection = () => this.page.locator('.left-sidebar .brands_products');
  allProductsHeader = () => this.page.locator('h2.title.text-center');

  async navigateTo() {
    await this.page.goto('/products');
    
    // Handle consent modal using dedicated helper
    const consentHelper = new ConsentHelper(this.page);
    await consentHelper.dismissConsentModal();
  }

  async searchForProduct(productName: string) {
    await this.searchInput().fill(productName);
    await this.searchButton().click();
  }

  async addFirstProductToCart() {
    await this.productItem().first().locator('.add-to-cart').click();
    // Wait for modal to appear
    await this.addedToCartModal().waitFor({ state: 'visible', timeout: 5000 });
  }

  async addFirstSearchResultToCart() {
    // Add the first product from search results to cart
    await this.productItem().first().locator('.add-to-cart').click();
    // Wait for modal to appear and then continue shopping to stay on products page
    await this.addedToCartModal().waitFor({ state: 'visible', timeout: 5000 });
    await this.continueShopping();
  }

  async isProductListVisible(): Promise<boolean> {
    return await this.productList().isVisible();
  }

  // New methods for comprehensive product catalog functionality

  async isAllProductsPageLoaded(): Promise<boolean> {
    try {
      // Wait for page to load
      await this.page.waitForLoadState('domcontentloaded');
      
      // Wait for the header element to be visible
      await this.allProductsHeader().waitFor({ state: 'visible', timeout: 10000 });
      
      const headerText = await this.allProductsHeader().textContent();
      return headerText?.includes('ALL PRODUCTS') || false;
    } catch (error) {
      console.warn('Error checking if products page loaded:', error);
      return false;
    }
  }

  async viewFirstProduct(): Promise<void> {
    await this.viewProductButton().first().click();
  }

  async selectCategory(category: string, subcategory: string): Promise<void> {
    // Navigate to products page first to ensure categories are visible
    await this.page.goto('/products');
    
    // Wait for categories to load
    await this.categorySection().waitFor({ state: 'visible', timeout: 10000 });
    
    // Click on main category (e.g., "Women") to expand it
    const categoryLink = this.page.locator(`a[href="#${category}"]`).first();
    await categoryLink.click();
    
    // Wait a moment for the category to expand
    await this.page.waitForTimeout(1000);
    
    // Look for subcategory with more flexible selectors
    const subcategoryLink = this.page.locator(`
      a[href*="/category_products/"]:has-text("${subcategory}"), 
      a:has-text("${subcategory}")[href*="/category"]
    `).first();
    
    await subcategoryLink.waitFor({ state: 'visible', timeout: 5000 });
    await subcategoryLink.click();
    
    // Wait for category page to load
    await this.page.waitForLoadState('domcontentloaded');
  }

  async selectBrand(brandName: string): Promise<void> {
    const brandLink = this.page.locator(`.brands_products a:has-text("${brandName}")`);
    await brandLink.click();
  }

  async isSearchResultsVisible(): Promise<boolean> {
    return await this.searchResultsHeader().isVisible();
  }

  async getSearchResultsText(): Promise<string> {
    return await this.searchResultsHeader().textContent() || '';
  }

  async getCategoryHeaderText(): Promise<string> {
    const headerElement = this.page.locator('h2.title.text-center, .features_items .title.text-center');
    return await headerElement.textContent() || '';
  }

  async isBrandPageLoaded(): Promise<boolean> {
    const brandHeader = this.page.locator('.features_items .title.text-center');
    const headerText = await brandHeader.textContent();
    return headerText?.includes('BRAND') || false;
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton().click();
  }

  async viewCart(): Promise<void> {
    await this.addedToCartModal().waitFor({ state: 'visible' });
    expect(await this.addedToCartModal().isVisible()).toBe(true);
    await this.viewCartButton().click();
  }

  async addSecondProductToCart(): Promise<void> {
    const secondProduct = this.productItem().nth(1);
    await secondProduct.locator('.add-to-cart').click();
  }

  async addProductToCartByIndex(index: number): Promise<void> {
    const product = this.productItem().nth(index);
    await product.locator('.add-to-cart').click();
  }

  async viewProductByIndex(index: number): Promise<void> {
    await this.viewProductButton().nth(index).click();
  }

  async getProductCount(): Promise<number> {
    return await this.productItem().count();
  }

  async getProductName(index: number): Promise<string> {
    const product = this.productItem().nth(index);
    const nameElement = product.locator('p');
    return await nameElement.textContent() || '';
  }

  async getProductPrice(index: number): Promise<string> {
    const product = this.productItem().nth(index);
    const priceElement = product.locator('h2');
    return await priceElement.textContent() || '';
  }

  async hoverOverProduct(index: number): Promise<void> {
    const product = this.productItem().nth(index);
    await product.hover();
  }

  async isAddToCartVisible(index: number): Promise<boolean> {
    const product = this.productItem().nth(index);
    const addToCartBtn = product.locator('.add-to-cart');
    return await addToCartBtn.isVisible();
  }

  /**
   * Assert that products page is loaded successfully
   */
  async assertPageLoaded(): Promise<void> {
    // First check if product list is visible (most important indicator)
    const isProductListVisible = await this.isProductListVisible();
    
    if (isProductListVisible) {
      const productCount = await this.getProductCount();
      if (productCount === 0) {
        throw new Error('No products found on page');
      }
      // If we have products, page is considered loaded regardless of header
      return;
    }
    
    // If no product list, then check if page header loaded
    const isPageLoaded = await this.isAllProductsPageLoaded();
    if (!isPageLoaded) {
      throw new Error('Products page not loaded - neither header nor product list visible');
    }
  }

  /**
   * Assert that search results are visible and contain expected content
   */
  async assertSearchResultsVisible(searchTerm: string): Promise<void> {
    const isSearchResultsVisible = await this.isSearchResultsVisible();
    if (!isSearchResultsVisible) {
      throw new Error(`Search results not visible for "${searchTerm}"`);
    }
    
    const resultsText = await this.getSearchResultsText();
    // Check for both "SEARCHED PRODUCTS" and "Searched Products" to handle case variations
    if (!resultsText.toUpperCase().includes('SEARCHED PRODUCTS')) {
      throw new Error(`Search results header missing. Found: "${resultsText}"`);
    }
    
    const productCount = await this.getProductCount();
    if (productCount === 0) {
      throw new Error(`No search results found for "${searchTerm}"`);
    }
  }

  /**
   * Assert that category page is loaded with expected text
   */
  async assertCategoryPageLoaded(expectedText: string): Promise<void> {
    // Wait for category page to load
    await this.page.waitForLoadState('domcontentloaded');
    
    const headerText = await this.getCategoryHeaderText();
    if (!headerText.toUpperCase().includes(expectedText.toUpperCase())) {
      throw new Error(`Category page header mismatch. Expected: "${expectedText}", Found: "${headerText}"`);
    }
    
    const productCount = await this.getProductCount();
    if (productCount === 0) {
      throw new Error('No products found in category page');
    }
    
    console.log(`Category page loaded successfully: ${headerText}`);
  }

  /**
   * Assert that brand page is loaded with expected brand name
   */
  async assertBrandPageLoaded(expectedBrandName: string): Promise<void> {
    // Wait for brand page to load
    await this.page.waitForLoadState('domcontentloaded');
    
    const headerText = await this.getCategoryHeaderText();
    // The actual format is "Brand - Polo Products"
    // Just check if the brand name appears in the header
    if (!headerText.toUpperCase().includes(expectedBrandName.toUpperCase())) {
      throw new Error(`Brand page header mismatch. Expected brand "${expectedBrandName}" in header, Found: "${headerText}"`);
    }
    
    const productCount = await this.getProductCount();
    if (productCount === 0) {
      throw new Error(`No products found for brand "${expectedBrandName}"`);
    }
    
    console.log(`Brand page loaded successfully: ${headerText}`);
  }

  /**
   * Get list of available brand names from the sidebar
   */
  async getAvailableBrands(): Promise<string[]> {
    await this.brandSection().waitFor({ state: 'visible', timeout: 10000 });
    const brandLinks = this.page.locator('.brands_products a');
    const brandCount = await brandLinks.count();
    const brands: string[] = [];
    
    for (let i = 0; i < brandCount; i++) {
      const brandText = await brandLinks.nth(i).textContent();
      if (brandText) {
        // Extract brand name from text like " (8) Polo" -> "Polo"
        // First trim, then remove the count pattern
        const cleanBrandName = brandText.trim().replace(/^\(\d+\)\s*/, '');
        
        if (cleanBrandName) {
          brands.push(cleanBrandName);
        }
      }
    }
    
    return brands;
  }
} 