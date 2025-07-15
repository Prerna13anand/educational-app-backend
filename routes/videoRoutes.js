import express from 'express';
import {
  getAllVideos,
  getVideoById,
  getConceptsByVideoId,
} from '../controllers/videoController.js';

const router = express.Router();

// GET /api/videos -> Gets all videos for the HomeScreen
router.get('/', getAllVideos);

// GET /api/videos/:videoId -> Gets details for one video
router.get('/:videoId', getVideoById);

// GET /api/concepts/:videoId -> Gets concepts for one video
router.get('/concepts/:videoId', getConceptsByVideoId);

export default router;