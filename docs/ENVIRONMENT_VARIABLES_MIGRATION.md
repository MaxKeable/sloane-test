# Environment Variables Migration Guide

## Required Environment Variable Changes

The following environment variables need to be updated from React (REACT_APP_) to Vite (VITE_) prefixes:

### 1. API Configuration
- **OLD**: `REACT_APP_API_BASE_URL`
- **NEW**: `VITE_API_BASE_URL`
- **Description**: Base URL for backend API calls

### 2. Production API URL
- **OLD**: `NEXT_PUBLIC_API_URL` (used in production)
- **NEW**: `VITE_NEXT_PUBLIC_API_URL`
- **Description**: Production API URL

### 3. Clerk Authentication
- **OLD**: `REACT_APP_CLERK_PUBLISHABLE_KEY`
- **NEW**: `VITE_CLERK_PUBLISHABLE_KEY`
- **Description**: Clerk authentication publishable key

### 4. Stripe Payment Keys
- **OLD**: `REACT_APP_STRIPE_PUBLISHABLE_KEY`
- **NEW**: `VITE_STRIPE_PUBLISHABLE_KEY`
- **Description**: Stripe publishable key for payments

- **OLD**: `REACT_APP_STRIPE_PUBLIC_KEY`
- **NEW**: `VITE_STRIPE_PUBLIC_KEY`
- **Description**: Alternative Stripe public key

## Action Required

1. Update your `.env` files (development, staging, production)
2. Update your deployment configuration
3. Update your CI/CD pipeline environment variables
4. Update any documentation referencing the old variable names

## Example .env File

```env
VITE_API_BASE_URL=http://localhost:3001
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_NEXT_PUBLIC_API_URL=https://your-production-api.com
```

## Important Notes

- Vite environment variables are exposed to the client-side code
- Only variables prefixed with `VITE_` are accessible in the frontend
- Environment variables are replaced at build time, not runtime
- All existing functionality remains the same, only the variable names changed
