const cloudinary = require("../utils/cloudinary");

// Elimina un'immagine da Cloudinary a partire dall'URL completo
const deleteImageFromCloudinary = async (imageUrl) => {
  if (!imageUrl) return;

  // Estrae il public_id dall'URL (es: breakmeet_profiles/abc123)
  const parts = imageUrl.split("/");
  const publicIdWithExtension = parts.at(-1); // es: abc123.jpg
  const folder = parts.at(-2); // es: breakmeet_profiles
  const publicId = `${folder}/${publicIdWithExtension.split(".")[0]}`;

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Errore eliminazione immagine Cloudinary:", err.message);
  }
};

module.exports = { deleteImageFromCloudinary };
