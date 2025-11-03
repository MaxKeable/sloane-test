import express from "express";
import getUserIdFromBearer from '../../utils/getUserIdFromBearer';
import { Action } from '../../models/actions';

const router = express.Router();

router.get("/", async (req, res) => {
  console.log('Route /user-filters hit!');
  console.log('Headers:', req.headers);
  
  try {
    const userId = getUserIdFromBearer(req);
    console.log('UserId from bearer:', userId);
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Get all actions for the user
    const actions = await Action.find({ userId });
    console.log('Found actions:', actions.length);
    
    // Extract unique tags
    const tags = [...new Set(actions.flatMap(action => action.tags || []))];
    const colors = [...new Set(actions.map(action => action.colour).filter(Boolean))];
    const priorities = [...new Set(actions.map(action => action.priority || "None"))];

    // Log the final response
    console.log('Sending response:', { tags, colors, priorities });

    res.json({
      tags,
      colors,
      priorities
    });
  } catch (error) {
    console.error('Error in getUserFilters:', error);
    res.status(500).json({ message: 'Error fetching filters' });
  }
});

export default router; 