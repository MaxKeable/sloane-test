export type Question = {
  _id: string;
  position: number;
  title: string;
  description: string | undefined;
  videoUrl: string;
  videoThumbnailUrl?: string;
  placeholderSentence: string | undefined;
  serviceBusinessExample: string | undefined;
  productBusinessExample: string | undefined;
};

export type CreateQuestion = {
  position: number;
  title: string;
  videoUrl: string;
  videoThumbnailUrl?: string;
  description?: string;
  placeholderSentence?: string;
  serviceBusinessExample?: string;
  productBusinessExample?: string;
};
