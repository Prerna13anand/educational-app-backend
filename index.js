import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import videoRoutes from './routes/videoRoutes.js';
import conceptRoutes from './routes/conceptRoutes.js';

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// =================================================================
//  HEALTH CHECK ROUTE (This is the new, important part)
// =================================================================
// This route will respond to Render's health checks.
app.get('/', (req, res) => {
  res.send('API is running successfully.');
});


// =================================================================
//  API ROUTES
// =================================================================
// All video-related routes will be under /api/videos
app.use('/api/videos', videoRoutes);

// All concept-related routes will be under /api/concepts
app.use('/api/concepts', conceptRoutes);


// =================================================================
//  SERVER STARTUP
// =================================================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  console.log('MongoDB connected successfully');
  console.log('==> Your service is live 🚀 <==');
  console.log('//////////////////////////////////////////////////');
  console.log(`==> Available at your primary URL https://${process.env.RENDER_EXTERNAL_HOSTNAME}`);
  console.log('//////////////////////////////////////////////////');
});