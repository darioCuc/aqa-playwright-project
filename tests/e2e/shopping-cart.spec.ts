import { test, expect } from '../../helpers/fixtures';
import { UserDataGenerator } from '../../helpers/user-data';

// Shopping Cart Test Suite
// Groups all shopping cart operations and cart persistence related test cases

test.describe('Shopping Cart', () => {

  // Test Case 12: Add Products in Cart
  // 1-2. Launch browser and navigate to url 'http://automationexercise.com'
  // 3. Verify that home page is visible successfully
  // 4. Click 'Products' button
  // 5. Hover over first product and click 'Add to cart'
  // 6. Click 'Continue Shopping' button
  // 7. Hover over second product and click 'Add to cart'
  // 8. Click 'View Cart' button
  // 9. Verify both products are added to Cart
  // 10. Verify their prices, quantity and total price
  test('Add multiple products to cart', async ({ pages }) => {
    // Get cart products data
    const productsData = UserDataGenerator.getCartProductsData();
    
    await pages.home.navigateTo();
    await pages.home.assertHomePageLoaded();
    await pages.home.goToProducts();
    
    // Hover over first product and click 'Add to cart'
    await pages.products.hoverOverProduct(0);
    await pages.products.addFirstProductToCart();
    
    // Click 'Continue Shopping' button
    await pages.products.continueShopping();
    
    // Hover over second product and click 'Add to cart'
    await pages.products.hoverOverProduct(1);
    await pages.products.addSecondProductToCart();
    
    // Click 'View Cart' button
    await pages.products.viewCart();
    
    // Verify both products are added to Cart
    // Verify their prices, quantity and total price
    expect(await pages.cart.isCartPageLoaded()).toBe(true);
    expect(await pages.cart.getCartItemsCount()).toBe(2);
    
    // Verify each product is in cart with correct quantity
    for (const productData of productsData) {
      expect(await pages.cart.isProductInCart(productData.productId)).toBe(true);
      expect(await pages.cart.getProductQuantity(productData.productId)).toBe(productData.quantity.toString());
      if (productData.expectedPrice) {
        expect(await pages.cart.getProductPrice(productData.productId)).toBe(productData.expectedPrice);
      }
    }
  });


  // Test Case 17: Remove Products From Cart
  // 1-2. Launch browser and navigate to url 'http://automationexercise.com'
  // 3. Verify that home page is visible successfully
  // 4. Add products to cart
  // 5. Click 'Cart' button
  // 6. Verify that cart page is displayed
  // 7. Click 'X' button corresponding to particular product
  // 8. Verify that product is removed from the cart
  test('Remove products from cart', async ({ pages }) => {
    // Get product data - using first product (product ID 1)
    const productData = UserDataGenerator.getSingleProductCartData();
    
    await pages.home.navigateTo();
    await pages.home.assertHomePageLoaded();
    
    // Add products to cart
    await pages.home.goToProducts();
    await pages.products.hoverOverProduct(0);
    await pages.products.addFirstProductToCart();
    
    // Click 'View Cart' button
    await pages.products.viewCart();
    
    // Verify product is added to cart
    expect(await pages.cart.isCartPageLoaded()).toBe(true);
    expect(await pages.cart.getCartItemsCount()).toBe(1);
    expect(await pages.cart.isProductInCart(productData.productId)).toBe(true);
    
    // Remove product from cart
    await pages.cart.removeProduct(productData.productId);
    
    // Verify that product is removed from the cart
    expect(await pages.cart.isProductInCart(productData.productId)).toBe(false);
    expect(await pages.cart.getCartItemsCount()).toBe(0);
    expect(await pages.cart.isCartEmpty()).toBe(true);
  });


  // Test Case 20: Search Products and Verify Cart After Login
  // 1-2. Launch browser and navigate to url 'http://automationexercise.com'
    // 3. Click on 'Products' button
    // 4. Verify user is navigated to ALL PRODUCTS page successfully
    // 5. Enter product name in search input and click search button
    // 6. Verify 'SEARCHED PRODUCTS' is visible
    // 7. Verify all the products related to search are visible
    // 8. Add those products to cart
    // 9. Click 'Cart' button and verify that products are visible in cart
    // 10. Click 'Signup / Login' button and submit login details
    // 11. Again, go to Cart page
    // 12. Verify that those products are visible in cart after login as well
  test('Verify search functionality and cart persistence after login', async ({ pages }) => {
    // Get search and login data
    const searchData = UserDataGenerator.getProductSearchData();
    const loginCredentials = UserDataGenerator.getValidLoginCredentials();
    
    await pages.home.navigateTo();
    await pages.home.assertHomePageLoaded();
    await pages.home.goToProducts();
    await pages.products.assertPageLoaded();
    
    await pages.products.searchForProduct(searchData.searchTerm);
    await pages.products.assertSearchResultsVisible(searchData.searchTerm);
    
    await pages.products.addFirstSearchResultToCart();
    await pages.home.goToCart();
    
    // Verify at least one product is in cart
    const cartItemsCount = await pages.cart.getCartItemsCount();
    expect(cartItemsCount).toBeGreaterThan(0);
    const productIdsInCart = await pages.cart.getAllProductIds();
    expect(productIdsInCart.length).toBeGreaterThan(0);
    
    await pages.home.goToLogin();
    await pages.login.login(loginCredentials.email, loginCredentials.password);
    
    await pages.home.goToCart();
    
    const cartItemsCountAfterLogin = await pages.cart.getCartItemsCount();
    expect(cartItemsCountAfterLogin).toBe(cartItemsCount);
    
    // Verify the same products are still in cart
    const productIdsAfterLogin = await pages.cart.getAllProductIds();
    expect(productIdsAfterLogin).toEqual(productIdsInCart);
  });

}); 