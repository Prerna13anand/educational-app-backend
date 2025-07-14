import express from 'express';
import { getAllVideos, processVideo, seedVideos } from '../controllers/videoController.js';

const router = express.Router();

// Add this route to seed the database
router.get('/seed', seedVideos);

router.post('/process', processVideo);
router.get('/', getAllVideos);

export default router;