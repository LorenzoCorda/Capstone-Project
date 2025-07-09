const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authenticateToken");
/* const User = require("../models/users.model"); */
const { upload } = require("../utils/multer");

const {
  getAllUsersController,
  getUserByIdController,
  getUserProfileController,
  updateUserController,
  deleteUserController,
} = require("../controller/users.controller");

router.get("/", authenticateToken, getAllUsersController);
router.get("/me", authenticateToken, getUserProfileController);
router.get("/:id", authenticateToken, getUserByIdController);
router.put(
  "/me",
  authenticateToken,
  upload.single("profileImage"),
  updateUserController
);
router.delete("/me", authenticateToken, deleteUserController);

module.exports = router;
