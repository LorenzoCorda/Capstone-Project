const User = require("../models/users.model");
const jwt = require("jsonwebtoken");

const crypto = require("crypto");
const bcrypt = require("bcrypt");
const cloudinary = require("../utils/cloudinary"); // importa da dove lo configuri
const { sendVerificationEmail } = require("../utils/email");

const signupService = async (userData, imagePath) => {
  const existingUser = await User.findOne({
    $or: [{ email: userData.email }, { username: userData.username }],
  });

  if (existingUser) {
    if (existingUser.email === userData.email) {
      throw new Error("Email già registrata");
    } else {
      throw new Error("Username già esistente");
    }
  }

  let uploadedImageUrl = "";
  if (imagePath) {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: "breakmeet/users",
    });
    uploadedImageUrl = result.secure_url;
  } else {
    // immagine di default se non caricata
    uploadedImageUrl =
      "https://res.cloudinary.com/dr2q63hgn/image/upload/v1751541166/user_oqtfxr.png";
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const emailToken = crypto.randomBytes(32).toString("hex");

  const newUser = new User({
    ...userData,
    profileImage: uploadedImageUrl,
    password: hashedPassword,
    emailToken,
    isVerified: false,
  });

  const saved = await newUser.save();

  await sendVerificationEmail(saved.email, emailToken); // invia email di conferma

  const { password, ...userWithoutPassword } = saved.toObject();
  return userWithoutPassword;
};

const loginService = async (email, password) => {
  const user = await User.findOne({ email });

  // ⛔ BLOCCA utenti non verificati
  if (!user.isVerified) {
    throw new Error("Email non verificata. Controlla la tua casella di posta.");
  }
  if (!user) {
    throw new Error("Email o password sbagliate");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Email o password sbagliate");
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return { user, token };
};

module.exports = { signupService, loginService };
