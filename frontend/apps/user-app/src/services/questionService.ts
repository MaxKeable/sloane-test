import { CreateQuestion, Question } from "../types/question";
import fetcher from "../utils/fetcher";

export namespace QuestionService {
  export const getQuestions = async (): Promise<Question[]> => {
    const response = await fetcher("/api/question");
    return response.data;
  };

  export const getQuestion = async (id: string): Promise<Question> => {
    const response = await fetcher(`/api/question/${id}`);
    return response.data;
  };

  export const updateQuestion = async (
    id: string,
    data: Partial<Question>
  ): Promise<Question> => {
    const response = await fetcher(`/api/question/${id}`, {
      method: "PUT",
      data,
    });
    return response.data;
  };

  export const removeQuestion = async (id: string): Promise<Question> => {
    const response = await fetcher(`/api/question/${id}`, {
      method: "DELETE",
    });
    return response.data;
  };

  export const createQuestion = async (
    data: CreateQuestion
  ): Promise<Question> => {
    const response = await fetcher(`/api/question`, {
      method: "POST",
      data,
    });
    return response.data;
  };
}
