import { test, expect } from '../../helpers/fixtures';
import { UserDataGenerator } from '../../helpers/user-data';
import { TestHelpers } from '../../helpers/test-helpers';

// Checkout & Orders Test Suite
// Groups all checkout processes, order placement, and order-related functionality

test.describe('Checkout & Orders', () => {

  // Test Case 14: Place Order: Register while Checkout
  // 1-2. Launch browser and navigate to url 'http://automationexercise.com'
  // 3. Verify that home page is visible successfully
  // 4. Add products to cart
  // 5. Click 'Cart' button
  // 6. Verify that cart page is displayed
  // 7. Click Proceed To Checkout
  // 8. Click 'Register / Login' button
  // 9. Fill all details in Signup and create account
  // 10. Verify 'ACCOUNT CREATED!' and click 'Continue' button
  // 11. Verify 'Logged in as username' at top
  // 12. Click 'Cart' button
  // 13. Click 'Proceed To Checkout' button
  // 14. Verify Address Details and Review Your Order
  // 15. Enter description in comment text area and click 'Place Order'
  // 16. Enter payment details: Name on Card, Card Number, CVC, Expiration date
  // 17. Click 'Pay and Confirm Order' button
  // 18. Verify success message 'Your order has been placed successfully!'
  // 19. Click 'Delete Account' button
  // 20. Verify 'ACCOUNT DELETED!' and click 'Continue' button
  test('Complete order with registration during checkout', async ({ pages }) => {
    // Generate test data
    const userData = UserDataGenerator.generateUniqueUser();
    const accountInfo = UserDataGenerator.generateAccountInfo(userData);
    const addressInfo = TestHelpers.getUserAddressInfo(userData);
    const paymentData = UserDataGenerator.getPaymentData();
    const checkoutComment = UserDataGenerator.getCheckoutComment();
  
    await pages.home.navigateTo();  
    await pages.home.assertHomePageLoaded();
    await pages.home.goToProducts();

    await pages.products.hoverOverProduct(0);
    await pages.products.addFirstProductToCart();
    await pages.products.continueShopping();
    
    await pages.home.goToCart();
    await pages.cart.assertCartPageLoaded();
    
    await pages.cart.proceedToCheckout();
    
    await pages.signup.fillInitialSignupForm(userData.name, userData.email);
    await pages.signup.assertAccountInfoFormVisible();
    await pages.signup.fillAccountInformation(accountInfo);
    await pages.signup.fillAddressInformation(addressInfo);
    await pages.signup.createAccount();
    
    await pages.signup.assertAccountCreated();
    await pages.signup.clickContinue();
    await pages.home.assertUserLoggedIn(userData.name);
    
    await pages.home.goToCart();
    await pages.cart.proceedToCheckout();
    await pages.checkout.assertCheckoutPageLoaded();
    await pages.checkout.assertAddressDetailsMatch(addressInfo);
    await pages.checkout.addCommentAndPlaceOrder(checkoutComment.comment);
    await pages.checkout.completePayment(paymentData);
    await pages.checkout.assertOrderSuccessful();
    
    await pages.home.deleteAccount();
    await pages.signup.assertAccountDeleted();
    await pages.signup.clickContinue();
  });


  // Test Case 16: Place Order: Login before Checkout
  // 1-2. Launch browser and navigate to url 'http://automationexercise.com'
    // 3. Verify that home page is visible successfully
    // 4. Click 'Signup / Login' button
    // 5. Fill email, password and click 'Login' button
    // 6. Verify 'Logged in as username' at top
    // 7. Add products to cart
    // 8. Click 'Cart' button
    // 9. Verify that cart page is displayed
    // 10. Click Proceed To Checkout
    // 11. Verify Address Details and Review Your Order
    // 12. Enter description in comment text area and click 'Place Order'
    // 13. Enter payment details: Name on Card, Card Number, CVC, Expiration date
    // 14. Click 'Pay and Confirm Order' button
    // 15. Verify success message 'Your order has been placed successfully!'
  test('Complete order with existing account login', async ({ pages }) => {
    // Get login credentials and test data
    const loginCredentials = UserDataGenerator.getValidLoginCredentials();
    const paymentData = UserDataGenerator.getPaymentData();
    const checkoutComment = UserDataGenerator.getCheckoutComment();
    
    
    await pages.home.navigateTo();
    await pages.home.assertHomePageLoaded();
    await pages.home.goToLogin();
    await pages.login.login(loginCredentials.email, loginCredentials.password);
    await pages.home.assertUserLoggedIn('Test Automation');
    
    // Add products to cart
    await pages.home.goToProducts();
    await pages.products.hoverOverProduct(0);
    await pages.products.addFirstProductToCart();
    await pages.products.continueShopping();
    await pages.home.goToCart();
    await pages.cart.assertCartPageLoaded();
    
    await pages.cart.proceedToCheckout();
    await pages.checkout.assertCheckoutPageLoaded();
    await pages.checkout.addCommentAndPlaceOrder(checkoutComment.comment);
    
    await pages.checkout.completePayment(paymentData);
    await pages.checkout.assertOrderSuccessful();
  });


  // Test Case 24: Download Invoice after purchase order
  // 1-2. Launch browser and navigate to url 'http://automationexercise.com'
  // 3. Verify that home page is visible successfully
  // 4. Add products to cart
  // 5. Click 'Cart' button
  // 6. Verify that cart page is displayed
  // 7. Click Proceed To Checkout
  // 8. Click 'Register / Login' button
  // 9. Fill all details in Signup and create account
  // 10. Verify 'ACCOUNT CREATED!' and click 'Continue' button
  // 11. Verify 'Logged in as username' at top
  // 12. Click 'Cart' button
  // 13. Click 'Proceed To Checkout' button
  // 14. Verify Address Details and Review Your Order
  // 15. Enter description in comment text area and click 'Place Order'
  // 16. Enter payment details: Name on Card, Card Number, CVC, Expiration date
  // 17. Click 'Pay and Confirm Order' button
  // 18. Verify success message 'Your order has been placed successfully!'
  // 19. Click 'Download Invoice' button and verify invoice is downloaded successfully.
  // 20. Click 'Continue' button
  // 21. Click 'Delete Account' button
  // 22. Verify 'ACCOUNT DELETED!' and click 'Continue' button
  test('Download invoice after order completion', async ({ pages }) => {
    // Generate test data
    const userData = UserDataGenerator.generateUniqueUser();
    const accountInfo = UserDataGenerator.generateAccountInfo(userData);
    const addressInfo = TestHelpers.getUserAddressInfo(userData);
    const paymentData = UserDataGenerator.getPaymentData();
    const checkoutComment = UserDataGenerator.getCheckoutComment();
    
    await pages.home.navigateTo();
    await pages.home.assertHomePageLoaded();

    // Add products to cart
    await pages.home.goToProducts();
    await pages.products.hoverOverProduct(0);
    await pages.products.addFirstProductToCart();
    await pages.products.continueShopping();
    await pages.home.goToCart();
    await pages.cart.assertCartPageLoaded();
    
    await pages.cart.proceedToCheckout();
    await pages.home.goToLogin();
    
    // Fill all details in Signup and create account
    await pages.signup.fillInitialSignupForm(userData.name, userData.email);
    await pages.signup.assertAccountInfoFormVisible();
    await pages.signup.fillAccountInformation(accountInfo);
    await pages.signup.fillAddressInformation(addressInfo);
    await pages.signup.createAccount();
    
    // Verify 'ACCOUNT CREATED!' and click 'Continue' button
    await pages.signup.assertAccountCreated();
    await pages.signup.clickContinue();
    await pages.home.assertUserLoggedIn(userData.name);
    
    await pages.home.goToCart();
    await pages.cart.proceedToCheckout();
    await pages.checkout.assertCheckoutPageLoaded();
    await pages.checkout.assertAddressDetailsMatch(addressInfo);
    await pages.checkout.addCommentAndPlaceOrder(checkoutComment.comment);
    await pages.checkout.completePayment(paymentData);
    await pages.checkout.assertOrderSuccessful();

    await pages.checkout.assertInvoiceDownloaded();
    await pages.checkout.clickContinueAfterOrder();
    
    // Delete Account
    await pages.home.deleteAccount();
    await pages.signup.assertAccountDeleted();
    await pages.signup.clickContinue();
  });
}); 