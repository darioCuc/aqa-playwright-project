import { test, expect } from '../../helpers/fixtures';
import { UserDataGenerator } from '../../helpers/user-data';
import { APIHelpers } from '../../helpers/api-helpers';

// Authentication API Test Suite
// Groups all user authentication and login verification related API test cases

test.describe('Authentication API', () => {

  // API 7: POST To Verify Login with valid details
  // 1. Prepare valid login credentials (email, password)
  // 2. Send POST request to /api/verifyLogin with email and password parameters
  // 3. Verify response code is 200
  // 4. Verify response message is "User exists!"
  test('POST verify login with valid credentials returns 200', async ({ request }) => {
    // Get valid login credentials
    const loginCredentials = UserDataGenerator.getAPILoginCredentials();
    
    // API URL: https://automationexercise.com/api/verifyLogin
    // Request Method: POST
    // Request Parameters: email, password
    // Response Code: 200
    // Response Message: User exists!
    
    const response = await request.post('https://automationexercise.com/api/verifyLogin', {
      form: {
        email: loginCredentials.email,
        password: loginCredentials.password
      }
    });
    
    await APIHelpers.assertAPIUserExists(response);
  });

  // API 10: POST To Verify Login with invalid details
  // 1. Prepare invalid login credentials (non-existent email, wrong password)
  // 2. Send POST request to /api/verifyLogin with invalid email and password parameters
  // 3. Verify response code is 404
  // 4. Verify response message is "User not found!"
  test('POST verify login with invalid credentials returns 404', async ({ request }) => {
    // Get invalid login credentials
    const invalidCredentials = UserDataGenerator.getAPIInvalidLoginCredentials();
    
    // API URL: https://automationexercise.com/api/verifyLogin
    // Request Method: POST
    // Request Parameters: email, password (invalid values)
    // Response Code: 404
    // Response Message: User not found!
    
    const response = await request.post('https://automationexercise.com/api/verifyLogin', {
      form: {
        email: invalidCredentials.email,
        password: invalidCredentials.password
      }
    });
    
    await APIHelpers.assertAPIUserNotFound(response);
  });

  // API 9: DELETE To Verify Login
  // 1. Send DELETE request to /api/verifyLogin endpoint
  // 2. Verify response code is 405
  // 3. Verify response message is "This request method is not supported."
  test('DELETE verify login returns 405 method not supported', async ({ request }) => {
    // API URL: https://automationexercise.com/api/verifyLogin
    // Request Method: DELETE
    // Response Code: 405
    // Response Message: This request method is not supported.
    
    const response = await request.delete('https://automationexercise.com/api/verifyLogin');
    await APIHelpers.assertAPIMethodNotSupported(response);
  });
}); 