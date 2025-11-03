import { Answer } from "../types/answer";
import fetcher from "../utils/fetcher";

export namespace AnswerService {
  export const getAnswer = async (
    questionId: string
  ): Promise<Answer | null> => {
    const response = await fetcher(
      `/api/question-answers/get-by-question-id/${questionId}`
    );
    return response.data;
  };

  export const createAnswer = async ({
    answer,
    questionId,
  }: {
    answer: string;
    questionId: string;
  }): Promise<Answer> => {
    const response = await fetcher("/api/question-answers", {
      method: "POST",
      data: { answer, questionId },
    });
    return response.data;
  };

  export const updateAnswer = async ({
    answer,
    questionId,
  }: {
    answer: string;
    questionId: string;
  }): Promise<Answer> => {
    const response = await fetcher(`/api/question-answers/${questionId}`, {
      method: "PATCH",
      data: { answer },
    });
    return response.data;
  };

  export const completeOnboarding = async ({
    userId,
  }: {
    userId?: string;
  }): Promise<unknown> => {
    const response = await fetcher("/api/business-prompts/generate", {
      method: "POST",
      data: {
        userId,
      },
    });
    return response.data;
  };
}
