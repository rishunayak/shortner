import express from 'express';
import { auth } from '../middleware/auth.js';
import { urlShortnerController } from '../controllers/urlController.js';




const router = express.Router();


router.post("/",auth,urlShortnerController)


export default router;

