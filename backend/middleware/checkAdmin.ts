import { clerkClient } from "@clerk/express";
import getUserIdFromBearer from "../utils/getUserIdFromBearer";

// Assuming you have your Clerk Backend API key set in your environment variables

const checkAdmin = async (req: any, res: any, next: any) => {
  try {
    const userId = getUserIdFromBearer(req);
    const user = await clerkClient.users.getUser(userId as string);

    // Check if the user's publicMetadata has account set to "admin"
    if (user.publicMetadata.account === "admin") {
      next(); // User is an admin, proceed with the request
    } else {
      // User is not an admin, return a 401 Unauthorized response
      res.status(401).json({
        error: "Unauthorized. This action is restricted to admin users.",
      });
    }
  } catch (error) {
    console.error("Error verifying admin user:", error);
    res.status(401).json({ error: "Error verifying user session." });
  }
};

export default checkAdmin;
