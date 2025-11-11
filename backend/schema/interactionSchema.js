const mongoose = require("mongoose");
const { Schema } = mongoose;

const interactionSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  liked: {
    type: Boolean,
    default: false,
  },
  commented: {
    type: Boolean,
    default: false,
  },
  commentText: {
    type: String,
    default: "",
  },
  attentionTime: {
    type: Number, // in seconds
    default: 0,
  },
  viewedAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Update lastUpdated automatically
interactionSchema.pre("save", function (next) {
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model("Interaction", interactionSchema);
