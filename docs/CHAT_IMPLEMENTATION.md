# Chat Implementation Guide

## Overview

The AI Hub chat system is a sophisticated multi-assistant chat platform that uses tRPC for type-safe APIs, Socket.IO for real-time streaming, and the Vercel AI SDK for multi-provider LLM support. The system features intelligent context building, folder organization, and configurable assistant behaviors.

**Key Technologies:**
- Backend: tRPC + Express + MongoDB (Prisma)
- Frontend: React + TanStack Query + Socket.IO Client
- AI: Vercel AI SDK (OpenAI, Anthropic, Google Gemini)
- Real-time: Socket.IO with namespace-based rooms

---

## Data Models

### Assistants (aka "Sloane Experts")

Located in database as `assistants` collection:

```typescript
{
  id: string                    // MongoDB ObjectId
  name: string                  // "FreeStyle", "Marketing Expert", etc.
  description: string           // Assistant description
  jobTitle: string              // Display name
  basePrompt: string            // System prompt for the assistant
  image: string                 // Avatar image URL
  prompts: []                   // Suggested prompts for UI

  // Feature Configuration
  excludeBusinessContext: boolean    // Default: false
  isolateRagContext: boolean         // Default: false (RAG scoped to assistant)
  allowCrossChatMemory: boolean      // Default: true
}
```

**Special Assistant:**
- **FreeStyle** - Appears first, acts as general-purpose chat without specific expertise

### Chats

```typescript
{
  id: string                // MongoDB ObjectId
  user: string              // Clerk user ID
  assistant: string?        // Assistant ID (nullable)
  folderId: string?         // Folder ID (nullable)
  title: string             // Chat title (default: "** New Chat **")
  messages: ChatsMessages[] // Embedded message array
  createdAt: Date
  updatedAt: Date
}
```

### Messages (Embedded)

```typescript
{
  id: string           // Message ID
  question: string     // User's prompt
  answer: string       // AI response
  file_type?: string   // "PDF" | "Image"
  imageUrl?: string    // Blob URL (browser only)
  imageName?: string   // Filename
  createdAt: Date
  updatedAt: Date
}
```

### Folders

```typescript
{
  id: string           // Folder ID
  user: string         // Clerk user ID
  assistant: string?   // Scoped to assistant
  title: string        // Folder name
  chats: string[]      // Array of chat IDs
}
```

---

## Backend Architecture

### tRPC Router Structure

**Location:** `backend/src/routers/chat.router.ts`

The chat router is mounted at `appApiRouter.chats` and provides:

#### Chat Operations
- `chats.create` - Create new chat
- `chats.list` - List chats by assistant (includes folders)
- `chats.get` - Get single chat with messages
- `chats.updateTitle` - Rename chat
- `chats.delete` - Delete chat
- `chats.sendMessage` - Send message (triggers streaming)
- `chats.getChatsByUser` - Admin: get user's chats

#### Folder Operations
- `chats.folders.create` - Create folder
- `chats.folders.list` - List folders by assistant
- `chats.folders.get` - Get folder details
- `chats.folders.getChatsByFolder` - Get chats in folder
- `chats.folders.updateTitle` - Rename folder
- `chats.folders.delete` - Delete folder
- `chats.folders.moveChat` - Move chat to folder

#### Assistant Operations
- `chats.assistants.list` - List all assistants

---

## Message Flow

### 1. User Sends Message

**Frontend:** `ChatContext.sendChat()`

```typescript
// 1. Create chat if needed
if (!chatId) {
  chat = await createChat(assistantId, folderId)
}

// 2. Convert file to base64
const fileData = file ? {
  data: base64String,
  mimeType: file.type,
  filename: file.name
} : undefined

// 3. Add optimistic message to UI
setSelectedChat(chat => ({
  ...chat,
  messages: [...messages, optimisticMessage]
}))

// 4. Call tRPC mutation
await sendMessageMutation.mutateAsync({
  chatId,
  message: prompt,
  file: fileData,
  enableTools: false  // Optional RAG tools
})
```

### 2. Backend Processing

**Service:** `backend/src/services/chat/send-message.service.ts`

