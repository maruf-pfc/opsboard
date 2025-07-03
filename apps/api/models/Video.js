const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a video title'],
    },
    description: {
      type: String,
    },
    url: {
      type: String,
      required: [true, 'Please add a video URL'],
      match: [
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
        'Please use a valid YouTube URL',
      ],
    },
    category: {
      type: String,
      required: true,
      enum: ['Data Structures', 'Algorithms', 'System Design', 'Behavioral'],
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Video', VideoSchema);
