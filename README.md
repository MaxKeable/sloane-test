# AI Hub

A comprehensive AI assistant platform with multiple AI service integrations.

## Features

### AI Services

- **Google Gemini** - Google's advanced AI model
- **OpenAI GPT-4** - OpenAI's conversational model
- **DeepSeek** - DeepSeek's AI model
- **Anthropic Claude** - Anthropic's Claude model with web search capability

### Web Search Integration

- **Real-time web search** available with Anthropic Claude
- Toggle web search on/off via admin panel
- Automatic web search when enabled for current information
- **Supported Models**: Claude 3.5 Sonnet (latest), Claude 3.7 Sonnet, Claude 4 Sonnet, Claude 4 Opus

## Web Search Setup

### Prerequisites

- Anthropic API key with web search access
- Admin access to toggle web search functionality
- **Important**: Web search must be enabled in your Anthropic Console

### Configuration

1. Navigate to Admin Panel → Config
2. Select "Anthropic Claude" as your AI service
3. Toggle "Web Search" to enable real-time web search
4. Web search will automatically be used when users ask for current information

### Usage

When web search is enabled, Claude will automatically search the web for:

- Current events and news
- Real-time information
- Latest data and statistics
- Recent developments in any field

### Web Search Features

- **Max Uses**: Limited to 5 searches per request
- **Citations**: Automatic source citations in responses
- **Streaming**: Real-time search results during conversation
- **Error Handling**: Graceful fallback if search fails

## API Endpoints

### Admin Routes

- `PUT /api/admin/update-ai-service` - Update AI service
- `PUT /api/admin/toggle-web-search` - Toggle web search functionality
- `GET /api/admin/get-config` - Get current configuration

### Chat Routes

- `POST /api/chats/general-chat/:chatId` - Send message with web search capability

## Environment Variables

```env
ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
```

## Development

This project uses **Turborepo** for efficient monorepo management.

### Project Structure

- `backend/` - Backend Express server
- `frontend/` - Frontend React application

### Getting Started

```bash
# Install dependencies for all workspaces
npm install

# Start all development servers
npm run dev

# Start only the frontend
npx turbo dev --filter=frontend

# Start only the backend
npx turbo dev --filter=backend

# Build all packages
npm run build

# Build specific package
npx turbo build --filter=frontend
```

### Available Commands

```bash
npm run dev        # Start all development servers
npm run build      # Build all packages
npm run lint       # Lint all packages
npm run type-check # Type check all packages
npm run clean      # Clean build artifacts
```

For detailed setup information, see [TURBOREPO_SETUP.md](./TURBOREPO_SETUP.md).

## Testing Web Search

```bash
# Test configuration
node test-websearch-simple.js

# Test with actual chat (requires valid chat ID)
node test-chat-with-websearch.js
```

## Pricing

Web search usage is charged in addition to token usage:

- $10 per 1,000 searches
- Standard token costs for search-generated content
- Each web search counts as one use, regardless of results returned
