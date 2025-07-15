// In routes/videoRoutes.js
import express from 'express';
import { getAllVideos, getVideoById, seedVideos } from '../controllers/videoController.js';

const router = express.Router();

// GET /api/videos
router.get('/', getAllVideos);

// POST /api/videos/seed
router.post('/seed', seedVideos);

// GET /api/videos/:videoId
router.get('/:videoId', getVideoById);

export default router;