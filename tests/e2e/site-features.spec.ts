import { test, expect } from '../../helpers/fixtures';
import { UserDataGenerator } from '../../helpers/user-data';
import { E2EValidators } from '../../helpers/e2e-validators';

// Site Features Test Suite
// Groups all additional site functionality like contact, subscriptions, navigation, and UI features

test.describe('Site Features', () => {

  // Test Case 6: Contact Us Form
  // 1-2. Launch browser and navigate to url 'http://automationexercise.com'
    // 3. Verify that home page is visible successfully
    // 4. Click on 'Contact Us' button
    // 5. Verify 'GET IN TOUCH' is visible
    // 6. Enter name, email, subject and message
    // 7. Upload file
    // 8. Click 'Submit' button
    // 9. Click OK button
    // 10. Verify success message 'Success! Your details have been submitted successfully.' is visible
    // 11. Click 'Home' button and verify that landed to home page successfully
  test('Submit contact form with file upload', async ({ pages }) => {
    // Get contact form data
    const contactData = UserDataGenerator.getContactFormData();
    
    await pages.home.navigateTo();
    await pages.home.assertHomePageLoaded();
    await pages.home.goToContact();
    
    expect(await pages.contact.isGetInTouchVisible()).toBe(true);
    
    // Enter name, email, subject and message & Upload a file
    await pages.contact.fillContactForm({
      name: contactData.name,
      email: contactData.email,
      subject: contactData.subject,
      message: contactData.message,
      filePath: './assets/test-upload.txt'
    });
    
    // Click 'Submit' button
    await pages.contact.submitForm();
    
    // Click OK button (handled automatically by submitForm method)
    // Verify success message 'Success! Your details have been submitted successfully.' is visible
    expect(await pages.contact.isSuccessMessageVisible()).toBe(true);
    const successMessage = await pages.contact.getSuccessMessage();
    expect(successMessage).toContain('Success! Your details have been submitted successfully.');
    
    // Click 'Home' button and verify that landed to home page successfully
    await pages.contact.clickHomeButton();
    await pages.home.assertHomePageLoaded();
  });

  
  // Test Case 7: Verify Test Cases Page
  // 1-2. Launch browser and navigate to url 'http://automationexercise.com'
  // 3. Verify that home page is visible successfully
  // 4. Click on 'Test Cases' button
  // 5. Verify user is navigated to test cases page successfully
  test('Navigate to test cases page', async ({ pages }) => {
    await pages.home.navigateTo();
    await pages.home.assertHomePageLoaded();
    
    await pages.home.goToTestCasesPage();
    
    // Verify user is navigated to test cases page successfully
    expect(await pages.testCases.isTestCasesPageLoaded()).toBe(true);
    expect(await pages.testCases.verifyTestCasesPageUrl()).toBe(true);
    expect(await pages.testCases.isTestCasesListVisible()).toBe(true);
  });


  // Test Case 10: Verify Subscription in home page
  // 1-2. Launch browser and navigate to url 'http://automationexercise.com'
  // 3. Verify that home page is visible successfully
  // 4. Scroll down to footer
  // 5. Verify text 'SUBSCRIPTION'
  // 6. Enter email address in input and click arrow button
  // 7. Verify success message 'You have been successfully subscribed!' is visible
  test('Subscribe to newsletter from home page', async ({ pages }) => {
    // Get subscription data
    const subscriptionData = UserDataGenerator.getSubscriptionEmail();
    
    await pages.home.navigateTo();
    await pages.home.assertHomePageLoaded();
    
    // Scroll down to footer
    await pages.home.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await E2EValidators.assertSubscriptionVisible(pages.home.page);
    
    // Enter email address in input and click arrow button and verify success message
    await pages.home.subscribeWithEmail(subscriptionData.email);
    expect(await pages.home.isSubscriptionSuccessMessageVisible()).toBe(true);
    const successMessage = await pages.home.getSubscriptionSuccessMessage();
    expect(successMessage).toContain('You have been successfully subscribed!');
  });

}); 