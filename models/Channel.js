import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  channelName: { type: String, required: true },
  youtubeChannelId: { type: String, required: true, unique: true },
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }],
}, { timestamps: true });

const Channel = mongoose.model('Channel', channelSchema);
export default Channel;