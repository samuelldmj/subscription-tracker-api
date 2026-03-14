# Testing Setup and Strategy for Subscription Tracker

## Current Setup Status ✅

**Dependencies Installed:**
- ✅ Jest (v29.7.0)
- ✅ Supertest (v7.1.4) for API testing
- ✅ Babel Jest (v30.2.0) for ES module support
- ✅ @babel/core and @babel/preset-env

**Package.json Scripts:**
- ✅ `"test": "jest"`
- ✅ `"test:coverage": "jest --coverage"`

**Test Files Created:**
- ✅ `src/controllers/__tests__/auth.controller.test.js`

## Missing Configuration Files ⚠️

Your project needs these configuration files to work properly with ES modules:

### 1. Jest Configuration (jest.config.js)
### 2. Babel Configuration (.babelrc or babel.config.js)

## Why Jest is the Best Fit

- **ES Module Compatibility**: Configured with Babel to handle ES6 modules
- **Built-in Features**: Assertions, mocking, code coverage, and snapshot testing
- **API Testing**: Works seamlessly with Supertest for HTTP endpoint testing
- **Performance**: Parallel test execution with fast feedback
- **MongoDB Mocking**: Easy to mock database operations for isolated testing

## Components and Features to Test

- **Authentication**  
  Test user sign-up, sign-in, and sign-out flows including JWT generation and verification.
- **Subscription Management**  
  Validate subscription creation, retrieval, renewal, cancellation, and model validations.

- **User Management**  
  Include tests for user-related APIs as they are implemented.

- **Email System**  
  Ensure email templates render correctly and sending utilities function as expected, mocking actual email delivery in tests.

- **Scheduled Tasks (Cron Jobs)**  
  Test business logic for reminder sending and subscription lifecycle management.

- **Middleware**  
  Verify authentication, error handling, and security middleware behave correctly under various conditions.

- **Database Models**  
  Test Mongoose schemas for correct validation, hooks, and integrity constraints.

## Benefits of Testing

- **Code Quality**: Tests help guarantee code correctness and reduce bugs.
- **Refactoring Confidence**: With tests in place, you can safely refactor or extend the codebase.
- **Documentation**: Tests serve as living documentation for API behavior and business logic.
- **CI/CD Integration**: Automated tests in CI pipelines ensure consistent quality before deployment.
- **Team Collaboration**: Shared tests improve understanding among developers and avoid regressions.

## Required Configuration Files

### Create jest.config.js (Root Directory)

```javascript
export default {
  testEnvironment: 'node',
  transform: {
    '^.+\.js$': 'babel-jest',
  },
  moduleFileExtensions: ['js'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/app.js',
    '!src/database/**',
    '!src/config/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.js']
};
```

### Create babel.config.js (Root Directory)

```javascript
export default {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ]
  ]
};
```

### Create Test Setup File

Create `src/__tests__/setup.js` for global test configuration:

```javascript
// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_key_for_testing';
process.env.DB_URI = 'mongodb://localhost:27017/subscription-tracker-test';

// Global test timeout
jest.setTimeout(10000);
```

## How to Run Tests

### Current Status
✅ **Dependencies**: Already installed
✅ **Scripts**: Already configured in package.json
✅ **Test Files**: Basic auth test exists

### Run Tests

```bash
# Run all tests
npm run test

# Run with coverage report
npm run test:coverage

# Run tests in watch mode
npm run test -- --watch
```

## Test File Structure

```
src/
├── __tests__/
│   └── setup.js                    # Global test setup
├── controllers/
│   └── __tests__/
│       ├── auth.controller.test.js  ✅ Created
│       ├── subscription.controller.test.js
│       └── user.controller.test.js
├── models/
│   └── __tests__/
│       ├── user.model.test.js
│       └── subscription.model.test.js
├── middlewares/
│   └── __tests__/
│       ├── auth.middleware.test.js
│       └── error.middleware.test.js
└── misc/
    └── __tests__/
        ├── emailTemplate.test.js
        └── sendEmail.test.js
```

## Testing Strategy

### Unit Tests
- **Models**: Mongoose schema validation, hooks
- **Utilities**: Email templates, helper functions
- **Middleware**: Authentication, error handling

### Integration Tests
- **API Endpoints**: Full request/response cycle
- **Database Operations**: CRUD operations with test DB
- **Email System**: Template rendering and sending

### Mocking Strategy
- **Database**: Use MongoDB Memory Server or mock Mongoose
- **External Services**: Mock Nodemailer, Arcjet
- **Environment**: Separate test environment variables

## Commands Reference

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- auth.controller.test.js

# Run tests in watch mode
npm test -- --watch

# Run tests with verbose output
npm test -- --verbose
```

## Next Steps to Complete Setup

1. ✅ Dependencies installed
2. ⚠️ **Create jest.config.js** (required)
3. ⚠️ **Create babel.config.js** (required)
4. ⚠️ **Create src/__tests__/setup.js** (recommended)
5. 🔄 **Add more test files** for other controllers
6. 🔄 **Mock database operations** in existing tests

---

**Status**: Jest is installed and configured in package.json, but needs configuration files to work with ES modules. Once configuration files are added, tests will run successfully.
