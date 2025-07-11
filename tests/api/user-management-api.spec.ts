import { test, expect } from '../../helpers/fixtures';
import { UserDataGenerator } from '../../helpers/user-data';
import { APIHelpers } from '../../helpers/api-helpers';

// User Management API Test Suite
// Groups all user account management related API test cases

test.describe('User Management API', () => {

  // API 11: POST To Create/Register User Account
  // 1. Prepare user account data (name, email, password, title, birth details, address details, etc.)
  // 2. Send POST request to /api/createAccount with all required parameters
  // 3. Verify response code is 201
  // 4. Verify response message is "User created!"
  test('POST create user account returns 201', async ({ request }) => {
    // Get user account data
    const userAccountData = UserDataGenerator.getAPIUserAccountData();
    
    // API URL: https://automationexercise.com/api/createAccount
    // Request Method: POST
    // Request Parameters: name, email, password, title (for example: Mr, Mrs, Miss), birth_date, birth_month, birth_year, firstname, lastname, company, address1, address2, country, zipcode, state, city, mobile_number
    // Response Code: 201
    // Response Message: User created!
    
    const response = await request.post('https://automationexercise.com/api/createAccount', {
      form: {
        name: userAccountData.name,
        email: userAccountData.email,
        password: userAccountData.password,
        title: userAccountData.title,
        birth_date: userAccountData.birth_date,
        birth_month: userAccountData.birth_month,
        birth_year: userAccountData.birth_year,
        firstname: userAccountData.firstname,
        lastname: userAccountData.lastname,
        company: userAccountData.company,
        address1: userAccountData.address1,
        address2: userAccountData.address2,
        country: userAccountData.country,
        zipcode: userAccountData.zipcode,
        state: userAccountData.state,
        city: userAccountData.city,
        mobile_number: userAccountData.mobile_number
      }
    });
    
    await APIHelpers.assertAPIUserCreated(response);
  });
}); 