# AQA Playwright Project

[![Playwright Tests](https://github.com/your-username/aqa-playwright-project/actions/workflows/playwright.yml/badge.svg)](https://github.com/your-username/aqa-playwright-project/actions/workflows/playwright.yml)

A comprehensive Playwright test automation framework for [AutomationExercise.com](https://automationexercise.com) - Academic Final Paper Implementation. This project demonstrates modern test automation practices using TypeScript, Playwright, and the Page Object Model pattern.

## 🎯 Project Overview

This test automation framework provides complete coverage for AutomationExercise.com, including:
- **25 comprehensive test cases** covering E2E and API testing
- **Clean architecture** with Page Object Model implementation
- **Cross-browser testing** (Chromium, Firefox, WebKit)
- **Parallel test execution** for faster feedback
- **Detailed reporting** with traces, screenshots, and videos
- **CI/CD integration** with GitHub Actions

## ✨ Features

### Test Coverage
- **User Authentication**: Registration, login, logout, account management
- **Product Catalog**: Product browsing, searching, filtering by category/brand
- **Shopping Cart**: Add/remove products, quantity management, cart persistence
- **Checkout Process**: Complete order flows with different user scenarios
- **Site Features**: Contact forms, subscriptions, navigation testing
- **API Testing**: Product APIs, user management, authentication endpoints

### Technical Features
- **TypeScript**: Full type safety and modern JavaScript features
- **Page Object Model**: Maintainable and reusable page abstractions
- **Helper Classes**: Specialized utilities for API, E2E, and data management
- **Fixtures**: Centralized test setup and page object management
- **Data Generators**: Dynamic test data creation with uniqueness guarantees
- **Error Handling**: Robust error handling and debugging capabilities

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/aqa-playwright-project.git
   cd aqa-playwright-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install Playwright browsers**
   ```bash
   npm run install:browsers
   # or
   npx playwright install
   ```

4. **Install system dependencies (Linux/CI)**
   ```bash
   npm run install:deps
   # or
   npx playwright install-deps
   ```

### Quick Start

```bash
# Run all tests
npm test

# Run tests with UI mode (interactive)
npm run test:ui

# Run tests in headed mode (visible browser)
npm run test:headed

# Run only E2E tests
npm run test:e2e

# Run only API tests
npm run test:api

# View test report
npm run report
```

## 📁 Project Structure

```
aqa-playwright-project/
├── .github/
│   └── workflows/
│       └── playwright.yml          # GitHub Actions CI/CD pipeline
├── assets/
│   └── test-upload.txt            # Test files for upload functionality
├── helpers/
│   ├── api-helpers.ts             # API testing utilities
│   ├── consent-helper.ts          # Cookie consent handling
│   ├── download-cleanup.ts        # File download management
│   ├── e2e-validators.ts          # E2E validation utilities
│   ├── fixtures.ts                # Test fixtures and setup
│   ├── test-helpers.ts            # Data transformation helpers
│   ├── user-data.ts               # Test data generators
│   └── index.ts                   # Helper exports
├── pages/
│   ├── BasePage.ts                # Base page class
│   ├── HomePage.ts                # Home page object
│   ├── LoginPage.ts               # Login page object
│   ├── SignupPage.ts              # Signup page object
│   ├── ProductCatalogPage.ts      # Product catalog page object
│   ├── ProductPage.ts             # Product detail page object
│   ├── CartPage.ts                # Shopping cart page object
│   ├── CheckoutPage.ts            # Checkout page object
│   ├── ContactPage.ts             # Contact page object
│   ├── TestCasesPage.ts           # Test cases page object
│   └── index.ts                   # Page object exports
├── tests/
│   ├── api/
│   │   ├── authentication-api.spec.ts    # Authentication API tests
│   │   ├── products-api.spec.ts          # Products API tests
│   │   └── user-management-api.spec.ts   # User management API tests
│   └── e2e/
│       ├── checkout-orders.spec.ts       # Checkout and order tests
│       ├── product-catalog.spec.ts       # Product catalog tests
│       ├── shopping-cart.spec.ts         # Shopping cart tests
│       ├── site-features.spec.ts         # Site features tests
│       └── user-authentication.spec.ts   # User authentication tests
├── playwright.config.ts          # Playwright configuration
├── package.json                  # Project dependencies and scripts
└── README.md                     # This file
```

## 🧪 Test Execution

### Running Tests

```bash
# Run all tests
npm test
npx playwright test

# Run specific test file
npx playwright test tests/e2e/user-authentication.spec.ts

# Run tests by browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Run tests in parallel
npm run test:parallel

# Run tests with debugging
npm run test:debug
```

### Test Modes

```bash
# Interactive UI mode
npm run test:ui

# Headed mode (visible browser)
npm run test:headed

# Debug mode (step through tests)
npm run test:debug
```

### Test Categories

```bash
# E2E tests only
npm run test:e2e

# API tests only
npm run test:api

# Specific test suites
npx playwright test --grep "User Authentication"
npx playwright test --grep "Shopping Cart"
```

## 📊 Test Reporting

### HTML Reports
```bash
# Generate and view HTML report
npm run report
npx playwright show-report
```

### Test Debugging

When tests fail, Playwright automatically generates comprehensive debugging artifacts:

#### Traces
```bash
# View trace file for failed test
npx playwright show-trace test-results/{test-directory}/trace.zip

# Example
npx playwright show-trace test-results/e2e-checkout-orders-Complete-order-chromium/trace.zip
```

#### Available Debug Artifacts
- **Screenshots**: Captured automatically on failure
- **Videos**: Captured on CI during retries
- **Console logs**: Available in trace viewer
- **Network requests**: Captured in traces
- **DOM snapshots**: Available in traces

## 🔧 Configuration

### Playwright Configuration
The project uses `playwright.config.ts` for configuration:
- **Cross-browser testing**: Chromium, Firefox, WebKit
- **Parallel execution**: 4 workers by default
- **Retry logic**: 2 retries on CI, 0 locally
- **Timeouts**: 30s test timeout, 60s expect timeout
- **Debugging**: Traces on failure, screenshots on failure

### Environment Variables
```bash
# CI environment detection
CI=true

# Base URL (default: https://automationexercise.com)
BASE_URL=https://automationexercise.com
```

## 🚀 CI/CD Integration

### GitHub Actions
The project includes a comprehensive GitHub Actions workflow (`.github/workflows/playwright.yml`) that:
- **Runs daily at 2 AM UTC** for continuous monitoring
- **Triggers on push/PR** to main and develop branches
- **Tests across all browsers** (Chromium, Firefox, WebKit)
- **Uploads test artifacts** on failure
- **Provides detailed reporting** with merged HTML reports

### Workflow Features
- **Matrix strategy**: Parallel execution across browsers
- **Artifact management**: Automatic upload of reports and traces
- **Failure handling**: Comprehensive error reporting
- **Manual triggers**: Workflow dispatch for on-demand runs

## 🏗️ Architecture

### Page Object Model
- **BasePage**: Common functionality for all pages
- **Specialized Pages**: Each page has its own class with specific methods
- **Locator Strategy**: Robust element selection using Playwright locators
- **Action Methods**: High-level actions that combine multiple steps

### Helper Classes
- **APIHelpers**: API testing utilities and assertions
- **E2EValidators**: E2E-specific validation methods
- **TestHelpers**: Data transformation and generation
- **UserDataGenerator**: Dynamic test data creation with uniqueness

### Test Organization
- **Fixtures**: Centralized page object management
- **Test Suites**: Logical grouping by functionality
- **Data Separation**: External test data generation
- **Utility Functions**: Reusable helper methods

## 📋 Test Cases Coverage

### E2E Tests (17 tests)
- **User Authentication** (4 tests): Registration, login, logout, error handling
- **Product Catalog** (4 tests): Product browsing, search, category/brand filtering
- **Shopping Cart** (3 tests): Add/remove products, quantity management, persistence
- **Checkout & Orders** (3 tests): Complete order flows, invoice download
- **Site Features** (3 tests): Contact forms, subscriptions, navigation

### API Tests (8 tests)
- **Products API** (4 tests): Product listing, brand listing, search functionality
- **Authentication API** (3 tests): Login verification, error handling
- **User Management API** (1 test): Account creation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎓 Academic Context

This project was developed as part of an academic final paper demonstrating:
- Modern test automation practices
- Clean code architecture
- Comprehensive test coverage
- CI/CD integration
- Industry-standard tooling and patterns

## 📞 Support

For questions or issues:
1. Check the [GitHub Issues](https://github.com/your-username/aqa-playwright-project/issues)
2. Review the [Playwright Documentation](https://playwright.dev/)
3. Consult the project's helper documentation in `/helpers/README.md`

---

**Built with ❤️ using Playwright and TypeScript** 