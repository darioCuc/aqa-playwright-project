import { expect } from '@playwright/test';

/**
 * API-specific assertion helpers for validating API responses
 * Handles all API response validation logic with proper error handling
 */
export class APIHelpers {
  /**
   * Generic API response validation with configurable expectations
   */
  static async validateAPIResponse(response: any, expectations: {
    expectedStatus: number;
    expectedContentType?: string;
    requiredFields?: string[];
    expectedMessage?: string;
  }): Promise<void> {
    // Status check
    expect(response.status(), `API returned status ${response.status()}, expected ${expectations.expectedStatus}`).toBe(expectations.expectedStatus);
    
    // Content type check
    if (expectations.expectedContentType) {
      const contentType = response.headers()['content-type'];
      expect(contentType, 'API response content type mismatch').toContain(expectations.expectedContentType);
    }
    
    // Parse and validate response body
    let responseBody;
    try {
      responseBody = await response.json();
    } catch (error) {
      throw new Error(`Failed to parse API response as JSON: ${error}`);
    }
    
    // Required fields check
    if (expectations.requiredFields) {
      for (const field of expectations.requiredFields) {
        expect(responseBody).toHaveProperty(field, `API response missing required field: ${field}`);
      }
    }
    
    // Message check
    if (expectations.expectedMessage) {
      expect(responseBody.message || responseBody.msg || responseBody.error, 'API response message mismatch').toContain(expectations.expectedMessage);
    }
  }

  /**
   * Assert API response for successful user login
   */
  static async assertAPIUserExists(response: any): Promise<void> {
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    // The API might return 404 in responseCode even with 200 status
    if (responseBody.responseCode === 404) {
      throw new Error(`User not found: ${responseBody.message}`);
    }
    expect(responseBody.responseCode).toBe(200);
    expect(responseBody.message).toContain('User exists!');
  }

  /**
   * Assert API response for user not found
   */
  static async assertAPIUserNotFound(response: any): Promise<void> {
    expect(response.status()).toBe(200); // API returns 200 status with 404 responseCode
    const responseBody = await response.json();
    expect(responseBody.responseCode).toBe(404);
    expect(responseBody.message).toContain('User not found!');
  }

  /**
   * Assert API response for method not supported
   */
  static async assertAPIMethodNotSupported(response: any): Promise<void> {
    expect(response.status()).toBe(200); // API returns 200 status with 405 responseCode
    const responseBody = await response.json();
    expect(responseBody.responseCode).toBe(405);
    expect(responseBody.message).toContain('This request method is not supported.');
  }

  /**
   * Assert API response for bad request (missing parameters)
   */
  static async assertAPIBadRequest(response: any, expectedMessage: string): Promise<void> {
    expect(response.status()).toBe(200); // API returns 200 status with 400 responseCode
    const responseBody = await response.json();
    expect(responseBody.responseCode).toBe(400);
    expect(responseBody.message).toContain(expectedMessage);
  }

  /**
   * Assert API response for products list
   */
  static async assertAPIProductsList(response: any): Promise<void> {
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.responseCode).toBe(200);
    expect(responseBody.products).toBeDefined();
    expect(Array.isArray(responseBody.products)).toBe(true);
    expect(responseBody.products.length).toBeGreaterThan(0);
    
    // Verify first product has expected structure
    const firstProduct = responseBody.products[0];
    expect(firstProduct).toHaveProperty('id');
    expect(firstProduct).toHaveProperty('name');
    expect(firstProduct).toHaveProperty('price');
  }

  /**
   * Assert API response for brands list
   */
  static async assertAPIBrandsList(response: any): Promise<void> {
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.responseCode).toBe(200);
    expect(responseBody.brands).toBeDefined();
    expect(Array.isArray(responseBody.brands)).toBe(true);
    expect(responseBody.brands.length).toBeGreaterThan(0);
    
    // Verify first brand has expected structure
    const firstBrand = responseBody.brands[0];
    expect(firstBrand).toHaveProperty('id');
    expect(firstBrand).toHaveProperty('brand');
  }

  /**
   * Assert API response for search results
   */
  static async assertAPISearchResults(response: any, searchTerm: string): Promise<void> {
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.responseCode).toBe(200);
    expect(responseBody.products).toBeDefined();
    expect(Array.isArray(responseBody.products)).toBe(true);
    
    // Verify that search results contain the search term in product names
    if (responseBody.products.length > 0) {
      const hasMatchingProduct = responseBody.products.some((product: any) => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      expect(hasMatchingProduct).toBe(true);
    }
  }

  /**
   * Assert API response for successful user creation
   */
  static async assertAPIUserCreated(response: any): Promise<void> {
    expect(response.status()).toBe(200); // API returns 200 status with 201 responseCode
    const responseBody = await response.json();
    expect(responseBody.responseCode).toBe(201);
    expect(responseBody.message).toContain('User created!');
  }
} 