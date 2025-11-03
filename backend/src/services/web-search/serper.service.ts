import { logger } from "../../../utils/logger";

export interface SerperSearchResult {
  title: string;
  link: string;
  snippet: string;
  position?: number;
  date?: string;
}

export interface SerperResponse {
  searchParameters: {
    q: string;
    type: string;
  };
  organic: Array<{
    title: string;
    link: string;
    snippet: string;
    position: number;
    date?: string;
  }>;
  answerBox?: {
    answer?: string;
    snippet?: string;
    title?: string;
  };
}

/**
 * Search the web using Serper API
 * @param query Search query
 * @param options Search options
 * @returns Array of search results
 */
export async function searchWeb(
  query: string,
  options: {
    numResults?: number;
  } = {}
): Promise<SerperSearchResult[]> {
  const { numResults = 5 } = options;

  const apiKey = process.env.SERPER_API_KEY;

  if (!apiKey) {
    logger.error("SERPER_API_KEY not configured");
    throw new Error("Web search not configured");
  }

  try {
    logger.info("Serper web search", { query, numResults });

    const response = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: query,
        location: "Australia",
        gl: "au",
        num: numResults,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error("Serper API error", {
        status: response.status,
        error: errorText,
      });
      throw new Error(`Serper API error: ${response.status}`);
    }

    const data = (await response.json()) as SerperResponse;

    // Format results
    const results: SerperSearchResult[] = data.organic.map((result) => ({
      title: result.title,
      link: result.link,
      snippet: result.snippet,
      position: result.position,
      date: result.date,
    }));

    logger.info("Serper search completed", {
      query,
      resultsCount: results.length,
    });

    return results;
  } catch (error) {
    logger.error("Error in Serper web search:", error);
    throw new Error(
      error instanceof Error ? error.message : "Web search failed"
    );
  }
}
