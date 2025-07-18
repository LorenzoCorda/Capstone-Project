const Joi = require("joi");

const updateUserSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .messages({ "string.min": "Devi inserire almeno 2 caratteri" }),

  username: Joi.string()
    .min(3)
    .max(30)
    .messages({ "string.min": "Devi inserire almeno 3 caratteri" }),

  email: Joi.string().email(),
  bio: Joi.string()
    .allow("")
    .min(3)
    .max(200)
    .messages({ "string.min": "Devi inserire almeno 3 caratteri" }),

  city: Joi.string()
    .allow("")
    .min(1)
    .messages({ "string.min": "Devi inserire almeno un carattere" }),

  styles: Joi.alternatives()
    .messages({ "string.min": "Devi inserire almeno uno stile di danza" })
    .try(Joi.string(), Joi.array().items(Joi.string()))
    .default([]),
  profileImage: Joi.string().uri().allow(""),
  removeImage: Joi.boolean().truthy("true").falsy("false").default(false),
});

module.exports = updateUserSchema;
