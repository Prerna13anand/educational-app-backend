import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose'; // Import mongoose
import videoRoutes from './routes/videoRoutes.js';
import conceptRoutes from './routes/conceptRoutes.js';

// Load environment variables
dotenv.config();


// =================================================================
//  DATABASE CONNECTION (Moved back into index.js)
// =================================================================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};
// Call the function to connect to the database
connectDB();


const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// =================================================================
//  HEALTH CHECK ROUTE
// =================================================================
// This route responds to Render's health checks to prevent 502 errors.
app.get('/', (req, res) => {
  res.send('API is running successfully.');
});


// =================================================================
//  API ROUTES
// =================================================================
app.use('/api/videos', videoRoutes);
app.use('/api/concepts', conceptRoutes);


// =================================================================
//  SERVER STARTUP
// =================================================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});