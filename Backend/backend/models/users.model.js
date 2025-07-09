const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
  },
  surName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  emailToken: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  password: { type: String, required: true }, // hashed
  bio: {
    type: String,
    maxlength: 200,
  },
  profileImage: {
    type: String,
    default:
      "https://res.cloudinary.com/dr2q63hgn/image/upload/v1751541166/user_oqtfxr.png",
  },
  city: {
    type: String,
    trim: true,
  },
  /* location: {
    city: String,
    region: String,
    country: String,
  }, */
  styles: [String],
  joinedAt: { type: Date, default: Date.now },
  //password dimenticata
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

module.exports = mongoose.model("User", UserSchema);
