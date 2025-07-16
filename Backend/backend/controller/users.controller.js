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
        message: "Utenti non trovati",
      });
    }

    response.status(200).send({
      page: Number(page),
      totalPages,
      totalUsers,
      users,
      statusCode: 200,
      message: "Utenti trovati con successo",
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

const updateUserController = async (req, res) => {
  try {
    const userId = req.user._id;
    const payload = req.body;

    if (req.file && req.file.path) {
      payload.profileImage = req.file.path;
    }

    const removeImage = payload.removeImage === "true";

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
    console.error("Errore durante l'eliminazione:", err);
    res.status(500).json({ message: "Errore interno", error: err.message });
  }
};

module.exports = {
  getAllUsersController,
  getUserByIdController,
  getUserProfileController,
  updateUserController,
  deleteUserController,
};
