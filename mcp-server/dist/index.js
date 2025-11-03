// src/index.ts
import {
  McpServer,
  ResourceTemplate
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { z as z2 } from "zod";

// src/utils/trpc-client.ts
import { createTRPCClient, httpLink } from "@trpc/client";
import superjson from "superjson";
var apiBaseUrl = process.env.API_BASE_URL || "http://localhost:3001";
var trpcUrl = `${apiBaseUrl}/trpc/mcp`;
console.log(`[tRPC Client] Initializing with URL: ${trpcUrl}`);
var trpcClient = createTRPCClient({
  links: [
    httpLink({
      url: trpcUrl,
      transformer: superjson
    })
  ]
});

// src/tools/get-business-context.ts
var getBusinessContextTool = async () => {
  try {
    console.log("[getBusinessContextTool] Fetching business context...");
    const result = await trpcClient.getBusinessContext.query();
    return { businessContext: result };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[getBusinessContextTool] Error:", errorMessage);
    throw new Error(`Failed to get business context: ${errorMessage}`);
  }
};

// src/tools/get-last-chat.ts
var getLastChatTool = async () => {
  try {
    console.log("[getLastChatTool] Fetching last chat from tRPC...");
    const result = await trpcClient.getLastChat.query();
    console.log(
      "[getLastChatTool] Backend response received",
      `Type: ${typeof result}`,
      `Length: ${typeof result === "string" ? result.length : "N/A"}`
    );
    if (!result || typeof result === "string" && result.trim().length === 0) {
      throw new Error("Backend returned empty response");
    }
    const lastChat = typeof result === "string" ? result : JSON.stringify(result);
    console.log("[getLastChatTool] Successfully processed chat message");
    return { lastChat };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[getLastChatTool] Error:", errorMessage);
    throw new Error(`Failed to fetch last chat: ${errorMessage}`);
  }
};

// src/tools/create-action.ts
import { z } from "zod";
var createActionInputSchema = z.object({
  title: z.string().min(1, "Title cannot be empty")
});
var createActionTool = async (title) => {
  try {
    console.log(
      "[createActionTool] Attempting to create action with title:",
      title
    );
    const validatedInput = createActionInputSchema.parse({ title });
    const result = await trpcClient.createAction.mutate(validatedInput);
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[createActionTool] Failed to create action:", errorMessage);
    throw new Error(`Failed to create action: ${errorMessage}`);
  }
};

// src/index.ts
var server = new McpServer({
  name: "demo-server",
  version: "1.0.0"
});
server.registerTool(
  "Create Action Tool",
  {
    title: "Create Action Tool",
    description: "Create an action with a title. Example: Input: { title: 'Test Action' }, Output: { message: 'Action created successfully', title: 'Test Action' }",
    inputSchema: { title: z2.string() },
    outputSchema: { message: z2.string(), title: z2.string() }
  },
  async ({ title }) => {
    console.log("Attempting to create action with title:", title);
    const result = await createActionTool(title);
    console.log("Create Action Tool called and returned:", result);
    return {
      content: [{ type: "text", text: result.message }],
      structuredContent: result
    };
  }
);
server.registerTool(
  "Get Last Chat",
  {
    title: "Get Last Chat Tool",
    description: "Get the last chat message from the chat history. Example: Output: { lastChat: 'Hello, how are you?' }",
    outputSchema: { lastChat: z2.string() }
  },
  async () => {
    console.log("Attempting to get last chat");
    const result = await getLastChatTool();
    console.log("Get Last Chat Tool called and returned:", result);
    return {
      content: [{ type: "text", text: result.lastChat }],
      structuredContent: result
    };
  }
);
server.registerTool(
  "Get Business Context Tool",
  {
    title: "Get Business Context Tool",
    description: "Return the business context. Example: Output: { businessContext: 'The business name is John Doe and the business type is Software Development' }",
    outputSchema: { businessContext: z2.string() }
  },
  async () => {
    console.log("Attempting to get business context");
    const result = await getBusinessContextTool();
    console.log("Get Business Context Tool called and returned:", result);
    return {
      content: [{ type: "text", text: result.businessContext }],
      structuredContent: result
    };
  }
);
server.registerResource(
  "greeting",
  new ResourceTemplate("greeting://{name}", { list: void 0 }),
  {
    title: "Greeting Resource",
    // Display name for UI
    description: "Dynamic greeting generator"
  },
  async (uri, { name }) => ({
    contents: [
      {
        uri: uri.href,
        text: `Hello, ${name}!`
      }
    ]
  })
);
var app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.options(/.*/, (req, res) => {
  res.sendStatus(200);
});
app.get("/health", (req, res) => {
  res.json({ status: "ok", name: "demo-server", version: "1.0.0" });
});
app.post("/mcp", async (req, res) => {
  try {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: void 0,
      enableJsonResponse: true
    });
    res.on("close", () => {
      transport.close();
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("MCP request error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
var port = parseInt(process.env.PORT || "3002");
app.listen(port, () => {
  console.log(`Demo MCP Server running on http://localhost:${port}/mcp`);
  console.log(`Health check available at http://localhost:${port}/health`);
}).on("error", (error) => {
  console.error("Server error:", error);
  process.exit(1);
});
