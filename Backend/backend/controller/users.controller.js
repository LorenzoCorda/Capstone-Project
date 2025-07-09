const {
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
} = require("../services/users.service");
const {
  isEmailTaken,
  isUsernameTaken,
} = require("../validators/userValidator");
const updateUserSchema = require("../validators/updateUserValidator");
const User = require("../models/users.model");
const cloudinary = require("../utils/cloudinary");
const DEFAULT_PROFILE_IMAGE =
  "https://res.cloudinary.com/dr2q63hgn/image/upload/v1751541166/user_oqtfxr.png";

// Ottieni tutti gli utenti o ricerca
const getAllUsersController = async (request, response) => {
  try {
    const {
      search = "",
      city = "",
      country = "",
      page = 1,
      pageSize = 10,
    } = request.query;

    const { totalUsers, totalPages, users } = await getAllUsersService(
      search,
      city,
      country,
      Number(page),
      Number(pageSize)
    );

    if (!users || users.length === 0) {
      return response.status(404).send({
        statusCode: 404,
        message: "Users not found",
      });
    }

    response.status(200).send({
      page: Number(page),
      totalPages,
      totalUsers,
      users,
      statusCode: 200,
      message: "Users found successfully",
    });
  } catch (error) {
    response.status(500).send({
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Ottieni utente tramite ID
const getUserByIdController = async (req, res) => {
  try {
    const user = await getUserByIdService(req.params.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /users/me
const getUserProfileController = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ error: "Utente non trovato" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Errore del server" });
  }
};

// PUT /users/me

/* const updateUserController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, bio, styles, removeImage } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Utente non trovato" });

    if (username) user.username = username;
    if (bio !== undefined) user.bio = bio;
    if (styles && Array.isArray(styles)) user.styles = styles;

    // 🔴 Gestione rimozione immagine
    if (removeImage === "true" || removeImage === true) {
      if (user.profileImage && user.profileImage.includes("cloudinary.com")) {
        // Estrai public_id dall'URL per rimuoverla
        const publicId = user.profileImage.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`breakmeet/${publicId}`);
      }
      user.profileImage = DEFAULT_PROFILE_IMAGE;
    }

    // 🔵 Se c'è una nuova immagine da multer (file caricato)
    if (req.file && req.file.path) {
      user.profileImage = req.file.path;
    }

    await user.save();

    res.status(200).json(user);
  } catch (err) {
    console.error("Errore nel salvataggio del profilo:", err);
    res.status(500).json({ message: "Errore durante l'aggiornamento profilo" });
  }
}; */

const updateUserController = async (req, res) => {
  try {
    const userId = req.user._id;
    const payload = req.body;

    if (req.file && req.file.path) {
      payload.profileImage = req.file.path;
    }

    const removeImage = payload.removeImage === "true";

    // Validazione Joi
    const { error, value } = updateUserSchema.validate(payload, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});
      return res.status(400).json({ success: false, errors });
    }

    // Campi ammessi per update
    const allowedFields = [
      "name",
      "username",
      "email",
      "bio",
      "city",
      "styles",
      "profileImage",
    ];

    const updates = Object.fromEntries(
      Object.entries(value).filter(([key]) => allowedFields.includes(key))
    );

    // Verifiche univocità email / username
    if (updates.email && (await isEmailTaken(updates.email, userId))) {
      return res
        .status(400)
        .json({ success: false, message: "Email già in uso" });
    }

    if (updates.username && (await isUsernameTaken(updates.username, userId))) {
      return res
        .status(400)
        .json({ success: false, message: "Username già in uso" });
    }

    const user = await User.findById(userId);

    // Se richiesto, elimina immagine precedente e imposta default
    if (
      removeImage &&
      user.profileImage &&
      user.profileImage !== DEFAULT_PROFILE_IMAGE
    ) {
      const parts = user.profileImage.split("/");
      const filename = parts[parts.length - 1].split(".")[0];
      await cloudinary.uploader.destroy(`breakmeet_profiles/${filename}`);
      updates.profileImage = DEFAULT_PROFILE_IMAGE;
    }

    const updatedUser = await updateUserService(userId, updates);

    res.status(200).json({
      success: true,
      message: "Profilo aggiornato con successo",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Errore interno del server",
      error: error.message,
    });
  }
};

// Elimina utente
const deleteUserController = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await deleteUserService(userId);

    res.status(200).json(result);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

module.exports = {
  getAllUsersController,
  getUserByIdController,
  getUserProfileController,
  updateUserController,
  deleteUserController,
};
