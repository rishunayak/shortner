import express from 'express';
import { getAnalyticsController, getTopicAnalyticsController,getOverallAnalyticsController } from '../controllers/analyticsController.js';
import { auth } from '../middleware/auth.js';




const router = express.Router();

router.get("/:alias",getAnalyticsController)
router.get("/topic/:topic",getTopicAnalyticsController)
router.get("/overall/url",auth,getOverallAnalyticsController)

export default router;

