const User = require("../models/users.model");

const TrainingPost = require("../models/trainingPost.model");
const Participation = require("../models/participation.model");
const { deleteImageFromCloudinary } = require("../utils/deleteFromCloudinary");
const DEFAULT_IMAGE =
  "https://res.cloudinary.com/dr2q63hgn/image/upload/v1751541166/user_oqtfxr.png";
const {
  isUsernameTaken,
  isEmailTaken,
} = require("../validators/userValidator");

//ottieni tutti gli users o ricerca
const getAllUsersService = async (
  search = "",
  city = "",
  country = "",
  page = 1,
  pageSize = 10
) => {
  const query = {};

  if (search) {
    const regex = new RegExp(search, "i");
    query.$or = [{ name: { $regex: regex } }, { username: { $regex: regex } }];
  }

  if (city) {
    query["location.city"] = { $regex: new RegExp(city, "i") };
  }

  if (country) {
    query["location.country"] = { $regex: new RegExp(country, "i") };
  }

  const users = await User.find(query)
    .limit(pageSize)
    .skip((page - 1) * pageSize)
    .sort({ createdAt: -1 });

  const totalUsers = await User.countDocuments(query);
  const totalPages = Math.ceil(totalUsers / pageSize);

  return {
    page,
    pageSize,
    totalUsers,
    totalPages,
    users,
  };
};

//ottieni user tramite id
const getUserByIdService = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

//modifica post

const updateUserService = async (userId, updatePayload) => {
  const options = { new: true, runValidators: true };

  // Verifiche univocità solo se i campi sono presenti
  if (
    updatePayload.username &&
    (await isUsernameTaken(updatePayload.username, userId))
  ) {
    throw new Error("Username already in use");
  }

  if (
    updatePayload.email &&
    (await isEmailTaken(updatePayload.email, userId))
  ) {
    throw new Error("Email already in use");
  }

  // Usa direttamente findByIdAndUpdate (supporta sia $set che $unset)
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    updatePayload,
    options
  );

  if (!updatedUser) {
    throw new Error("User not found or update failed");
  }

  return updatedUser;
};

//eliminazione utente
const deleteUserService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // ✅ Elimina immagine profilo se personalizzata
  if (user.profileImage && user.profileImage !== DEFAULT_IMAGE) {
    await deleteImageFromCloudinary(user.profileImage);
  }

  // ✅ Elimina partecipazioni
  await Participation.deleteMany({ userId });

  // ✅ Elimina i post creati dall’utente (e immagini se vuoi)
  const userPosts = await TrainingPost.find({ author: userId });

  for (const post of userPosts) {
    if (post.image) {
      await deleteImageFromCloudinary(post.image);
    }
  }

  await TrainingPost.deleteMany({ author: userId });

  // ✅ Elimina utente
  await user.deleteOne();

  return {
    success: true,
    message: "Utente, post, partecipazioni e immagini eliminati con successo",
  };
};

module.exports = {
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
};
