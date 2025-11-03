# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Hub (Sloane) is a comprehensive AI assistant platform with multiple AI service integrations (Anthropic Claude, OpenAI GPT-4, Google Gemini, DeepSeek). The application features real-time chat with RAG (Retrieval Augmented Generation), web search capabilities, goal tracking, and a Move Club community feature.

**Tech Stack:**
- **Frontend:** React 19 + TypeScript + Vite + TailwindCSS
- **Backend:** Express.js + TypeScript + tRPC
- **Database:** MongoDB with Prisma ORM
- **Auth:** Clerk
- **Monorepo:** Turborepo with npm workspaces
- **Real-time:** Socket.io

**Requirements:**
- Node.js >= 22.0.0
- npm >= 10.0.0

## Development Commands

### Root Level (Turborepo)
```bash
# Install all dependencies
npm install

# Start all development servers (frontend + backend)
npm run dev

# Build all packages
npm run build

# Lint all packages
npm run lint

# Type check all packages
npm run type-check

# Clean build artifacts
npm run clean

# Build Docker image for backend
npm run docker:build
```

### Backend Only
```bash
# Run backend dev server (with watch mode and auto-restart)
npx turbo dev --filter=backend

# Build backend
npx turbo build --filter=backend

# Type check backend
cd backend && npm run type-check

# Generate Prisma client (required after schema changes)
cd backend && npm run prisma:generate

# Start production build
cd backend && npm start
```

### Frontend Only
```bash
# Run frontend dev server
npx turbo dev --filter=frontend

# Build frontend
npx turbo build --filter=frontend

# Type check frontend
cd frontend/apps/user-app && npm run type-check

# Preview production build
cd frontend/apps/user-app && npm run preview
```

## Architecture

### Backend Architecture

**Entry Point:** `backend/index.ts`

The backend uses a hybrid routing approach with both traditional Express routes and modern tRPC procedures:

1. **tRPC API (`backend/src/routers/`)** - Modern type-safe API layer
   - `app-api.router.ts` - Main tRPC router for authenticated app features (goals, RAG, move club, feature flags)
   - `admin-api.router.ts` - Admin-specific tRPC procedures
   - Mounted at `/trpc/app` and `/trpc/admin`
   - Uses Clerk authentication middleware
   - Type-safe client-server communication with `@trpc/server`
   - Request context includes `clerkUserId` and authentication status

2. **Legacy Express Routes (`backend/routes/`)** - Traditional REST API
   - Mounted at `/api/*`
   - Includes: chats, assistants, actions, users, stripe, community, etc.
   - Protected with Clerk `requireAuth` middleware

**Services Layer (`backend/src/services/`):**
- Feature-organized service modules (goals, RAG, move-club, feature-flags, users)
- RAG service includes resource management and streaming chat
- Socket.io integration for real-time chat streaming

**Database:**
- MongoDB with Prisma ORM
- Schema: `backend/src/model/db/schema.prisma`
- Auto-generates Zod schemas for validation
- Key models: users, chats, assistants, actions, resources, embeddings, MoveClub, FeatureFlags

**Middleware (`backend/middleware/`):**
- Clerk authentication with `requireAuth`
- Rate limiting (1000 requests per minute)
- Helmet security headers
- CORS configuration
- Error handling

### Frontend Architecture

**Entry Point:** `frontend/apps/user-app/src/index.tsx`

**Key Directories:**
- `src/app/pages/` - Page-level components (Chat, Dashboard, Onboarding, Community, etc.)
- `src/app/components/` - Reusable UI components organized by feature
- `src/context/` - React Context providers (ChatContext, AssistantContext, FolderContext, etc.)
- `src/providers/` - API and authentication providers
- `src/services/` - API client services
- `src/hooks/` - Custom React hooks
- `src/api/` - tRPC hooks for type-safe API calls

**API Integration:**
- **tRPC Client:** Type-safe API client using `@trpc/tanstack-react-query`
  - Provider: `src/providers/api-provider.tsx` (app API) and `admin-api-provider.tsx` (admin API)
  - Hooks pattern: `src/api/use-*-api.ts` files export tRPC query/mutation hooks
  - Automatic type inference from backend router types
  - Example: `useTRPC().goals.getAll.useQuery()` for goals

- **Legacy REST API:** Direct axios calls in `src/services/`

**State Management:**
- React Context API for global state (chat, assistant, folder contexts)
- TanStack Query for server state (via tRPC)
- Local component state with hooks

**Styling:**
- TailwindCSS v4 with `@tailwindcss/postcss`
- Component-specific CSS modules for complex styling
- Theme system with light/dark mode support

### RAG (Retrieval Augmented Generation)

**Backend:**
- Resources stored in `resources` collection with embeddings
- Embeddings stored separately in `embeddings` collection
- Chat streaming via Socket.io (`backend/src/services/rag/stream.service.ts`)
- Resource CRUD operations in `backend/src/services/rag/resource.service.ts`

**Frontend:**
- Playground component in `src/app/components/playground/`
- tRPC hooks in `src/api/use-rag-api.ts`
- Socket.io integration for real-time chat streaming

## Environment Variables

**Backend (.env in backend/):**
```env
# Required
MONGO_URI=<production_mongodb_uri>
DEV_MONGO_URI=<development_mongodb_uri>
CLERK_PUBLISHABLE_KEY=<clerk_publishable_key>
OPENAI_API_KEY=<openai_api_key>

# Optional
PORT=3001
NODE_ENV=development
FRONTEND_URL=<frontend_url>
LOG_LEVEL=info
```

**Frontend (.env in frontend/apps/user-app/):**
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_CLERK_PUBLISHABLE_KEY=<clerk_publishable_key>
```

## Important Patterns

### Adding a New tRPC Procedure

1. Create service in `backend/src/services/<feature>/`
2. Add input schema to `backend/src/model/types/index.ts`
3. Add procedure to appropriate router in `backend/src/routers/`
4. Frontend hooks auto-generate types via `@backend/api` import

### Working with Prisma

After modifying `backend/src/model/db/schema.prisma`:
```bash
cd backend
npm run prisma:generate  # Regenerates client and Zod schemas
```

### Socket.io Real-time Communication

The backend initializes Socket.io in `backend/index.ts` and passes it to services via `setSocketIO()`. RAG chat streaming uses Socket.io for real-time message delivery.

### Authentication Flow

- Clerk handles authentication on both frontend and backend
- Frontend: `@clerk/clerk-react` with `useAuth()` hook
- Backend: `@clerk/express` with `requireAuth()` middleware
- tRPC context includes authenticated user's `clerkUserId`

## Key Feature Areas

- **Chat System:** Multi-assistant chat with message history (located in `routes/chats/` and `pages/chat/`)
- **RAG System:** Upload resources, create embeddings, query with context
- **Goal Tracking:** Weekly/monthly goals with toggle states (tRPC-based)
- **Move Club:** Community fitness events with registration system
- **Feature Flags:** Dynamic feature toggling via database
- **Actions:** Task management linked to chat messages
- **Admin Panel:** User management, configuration, analytics

## Database Notes

- Uses MongoDB ObjectId for all `_id` fields
- Prisma maps `_id` to `id` in models
- Many embedded types (ActionsNotes, ChatsMessages, etc.) instead of separate collections
- Full-text search enabled on stock images
- Clerk user IDs stored in `clerkUserId` field with unique index
