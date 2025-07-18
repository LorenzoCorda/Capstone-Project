const express = require("express");
const router = express.Router();

const authenticateToken = require("../middlewares/authenticateToken");
const validate = require("../middlewares/validate"); // custom middleware Joi
const { uploadPostImage } = require("../utils/multer");
const {
  getAllTrainingPostController,
  getMyTrainingPostsController,
  getTrainingPostByIdController,
  createTrainingPostController,
  updateTrainingPostController,
  deleteTrainingPostController,
} = require("../controller/trainingPost.controller");

const {
  updatePostSchema,
  createPostSchema,
} = require("../validators/trainingPostValidator");

router.get("/", getAllTrainingPostController);
router.get("/my-posts", authenticateToken, getMyTrainingPostsController);

router.get("/:id", getTrainingPostByIdController);

router.post(
  "/",
  authenticateToken,
  uploadPostImage.single("image"),
  validate(createPostSchema),
  createTrainingPostController
);

router.put(
  "/:id",
  authenticateToken,
  uploadPostImage.single("image"),
  validate(updatePostSchema),
  updateTrainingPostController
);

router.delete("/:id", authenticateToken, deleteTrainingPostController);

module.exports = router;
