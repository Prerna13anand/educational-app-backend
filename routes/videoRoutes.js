import express from 'express';
import {
  getAllVideos,
  getVideoById,
  getConceptsByVideoId,
  processVideo,
  seedVideos,
} from '../controllers/videoController.js';

const router = express.Router();

// =================================================================
//  MAIN API ROUTES
// =================================================================

// @desc    Get all videos for the HomeScreen
// @route   GET /api/videos
// This is the corrected route. It now uses '/' instead of '/videos'.
router.get('/', getAllVideos);

// @desc    Get a single video's details for the VideoPlayerScreen
// @route   GET /api/videos/:videoId
router.get('/:videoId', getVideoById);

// @desc    Get the (mocked) concepts for a video
// @route   GET /api/concepts/:videoId
// This route is separate and correct as is.
// Note: We will mount this separately in the main server file.


// =================================================================
//  UTILITY & EXTRA ROUTES
// =================================================================

// @desc    Seed the database with sample videos (Run this once)
// @route   POST /api/seed
router.post('/seed', seedVideos);

// @desc    Process a video with the AI
// @route   POST /api/process
router.post('/process', processVideo);


export default router;