```typescript
async function sendMessage(userId, input) {
  // 1. Get chat from database
  const chat = await prisma.chats.findFirst({ ... })

  // 2. Build context configuration from assistant
  const contextConfig = await contextBuilderService.buildConfigFromAssistant(
    userId,
    chat.assistant,
    input.message
  )

  // 3. Build system prompt from config
  const systemPrompt = await contextBuilderService.buildContextFromConfig(contextConfig)

  // 4. Format message history (AI SDK format)
  const messages = [
    ...chat.messages.flatMap(msg => [
      { role: "user", content: msg.question },
      { role: "assistant", content: msg.answer }
    ]),
    { role: "user", content: input.message }
  ]

  // 5. Stream response using AI SDK
  await streamChatWithAISDK({
    chatId,
    messages,
    systemPrompt,
    file: input.file,
    userId,
    assistantId: chat.assistant,
    tools: input.enableTools ? createRagTools(...) : undefined,
    onComplete: async (response) => {
      // Save to database
      await prisma.chats.update({
        data: {
          messages: [...chat.messages, newMessage]
        }
      })

      // Memory batch processing (every 5 messages)
      if (totalMessages % 5 === 0 && contextConfig.features.memory?.enabled) {
        processMemoryBatch(userId, lastFiveMessages)
      }
    }
  })
}
```

### 3. Context Building

**Service:** `backend/src/services/chat/context-builder.service.ts`

The context builder assembles the system prompt from multiple sources:

```typescript
async buildContextFromConfig(config: ContextConfig): Promise<string> {
  const parts = []

  // 1. User Memory (if enabled)
  if (config.features.memory?.enabled) {
    const memory = await getUserMemory(userId)
    parts.push(memory)
  }

  // 2. Assistant Base Prompt
  if (config.features.assistantPrompt?.enabled) {
    const prompt = await getAssistantPrompt(assistantId)
    parts.push(prompt)
  }

  // 3. Business Context (if enabled)
  if (config.features.businessContext?.enabled) {
    const business = await getBusinessContext(userId)
    parts.push(business)
  }

  // 4. RAG Context (semantic search)
  if (config.features.rag?.enabled) {
    const ragContext = await findRelevantContent(
      userQuery,
      userId,
      assistantId,
      isolateToAssistant
    )
    parts.push(ragContext)
  }

  // 5. Formatting instructions
  parts.push("FORMATTING: Always format your responses using proper Markdown syntax.")

  return parts.join("\n\n")
}
```

**Configuration from Assistant:**

```typescript
async buildConfigFromAssistant(userId, assistantId, userQuery) {
  const assistant = await prisma.assistants.findUnique({ ... })

  return {
    userId,
    assistantId,
    userQuery,
    features: {
      memory: {
        enabled: assistant.allowCrossChatMemory
      },
      assistantPrompt: {
        enabled: true
      },
      businessContext: {
        enabled: !assistant.excludeBusinessContext
      },
      rag: {
        enabled: true,
        assistantId,
        isolateToAssistant: assistant.isolateRagContext,
        limit: 5
      }
    }
  }
}
```

### 4. AI Streaming

**Service:** `backend/src/services/chat/stream-ai-sdk.service.ts`

```typescript
async function streamChatWithAISDK(options) {
  // 1. Get AI model based on config
  const aiConfig = await Config.findOne()
  const model = getAIModel(aiConfig.aiService) // openai, anthropic, google

  // 2. Handle file attachments
  if (file?.mimeType === "application/pdf") {
    const pdfText = await extractPdfText(file.data)
    lastMessage.content = `Document Content:\n${pdfText}\n\nUser Question: ${content}`
  } else if (file?.mimeType.startsWith("image/")) {
    lastMessage.content = [
      { type: "text", text: content },
      { type: "image", image: `data:${mimeType};base64,${data}` }
    ]
  }

  // 3. Stream using AI SDK
  const result = streamText({
    model,
    system: systemPrompt,
    messages,
    temperature: 0.7,
    tools  // Optional RAG tools
  })

  // 4. Emit chunks to Socket.IO
  for await (const part of result.fullStream) {
    if (part.type === "text-delta") {
      fullResponse += part.text
      chatNamespace.to(chatId).emit("chat:response", fullResponse)
    } else if (part.type === "tool-call") {
      chatNamespace.to(chatId).emit("chat:tool_call", { ... })
    }
  }

  // 5. Complete
  chatNamespace.to(chatId).emit("chat:stream_end", fullResponse)
  await onComplete(fullResponse)
}
```

