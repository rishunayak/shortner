import express from 'express';
import { auth } from '../middleware/auth.js';
import { getShortenUrlController, urlShortnerController } from '../controllers/urlController.js';
import rateLimit from "express-rate-limit";



const router = express.Router();


const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5, // Limit each IP to 5 requests per window
    message: {
      error: "Too many requests. Please try again later.",
    },
    headers: true, // Send RateLimit headers
  });
  



router.post("/",auth,limiter,urlShortnerController)
router.get("/:alias",getShortenUrlController)


export default router;

