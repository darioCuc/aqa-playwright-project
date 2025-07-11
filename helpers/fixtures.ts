import { test as base, expect } from '@playwright/test';
import { 
  HomePage, 
  LoginPage, 
  SignupPage, 
  ProductCatalogPage, 
  ProductPage, 
  CartPage, 
  CheckoutPage,
  ContactPage,
  TestCasesPage 
} from '../pages';
import { DownloadCleanup } from './download-cleanup';

// Unified page access object
type PageObjects = {
  home: HomePage;
  login: LoginPage;
  signup: SignupPage;
  products: ProductCatalogPage;
  product: ProductPage;
  cart: CartPage;
  checkout: CheckoutPage;
  contact: ContactPage;
  testCases: TestCasesPage;
};

// Define custom fixture types
type CustomFixtures = {
  pages: PageObjects;
};

// Extend base test with custom fixtures
export const test = base.extend<CustomFixtures>({
  // All page objects without authentication
  pages: async ({ page }, use) => {
    // Setup: Ensure downloads directory exists and is clean
    await DownloadCleanup.ensureDownloadsDir();
    await DownloadCleanup.cleanupAllDownloads();
    
    const pageObjects: PageObjects = {
      home: new HomePage(page),
      login: new LoginPage(page),
      signup: new SignupPage(page),
      products: new ProductCatalogPage(page),
      product: new ProductPage(page),
      cart: new CartPage(page),
      checkout: new CheckoutPage(page),
      contact: new ContactPage(page),
      testCases: new TestCasesPage(page),
    };
    
    await use(pageObjects);
    
    // Teardown: Clean up downloads after test
    await DownloadCleanup.cleanupAllDownloads();
  },
});

export { expect }; 