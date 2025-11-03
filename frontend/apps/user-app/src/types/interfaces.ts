export interface IAssistant {
  _id: string;
  name: string;
  image: string;
  description: string;
  jobTitle: string;
  createdBy?: string; // User ID of the creator, if it's a custom assistant
  basePrompt?: string; // The base prompt for the assistant
  prompts?: { display: string; prompt: string; _id?: string }[]; // Array of prompts
  user?: string; // User ID that the assistant belongs to
}

export interface ICreateAssistantValues {
  name: string;
  image: string;
  description: string;
  jobTitle: string;
  basePrompt: string;
  relatedAssistants: string[];
  createdBy?: string; // User ID of the creator, if it's a custom assistant
}

export interface IUser {
  name: string;
  email: string;
  businessProfile: {
    businessName: string;
    businessType: string;
    businessSize: number;
    businessDescription: string;
  };
}

export interface IBusinessProfile {
  businessName: string;
  businessType: string;
  businessSize: number;
  businessDescription: string;
}

export interface IMessage {
  question: string;
  answer: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IChat {
  _id: string;
  title: string;
  user: string;
  assistant: IAssistant; // Assuming this is a reference to an Assistant's _id
  messages: IMessage[];
  createdAt?: Date;
  updatedAt?: Date;
  folderId?: string;
}
