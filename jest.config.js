export default {
  testEnvironment: 'node',
  globals: {
    'describe': 'readonly',
    'it': 'readonly', 
    'expect': 'readonly',
    'beforeEach': 'readonly',
    'afterEach': 'readonly',
    'jest': 'readonly'
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
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