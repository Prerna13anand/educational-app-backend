// In routes/conceptRoutes.js
import express from 'express';
import { getConceptsByVideoId } from '../controllers/videoController.js';

const router = express.Router();

// This will now correctly handle GET /api/concepts/:videoId
router.get('/:videoId', getConceptsByVideoId);

export default router;