import prisma from "../../../../config/client";

export const getBusinessContextService = async () => {
  const userId = "user_31tiLXd9ywrcRGgxiBfKNDjl0we";
  const user = await prisma.users.findUniqueOrThrow({
    where: {
      clerkUserId: userId,
    },
    select: {
      businessProfile: true,
    },
  });

  const businessContext = `
    The business description is ${user?.businessProfile?.businessDescription}
    `;

  return businessContext;
};
