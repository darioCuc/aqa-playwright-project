/**
 * Test data transformation and generation helpers
 * Focused on converting and generating test data for various test scenarios
 */
export class TestHelpers {
  /**
   * Transforms user data for address information
   */
  static getUserAddressInfo(userData: any) {
    return {
      firstName: userData.name.split(' ')[0],
      lastName: userData.name.split(' ')[1] || 'User',
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

  /**
   * Generate random test user data
   */
  static generateTestUser(prefix: string = 'test') {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8); // 6 random characters
    const uniqueId = `${timestamp}-${randomSuffix}`;
    
    return {
      name: `${prefix} User ${uniqueId}`,
      email: `${prefix}user+${uniqueId}@example.com`,
      password: 'password123'
    };
  }


} 