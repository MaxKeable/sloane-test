export const QUERY_KEYS = {
  USER: {
    ME: "user-me",
  },
  ANSWER: {
    GET_ALL: "answers",
    GET_ONE: "answer",
    GET_BY_QUESTION_ID: "answer-get-by-question-id",
  },
  QUESTION: {
    GET_ALL: "question-get-all",
    GET_ONE: "question-get-one",
  },
  STRIPE: {
    CHECK_SUBSCRIPTION: "stripe-check-subscription",
    GET_PRICES: "stripe-get-prices",
  },
  BUSINESS_MODEL: "business-model",
  VIDEOS: {
    GET_ALL: "videos-get-all",
    GET_ONE: "video-get-one",
  },
} as const;
