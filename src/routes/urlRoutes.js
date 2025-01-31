import express from 'express';
import { auth } from '../middleware/auth.js';
import { getShortenUrlController, urlShortnerController } from '../controllers/urlController.js';




const router = express.Router();


router.post("/",auth,urlShortnerController)
router.get("/:alias",getShortenUrlController)


export default router;