### 5. Frontend Real-time Updates

**Hook:** `frontend/src/app/components/chats/chat-window/hooks/use-socket.ts`

```typescript
export const useSocket = ({ chatId, namespace = "/chat", onResponse, onStreamEnd }) => {
  useEffect(() => {
    // 1. Connect to Socket.IO namespace
    const socket = io(baseUrl + namespace, {
      transports: ["websocket", "polling"]
    })

    // 2. Join chat room
    socket.emit("joinRoom", chatId)

    // 3. Listen for streaming events
    socket.on("chat:response", onResponse)        // Incremental updates
    socket.on("chat:stream_end", onStreamEnd)     // Final response
    socket.on("chat:error", onError)

    return () => socket.disconnect()
  }, [chatId, namespace])
}
```

**Component:** `frontend/src/app/components/chats/chat-window/chat-window.tsx`

```typescript
const handleOpenAiResponse = (fullResponse: string) => {
  setIsStreaming(true)
  setSelectedChat(chat => {
    const messages = [...chat.messages]
    messages[messages.length - 1] = {
      ...lastMessage,
      answer: cleanMarkdownResponse(fullResponse)
    }
    return { ...chat, messages }
  })
}

const handleStreamEnd = (fullResponse: string) => {
  setIsStreaming(false)
  // Final update + trigger memory processing
  processMessageBatch(newMessage)
}

useSocket({
  chatId: selectedChat?.id,
  onResponse: handleOpenAiResponse,
  onStreamEnd: handleStreamEnd
})
```

---

## Frontend Implementation

### tRPC Hooks

**Location:** `frontend/src/api/use-chat-api.ts`

```typescript
// Query hooks
export const useListChats = (assistantId: string) => {
  return useQuery(trpc.chats.list.queryOptions({ assistantId }))
}

export const useGetChat = (chatId: string) => {
  return useQuery(trpc.chats.get.queryOptions({ chatId }))
}

export const useChatAssistantList = () => {
  return useQuery(trpc.chats.assistants.list.queryOptions())
}

// Mutation hooks with optimistic updates
export const useCreateChat = () => {
  return useMutation(trpc.chats.create.mutationOptions({
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries(trpc.chats.pathFilter())
    }
  }))
}

export const useUpdateChatTitle = () => {
  return useMutation(trpc.chats.updateTitle.mutationOptions({
    onMutate: async ({ chatId, title }) => {
      // Optimistic update - immediately update cache
      queryClient.setQueriesData(
        { queryKey: trpc.chats.list.queryKey() },
        (old) => updateTitleInCache(old, chatId, title)
      )
    },
    onError: (err, variables, context) => {
      // Rollback on error
      restorePreviousCache(context)
    }
  }))
}

export const useDeleteChat = () => {
  return useMutation(trpc.chats.delete.mutationOptions({
    onMutate: async ({ chatId }) => {
      // Optimistic removal
      queryClient.setQueriesData(
        { queryKey: trpc.chats.list.queryKey() },
        (old) => removeChatFromCache(old, chatId)
      )
    }
  }))
}
```

### Chat Context

**Location:** `frontend/src/context/ChatContext.tsx`

Provides global chat state management:

```typescript
interface IChatContextState {
  selectedChat: Chat | undefined
  setSelectedChat: (chat: Chat) => void
  selectChat: (chatId: string) => Promise<void>
  sendChat: (prompt, assistantId, file?, chatId?, folderId?) => Promise<void>
  createChat: (assistantId, folderId?) => Promise<Chat>
  deleteChat: (chatId: string) => Promise<void>
  updateChatTitle: (chatId: string, newTitle: string) => Promise<void>
  isMessageLoading: boolean
  resetChat: () => void
}
```

**Key Features:**
- Auto-select chat from URL params (`?chat=chatId`)
- Optimistic message rendering
- Temp chat IDs for UI responsiveness
- File upload support (images + PDFs)

---

## Assistant Configuration

