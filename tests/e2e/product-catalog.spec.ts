import { test, expect } from '../../helpers/fixtures';
import { UserDataGenerator } from '../../helpers/user-data';

// Product Catalog Test Suite
// Groups all product browsing, searching, and catalog related test cases

test.describe('Product Catalog', () => {

  // Test Case 8: Verify All Products and product detail page
  // 1-2. Launch browser and navigate to url 'http://automationexercise.com'
  // 3. Verify that home page is visible successfully
  // 4. Click on 'Products' button
  // 5. Verify user is navigated to ALL PRODUCTS page successfully
  // 6. The products list is visible
  // 7. Click on 'View Product' of first product
  // 8. User is landed to product detail page
  // 9. Verify that detail detail is visible: product name, category, price, availability, condition, brand
  test('View all products and product details', async ({ pages }) => {
    await pages.home.navigateTo();
    await pages.home.assertHomePageLoaded();
    await pages.home.goToProducts();
    await pages.products.assertPageLoaded();
    await pages.products.viewFirstProduct();
    await pages.product.assertProductDetailPageLoaded();
  });


  // Test Case 18: View Category Products
  // 1-2. Launch browser and navigate to url 'http://automationexercise.com'
  // 3. Verify that categories are visible on left side bar
  // 4. Click on 'Women' category
  // 5. Click on any category link under 'Women' category, for example: Dress
  // 6. Verify that category page is displayed and confirm text 'WOMEN - DRESS PRODUCTS'
  // 7. On left side bar, click on any sub-category link of 'Men' category
  // 8. Verify that user is navigated to that category page
  test('Browse products by category', async ({ pages }) => {
    await pages.home.navigateTo();
    await pages.home.assertHomePageLoaded();
    await pages.home.goToProducts();
    await pages.products.assertPageLoaded();
    
    // Verify that categories are visible on left side bar
    const categorySection = pages.products.page.locator('.left-sidebar #accordian');
    expect(await categorySection.isVisible()).toBe(true);
    
    await pages.products.selectCategory('Women', 'Dress');
    await pages.products.assertCategoryPageLoaded('WOMEN - DRESS PRODUCTS');
    await pages.products.selectCategory('Men', 'Tshirts');
    await pages.products.assertCategoryPageLoaded('MEN - TSHIRTS PRODUCTS');
  });

  // Test Case 19: View & Cart Brand Products
  // 1-2. Launch browser and navigate to url 'http://automationexercise.com'
  // 3. Click on 'Products' button
  // 4. Verify that Brands are visible on left side bar
  // 5. Click on any brand name
  // 6. Verify that user is navigated to brand page and brand products are displayed
  // 7. On left side bar, click on any other brand link
  // 8. Verify that user is navigated to that brand page and can see products
  test('Browse products by brand', async ({ pages }) => {
    await pages.home.navigateTo();
    await pages.home.goToProducts();
    await pages.products.assertPageLoaded();
    
    // Verify that Brands are visible on left side bar
    const brandSection = pages.products.page.locator('.left-sidebar .brands_products');
    expect(await brandSection.isVisible()).toBe(true);
    
    const availableBrands = await pages.products.getAvailableBrands();
    expect(availableBrands.length).toBeGreaterThan(0);
    
    // Click on first brand name and verify brand page
    const firstBrand = availableBrands[0];
    await pages.products.selectBrand(firstBrand);
    await pages.products.assertBrandPageLoaded(firstBrand);
    
    // Click on second brand name and verify navigation
    if (availableBrands.length > 1) {
      const secondBrand = availableBrands[1];
      await pages.products.selectBrand(secondBrand);
      await pages.products.assertBrandPageLoaded(secondBrand);
    }
  });

  // Test Case 21: Add review on product
  // 1-2. Launch browser and navigate to url 'http://automationexercise.com'
  // 3. Click on 'Products' button
  // 4. Verify user is navigated to ALL PRODUCTS page successfully
  // 5. Click on 'View Product' button
  // 6. Verify 'Write Your Review' is visible
  // 7. Enter name, email and review
  // 8. Click 'Submit' button
  // 9. Verify success message 'Thank you for your review.'
  test('Add product review', async ({ pages }) => {
    // Get review test data
    const reviewData = UserDataGenerator.getProductReviewData();
    
    await pages.home.navigateTo();
    await pages.home.goToProducts();
    await pages.products.assertPageLoaded();

    await pages.products.viewFirstProduct();
    expect(await pages.product.isWriteReviewVisible()).toBe(true);
    await pages.product.submitReview(reviewData.name, reviewData.email, reviewData.review);
    await pages.product.assertReviewSubmitted();
  });
}); 