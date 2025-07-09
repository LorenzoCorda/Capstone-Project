const { body, param } = require("express-validator");

//CreatePost
const validateCreatePost = [
  body("author").isMongoId().withMessage("Invalid author ID"),
  body("title").isString().isLength({ min: 2, max: 50 }),
  body("description").isString().isLength({ min: 5, max: 100 }),
  body("date").isISO8601().withMessage("Date must be in ISO format"),
  body("location.address").notEmpty(),
  body("location.city").notEmpty(),
];

//DeletePost
const validateDeletePost = [
  param("id").isMongoId().withMessage("Invalid post ID format"),
];

module.exports = {
  validateCreatePost,
  validateDeletePost,
};
