
import prisma from "../../../../../config/client";
import { logger } from "../../../../../utils/logger";

export interface BusinessResolverOptions {
  userId: string;
  enabled: boolean;
}

interface BusinessProfile {
  businessName?: string;
  businessType?: string;
  businessSize?: number;
  businessDescription?: string;
}

export async function resolveBusinessContext(
  options: BusinessResolverOptions
): Promise<string | null> {
  if (!options.enabled) {
    return null;
  }

  try {
    const user = await prisma.users.findUnique({
      where: { clerkUserId: options.userId },
      select: { businessProfile: true },
    });

    if (!user?.businessProfile) {
      return null;
    }

    const profile = user.businessProfile as BusinessProfile;

    const parts: string[] = [];

    if (profile.businessName) {
      parts.push(`The business name is ${profile.businessName}`);
    }

    if (profile.businessType) {
      parts.push(`the business type is ${profile.businessType}`);
    }

    if (profile.businessSize) {
      parts.push(`and the business has ${profile.businessSize} employees`);
    }

    if (profile.businessDescription) {
      parts.push(
        `\n\nHere is the business description and notes: ${profile.businessDescription}`
      );
    }

    if (parts.length === 0) {
      return null;
    }

    return `Before we begin, I would like to give you some background on my business:\n\n${parts.join(", ")}`;
  } catch (error) {
    logger.error("Error resolving business context:", error);
    return null;
  }
}
