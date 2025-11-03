# Web Search Tool Implementation

## Overview

A modular, plug-and-play Google Search tool integrated with your existing chat system using the Vercel AI SDK pattern. The tool uses Serper API to search Google and return results to the AI assistant.

## Architecture

```
backend/src/services/chat/tools/
├── types.ts                    # Shared interfaces
├── rag-tools.factory.ts        # RAG knowledge base tools
├── web-search-tools.factory.ts # Google Search tool (NEW)
└── index.ts                    # Tool composer/registry

backend/src/services/web-search/
└── serper.service.ts           # Serper API integration
```

## Features

✅ **Plug & Play**: Independent tool factories that can be mixed and matched
✅ **Type-Safe**: Shared TypeScript interfaces across all tools
✅ **AI SDK Native**: Uses Vercel AI SDK's `tool()` function
✅ **Composable**: Combine RAG + Web Search or use separately
✅ **Real-time**: Socket.IO integration for tool call notifications
✅ **Free Tier**: Serper API provides 2500 free searches/month

## Setup

### 1. Get Serper API Key

1. Visit [serper.dev](https://serper.dev)
2. Sign up for free account
3. Get your API key (2500 searches/month free)

### 2. Add Environment Variable

**Backend `.env`:**
```env
SERPER_API_KEY=your_serper_api_key_here
```

### 3. Regenerate Prisma Client (if needed)

```bash
cd backend
npm run prisma:generate
```

## Usage

### Frontend Usage

**Option 1: Programmatically enable web search**

```typescript
import { useChat } from "@/context/ChatContext";

const { sendChat } = useChat();

// Send message with web search enabled
await sendChat(
  "What happened in AI news this week?",
  assistantId,
  null, // no file
  chatId,
  folderId,
  true // enableWebSearch = true
);
```

**Option 2: UI Toggle (Example)**

```typescript
const [enableWebSearch, setEnableWebSearch] = useState(false);

<Checkbox
  checked={enableWebSearch}
  onChange={(e) => setEnableWebSearch(e.target.checked)}
  label="Enable Web Search"
/>

<ChatInput
  onSubmit={(message) =>
    sendChat(message, assistantId, null, chatId, folderId, enableWebSearch)
  }
/>
```

### Backend Tool Composer

The tool composer automatically combines enabled tools:

```typescript
// backend/src/services/chat/send-message.service.ts

const tools = createChatTools({
  userId,
  assistantId: chat.assistant,
  enabledTools: {
    rag: input.enableTools ?? false,          // Knowledge base search
    webSearch: input.enableWebSearch ?? false, // Google search
  },
  isolateRagToAssistant: false,
  callbacks: {
    onToolCall: (toolName, args) => {
      logger.info("Tool called", { toolName, args });
    },
  },
});
```

## Tool Behavior

### When the AI Uses Web Search

The AI will automatically call the `searchWeb` tool when:
- User asks about current events or recent news
- Question requires up-to-date information
- User explicitly asks to search the web
- Information is not in the training data

### Search Result Format

```typescript
{
  title: "Article Title",
  link: "https://example.com",
  snippet: "Preview text from the page",
  date: "2025-01-15" // if available
}
```

### LLM Receives Formatted Results

```
Web search results for "AI news this week":

[1] Latest AI Developments in 2025
URL: https://example.com/ai-news
Preview text about AI developments...
Date: 2025-01-15

[2] OpenAI Announces New Model
URL: https://example.com/openai
Details about the new model release...

Note: Always cite sources by including the URL when using this information.
```

## API Reference

### Serper Service

**Location:** `backend/src/services/web-search/serper.service.ts`

```typescript
import { searchWeb } from "@/services/web-search/serper.service";

const results = await searchWeb("AI developments 2025", {
  numResults: 5,
  country: "us"
});
```

### Web Search Tools Factory

**Location:** `backend/src/services/chat/tools/web-search-tools.factory.ts`

```typescript
import { createWebSearchTools } from "@/services/chat/tools";

const tools = createWebSearchTools({
  userId: "user-123",
  assistantId: "assistant-456",
  callbacks: {
    onToolCall: (toolName, args) => console.log(toolName, args)
  }
});
```

### Tool Composer

**Location:** `backend/src/services/chat/tools/index.ts`

```typescript
import { createChatTools } from "@/services/chat/tools";

// Combine multiple tools
const allTools = createChatTools({
  userId,
  assistantId,
  enabledTools: {
    rag: true,        // Enable RAG knowledge base
    webSearch: true   // Enable Google search
  },
  isolateRagToAssistant: false
});
```

## Schema Updates

### Backend Input Schema

```typescript
// backend/src/model/types/chat.ts

export const sendMessageRequestSchema = z.object({
  chatId: z.string(),
  message: z.string().min(1),
  file: fileUploadSchema.optional(),
  enableTools: z.boolean().optional(),      // RAG tools
  enableWebSearch: z.boolean().optional(),  // Web search tool (NEW)
});
```

### Frontend Context

```typescript
// frontend/src/context/ChatContext.tsx

sendChat: (
  prompt: string,
  assistantId: string,
  file?: File | null,
  chatId?: string,
  folderId?: string,
  enableWebSearch?: boolean  // NEW parameter
) => Promise<void>;
```

## Socket.IO Events

The tool emits real-time events during execution:

```typescript
// Client listening for tool calls
socket.on("chat:tool_call", ({ toolName, args }) => {
  if (toolName === "searchWeb") {
    console.log("Searching web for:", args.query);
  }
});
```

## Error Handling

### Service-Level Errors

```typescript
try {
  const results = await searchWeb(query);
} catch (error) {
  // Serper API errors are logged
  // Tool returns: "Error performing web search..."
}
```

### Missing API Key

If `SERPER_API_KEY` is not configured:
- Tool returns: "Web search not configured"
- Backend logs: "SERPER_API_KEY not configured"

## Performance & Costs

### Serper API Limits

- **Free Tier**: 2500 searches/month
- **Response Time**: ~1-2 seconds
- **Rate Limit**: Reasonable for chat use cases

### Caching (Optional Enhancement)

Consider caching search results for identical queries:

```typescript
// Example: Simple in-memory cache
const searchCache = new Map<string, { results: any[], timestamp: number }>();

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function searchWeb(query: string) {
  const cached = searchCache.get(query);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.results;
  }

  const results = await fetchFromSerper(query);
  searchCache.set(query, { results, timestamp: Date.now() });
  return results;
}
```

## Testing

### Manual Test

```bash
# Start backend
cd backend && npm run dev

# In another terminal, test Serper API
curl -X POST https://google.serper.dev/search \
  -H "X-API-KEY: your_key_here" \
  -H "Content-Type: application/json" \
  -d '{"q":"test query"}'
```

### Frontend Test

1. Enable web search in UI
2. Ask: "What happened in AI news this week?"
3. Check backend logs for tool call
4. Verify AI response includes citations with URLs

## Future Enhancements

### 1. Per-Assistant Configuration

Add `allowWebSearch` flag to assistants table:

```typescript
// backend/src/model/db/schema.prisma

model assistants {
  // ...existing fields
  allowWebSearch Boolean @default(false)
}
```

Then auto-enable for specific assistants:

```typescript
const assistant = await prisma.assistants.findUnique({ ... });
const enableWebSearch = input.enableWebSearch ?? assistant.allowWebSearch;
```

### 2. Search Result Formatting

Enhance result display with rich cards:

```typescript
interface EnhancedSearchResult {
  title: string;
  url: string;
  snippet: string;
  thumbnail?: string;
  publishedDate?: string;
  source?: string;
}
```

### 3. Multiple Search Providers

Add support for:
- DuckDuckGo (privacy-focused)
- Bing API
- Custom search engines

```typescript
export function createWebSearchTools(options: ToolFactoryOptions & {
  provider?: "serper" | "bing" | "duckduckgo"
}) {
  // ...
}
```

### 4. Search Filters

Allow users to specify search filters:

```typescript
searchWeb: tool({
  inputSchema: z.object({
    query: z.string(),
    dateRange: z.enum(["day", "week", "month", "year"]).optional(),
    language: z.string().optional(),
    country: z.string().optional()
  })
})
```

## Troubleshooting

### Tool Not Being Called

1. Check `enableWebSearch` is `true` in request
2. Verify tool is registered in composer
3. Check backend logs for tool creation
4. Ensure AI model supports tool calling

### Serper API Errors

```
Error: Serper API error: 429
```
**Solution**: Rate limit hit, wait or upgrade plan

```
Error: Serper API error: 401
```
**Solution**: Invalid API key, check `.env`

### No Search Results

```
"No results found for this search query."
```
**Possible causes**:
- Query too specific
- Serper API temporary issue
- Country/language mismatch

## Related Files

### Backend
- `/backend/src/services/chat/tools/` - All tool factories
- `/backend/src/services/web-search/serper.service.ts` - Serper integration
- `/backend/src/services/chat/send-message.service.ts` - Message handler
- `/backend/src/model/types/chat.ts` - Input schemas

### Frontend
- `/frontend/src/context/ChatContext.tsx` - Chat state management
- `/frontend/src/api/use-chat-api.ts` - tRPC hooks

## Additional Resources

- [Serper API Documentation](https://serper.dev/docs)
- [Vercel AI SDK Tools](https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling)
- [Chat Implementation Guide](./CHAT_IMPLEMENTATION.md)
