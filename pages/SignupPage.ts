import { BasePage } from './BasePage';

export class SignupPage extends BasePage {
  // Initial signup form elements
  nameInput = () => this.page.locator('input[data-qa="signup-name"]');
  emailInput = () => this.page.locator('input[data-qa="signup-email"]');
  signupButton = () => this.page.locator('button[data-qa="signup-button"]');
  newUserSignupText = () => this.page.locator('text=New User Signup!');
  errorMessage = () => this.page.locator('.signup-form p');

  // Account information form elements
  accountInfoHeader = () => this.page.locator('text=ENTER ACCOUNT INFORMATION');
  titleMr = () => this.page.locator('input[value="Mr"]');
  titleMrs = () => this.page.locator('input[value="Mrs"]');
  accountNameInput = () => this.page.locator('input[data-qa="name"]');
  accountEmailInput = () => this.page.locator('input[data-qa="email"]');
  passwordInput = () => this.page.locator('input[data-qa="password"]');
  
  // Date of birth dropdowns
  dayDropdown = () => this.page.locator('select[data-qa="days"]');
  monthDropdown = () => this.page.locator('select[data-qa="months"]');
  yearDropdown = () => this.page.locator('select[data-qa="years"]');
  
  // Checkboxes
  newsletterCheckbox = () => this.page.locator('input[data-qa="newsletter"]');
  offersCheckbox = () => this.page.locator('input[data-qa="optin"]');
  
  // Address information
  firstNameInput = () => this.page.locator('input[data-qa="first_name"]');
  lastNameInput = () => this.page.locator('input[data-qa="last_name"]');
  companyInput = () => this.page.locator('input[data-qa="company"]');
  addressInput = () => this.page.locator('input[data-qa="address"]');
  address2Input = () => this.page.locator('input[data-qa="address2"]');
  countryDropdown = () => this.page.locator('select[data-qa="country"]');
  stateInput = () => this.page.locator('input[data-qa="state"]');
  cityInput = () => this.page.locator('input[data-qa="city"]');
  zipcodeInput = () => this.page.locator('input[data-qa="zipcode"]');
  mobileNumberInput = () => this.page.locator('input[data-qa="mobile_number"]');
  
  // Create account button and success messages
  createAccountButton = () => this.page.locator('button[data-qa="create-account"]');
  accountCreatedText = () => this.page.locator('text=ACCOUNT CREATED!');
  continueButton = () => this.page.locator('a[data-qa="continue-button"]');
  
  // Delete account elements
  deleteAccountButton = () => this.page.locator('a[href="/delete_account"]');
  accountDeletedText = () => this.page.locator('text=ACCOUNT DELETED!');

  async navigateTo() {
    await this.page.goto('/login');
  }

  async isNewUserSignupVisible(): Promise<boolean> {
    return await this.newUserSignupText().isVisible();
  }

  async fillInitialSignupForm(name: string, email: string) {
    await this.nameInput().fill(name);
    await this.emailInput().fill(email);
    await this.signupButton().click();
  }

  async isAccountInfoFormVisible(): Promise<boolean> {
    return await this.accountInfoHeader().isVisible();
  }

  async fillAccountInformation(data: {
    title: 'Mr' | 'Mrs';
    name: string;
    email: string;
    password: string;
    day: string;
    month: string;
    year: string;
    newsletter?: boolean;
    offers?: boolean;
  }) {
    // Select title
    if (data.title === 'Mr') {
      await this.titleMr().check();
    } else {
      await this.titleMrs().check();
    }

    // Fill basic account info
    await this.accountNameInput().fill(data.name);
    await this.passwordInput().fill(data.password);
    
    // Select date of birth
    await this.dayDropdown().selectOption(data.day);
    await this.monthDropdown().selectOption(data.month);
    await this.yearDropdown().selectOption(data.year);
    
    // Handle checkboxes (check if they exist first)
    if (data.newsletter) {
      try {
        const newsletterExists = await this.newsletterCheckbox().count() > 0;
        if (newsletterExists) {
          await this.newsletterCheckbox().check();
        }
      } catch (error) {
        console.log('Newsletter checkbox not found or not interactable');
      }
    }
    if (data.offers) {
      try {
        const offersExists = await this.offersCheckbox().count() > 0;
        if (offersExists) {
          await this.offersCheckbox().check();
        }
      } catch (error) {
        console.log('Offers checkbox not found or not interactable');
      }
    }
  }

  async fillAddressInformation(data: {
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
  }) {
    await this.firstNameInput().fill(data.firstName);
    await this.lastNameInput().fill(data.lastName);
    
    if (data.company) {
      await this.companyInput().fill(data.company);
    }
    
    await this.addressInput().fill(data.address);
    
    if (data.address2) {
      await this.address2Input().fill(data.address2);
    }
    
    await this.countryDropdown().selectOption(data.country);
    await this.stateInput().fill(data.state);
    await this.cityInput().fill(data.city);
    await this.zipcodeInput().fill(data.zipcode);
    await this.mobileNumberInput().fill(data.mobileNumber);
  }

  async createAccount() {
    await this.createAccountButton().click();
  }

  async isAccountCreated(): Promise<boolean> {
    return await this.accountCreatedText().isVisible();
  }

  async clickContinue() {
    await this.continueButton().click();
  }

  /**
   * Assert that account info form is visible
   */
  async assertAccountInfoFormVisible(): Promise<void> {
    const isVisible = await this.isAccountInfoFormVisible();
    if (!isVisible) {
      throw new Error('Account information form is not visible');
    }
  }

  /**
   * Assert that account creation was successful
   */
  async assertAccountCreated(): Promise<void> {
    const isCreated = await this.isAccountCreated();
    if (!isCreated) {
      throw new Error('Account creation confirmation not visible');
    }
  }

  /**
   * Assert that account deletion was successful
   */
  async assertAccountDeleted(): Promise<void> {
    const isDeleted = await this.isAccountDeleted();
    if (!isDeleted) {
      throw new Error('Account deletion confirmation not visible');
    }
  }

  async deleteAccount() {
    await this.deleteAccountButton().click();
  }

  async isAccountDeleted(): Promise<boolean> {
    return await this.accountDeletedText().isVisible();
  }

  async getErrorMessage(): Promise<string | null> {
    return await this.errorMessage().textContent();
  }

  async isSignupFormVisible(): Promise<boolean> {
    return await this.nameInput().isVisible() &&
           await this.emailInput().isVisible() &&
           await this.signupButton().isVisible();
  }
} 