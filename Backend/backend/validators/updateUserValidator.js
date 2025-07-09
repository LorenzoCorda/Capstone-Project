const Joi = require("joi");

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  username: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  bio: Joi.string().allow(""),
  city: Joi.string().allow(""),
  /* styles: Joi.array().items(Joi.string()).default([]), */
  styles: Joi.alternatives()
    .messages({ "array.min": "Devi inserire almeno uno stile di danza" })

    .try(
      Joi.string(), // es. "break dance, hip hop"
      Joi.array().items(Joi.string()) // es. ["break dance", "hip hop"]
    )
    .default([]),
  profileImage: Joi.string().uri().allow(""),
  removeImage: Joi.boolean().truthy("true").falsy("false").default(false),
});

module.exports = updateUserSchema;
