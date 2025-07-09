const express = require("express");
const router = express.Router();
const { upload } = require("../utils/multer");
const User = require("../models/users.model");
const { signupService, loginService } = require("../services/auth.service");
const { registerSchema, loginSchema } = require("../validators/authValidator");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { sendPasswordResetEmail } = require("../utils/email");

// REGISTER

router.post("/register", upload.single("profileImage"), async (req, res) => {
  try {
    const imagePath = req.file?.path;

    // Validazione dei dati
    const { error } = registerSchema.validate(req.body);
    if (error) {
      const field = error.details[0].context.key;
      return res
        .status(400)
        .json({ error: { [field]: error.details[0].message } });
    }

    // ✅ Passaggio corretto dell'immagine
    const savedUser = await signupService(req.body, imagePath);

    res.status(201).json({
      message: "Utente registrato con successo",
      user: savedUser,
    });
  } catch (error) {
    // Gestione errori MongoDB per chiave duplicata
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0]; // "username" o "email"
      return res.status(400).json({
        error: { [duplicateField]: `${duplicateField} già in uso` },
      });
    }

    res.status(400).json({ error: { general: error.message } });
  }
});
/* router.post("/register", upload.single("profileImage"), async (req, res) => {
  try {
    const profileImage = req.file?.path;

    const { error } = registerSchema.validate(req.body);
    if (error) {
      const field = error.details[0].context.key;
      return res
        .status(400)
        .json({ error: { [field]: error.details[0].message } });
    }

    const savedUser = await signupService({ ...req.body, profileImage });
    res
      .status(201)
      .json({ message: "Utente registrato con successo", user: savedUser });
  } catch (error) {
    // Gestione errori MongoDB per chiave duplicata

    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0]; // "username" o "email"
      return res.status(400).json({
        error: { [duplicateField]: `${duplicateField} già in uso` },
      });
    }

    res.status(400).json({ error: { general: error.message } });
  }
}); */

// LOGIN

router.post("/login", async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    const field = error.details[0].context.key;
    return res
      .status(400)
      .json({ error: { [field]: error.details[0].message } });
  }

  try {
    const { email, password } = req.body;
    const { user, token } = await loginService(email, password);
    res.json({ user, token });
  } catch (error) {
    return res.status(401).json({
      error: { general: error.message },
    });
  }
});

router.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  const user = await User.findOne({ emailToken: token });
  if (!user) {
    return res.status(400).json({ error: "Token non valido" });
  }

  user.emailToken = null;
  user.isVerified = true;
  await user.save();

  res.redirect(`${process.env.CLIENT_BASE_URL}/verify-email`);
});

// RICHIESTA RESET PASSWORD
router.post("/request-password-reset", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Email non trovata" });

  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 ora
  await user.save();

  await sendPasswordResetEmail(email, token); // ✅ CORRETTO

  res.json({ message: "Email inviata con istruzioni per il reset" });
});

// RESET PASSWORD
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ error: "Token non valido o scaduto" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: "Password aggiornata con successo" });
});

/* // Richiesta reset password

router.post("/request-password-reset", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Email non trovata" });

  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();

  await sendPasswordResetEmail(email, token);

  res.json({ message: "Email inviata con istruzioni per il reset" });
});


// Reset password effettivo
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ error: "Token non valido o scaduto" });

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: "Password aggiornata con successo" });
}); */

module.exports = router;
