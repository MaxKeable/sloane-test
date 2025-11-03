import { IBusinessProfile } from "../types/interfaces";

/**
 * Generates a business prompt based on the provided business profile.
 *
 * @param businessProfile - The business profile containing information about the business.
 * @returns The generated business prompt as a string.
 */
export const generateBusinessPrompt = (
	businessProfile: IBusinessProfile,
): string => {
	const { businessName, businessType, businessSize, businessDescription } =
		businessProfile;

	return `
        The business name is ${businessName}, the business type is ${businessType} and the business has ${businessSize} employees,
        
        Here is the business description and notes: ${businessDescription}

		All of your responses should be returned in correct markdown format to be displayed with the React-Markdown library in react.
    `;
};
