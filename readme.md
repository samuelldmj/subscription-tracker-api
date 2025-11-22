# Subscription Tracker API

A comprehensive Node.js backend application for managing subscription services with automated renewal tracking, email reminders, and flexible payment integration.

## Features

- **User Authentication**: JWT-based authentication with secure sign-up/sign-in
- **Subscription Management**: Create, track, and manage various subscription services
- **Automated Renewals**: Support for auto-renewing and manual renewal subscriptions
- **Smart Reminders**: Email notifications with timezone-aware scheduling
- **Grace Period Handling**: 7-day grace period for non-auto-renewing subscriptions
- **Security**: Rate limiting and protection with Arcjet middleware
- **Email Notifications**: Automated email reminders using Nodemailer
- **Audit Trail**: Complete subscription history tracking

## Tech Stack

- **Runtime**: Node.js with ES6 modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Arcjet for rate limiting and protection
- **Email**: Nodemailer for email notifications
- **Scheduling**: Node-cron for automated tasks
- **Date/Time**: Day.js with timezone support
- **Password Hashing**: bcrypt

## Project Structure

```
src/
├── config/          # Configuration files
│   ├── arcjet.js    # Arcjet security config
│   ├── env.js       # Environment variables
│   ├── nodemailer.js # Email configuration
├── controllers/     # Route controllers
│   ├── auth.controller.js
│   ├── subscription.controller.js
│   └── user.controller.js
├── cron/           # Scheduled tasks
│   ├── reminderTask.js      # Email reminder processor
│   └── subscriptionTask.js  # Subscription renewal/expiry
├── database/       # Database connection
│   └── mongodb.js
├── middlewares/    # Express middlewares
│   ├── arcjet.middleware.js
│   ├── auth.middleware.js
│   └── error.middleware.js
├── misc/          # Utility functions
│   ├── emailTemplate.js
│   └── sendEmail.js
├── models/        # Mongoose schemas
│   ├── reminder.model.js
│   ├── subscription.model.js
│   ├── subscriptionHistory.model.js
│   └── user.model.js
├── routes/        # API routes
│   ├── auth.routes.js
│   ├── subscription.routes.js
│   └── user.routes.js
└── app.js         # Main application file
```

## Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd subscription-tracker
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Setup**
   Create environment files:

- `.env.development.local` for development
- `.env.production.local` for production

Required environment variables:

```env
PORT=3000
NODE_ENV=development
DB_URI=mongodb://localhost:27017/subscription-tracker
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d
ARCJET_ENV=development
ARCJET_KEY=your-arcjet-key
EMAIL_PASSWORD=your-email-app-password
```

EMAIL_PASSWORD=your-email-app-password
npm install
cd subscription-tracker

4. **Start the application**

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/sign-up` - User registration
- `POST /api/v1/auth/sign-in` - User login
- `POST /api/v1/auth/sign-out` - User logout

### Subscriptions

- `POST /api/v1/subscriptions` - Create subscription
- `GET /api/v1/subscriptions/user/:id` - Get user subscriptions
- `POST /api/v1/subscriptions/renew` - Renew subscription
- `PUT /api/v1/subscriptions/:id/cancel` - Cancel subscription

### Users

- User management endpoints (implementation in progress)

## Subscription Model

### Supported Frequencies

- `daily` - Daily renewals
- `weekly` - Weekly renewals
- `monthly` - Monthly renewals
- `yearly` - Yearly renewals

### Supported Categories

- `sports`, `news`, `entertainment`, `lifestyle`, `technology`, `finance`, `politics`, `other`

### Supported Currencies

- `USD`, `EUR`, `GBP`

### Payment Methods

- `Credit Card`, `PayPal`, `Bank Transfer`, `Other`

## Automated Features

### Reminder System

**Pre-renewal Reminders:**

- Daily subscriptions: 6 hours, 1 hour before renewal
- Weekly/Monthly/Yearly: 7, 5, 2, 1 days before renewal

**Grace Period Reminders:**

- Non-auto-renewing subscriptions get 7-day grace period
- Reminders sent on days 1, 3, and 5 of grace period

### Subscription Lifecycle

1. **Active**: Subscription is active and running
2. **Grace Period**: 7-day period after renewal date for manual renewal
3. **Expired**: Subscription expired after grace period

### Cron Jobs

- **Reminder Task**: Runs every minute to send pending email reminders
- **Subscription Task**: Runs daily at midnight UTC to handle renewals and expirations

### Job Scheduling

This project uses **node-cron** for scheduling all cron jobs locally within the Node.js process.

## Usage Examples

### Create a Subscription

```javascript
POST / api / v1 / subscriptions;
Authorization: Bearer <
  jwt - token >
  {
    name: "Netflix",
    price: 12.99,
    currency: "USD",
    frequency: "monthly",
    category: "entertainment",
    startDate: "2025-01-15",
    paymentMethod: "Credit Card",
    autoRenew: false,
  };
```

### User Registration

```javascript
POST /api/v1/auth/sign-up

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "timezone": "America/New_York"
}
```

## Security Features

- **Rate Limiting**: Arcjet middleware for API protection
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Mongoose schema validation
- **Error Handling**: Centralized error middleware

## Timezone Support

The application supports timezone-aware operations:

- User timezones stored in profile
- Subscription dates calculated in user's timezone
- Email reminders scheduled according to user timezone
- Automatic UTC conversion for database storage

## Email Notifications

Automated email system with:

- HTML email templates
- Timezone-aware scheduling
- Retry mechanism for failed emails
- Comprehensive email logging

## Development

### Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run lint` - Run ESLint (if configured)

### Code Style

- ES6 modules
- Async/await for asynchronous operations
- Mongoose for MongoDB operations
- Express.js best practices

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is private and proprietary.

## Support

For support and questions, please contact the development team.
