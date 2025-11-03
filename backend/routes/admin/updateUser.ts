import express, { Request, Response } from "express";
import User from "../../models/user";

const router = express.Router();

// Handle the base path
router.put("/", async (req: Request, res: Response) => {
  return res.status(400).json({ message: "User ID is required" });
});

// Handle the ID parameter
router.put("/:id", async (req: Request, res: Response) => {
  console.log("Update user request received - params:", req.params);
  console.log("Update user request body:", req.body);

  const { id } = req.params;
  const { name, email, businessProfile } = req.body;

  // Basic validation
  if (!name || !email || !businessProfile) {
    console.log("Validation failed - missing required fields");
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  try {
    console.log("Attempting to update user with ID:", id);
    // Update the assistant document
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, businessProfile },
      { new: true } // { new: true } returns the updated document
    );

    if (!updatedUser) {
      console.log("User not found with ID:", id);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User updated successfully:", updatedUser._id);
    // Send back the updated assistant
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
