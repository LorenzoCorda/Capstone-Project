const mongoose = require("mongoose");

const participationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TrainingPost",
    required: true,
  },
  status: {
    type: String,
    enum: ["confirmed", "cancelled"],
    default: "confirmed",
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

// Per evitare che un utente si iscriva due volte allo stesso post
participationSchema.index({ userId: 1, postId: 1 }, { unique: true });

module.exports = mongoose.model("Participation", participationSchema);
