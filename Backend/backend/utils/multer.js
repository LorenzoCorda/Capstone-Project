const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "breakmeet_profiles", // puoi cambiare nome se vuoi
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const upload = multer({ storage });

// Upload per immagini post
/* const postStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "breakmeet_posts",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});
const uploadPostImage = multer({ storage: postStorage }); */
module.exports = { /* uploadPostImage */ upload };
