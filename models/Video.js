import mongoose from 'mongoose';

const ncertConceptSchema = new mongoose.Schema({
  conceptTitle: { type: String, required: true },
  reference: { type: String, required: true },
  description: { type: String, required: true },
});

const videoSchema = new mongoose.Schema({
  videoId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  thumbnail: { type: String, required: true },
  transcript: { type: String },
  ncertConcepts: [ncertConceptSchema],
}, { timestamps: true });

const Video = mongoose.model('Video', videoSchema);
export default Video;