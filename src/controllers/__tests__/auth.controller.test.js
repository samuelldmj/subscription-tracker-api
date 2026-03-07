/* eslint-env jest */
import request from 'supertest';
import express from 'express';
import authRoutes from '../../routes/auth.routes.js';
import User from '../../models/user.model.js';

import mongoose from 'mongoose';
import errorMiddleware from '../../middlewares/error.middleware.js';
import bcrypt from 'bcrypt';

// Mock the User model
jest.mock('../../models/user.model.js');

// Mock database connection
jest.mock('../../database/mongodb.js', () => ({}));

// Mock mongoose.startSession and its methods for transaction support in tests
const mockStartSession = jest.fn().mockImplementation(() => {
    return {
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        abortTransaction: jest.fn(),
        endSession: jest.fn(),
    };
});
mongoose.startSession = mockStartSession;

const app = express();
app.use(express.json());
app.use('/api/v1/auth', authRoutes);
app.use(errorMiddleware);  // Add error handling middleware

const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Test User',
    email: 'test@example.com',
    timezone: 'America/New_York',
    password: 'hashedpassword',  // Add dummy password field
};

// Helper to mock User.findOne with .session chaining
const mockFindOneWithSession = (returnValue) => {
    return {
        session: jest.fn(() => Promise.resolve(returnValue))
    };
};

// Mock bcrypt.compare
jest.spyOn(bcrypt, 'compare').mockImplementation((password, hash) => {
    if (password === 'Password123!' && hash === 'hashedpassword') {
        return Promise.resolve(true);
    }
    return Promise.resolve(false);
});

describe('Authentication Endpoints', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/v1/auth/sign-up', () => {
        it('should register a new user successfully', async () => {
            User.findOne.mockReturnValue(mockFindOneWithSession(null));
            User.prototype.save = jest.fn().mockResolvedValue(mockUser);

            const res = await request(app)
                .post('/api/v1/auth/sign-up')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'Password123!',
                    timezone: 'America/New_York',
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('email', 'test@example.com');
        });

        it('should return 409 for duplicate email', async () => {
            User.findOne.mockReturnValue(mockFindOneWithSession(mockUser));

            const res = await request(app)
                .post('/api/v1/auth/sign-up')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'Password123!',
                    timezone: 'America/New_York',
                });

            expect(res.statusCode).toBe(409);
        });

        it('should return 400 for invalid input', async () => {
            const res = await request(app)
                .post('/api/v1/auth/sign-up')
                .send({
                    name: '',
                    email: 'invalid-email',
                    password: '123',
                });

            expect(res.statusCode).toBe(400);
        });
    });

    describe('POST /api/v1/auth/sign-in', () => {
        it('should login user with valid credentials', async () => {
            User.findOne.mockResolvedValue(mockUser);

            const res = await request(app)
                .post('/api/v1/auth/sign-in')
                .send({
                    email: 'test@example.com',
                    password: 'Password123!'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should return 401 for invalid credentials', async () => {
            User.findOne.mockResolvedValue(null);

            const res = await request(app)
                .post('/api/v1/auth/sign-in')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toBe(401);
        });

        it('should return 400 for missing fields', async () => {
            const res = await request(app)
                .post('/api/v1/auth/sign-in')
                .send({
                    email: 'test@example.com'
                });

            expect(res.statusCode).toBe(400);
        });
    });

    describe('POST /api/v1/auth/sign-out', () => {
        it('should logout user successfully', async () => {
            const res = await request(app)
                .post('/api/v1/auth/sign-out');

            expect([200, 204]).toContain(res.statusCode);
        });
    });
});

describe('Authentication Endpoints', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/v1/auth/sign-up', () => {
        it('should register a new user successfully', async () => {
            User.findOne.mockResolvedValue(null);
            User.prototype.save = jest.fn().mockResolvedValue(mockUser);

            // Note: CSRF protection not needed in test environment - this is a mocked API test
            const res = await request(app)
                .post('/api/v1/auth/sign-up')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'Password123!',
                    timezone: 'America/New_York',
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('email', 'test@example.com');
        });

        it('should return 409 for duplicate email', async () => {
            User.findOne.mockResolvedValue(mockUser);

            const res = await request(app)
                .post('/api/v1/auth/sign-up')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'Password123!',
                    timezone: 'America/New_York',
                });

            expect(res.statusCode).toBe(409);
        });



        it('should return 400 for invalid input', async () => {
            const res = await request(app)
                .post('/api/v1/auth/sign-up')
                .send({
                    name: '',
                    email: 'invalid-email',
                    password: '123',
                });

            expect(res.statusCode).toBe(400);
        });
    });

    describe('POST /api/v1/auth/sign-in', () => {
        it('should login user with valid credentials', async () => {
            const userWithPassword = {
                ...mockUser,
                comparePassword: jest.fn().mockResolvedValue(true)
            };
            User.findOne.mockResolvedValue(userWithPassword);

            const res = await request(app)
                .post('/api/v1/auth/sign-in')
                .send({
                    email: 'test@example.com',
                    password: 'Password123!'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should return 401 for invalid credentials', async () => {
            User.findOne.mockResolvedValue(null);

            const res = await request(app)
                .post('/api/v1/auth/sign-in')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toBe(401);
        });

        it('should return 400 for missing fields', async () => {
            const res = await request(app)
                .post('/api/v1/auth/sign-in')
                .send({
                    email: 'test@example.com'
                });

            expect(res.statusCode).toBe(400);
        });
    });

    describe('POST /api/v1/auth/sign-out', () => {
        it('should logout user successfully', async () => {
            const res = await request(app)
                .post('/api/v1/auth/sign-out');

            expect([200, 204]).toContain(res.statusCode);
        });
    });
});
