# Web Search Tool - Quick Setup Guide

## 🚀 Quick Start

### 1. Get Serper API Key
```bash
# Visit https://serper.dev and sign up
# Copy your API key (2500 free searches/month)
```

### 2. Configure Backend
```bash
# Add to backend/.env
echo "SERPER_API_KEY=your_api_key_here" >> backend/.env
```

### 3. Test It!

**Frontend Example:**
```typescript
import { useChat } from "@/context/ChatContext";

const { sendChat } = useChat();

// Send message with web search enabled
await sendChat(
  "What are the latest AI developments?",
  assistantId,
  null,    // no file
  chatId,
  folderId,
  true     // enableWebSearch = true ✨
);
```

That's it! The AI can now search Google during conversations.

## 📁 What Was Created

```
backend/src/services/
├── chat/tools/
│   ├── types.ts                    # Shared types
│   ├── rag-tools.factory.ts        # Refactored RAG tools
│   ├── web-search-tools.factory.ts # NEW: Google Search
│   └── index.ts                    # Tool composer
└── web-search/
    └── serper.service.ts           # Serper API integration
```

## 🎯 Key Features

- ✅ Plug & Play architecture
- ✅ Works with any assistant
- ✅ Combines with RAG tools
- ✅ Real-time Socket.IO events
- ✅ Type-safe end-to-end

## 📖 Full Documentation

See [docs/WEB_SEARCH_TOOL.md](./docs/WEB_SEARCH_TOOL.md) for:
- Complete API reference
- Frontend integration examples
- Per-assistant configuration
- Error handling
- Performance tips

## 🧪 Test Commands

```bash
# Start backend with logs
cd backend && npm run dev

# Test Serper API directly
curl -X POST https://google.serper.dev/search \
  -H "X-API-KEY: $SERPER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"q":"test query","num":3}'
```

## 🔧 Frontend Integration Options

### Option 1: Manual Control
```typescript
<Button onClick={() => sendChat(message, assistantId, null, chatId, folderId, true)}>
  Send with Web Search
</Button>
```

### Option 2: Toggle
```typescript
const [webSearchEnabled, setWebSearchEnabled] = useState(false);

<Checkbox
  checked={webSearchEnabled}
  onChange={(e) => setWebSearchEnabled(e.target.checked)}
/>

<ChatInput onSubmit={(msg) =>
  sendChat(msg, assistantId, null, chatId, folderId, webSearchEnabled)
} />
```

### Option 3: Auto-Enable for Specific Assistants
```typescript
// In future: Add allowWebSearch to assistants table
// Then auto-enable based on assistant config
```

## 📊 Usage Example

**User:** "What happened in San Francisco last week?"

**AI Tool Call:**
```json
{
  "toolName": "searchWeb",
  "args": {
    "query": "San Francisco news last week",
    "numResults": 5
  }
}
```

**AI Response:**
```
Based on recent news from San Francisco:

1. **Tech Conference Announcement** - A major AI conference was announced for Q2 2025...
   [Source: techcrunch.com/article]

2. **City Council Decision** - The city approved new housing developments...
   [Source: sfchronicle.com/news]

[Citations included automatically]
```

## 🎛️ Configuration Options

All tools are configured via the tool composer:

```typescript
createChatTools({
  userId,
  assistantId,
  enabledTools: {
    rag: true,         // Knowledge base search
    webSearch: true    // Google search
  },
  isolateRagToAssistant: false,
  callbacks: {
    onToolCall: (name, args) => logger.info(name, args)
  }
})
```

## 🐛 Common Issues

**"Web search not configured"**
- Missing `SERPER_API_KEY` in `.env`

**Tool not being called**
- Ensure `enableWebSearch: true` in frontend
- Check backend logs for tool registration

**Rate limit errors**
- Serper free tier: 2500/month
- Consider caching identical queries

## 🚀 Next Steps

1. ✅ Setup complete - Test it!
2. Add UI toggle for web search
3. Configure per-assistant settings
4. Monitor usage via Serper dashboard

---

**Need Help?** See full docs: `docs/WEB_SEARCH_TOOL.md`
