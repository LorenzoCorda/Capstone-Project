const cloudinary = require("../utils/cloudinary");

const deleteImageFromCloudinary = async (imageUrl) => {
  if (!imageUrl) return;

  const parts = imageUrl.split("/");
  const publicIdWithExtension = parts.at(-1);
  const folder = parts.at(-2);
  const publicId = `${folder}/${publicIdWithExtension.split(".")[0]}`;

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Errore eliminazione immagine Cloudinary:", err.message);
  }
};

module.exports = { deleteImageFromCloudinary };
