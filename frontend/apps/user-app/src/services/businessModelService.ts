import fetcher from "../utils/fetcher";

export type BusinessModelQuestion = {
  _id: string;
  position: number;
  title: string;
  videoUrl: string;
  videoThumbnailUrl?: string;
  description?: string;
  placeholderSentence?: string;
  serviceBusinessExample?: string;
  productBusinessExample?: string;
  example?: string;
};

export type BusinessModelAnswer = {
  _id: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
};

export type BusinessModelItem = {
  question: BusinessModelQuestion;
  answer: BusinessModelAnswer | null;
};

export type BusinessModelResponse = {
  success: boolean;
  businessModel: BusinessModelItem[];
};

export type AnswerResponse = {
  success: boolean;
  answer: {
    _id: string;
    answer: string;
    createdAt: string;
    updatedAt: string;
  };
};

export namespace BusinessModelService {
  export const getBusinessModel = async (): Promise<BusinessModelResponse> => {
    const response = await fetcher("/api/business-model");
    return response.data;
  };

  export const adminGetBusinessModel = async (
    userId: string
  ): Promise<BusinessModelResponse> => {
    const response = await fetcher(
      `/api/admin/get-users-business-plan/${userId}`
    );
    return response.data;
  };

  export const updateAnswer = async (
    answerId: string,
    answer: string
  ): Promise<AnswerResponse> => {
    const response = await fetcher(`/api/question-answers/${answerId}`, {
      method: "PATCH",
      data: { answer },
    });
    return response.data;
  };

  export const createAnswer = async (
    questionId: string,
    answer: string,
    userId?: string
  ): Promise<AnswerResponse> => {
    const response = await fetcher("/api/question-answers", {
      method: "POST",
      data: { questionId, answer, userId },
    });
    return response.data;
  };
}