Each assistant can be configured with three feature flags:

### 1. excludeBusinessContext (default: false)

When `true`, the assistant will NOT include the user's business profile in the context.

**Use case:** General-purpose assistants that don't need business-specific context.

### 2. isolateRagContext (default: false)

When `true`, RAG (knowledge base) search is scoped only to resources uploaded for this specific assistant.

When `false`, RAG search includes all user resources across all assistants.

**Use case:** Specialized experts that should only reference their domain-specific knowledge.

### 3. allowCrossChatMemory (default: true)

When `true`, the assistant includes the user's memory items (facts extracted from previous conversations).

When `false`, the assistant operates without historical memory context.

**Use case:** Privacy-sensitive assistants or fresh-start conversations.

---

## Folder Organization

Folders provide hierarchical organization of chats within an assistant:

```
FreeStyle
├── Folder: "Marketing Ideas"
│   ├── Chat: "Q4 Campaign"
│   └── Chat: "Social Media Strategy"
├── Chat: "Random Chat"
└── Chat: "Another Chat"
```

**Backend List Response:**

```typescript
{
  assistantName: "FreeStyle",
  folders: [
    {
      id: "folder-id",
      title: "Marketing Ideas",
      chats: [
        { id: "chat-1", title: "Q4 Campaign" },
        { id: "chat-2", title: "Social Media Strategy" }
      ]
    }
  ],
  chats: [
    { id: "chat-3", title: "Random Chat" },
    { id: "chat-4", title: "Another Chat" }
  ]
}
```

**Moving Chats:**

```typescript
// Move to folder
await moveChat(chatId, folderId)

// Move to root (no folder)
await moveChat(chatId, undefined)
```

---

## Memory Processing

**Location:** `backend/src/services/memory/batch-processor.service.ts`

Memory extraction happens automatically every 5 messages:

```typescript
// In send-message.service.ts
const totalMessages = chat.messages.length + 1

if (totalMessages % 5 === 0 && contextConfig.features.memory?.enabled) {
  const lastFiveMessages = [...messages.slice(-4), newMessage]
  processMemoryBatch(userId, lastFiveMessages).catch(error => {
    logger.error("Error in background memory processing:", error)
  })
}
```

The batch processor:
1. Sends last 5 Q&A pairs to LLM
2. Extracts factual information about the user
3. Updates `usermemories` collection
4. New memories are automatically included in future context builds

---

## RAG Tools (Optional)

When `enableTools: true` is passed to `sendMessage`, the assistant gains access to RAG search tools:

**Factory:** `backend/src/services/chat/rag-tools.factory.ts`

```typescript
export function createRagTools(userId, assistantId, isolateToAssistant) {
  return {
    search_knowledge_base: tool({
      description: "Search the user's knowledge base for relevant information",
      parameters: z.object({
        query: z.string().describe("Search query")
      }),
      execute: async ({ query }) => {
        const results = await findRelevantContent(
          query,
          userId,
          assistantId,
          isolateToAssistant,
          5
        )
        return formatResults(results)
      }
    })
  }
}
```

The LLM can now call this tool during streaming to fetch relevant knowledge base content dynamically.

---

## API Routes Summary

### tRPC Routes (Type-safe)

**Base:** `/trpc/app`

```
POST /trpc/app/chats.create
GET  /trpc/app/chats.list?input={"assistantId":"abc"}
GET  /trpc/app/chats.get?input={"chatId":"abc"}
POST /trpc/app/chats.updateTitle
POST /trpc/app/chats.delete
POST /trpc/app/chats.sendMessage

POST /trpc/app/chats.folders.create
GET  /trpc/app/chats.folders.list
GET  /trpc/app/chats.folders.get
GET  /trpc/app/chats.folders.getChatsByFolder
POST /trpc/app/chats.folders.updateTitle
POST /trpc/app/chats.folders.delete
POST /trpc/app/chats.folders.moveChat

GET  /trpc/app/chats.assistants.list
```

### Socket.IO Namespaces

```
/chat - Expert chat streaming (default)
/rag  - Playground chat streaming (legacy)
```

