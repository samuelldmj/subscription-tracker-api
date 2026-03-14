// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_key_for_testing';
process.env.DB_URI = 'mongodb://localhost:27017/subscription-tracker-test';

// Global test timeout
import { jest } from '@jest/globals';
jest.setTimeout(10000);