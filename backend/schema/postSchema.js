const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const postSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['post', 'reel'],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    required: true
  },
  hashtags: {
    type: [String]
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: {
    type: Number,
    default: 0

  },
  shares: {
    type: Number,
    default: 0

  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
})
module.exports = mongoose.model('Post', postSchema);