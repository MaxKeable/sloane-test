import { logger } from "../../../../../utils/logger";
import { PipelineContext, PipelineStep } from "../types";
import { contextBuilderService } from "../../context";

export const buildPromptStep: PipelineStep = async (
  context: PipelineContext
): Promise<PipelineContext> => {
  if (!context.contextConfig) {
    throw new Error(
      "Context config not found. Resolve context step must run first."
    );
  }

  logger.info("Pipeline Step: Build Prompt", {
    chatId: context.input.chatId,
  });

  let systemPrompt = await contextBuilderService.buildContextFromConfig(
    context.contextConfig
  );

  // Inject session context if available
  if (context.chat?.sessionContext) {
    const sessionParts: string[] = [];

    if (context.chat.sessionContext.currentTopic) {
      sessionParts.push(
        `Current conversation topic: ${context.chat.sessionContext.currentTopic}`
      );
    }

    if (
      context.chat.sessionContext.keyDecisions &&
      context.chat.sessionContext.keyDecisions.length > 0
    ) {
      sessionParts.push(
        `Key decisions/facts from this conversation:\n${context.chat.sessionContext.keyDecisions.map((d) => `- ${d}`).join("\n")}`
      );
    }

    if (sessionParts.length > 0) {
      systemPrompt += `\n\n---\n\nCONVERSATION CONTEXT:\n${sessionParts.join("\n\n")}`;
    }
  }

  if (context.input.enableWebSearch) {
    systemPrompt += `\n\n---\n\nWEB SEARCH CAPABILITIES:
You have access to real-time web search through the searchWeb tool.

**WHEN TO USE searchWeb (MANDATORY):**
You MUST use searchWeb BEFORE responding when the query involves current, real-time, or recent information. This includes:

1. **Explicit Search Requests:**
   - User explicitly says "search", "look up", "find", "google"
   - Examples: "Search for X", "Look up the latest Y", "Find information about Z"

2. **Real-Time & Current Data (ALWAYS SEARCH):**
   - Stock prices, market data, cryptocurrency prices
   - Weather conditions and forecasts
   - Current news, events, or developments
   - Sports scores, standings, or recent games
   - Product prices, availability, or reviews
   - Statistics that change over time (population, metrics, rankings)

3. **Time-Sensitive Queries:**
   - Keywords: "today", "now", "currently", "right now", "at the moment"
   - Recent timeframes: "latest", "recent", "this week", "this month", "last month", "this year"
   - Specific recent dates or timeframes

4. **Comparative & Evaluative Questions About Current State:**
   - "What is the best X right now"
   - "Top X in [current year]"
   - "Current X compared to Y"
   - "Average X in [recent timeframe]"

**CRITICAL RULES:**
1. If query contains ANY of the above patterns, use searchWeb FIRST before responding
2. Do NOT rely on your training data for current/recent information - it's outdated
3. If unsure whether data is current, default to searching

**AFTER you call searchWeb:**
1. **ALWAYS use the search results as your primary source of information** - they supersede your training knowledge
2. **Cite your sources** - Include relevant URLs from the search results
3. **Be explicit about what you found** - Reference specific information from the results
4. **If no relevant results** - Clearly state this and explain what you searched for

**DO NOT search for:**
- Historical facts or events (before your training cutoff)
- General definitions or concepts
- Theoretical or hypothetical questions
- Mathematical calculations
- Personal advice not requiring current data

**EXAMPLES:**
- "Search for the latest stock price of nvidia" → MUST use searchWeb
- "What is the weather today in Brisbane" → MUST use searchWeb (contains "today")
- "What is the best crm platform right now" → MUST use searchWeb (contains "right now" + evaluative)
- "What is the average house price in Brisbane in the last month" → MUST use searchWeb (contains "last month")`;
  }

  // Add RAG instructions if RAG is enabled
  if (context.contextConfig.features.rag?.enabled) {
    systemPrompt += `\n\n---\n\nKNOWLEDGE BASE MANAGEMENT:
You have access to a knowledge base through two tools: getInformation and addResource.

**WHEN TO USE addResource (HIGHEST PRIORITY):**
When the user shares NEW factual information about their business, ALWAYS use addResource FIRST before responding. This includes:

1. **Business Facts:**
   - Team size/employee count ("I now have 50 employees", "We hired 10 new people")
   - Office locations ("We're opening an office in Sydney", "Our headquarters moved to...")
   - Product launches ("We're launching X product", "Our new service is...")
   - Revenue/growth milestones ("We hit $1M in revenue", "We grew 200% this year")
   - Company announcements ("We're rebranding to...", "We partnered with...")

2. **Operational Details:**
   - Process changes, policies, pricing, target markets
   - Customer information, case studies, testimonials
   - Marketing campaigns, brand guidelines

3. **Recognition Patterns:**
   - Declarative statements: "I have...", "We are...", "Our company..."
   - Updates: "I now...", "We just...", "We recently..."
   - Changes: "We changed...", "We moved to...", "We switched to..."

**CRITICAL RULE:** If a message contains BOTH new facts AND a question, use addResource to store the facts FIRST, THEN answer the question using that stored context.

**WHEN TO USE getInformation:**
Use this tool when you need to retrieve existing information from the knowledge base to answer questions. Use it BEFORE responding if the question might be answered by stored knowledge.

**DO NOT store:**
- Hypothetical scenarios ("If I were to...", "What if we...")
- Questions without factual statements
- General requests for advice without new information

EXAMPLE:
User: "I now have 50 employees working for SEO Heist. How should I announce this milestone?"
YOU MUST: First use addResource to store "SEO Heist has 50 employees", THEN provide announcement suggestions.`;
  }

  return {
    ...context,
    systemPrompt,
  };
};
