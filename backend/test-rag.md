# 🧪 RAG System Quick Test Guide

## ✅ Pre-flight Checklist

Before testing, ensure:
- [x] Backend is running (`npm run dev`)
- [ ] MongoDB Atlas vector index is created (see below)
- [x] OpenAI API key is set in `.env`
- [x] You have a valid Clerk authentication token

---

## 🔧 Step 1: Create MongoDB Atlas Vector Index

**This is REQUIRED for vector search to work!**

1. Go to https://cloud.mongodb.com
2. Navigate to your cluster → Browse Collections
3. Find the `embeddings` collection (it exists now after `prisma db push`)
4. Click **Search Indexes** tab
5. Click **Create Search Index**
6. Select **JSON Editor**
7. Name it `vector_index`
8. Paste this JSON:

```json
{
  "name": "vector_index",
  "type": "vectorSearch",
  "definition": {
    "fields": [
      {
        "type": "vector",
        "path": "embedding",
        "numDimensions": 1536,
        "similarity": "cosine"
      },
      {
        "type": "filter",
        "path": "userId"
      }
    ]
  }
}
```

9. Click **Create**
10. Wait 1-2 minutes for index to build
11. Verify status shows "Active"

---

## 🧪 Step 2: Test Resource Creation

### **Option A: Using Frontend tRPC (Recommended)**

```typescript
// In your browser console (after implementing frontend)
const result = await trpc.rag.resources.create.mutate({
  content: "Our company was founded in 2020 in San Francisco. We specialize in AI-powered business solutions. Our team consists of 50 talented engineers and designers. We serve over 1000 clients worldwide.",
  metadata: {
    title: "Company Overview"
  }
});

console.log('Resource created:', result);
```

### **Option B: Using curl**

```bash
# Get your Clerk token from the browser (in console: `await clerk.session.getToken()`)
TOKEN="your_clerk_token_here"

curl -X POST "http://localhost:3000/trpc/rag.resources.create" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Our company was founded in 2020 in San Francisco. We specialize in AI-powered business solutions. Our team consists of 50 talented engineers and designers. We serve over 1000 clients worldwide.",
    "metadata": {
      "title": "Company Overview"
    }
  }'
```

### **Expected Result:**

```json
{
  "success": true,
  "message": "Resource created and embedded successfully",
  "resourceId": "some-mongo-id"
}
```

### **Verify in Database:**

```bash
# From backend directory
npx prisma studio
```

Check:
- ✅ 1 new entry in `resources` collection
- ✅ Multiple entries in `embeddings` collection (one per chunk)
- ✅ Each embedding has `embedding` field with array of 1536 floats

---

## 🔍 Step 3: Test Vector Search (Chat)

### **Create a test HTML file:**

Save this as `test-rag-chat.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <title>RAG Chat Test</title>
  <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
</head>
<body>
  <h1>RAG Chat Test</h1>
  <div id="output" style="white-space: pre-wrap; border: 1px solid #ccc; padding: 10px; min-height: 200px;"></div>
  
  <script>
    const socket = io('http://localhost:3000');
    const output = document.getElementById('output');
    const chatId = 'test-chat-' + Date.now();
    
    socket.emit('joinRoom', chatId);
    
    socket.on('rag_response', (response) => {
      output.textContent = 'Streaming: ' + response;
    });
    
    socket.on('rag_tool_call', (data) => {
      console.log('Tool called:', data);
      output.textContent += '\n\nTool: ' + data.toolName;
    });
    
    socket.on('stream_end', (data) => {
      output.textContent = 'Complete:\n\n' + data.response;
      console.log('Tool calls:', data.toolCalls);
    });
    
    // Test after 2 seconds
    setTimeout(async () => {
      const token = 'YOUR_CLERK_TOKEN'; // Replace with actual token
      
      const response = await fetch('http://localhost:3000/trpc/rag.chat.stream', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chatId: chatId,
          messages: [
            { role: 'user', content: 'When was the company founded?' }
          ]
        })
      });
      
      console.log('Response:', await response.json());
    }, 2000);
  </script>
</body>
</html>
```

Open in browser and check:
- ✅ You see "Tool: getInformation" appear
- ✅ Response mentions "2020" and "San Francisco"
- ✅ Response is based on the resource you created

---

## 🎯 Step 4: Test Adding Resources via Chat

```typescript
// Send this message
await trpc.rag.chat.stream.mutate({
  chatId: 'test-chat-' + Date.now(),
  messages: [
    { 
      role: 'user', 
      content: 'Remember this: Our main product is called SmartFlow AI and it costs $99/month.' 
    }
  ]
});
```

**Expected Behavior:**
1. AI calls `addResource` tool
2. Information is saved to knowledge base
3. AI confirms it was saved
4. You can now ask "What is our main product?" and it will know

---

## 📊 Step 5: Verify Everything Works

### **Test Queries to Try:**

After adding a few resources, test these queries:

```typescript
// Should find the answer
"When was the company founded?"
"How many employees do we have?"
"What is our main product?"

// Should say "I don't have information"
"What is the weather today?"
"Who won the Super Bowl?"
```

### **Check Database:**

```bash
npx prisma studio
```

Verify:
- Multiple entries in `resources`
- Each resource has multiple `embeddings`
- `userId` is correctly set on all entries

---

## 🚨 Common Issues

### **Issue: "Socket.IO not initialized"**

**Fix:** Restart backend server
```bash
npm run dev
```

### **Issue: "No relevant information found"**

**Possible causes:**
1. Vector index not created in Atlas → Create it (see Step 1)
2. Vector index still building → Wait 2-3 minutes
3. Similarity threshold too high → Lower from 0.7 to 0.5 in `embeddingService.ts`

```typescript
// In findRelevantContent function
{
  $match: {
    score: { $gte: 0.5 }  // Changed from 0.7
  }
}
```

### **Issue: "UNAUTHORIZED" error**

**Fix:** Provide valid Clerk token:
```javascript
// In browser console
const token = await clerk.session.getToken();
console.log(token);
```

### **Issue: Embeddings not created**

**Check:**
1. OpenAI API key in `.env` file
2. OpenAI API key has credits
3. Check backend logs for errors

---

## ✅ Success Criteria

You'll know it's working when:

1. ✅ Resource creation returns success
2. ✅ Embeddings appear in database
3. ✅ Vector search finds relevant content
4. ✅ Chat responses use retrieved information
5. ✅ AI can add resources when you share information
6. ✅ Socket.IO events stream properly

---

## 🎉 Next Steps

Once everything is working:

1. Implement frontend components
2. Add PDF upload functionality
3. Create resource management UI
4. Add analytics dashboard
5. Deploy to production

---

## 📞 Support

If you're stuck:
1. Check backend console for errors
2. Verify MongoDB Atlas index status
3. Check OpenAI API usage in dashboard
4. Ensure Clerk authentication is working

**The most common issue is forgetting to create the MongoDB Atlas vector index!**
