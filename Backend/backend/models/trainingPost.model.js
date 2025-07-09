const mongoose = require("mongoose");

const TrainingPostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    minlength: 2,
    maxlength: 12,
  },
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  description: {
    type: String,
    minlength: 5,
    maxlength: 100,
  },
  location: {
    address: { type: String },
    city: { type: String, required: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  date: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  maxParticipants: { type: Number },
  image: { type: String },
});

module.exports = mongoose.model("TrainingPost", TrainingPostSchema);
