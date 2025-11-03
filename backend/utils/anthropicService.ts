import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import { io } from "../index";
import Chat from "../models/chat";

dotenv.config();

interface ImageData {
  mimeType: string;
  data: string; // base64
}

const anthropicService = async (
  room: string,
  chatId: string,
  prompt: string,
  context: any,
  basePrompt?: string,
  businessPrompt?: string,
  pdfText?: string,
  imageData?: ImageData | null,
  memory?: string
) => {
  const chat = await Chat.findById(chatId);
  if (!chat) return;

  io.on("connection", (socket) => {
    socket.on("joinRoom", (chatId: string) => {
      socket.join(chatId);
      console.log(`User joined room ${chatId}`);
    });
  });

  let systemPrompt = "";

  if (memory) {
    systemPrompt += `${memory}\n\nIMPORTANT: Always refer back to any relevant facts from user memory to personalize your replies, such as names, preferences, goals, or instructions.\n`;
  }

  // Build system prompt
  systemPrompt = `
You are a helpful, conversational assistant. Respond in a natural, friendly, and flowing manner, as if you are having a real-time conversation with the user. Do not add titles, headlines, or section headers to the beginning of your responses—just reply conversationally. If the user provides information about their business background or onboarding, use it to tailor your advice. If the user has not answered some business background or onboarding questions, proceed with the information you do have—do not insist on getting all answers before helping. If the user asks a question or wants to discuss something else, respond helpfully using whatever information is available.
`;

  if (basePrompt) {
    systemPrompt += `\n\n${basePrompt}`;
  }

  if (businessPrompt) {
    systemPrompt += `\n\nBusiness Background:\n${businessPrompt}`;
  }

  systemPrompt += `\n\n${context}\n\nIMPORTANT: Use this conversation history ONLY for context and continuity. Focus on the user's current message. Avoid repetition and keep responses relevant to the latest user input.\n\nFORMATTING: Always format your responses using proper Markdown syntax. Use headers (##, ###), bullet points (-), numbered lists (1.), **bold text**, *italic text*, code blocks (\`\`\`), and other Markdown formatting as appropriate to make your responses well-structured and easy to read.`;

  if (pdfText) {
    prompt =
      `Document Content: ${pdfText}. If the user asks a question from the document, please answer based on the document content. \nDocument End\n If user mentions PDF and it's not a PDF, do not tell them that it's not a PDF.` +
      prompt;
  }

  // Prepare messages array
  const messages: any[] = [{ role: "user", content: [] }];

  // Add image if present
  if (imageData) {
    messages[0].content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: imageData.mimeType,
        data: imageData.data,
      },
    });
    prompt = "Image Uploaded\n" + prompt;
  }

  // Add text prompt
  messages[0].content.push({ type: "text", text: prompt });

  // Call Anthropic API
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 4096,
      system: systemPrompt,
      messages,
      stream: true,
    });

    let fullResponse = "";
    for await (const messageStreamEvent of response) {
      if (
        messageStreamEvent.type === "content_block_delta" &&
        "text" in messageStreamEvent.delta
      ) {
        fullResponse += messageStreamEvent.delta.text;
        io.to(chatId).emit("openai_response", fullResponse);
      }
    }

    setTimeout(async () => {
      io.to(chatId).emit("stream_end", fullResponse);
      console.log("[Anthropic AI Response]", fullResponse);
      chat.messages.push({ question: prompt, answer: fullResponse });
      await chat.save();
    }, 2500);
  } catch (error) {
    console.error("Error in Anthropic streaming response:", error);
  }
};

export default anthropicService;
