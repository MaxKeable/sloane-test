/**
 * Truncates a string to a maximum length and adds ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation (default: 15)
 * @returns Truncated string with ellipsis if needed
 */
export const truncateString = (
  text: string,
  maxLength: number = 15
): string => {
  if (!text) return "New Item";
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength + 5) + "...";
};

/**
 * Validates that a title has fewer than a specified number of words
 * @param title - The title to validate
 * @param maxWords - Maximum number of words (default: 5)
 * @returns True if valid, false otherwise
 */
export const validateTitleLength = (
  title: string,
  maxWords: number = 5
): boolean => {
  const wordCount = title?.split(" ").filter(Boolean).length || 0;
  return wordCount < maxWords;
};

/**
 * Cleans markdown code blocks from response text
 * @param response - The response text to clean
 * @returns Cleaned response text
 */
export const cleanMarkdownResponse = (response: string): string => {
  return response
    .trim()
    .replace(/^```[\w]*\n?([\s\S]*?)\n?```$/, "$1")
    .trim();
};

