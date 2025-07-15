import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import videoRoutes from './routes/videoRoutes.js';
import conceptRoutes from './routes/conceptRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();
app.use(express.json());

// Tell express to use the video routes
app.use('/api/videos', videoRoutes);

// All concept-related routes will be under /api/concepts
app.use('/api/concepts', conceptRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});