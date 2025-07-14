const { body, param } = require("express-validator");

//CreatePost
const validateCreatePost = [
  body("author").isMongoId().withMessage("Invalid author ID"),
  body("title").isString().isLength({ min: 2, max: 50 }),
  body("description").isString().isLength({ min: 5, max: 600 }),
  body("date").isISO8601().withMessage("Date must be in ISO format"),
  body("location.address").notEmpty(),
  body("location.city").notEmpty(),
];

// UpdatePost
const validateUpdatePost = [
  param("id").isMongoId().withMessage("Formato ID invalido"),
  body("title").optional().isString().isLength({ min: 2, max: 50 }),
  body("description")
    .optional()
    .isString()
    .isLength({ min: 5, max: 600 })
    .withMessage("La descrizione deve contenere massimo 600 caratteri"),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("La data deve avere un formato giusto"),
  body("location.address").optional().notEmpty(),
  body("location.city").optional().notEmpty(),
];

//DeletePost
const validateDeletePost = [
  param("id").isMongoId().withMessage("Invalid post ID format"),
];

module.exports = {
  validateCreatePost,
  validateUpdatePost,
  validateDeletePost,
};
