import mongoose from 'mongoose';



const videoSchema = new mongoose.Schema(
  {
    videoId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    // This is the new, important line that fixes the problem
    channel: {
      type: String,
      required: true,
    },
    ncertConcepts: [
      {
        concept: String,
        reference: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Video = mongoose.model('Video', videoSchema);
export default Video;