**Events:**
- Client → Server: `joinRoom(chatId)`
- Server → Client: `chat:response(fullResponse)` - Incremental updates
- Server → Client: `chat:stream_end(fullResponse)` - Completion
- Server → Client: `chat:error({ message })` - Error handling
- Server → Client: `chat:tool_call({ toolName, args })` - Tool execution

---

## UI Flow

### 1. Select Assistant

**Route:** `/ai-chats`

```typescript
// Fetch assistants
const { data } = useChatAssistantList()

// Display FreeStyle + Sloane Experts
<AssistantCard assistant={data.freeStyle} />
<AssistantList assistants={data.assistants} />

// Click navigates to: /ai-chats/{assistantId}
```

### 2. View Chats

**Route:** `/ai-chats/{assistantId}`

```typescript
// Fetch chats for assistant
const { data } = useListChats(assistantId)

// Display folder structure
data.folders.map(folder => (
  <Folder title={folder.title}>
    {folder.chats.map(chat => <ChatItem chat={chat} />)}
  </Folder>
))

// Root-level chats
data.chats.map(chat => <ChatItem chat={chat} />)

// Click chat navigates to: /ai-chats/{assistantId}?chat={chatId}
```

### 3. Chat Interface

**Route:** `/ai-chats/{assistantId}?chat={chatId}`

```typescript
// Auto-load chat from URL
useEffect(() => {
  const chatId = searchParams.get("chat")
  if (chatId) selectChat(chatId)
}, [searchParams])

// Render messages
<MessageList messages={selectedChat.messages} />

// Send message
<ChatInput onSubmit={(message, file) => {
  sendChat(message, assistantId, file, chatId)
}} />
```

---

## Key Differences: Experts vs Playground

| Feature | Experts (Assistants) | Playground |
|---------|---------------------|------------|
| **Database Model** | `chats` collection | No persistence (legacy) |
| **Socket Namespace** | `/chat` | `/rag` |
| **Context Building** | Full (memory, business, RAG, assistant prompt) | Minimal |
| **Folder Support** | ✅ Yes | ❌ No |
| **Assistant Config** | ✅ Feature flags | ❌ N/A |
| **Multi-provider** | ✅ OpenAI, Anthropic, Gemini | ✅ Same |
| **Tool Support** | ✅ Optional RAG tools | ✅ Built-in |
| **UI Route** | `/ai-chats/{assistantId}` | `/playground` |

---

## File Attachment Support

### Images

```typescript
// Frontend: Convert to blob URL for preview
const imageUrl = URL.createObjectURL(file)

// Backend: Extract base64 data
const base64 = buffer.toString('base64')

// AI SDK: Multi-modal content
{
  role: "user",
  content: [
    { type: "text", text: "What's in this image?" },
    { type: "image", image: `data:image/jpeg;base64,${base64}` }
  ]
}
```

### PDFs

```typescript
// Backend: Extract text using pdf-parse
import pdfParse from "pdf-parse"

const buffer = Buffer.from(base64, "base64")
const data = await pdfParse(buffer)
const text = data.text

// Prepend to user message
const userMessage = `Document Content:\n${text}\n\nUser Question: ${prompt}`
```

---

## Error Handling

### Frontend

```typescript
// Optimistic updates with rollback
onMutate: async (variables) => {
  // Cancel outgoing requests
  await queryClient.cancelQueries(trpc.chats.pathFilter())

  // Snapshot previous data
  const previousData = queryClient.getQueryData(queryKey)

  // Update cache optimistically
  queryClient.setQueryData(queryKey, newData)

  return { previousData }
},
onError: (err, variables, context) => {
  // Rollback on error
  queryClient.setQueryData(queryKey, context.previousData)
}
```

### Backend

```typescript
try {
  // Service logic
} catch (error) {
  logger.error("Error:", error)

  // Socket error event
  chatNamespace.to(chatId).emit("chat:error", {
    message: "An error occurred during streaming"
  })

  // tRPC error
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Failed to send message"
  })
}
```

---

## Performance Optimizations

### 1. Optimistic Updates

All mutations (create, update, delete) update the cache immediately for instant UI feedback.

### 2. Selective Invalidation

