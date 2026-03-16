# Wrapping Up: Subscription Tracker

## What's Done

- User authentication (sign-up, sign-in, sign-out)
- JWT auth middleware
- Subscription CRUD (create, read, renew, cancel)
- Email reminders with timezone support
- Cron jobs for automated tasks
- MongoDB with Mongoose
- Error handling middleware
- Basic tests (auth controller)

## What Still Needs Finishing

### 1. User Controller
- Complete `GET /users/:id` - get user profile
- Complete `PUT /users/:id` - update name, email, timezone
- Complete `DELETE /users/:id` - delete account

### 2. Subscription Controller
- Verify cancel endpoint works end-to-end
- Complete `PUT /subscriptions/:id` - update subscription details

### 3. Input Validation
- Add basic validation checks on request body fields
- Return clear error messages for missing or invalid inputs

### 4. Tests
- Add basic tests for subscription and user controllers to match what's already done for auth

## What You Learned

- How to structure a REST API with Express
- JWT authentication flow
- MongoDB schema design with Mongoose
- Middleware pattern (auth, error handling, security)
- Cron jobs for background tasks
- Sending emails programmatically
- Environment-based configuration
