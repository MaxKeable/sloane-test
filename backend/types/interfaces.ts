export interface IAssistant {
	_id: string;
	name: string;
	image: string;
	description: string;
	jobTitle: string;
	user?: string;
}

export interface IBusinessProfile {
  businessName?: string;
  businessType?: string;
  businessSize?: number;
  businessDescription?: string;
}
