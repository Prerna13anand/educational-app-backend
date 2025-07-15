
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
//  MAIN API ROUTES FOR THE REACT NATIVE APP
// =================================================================

// @desc    Get all videos for the HomeScreen
// @route   GET /api/videos
router.get('/videos', getAllVideos);

// @desc    Get a single video's details for the VideoPlayerScreen
// @route   GET /api/videos/:videoId
router.get('/videos/:videoId', getVideoById);

// @desc    Get the (mocked) concepts for a video
// @route   GET /api/concepts/:videoId
router.get('/concepts/:videoId', getConceptsByVideoId);


// =================================================================
//  UTILITY ROUTE FOR SETUP
// =================================================================

// @desc    Seed the database with sample videos (Run this once)
// @route   POST /api/seed
router.post('/seed', seedVideos);


// =================================================================
//  EXTRA ROUTE (Not used by the app yet)
// =================================================================

// @desc    Process a video with the AI
// @route   POST /api/process
router.post('/process', processVideo);


export default router;