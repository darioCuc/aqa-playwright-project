import { test, expect } from '../../helpers/fixtures';
import { UserDataGenerator } from '../../helpers/user-data';
import { TestHelpers } from '../../helpers/test-helpers';

// User Authentication Test Suite
// Groups all user management and authentication related test cases

test.describe('User Authentication', () => {
  
  // Test Case 1: Register User
  // 1-2. Launch browser and navigate to url 'http://automationexercise.com'
    // 3. Verify that home page is visible successfully
    // 4. Click on 'Signup / Login' button
    // 5. Verify 'New User Signup!' is visible
    // 6. Enter name and email address
    // 7. Click 'Signup' button
    // 8. Verify that 'ENTER ACCOUNT INFORMATION' is visible
    // 9. Fill details: Title, Name, Email, Password, Date of birth
    // 10. Select checkbox 'Sign up for our newsletter!'
    // 11. Select checkbox 'Receive special offers from our partners!'
    // 12. Fill details: First name, Last name, Company, Address, Address2, Country, State, City, Zipcode, Mobile Number
    // 13. Click 'Create Account button'
    // 14. Verify that 'ACCOUNT CREATED!' is visible
    // 15. Click 'Continue' button
    // 16. Verify that 'Logged in as username' is visible
    // 17. Click 'Delete Account' button
    // 18. Verify that 'ACCOUNT DELETED!' is visible and click 'Continue' button
  test('Register new user with complete flow', async ({ pages }) => {
    // Generate unique test data
    const userData = UserDataGenerator.generateUniqueUser();
    
    await pages.home.navigateTo();
    await pages.home.assertHomePageLoaded();

    await pages.home.goToLogin();
    expect(await pages.signup.isNewUserSignupVisible()).toBe(true);
    
    await pages.signup.fillInitialSignupForm(userData.name, userData.email);
    
    // Fill account information
    expect(await pages.signup.isAccountInfoFormVisible()).toBe(true);
    const addressInfo = TestHelpers.getUserAddressInfo(userData);
    await pages.signup.fillAccountInformation({
      title: 'Mr',
      name: userData.name,
      email: userData.email,
      password: userData.password,
      day: '1',
      month: 'January',
      year: '1990'
    });
    await pages.signup.fillAddressInformation(addressInfo);
    await pages.signup.createAccount();
    
    // Verify account creation
    expect(await pages.signup.isAccountCreated()).toBe(true);
    
    // Click Continue to navigate to homepage
    await pages.signup.clickContinue();
    
    // Wait for homepage to load and verify user is logged in
    await pages.home.page.waitForURL('**/');
    
    // Verify user is logged in
    expect(await pages.home.isUserLoggedIn(userData.name)).toBe(true);
    
    // Delete account
    await pages.home.deleteAccount();
    expect(await pages.signup.isAccountDeleted()).toBe(true);
  });


  // Test Case 2: Login User with correct email and password and then logout
    // 1-2. Launch browser and navigate to url 'http://automationexercise.com'
    // 3. Verify that home page is visible successfully
    // 4. Click on 'Signup / Login' button
    // 5. Verify 'Login to your account' is visible
    // 6. Enter correct email address and password
    // 7. Click 'login' button
    // 8. Verify that 'Logged in as username' is visible
    // 9. Click 'Logout' button
    // 10. Verify that user is navigated to login page
  test('should login with correct email and password', async ({ pages }) => {
    await pages.home.navigateTo();
    await pages.home.assertHomePageLoaded();
    
    await pages.home.goToLogin();
    expect(await pages.login.isLoginFormVisible()).toBe(true);
    
    await pages.login.login('testuser+dario@example.com', 'password123');
    
    expect(await pages.home.isUserLoggedIn('Test Automation')).toBe(true);

    // Logout
    await pages.home.logout();
    expect(await pages.login.isLoginFormVisible()).toBe(true);
  });


  // Test Case 3: Login User with incorrect email and password
  // 1-2. Launch browser and navigate to url 'http://automationexercise.com'
    // 3. Verify that home page is visible successfully
    // 4. Click on 'Signup / Login' button
    // 5. Verify 'Login to your account' is visible
    // 6. Enter incorrect email address and password
    // 7. Click 'login' button
    // 8. Verify error 'Your email or password is incorrect!' is visible
  test('should show error for incorrect email and password', async ({ pages }) => {
    await pages.home.navigateTo();
    await pages.home.assertHomePageLoaded();
    
    await pages.home.goToLogin();
    expect(await pages.login.isLoginFormVisible()).toBe(true);
    
    // Attempt login with incorrect credentials
    await pages.login.login('incorrect@email.com', 'wrongpassword');
    
    const errorMessage = await pages.login.getErrorMessage();
    expect(errorMessage).toContain('Your email or password is incorrect!');
  });


  // Test Case 5: Register User with existing email
  // 1-2. Launch browser and navigate to url 'http://automationexercise.com'
    // 3. Verify that home page is visible successfully
    // 4. Click on 'Signup / Login' button
    // 5. Verify 'New User Signup!' is visible
    // 6. Enter name and already registered email address
    // 7. Click 'Signup' button
    // 8. Verify error 'Email Address already exist!' is visible
  test('should show error for existing email during registration', async ({ pages }) => {
    await pages.home.navigateTo();
    await pages.home.assertHomePageLoaded();
    
    await pages.home.goToLogin();
    expect(await pages.signup.isNewUserSignupVisible()).toBe(true);
    
    // Try to signup with existing email
    await pages.signup.fillInitialSignupForm('Test User', 'testuser@example.com');
    
    const errorElement = pages.signup.page.locator('text="Email Address already exist!"');
    expect(await errorElement.isVisible()).toBe(true);
  });
}); 