```typescript
// Invalidate specific queries only
queryClient.invalidateQueries({
  queryKey: trpc.chats.get.queryKey({ chatId })
})

// Broad invalidation for background sync
queryClient.invalidateQueries(trpc.chats.pathFilter())
```

### 3. Message Streaming

Socket.IO provides incremental updates instead of waiting for full response.

### 4. Memory Background Processing

Memory extraction runs asynchronously without blocking the response:

```typescript
processMemoryBatch(userId, messages).catch(error => {
  logger.error("Error in background memory processing:", error)
})
```

### 5. Temp Chat IDs

Frontend assigns temporary IDs (`temp-{timestamp}`) for instant navigation, replaced with real IDs after creation.

---

## Development Tips

### Testing Chat Flow

```bash
# 1. Start backend
cd backend && npm run dev

# 2. Start frontend
cd frontend/apps/user-app && npm run dev

# 3. Check Socket.IO connection
# Browser console should show: "socket connected"
```

### Debugging Context Building

Add logging in `context-builder.service.ts`:

```typescript
logger.info("Context built for chat", {
  chatId,
  assistantId,
  features: contextConfig.features,
  systemPromptLength: systemPrompt.length
})
```

### Testing RAG Tools

```typescript
// Enable tools in ChatInput
await sendChat(prompt, assistantId, file, chatId, folderId, {
  enableTools: true
})

// Watch backend logs for tool calls
// Backend console: "Tool called during chat: search_knowledge_base"
```

### Modifying Assistant Prompts

```bash
# Update assistant base prompt in MongoDB
db.assistants.updateOne(
  { name: "Marketing Expert" },
  { $set: { basePrompt: "New system prompt..." } }
)
```

---

## Common Use Cases

### 1. Create New Chat

```typescript
// No existing chat - auto-create
await sendChat(
  "Hello",
  assistantId,  // Required
  null,         // No file
  undefined,    // No chatId (will create)
  folderId      // Optional folder
)
```

### 2. Continue Existing Chat

```typescript
// Chat already selected
await sendChat(
  "Follow-up question",
  assistantId,
  null,
  selectedChat.id  // Existing chat
)
```

### 3. Upload File

```typescript
// With image
await sendChat(
  "Analyze this image",
  assistantId,
  imageFile,  // File object
  chatId
)

// With PDF
await sendChat(
  "Summarize this document",
  assistantId,
  pdfFile,
  chatId
)
```

### 4. Organize with Folders

```typescript
// Create folder
const folder = await createFolder({
  title: "Marketing Ideas",
  assistantId
})

// Create chat in folder
await createChat({
  assistantId,
  folderId: folder.id,
  title: "Q4 Campaign"
})

// Move existing chat to folder
await moveChat(chatId, folderId)
```

### 5. Disable Business Context

```bash
# Update assistant config
db.assistants.updateOne(
  { name: "Privacy Expert" },
  { $set: { excludeBusinessContext: true } }
)
```

---

## Troubleshooting

### Chat Not Loading

1. Check URL params: `/ai-chats/{assistantId}?chat={chatId}`
2. Verify chat ownership: `chat.user === userId`
3. Check browser console for tRPC errors

### Streaming Not Working

1. Verify Socket.IO connection: Check `isConnected` state
2. Ensure `joinRoom` event was emitted
3. Check backend logs for streaming errors
4. Verify CORS settings for WebSocket

### Missing Context

1. Check assistant configuration flags
2. Verify RAG resources exist: `db.resources.find({ userId })`
3. Check memory enabled: `db.usermemories.findOne({ userId })`
4. Review backend logs for context build errors

### Optimistic Update Issues

1. Check cache invalidation in mutation hooks
2. Verify `onError` rollback logic
3. Inspect TanStack Query DevTools for cache state

---

## Related Documentation

- [RAG_IMPLEMENTATION_GUIDE.md](./RAG_IMPLEMENTATION_GUIDE.md) - Knowledge base setup
- [TRPC_IMPLEMENTATION_GUIDE.md](./TRPC_IMPLEMENTATION_GUIDE.md) - tRPC setup and patterns
- [backend/src/model/db/schema.prisma](../backend/src/model/db/schema.prisma) - Database schema
- [Vercel AI SDK Docs](https://sdk.vercel.ai/docs) - AI streaming patterns
