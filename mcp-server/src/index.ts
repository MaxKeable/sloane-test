import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { z } from "zod";
import { getBusinessContextTool } from "./tools/get-business-context.js";
import { getLastChatTool } from "./tools/get-last-chat.js";
import { createActionTool } from "./tools/create-action.js";

// Create an MCP server
const server = new McpServer({
  name: "demo-server",
  version: "1.0.0",
});

// Add an addition tool
server.registerTool(
  "Create Action Tool",
  {
    title: "Create Action Tool",
    description:
      "Create an action with a title. Example: Input: { title: 'Test Action' }, Output: { message: 'Action created successfully', title: 'Test Action' }",
    inputSchema: { title: z.string() },
    outputSchema: { message: z.string(), title: z.string() },
  },
  async ({ title }) => {
    console.log("Attempting to create action with title:", title);
    const result = await createActionTool(title);
    console.log("Create Action Tool called and returned:", result);
    return {
      content: [{ type: "text", text: result.message }],
      structuredContent: result,
    };
  }
);

server.registerTool(
  "Get Last Chat",
  {
    title: "Get Last Chat Tool",
    description:
      "Get the last chat message from the chat history. Example: Output: { lastChat: 'Hello, how are you?' }",
    outputSchema: { lastChat: z.string() },
  },
  async () => {
    console.log("Attempting to get last chat");
    const result = await getLastChatTool();
    console.log("Get Last Chat Tool called and returned:", result);
    return {
      content: [{ type: "text", text: result.lastChat }],
      structuredContent: result,
    };
  }
);

server.registerTool(
  "Get Business Context Tool",
  {
    title: "Get Business Context Tool",
    description:
      "Return the business context. Example: Output: { businessContext: 'The business name is John Doe and the business type is Software Development' }",
    outputSchema: { businessContext: z.string() },
  },
  async () => {
    console.log("Attempting to get business context");
    const result = await getBusinessContextTool();
    console.log("Get Business Context Tool called and returned:", result);
    return {
      content: [{ type: "text", text: result.businessContext }],
      structuredContent: result,
    };
  }
);

// Add a dynamic greeting resource
server.registerResource(
  "greeting",
  new ResourceTemplate("greeting://{name}", { list: undefined }),
  {
    title: "Greeting Resource", // Display name for UI
    description: "Dynamic greeting generator",
  },
  async (uri, { name }) => ({
    contents: [
      {
        uri: uri.href,
        text: `Hello, ${name}!`,
      },
    ],
  })
);

// Set up Express and HTTP transport
const app = express();
app.use(express.json());

// Add CORS headers for ngrok compatibility
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.options(/.*/, (req, res) => {
  res.sendStatus(200);
});

// Health check endpoint for discoverability
app.get("/health", (req, res) => {
  res.json({ status: "ok", name: "demo-server", version: "1.0.0" });
});

// Main MCP endpoint
app.post("/mcp", async (req, res) => {
  try {
    // Create a new transport for each request to prevent request ID collisions
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
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

const port = parseInt(process.env.PORT || "3002");
app
  .listen(port, () => {
    console.log(`Demo MCP Server running on http://localhost:${port}/mcp`);
    console.log(`Health check available at http://localhost:${port}/health`);
  })
  .on("error", (error) => {
    console.error("Server error:", error);
    process.exit(1);
  });
