# tRPC Implementation Guide

## Overview
This implementation follows the exact pattern from your reference project, creating a robust tRPC setup that coexists with your existing Express routes for gradual migration.

## Architecture

### Backend Structure
```
backend/
├── src/
│   ├── model/types/index.ts     # Shared types
│   ├── middleware/auth.middleware.ts  # Auth context creation
│   ├── routers/
│   │   ├── api.router.ts        # Main tRPC router with nested routes
│   │   └── index.ts            # Exports
│   └── routes/
│       └── api.router.ts        # Express adapter integration
├── package.json                 # With exports configuration
└── existing routes...           # Unchanged for gradual migration
```

### Frontend Structure
```
frontend/src/
├── providers/
│   └── api-provider.tsx         # tRPC client setup with Clerk auth
├── hooks/
│   ├── use-assistant-api.ts     # Assistant API hooks
│   └── use-user-api.ts         # User API hooks
├── components/examples/
│   └── TRPCAssistantExample.tsx # Usage example
└── App.tsx                     # Integrated ApiProvider
```

## Key Features

### 1. Package Exports (Backend)
```json
"exports": {
  "./api": "./src/routers/index.ts",
  "./types": "./src/model/types/index.ts"
}
```

### 2. Nested Router Pattern
```typescript
export const apiRouter = router({
  assistants: router({
    get: procedure.input(z.string()).query(async ({ input, ctx }) => { ... }),
    search: procedure.query(async ({ ctx }) => { ... }),
    create: procedure.input(createSchema).mutation(async ({ input, ctx }) => { ... }),
    update: procedure.input(updateSchema).mutation(async ({ input, ctx }) => { ... }),
    delete: procedure.input(z.string()).mutation(async ({ input, ctx }) => { ... }),
  }),
  users: router({
    get: procedure.query(async ({ ctx }) => { ... }),
    search: procedure.input(searchSchema).query(async ({ input }) => { ... }),
    update: procedure.input(updateSchema).mutation(async ({ input, ctx }) => { ... }),
  }),
});
```

### 3. Auth Integration
- **Backend**: Reuses existing Clerk `getUserIdFromBearer` utility
- **Frontend**: Uses Clerk's `getToken()` for automatic auth headers
- **Context**: User info extracted and validated in tRPC context

### 4. Type Safety
- Full end-to-end type safety from backend to frontend
- Automatic type inference for all API calls
- Runtime validation with Zod schemas

## Usage Examples

### Backend Router
```typescript
// Nested routes with full auth context
assistants: router({
  create: procedure.input(createAssistantSchema).mutation(async ({ input, ctx }) => {
    // ctx.auth0Id and ctx.user available
    // Automatic validation via Zod schema
    // Business logic here
  }),
}),
```

### Frontend Hooks
```typescript
// Custom hooks following the pattern
export const useCreateAssistant = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(trpc.assistants.create.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.assistants.pathFilter());
    },
  }));
};
```

### Component Usage
```typescript
const { data: assistants, isLoading } = useSearchAssistants();
const createMutation = useCreateAssistant();

// Built-in loading states, error handling, and cache management
```

## Migration Strategy

### Phase 1: Foundation ✅
- [x] Install tRPC v11 dependencies
- [x] Configure package exports
- [x] Create tRPC context with Clerk auth
- [x] Set up nested router structure
- [x] Integrate Express adapter at `/trpc/api`
- [x] Configure frontend client with auth headers
- [x] Create example hooks and components

### Phase 2: Gradual Migration
1. **New Features**: Build all new features using tRPC
2. **High-Traffic Routes**: Migrate frequently used endpoints
3. **Complex Logic**: Move routes with heavy validation/business logic
4. **Simple CRUD**: Convert remaining basic operations

### Phase 3: Cleanup
1. Remove unused Express routes
2. Update all frontend components
3. Remove legacy API services
4. Clean up imports and dependencies

## Coexistence Strategy

### Current Setup
- **Express Routes**: `/api/*` (unchanged)
- **tRPC Routes**: `/trpc/api/*` (new)
- **Authentication**: Both use same Clerk middleware
- **Database**: Both use same Mongoose models

### Benefits
- **Zero Disruption**: Existing functionality unchanged
- **Gradual Migration**: Move routes one at a time
- **Type Safety**: New routes get full type safety
- **Performance**: Request batching and smart caching
- **DX**: Better error handling and loading states

## Environment Variables
No new environment variables needed - reuses existing Clerk configuration:
- `VITE_CLERK_PUBLISHABLE_KEY`
- `CLERK_PUBLISHABLE_KEY`
- `VITE_API_URL` (optional, defaults to localhost:3001)

## Testing the Implementation

1. **Start Development**:
   ```bash
   npm run dev
   ```

2. **Test tRPC Endpoints**:
   - Backend: `http://localhost:3001/trpc/api`
   - Frontend: Use the example component

3. **Verify Coexistence**:
   - Existing routes still work at `/api/*`
   - New tRPC routes work at `/trpc/api/*`
   - Authentication works for both

## Next Steps

1. **Try the Example**: Check out `TRPCAssistantExample.tsx`
2. **Create New Routes**: Add new features using tRPC pattern
3. **Migrate Gradually**: Start with high-value existing routes
4. **Monitor Performance**: Enjoy improved caching and batching

## Key Differences from Standard tRPC

1. **Nested Routers**: Resources grouped logically (assistants.create, users.update)
2. **Package Exports**: Types exported for frontend consumption
3. **Auth Context**: Full user object available in context
4. **Coexistence**: Runs alongside existing Express routes
5. **Gradual Migration**: Designed for incremental adoption

This implementation provides a solid foundation for migrating to tRPC while maintaining all existing functionality.
