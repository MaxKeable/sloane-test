/**
 * Extracts the actual question from a message that may contain file markers
 * @param questionText - The raw question text
 * @returns Cleaned question text
 */
export const extractQuestionText = (
  questionText: string
): string | string[] => {
  if (questionText?.includes("Document End")) {
    return (
      questionText.split("Document End")[1]?.trim().split("\n") || questionText
    );
  } else if (questionText?.includes("Image Uploaded")) {
    return (
      questionText.split("Image Uploaded")[1]?.trim().split("\n") ||
      questionText
    );
  }
  return questionText;
};

/**
 * Determines the file type from a message
 * @param message - The message object
 * @returns File type ('PDF', 'Image', or undefined)
 */
export const getMessageFileType = (message: any): string | undefined => {
  if (message?.question?.includes("Document End")) {
    return "PDF";
  } else if (message?.question?.includes("Image Uploaded")) {
    return "Image";
  }
  return message?.file_type;
};

/**
 * Extracts filename from a message question
 * @param question - The question text
 * @returns Filename or default
 */
export const extractFilename = (question: string): string => {
  return question?.split("filename:")[1]?.trim() || "PDF";
};

