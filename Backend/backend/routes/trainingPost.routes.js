const express = require("express");
const router = express.Router();

const authenticateToken = require("../middlewares/authenticateToken");
const validateRequest = require("../middlewares/validateRequest");
const {
  getAllTrainingPostController,
  getMyTrainingPostsController,
  getTrainingPostByIdController,
  createTrainingPostController,
  updateTrainingPostController,
  deleteTrainingPostController,
} = require("../controller/trainingPost.controller");
const { uploadPostImage } = require("../utils/multer");
const { validateUpdatePost } = require("../validators/trainingPostValidator");

//AllPosts
router.get("/", /* validateRequest, */ getAllTrainingPostController);
router.get("/my-posts", authenticateToken, getMyTrainingPostsController);

//FindByIdPost
router.get("/:id", getTrainingPostByIdController);

//CreatePost

router.post(
  "/",
  authenticateToken,
  uploadPostImage.single("image"),
  validateRequest,
  createTrainingPostController
);

//UpdatePost
router.put(
  "/:id",
  uploadPostImage.single("image"),
  authenticateToken,
  validateUpdatePost,
  validateRequest,
  updateTrainingPostController
);

//DeletePost
router.delete(
  "/:id",
  authenticateToken,
  validateRequest,
  deleteTrainingPostController
);

module.exports = router;
