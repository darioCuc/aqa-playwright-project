export interface UserData {
  name: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company?: string;
  address: string;
  address2?: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
}

export interface AccountInfo {
  title: 'Mr' | 'Mrs';
  name: string;
  email: string;
  password: string;
  day: string;
  month: string;
  year: string;
  newsletter?: boolean;
  offers?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Product-related interfaces
export interface ProductSearchData {
  searchTerm: string;
  expectedResultsCount?: number;
}

export interface ProductReviewData {
  name: string;
  email: string;
  review: string;
}

export interface CategoryData {
  category: string;
  subcategory: string;
  expectedText: string;
}

export interface BrandData {
  brandName: string;
}

// Shopping cart interfaces
export interface CartProductData {
  productId: number;
  quantity: number;
  expectedPrice?: string;
}

// Checkout and payment interfaces
export interface PaymentData {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expirationMonth: string;
  expirationYear: string;
}

export interface CheckoutCommentData {
  comment: string;
}

// Site features interfaces
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  fileName?: string;
}

export interface SubscriptionData {
  email: string;
}

// API test interfaces
export interface APIProductSearchData {
  searchProduct: string;
}

export interface APIUserAccountData {
  name: string;
  email: string;
  password: string;
  title: string;
  birth_date: string;
  birth_month: string;
  birth_year: string;
  firstname: string;
  lastname: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  zipcode: string;
  state: string;
  city: string;
  mobile_number: string;
}

export class UserDataGenerator {
  static generateUniqueUser(): UserData {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8); // 6 random characters
    const uniqueId = `${timestamp}-${randomSuffix}`;
    
    return {
      name: `Test Automation User ${uniqueId}`,
      email: `testuser+${uniqueId}@example.com`,
      password: 'SecurePassword123!',
      firstName: 'Test',
      lastName: 'Automation',
      company: 'Test Company',
      address: '123 Test Street',
      address2: 'Apt 306A',
      country: 'Canada',
      state: 'Alberta',
      city: 'Edmonton',
      zipcode: 'T4X 0X4',
      mobileNumber: '+1234567890'
    };
  }

  static generateAccountInfo(userData: UserData): AccountInfo {
    return {
      title: 'Mr',
      name: userData.name,
      email: userData.email,
      password: userData.password,
      day: '15',
      month: 'January',
      year: '1990',
      newsletter: true,
      offers: true
    };
  }

  /**
   * Gets valid login credentials for testing
   */
  static getValidLoginCredentials(): LoginCredentials {
    return {
      email: 'testuser+dario@example.com',
      password: 'password123'
    };
  }

  /**
   * Gets invalid login credentials for testing
   */
  static getInvalidLoginCredentials(): LoginCredentials {
    return {
      email: 'invalid@example.com', 
      password: 'wrongpassword'
    };
  }

  /**
   * Gets existing email for testing registration with existing email
   */
  static getExistingEmailForRegistration(): string {
    return 'existing.user@example.com';
  }

  // Pre-defined test users for different scenarios
  static readonly VALID_USER: UserData = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: 'validpassword123',
    firstName: 'John',
    lastName: 'Doe',
    company: 'Test Corp',
    address: '456 Main Street',
    country: 'United States',
    state: 'New York',
    city: 'New York',
    zipcode: '10001',
    mobileNumber: '+1987654321'
  };

  static readonly INVALID_USER = {
    email: 'invalid@example.com',
    password: 'wrongpassword'
  };

  static readonly EXISTING_USER = {
    name: 'Existing User',
    email: 'existing@example.com'
  };

  /**
   * Product-related test data generators
   */
  static getProductSearchData(): ProductSearchData {
    return {
      searchTerm: 'tshirt',
      expectedResultsCount: 3
    };
  }

  static getProductReviewData(): ProductReviewData {
    return {
      name: 'John Reviewer',
      email: 'reviewer@example.com',
      review: 'This is a great product! I highly recommend it for anyone looking for quality and style.'
    };
  }



  /**
   * Shopping cart test data generators
   */
  static getCartProductsData(): CartProductData[] {
    return [
      { productId: 1, quantity: 1, expectedPrice: 'Rs. 500' },
      { productId: 2, quantity: 1, expectedPrice: 'Rs. 400' }
    ];
  }

  static getSingleProductCartData(): CartProductData {
    return {
      productId: 1,
      quantity: 4,
      expectedPrice: 'Rs. 2000'
    };
  }

  /**
   * Checkout and payment test data generators
   */
  static getPaymentData(): PaymentData {
    return {
      nameOnCard: 'John Doe',
      cardNumber: '4242424242424242',
      cvc: '123',
      expirationMonth: '12',
      expirationYear: '2027'
    };
  }

  static getCheckoutComment(): CheckoutCommentData {
    return {
      comment: 'Please deliver during business hours. Thank you!'
    };
  }

  /**
   * Site features test data generators
   */
  static getContactFormData(): ContactFormData {
    return {
      name: 'Test User',
      email: 'testuser@example.com',
      subject: 'Test Contact Form',
      message: 'This is a test message for the contact form functionality. Please ignore this message.',
      fileName: 'test-file.txt'
    };
  }

  static getSubscriptionEmail(): SubscriptionData {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8); // 6 random characters
    const uniqueId = `${timestamp}-${randomSuffix}`;
    
    return {
      email: `subscribe+${uniqueId}@example.com`
    };
  }

  /**
   * API test data generators
   */
  static getAPIProductSearchData(): APIProductSearchData {
    return {
      searchProduct: 'top'
    };
  }

  static getAPIUserAccountData(): APIUserAccountData {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8); // 6 random characters
    const uniqueId = `${timestamp}-${randomSuffix}`;
    
    return {
      name: `API Test User ${uniqueId}`,
      email: `apitest+${uniqueId}@example.com`,
      password: 'password123',
      title: 'Mr',
      birth_date: '15',
      birth_month: '6',
      birth_year: '1990',
      firstname: 'API',
      lastname: 'User',
      company: 'Test Company',
      address1: '123 Test Street',
      address2: 'Apt 4B',
      country: 'United States',
      zipcode: '12345',
      state: 'California',
      city: 'Los Angeles',
      mobile_number: '+1234567890'
    };
  }

  static getAPILoginCredentials(): LoginCredentials {
    return {
      email: 'testuser+dario@example.com', // Use same credentials as E2E tests
      password: 'password123'
    };
  }

  static getAPIInvalidLoginCredentials(): LoginCredentials {
    return {
      email: 'invalid@example.com',
      password: 'wrongpassword'
    };
  }
} 