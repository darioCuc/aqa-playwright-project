import { BasePage } from './BasePage';
import { ConsentHelper } from '../helpers/consent-helper';

export class ContactPage extends BasePage {
  // Contact form elements
  nameInput = () => this.page.locator('input[data-qa="name"]');
  emailInput = () => this.page.locator('input[data-qa="email"]');
  subjectInput = () => this.page.locator('input[data-qa="subject"]');
  messageTextArea = () => this.page.locator('textarea[data-qa="message"]');
  uploadFileInput = () => this.page.locator('input[name="upload_file"]');
  submitButton = () => this.page.locator('input[data-qa="submit-button"]');
  
  // Page elements
  contactUsHeader = () => this.page.locator('text=Contact Us');
  getInTouchSection = () => this.page.locator('.contact-form h2:has-text("Get In Touch")');
  successMessage = () => this.page.locator('.contact-form .status.alert.alert-success');
  homeButton = () => this.page.locator('#form-section').getByRole('link', { name: ' Home' });
  
  // Contact information
  contactInfoSection = () => this.page.locator('.contact-info');

  async navigateTo(): Promise<void> {
    await this.page.goto('/contact_us');
    
    // Handle consent modal using dedicated helper
    const consentHelper = new ConsentHelper(this.page);
    await consentHelper.dismissConsentModal();
  }

  async isContactPageLoaded(): Promise<boolean> {
    return await this.contactUsHeader().isVisible() &&
           await this.getInTouchSection().isVisible();
  }

  async fillContactForm(contactData: {
    name: string;
    email: string;
    subject: string;
    message: string;
    filePath?: string;
  }): Promise<void> {
    await this.nameInput().fill(contactData.name);
    await this.emailInput().fill(contactData.email);
    await this.subjectInput().fill(contactData.subject);
    await this.messageTextArea().fill(contactData.message);
    
    if (contactData.filePath) {
      await this.uploadFileInput().setInputFiles(contactData.filePath);
    }
  }

  async submitForm(): Promise<void> {
    // Handle potential dialog/alert when submitting
    this.page.once('dialog', dialog => dialog.accept());
    await this.submitButton().click();
    await this.page.waitForTimeout(1000);
  }

  async getSuccessMessage(): Promise<string> {
    return await this.successMessage().textContent() || '';
  }

  async isSuccessMessageVisible(): Promise<boolean> {
    await this.successMessage().waitFor({ state: 'visible' });
    return await this.successMessage().isVisible();
  }

  async clickHomeButton(): Promise<void> {
    await this.homeButton().click();
  }

  async isGetInTouchVisible(): Promise<boolean> {
    return await this.getInTouchSection().isVisible();
  }

  async hasContactInfo(): Promise<boolean> {
    return await this.contactInfoSection().isVisible();
  }

  async clearForm(): Promise<void> {
    await this.nameInput().clear();
    await this.emailInput().clear();
    await this.subjectInput().clear();
    await this.messageTextArea().clear();
  }

  async getFormValidationErrors(): Promise<string[]> {
    const errors: string[] = [];
    
    // Check for HTML5 validation messages
    const nameValidation = await this.nameInput().evaluate(el => (el as HTMLInputElement).validationMessage);
    const emailValidation = await this.emailInput().evaluate(el => (el as HTMLInputElement).validationMessage);
    const subjectValidation = await this.subjectInput().evaluate(el => (el as HTMLInputElement).validationMessage);
    const messageValidation = await this.messageTextArea().evaluate(el => (el as HTMLTextAreaElement).validationMessage);
    
    if (nameValidation) errors.push(`Name: ${nameValidation}`);
    if (emailValidation) errors.push(`Email: ${emailValidation}`);
    if (subjectValidation) errors.push(`Subject: ${subjectValidation}`);
    if (messageValidation) errors.push(`Message: ${messageValidation}`);
    
    return errors;
  }

  async isFormValid(): Promise<boolean> {
    const errors = await this.getFormValidationErrors();
    return errors.length === 0;
  }

  async uploadFile(filePath: string): Promise<void> {
    await this.uploadFileInput().setInputFiles(filePath);
  }

  async getUploadedFileName(): Promise<string> {
    const fileInput = this.uploadFileInput();
    return await fileInput.evaluate(el => {
      const input = el as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        return input.files[0].name;
      }
      return '';
    });
  }
} 