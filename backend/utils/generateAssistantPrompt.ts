import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const generateAssistantPrompt = async (userInput: string): Promise<string> => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const systemMessage = `You are an expert at creating AI assistant prompts. 
    Your task is to take a user's description of what they want their AI assistant to do, 
    and convert it into a comprehensive system prompt that will make the assistant behave appropriately. 
    The prompt should be detailed and specific, ensuring the assistant stays in character and provides appropriate responses.
    
    IMPORTANT: Always include this instruction in every generated prompt: "Always format your responses using proper Markdown syntax. Use headers (##, ###), bullet points (-), numbered lists (1.), **bold text**, *italic text*, code blocks (\`\`\`), and other Markdown formatting as appropriate to make your responses well-structured and easy to read."`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userInput },
      ],
      temperature: 0.7,
    });

    return completion.choices[0].message?.content || userInput;
  } catch (error) {
    console.error("Error generating assistant prompt:", error);
    throw new Error("Failed to generate assistant prompt");
  }
};

export default generateAssistantPrompt;
