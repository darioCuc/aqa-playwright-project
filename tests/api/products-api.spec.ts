import { test, expect } from '../../helpers/fixtures';
import { UserDataGenerator } from '../../helpers/user-data';
import { APIHelpers } from '../../helpers/api-helpers';

// Products API Test Suite
// Groups all product and brand related API test cases

test.describe('Products API', () => {

  // API 1: Get All Products List
  // 1. Send GET request to /api/productsList endpoint
  // 2. Verify response code is 200
  // 3. Verify response contains all products list in JSON format
  test('GET all products list returns 200', async ({ request }) => {
    // API URL: https://automationexercise.com/api/productsList
    // Request Method: GET
    // Response Code: 200
    // Response JSON: All products list
    
    const response = await request.get('https://automationexercise.com/api/productsList');
    await APIHelpers.assertAPIProductsList(response);
  });

  // API 3: Get All Brands List
  // 1. Send GET request to /api/brandsList endpoint
  // 2. Verify response code is 200
  // 3. Verify response contains all brands list in JSON format
  test('GET all brands list returns 200', async ({ request }) => {
    // API URL: https://automationexercise.com/api/brandsList
    // Request Method: GET
    // Response Code: 200
    // Response JSON: All brands list
    
    const response = await request.get('https://automationexercise.com/api/brandsList');
    await APIHelpers.assertAPIBrandsList(response);
  });

  // API 5: POST To Search Product
  // 1. Prepare search product data (search term like 'top', 'tshirt', 'jean')
  // 2. Send POST request to /api/searchProduct with search_product parameter
  // 3. Verify response code is 200
  // 4. Verify response contains searched products list in JSON format
  test('POST search product with parameter returns 200', async ({ request }) => {
    // Get search data
    const searchData = UserDataGenerator.getAPIProductSearchData();
    
    // API URL: https://automationexercise.com/api/searchProduct
    // Request Method: POST
    // Request Parameter: search_product (For example: top, tshirt, jean)
    // Response Code: 200
    // Response JSON: Searched products list
    
    const response = await request.post('https://automationexercise.com/api/searchProduct', {
      form: {
        search_product: searchData.searchProduct
      }
    });
    
    await APIHelpers.assertAPISearchResults(response, searchData.searchProduct);
  });

  // API 6: POST To Search Product without search_product parameter
  // 1. Send POST request to /api/searchProduct without search_product parameter
  // 2. Verify response code is 400
  // 3. Verify response message is "Bad request, search_product parameter is missing in POST request."
  test('POST search product without parameter returns 400', async ({ request }) => {
    // API URL: https://automationexercise.com/api/searchProduct
    // Request Method: POST
    // Response Code: 400
    // Response Message: Bad request, search_product parameter is missing in POST request.
    
    const response = await request.post('https://automationexercise.com/api/searchProduct');
    
    await APIHelpers.assertAPIBadRequest(response, 'Bad request, search_product parameter is missing in POST request.');
  });
}); 