const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Il nome è obbligatorio",
    "string.min": "Il nome deve avere almeno 2 caratteri",
  }),
  surName: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Il cognome è obbligatorio",
    "string.min": "Il cognome deve avere almeno 2 caratteri",
  }),
  username: Joi.string() /* .alphanum() */
    .min(3)
    .max(30)
    .required()
    .messages({
      "string.empty": "L'username è obbligatorio",
      "string.alphanum": "L'username può contenere solo lettere e numeri",
      "string.min": "L'username deve avere almeno 3 caratteri",
    }),
  styles: Joi.string().min(2).required().messages({
    "string.empty": "Lo stile è obbligatorio",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email non valida",
    "string.empty": "L'email è obbligatoria",
  }),
  password: Joi.string()
    .pattern(new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*?&]{6,}$"))
    .required()
    .messages({
      "string.pattern.base":
        "La password deve contenere almeno una lettera e un numero",
    }),
  /*  password: Joi.string().min(6).required().messages({
    "string.min": "La password deve avere almeno 6 caratteri",
    "string.empty": "La password è obbligatoria",
  }), */
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "L'email è obbligatoria",
    "string.email": "Formato email non valido",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "La password è obbligatoria",
    "string.min": "La password deve avere almeno 6 caratteri",
  }),
});

module.exports = { registerSchema, loginSchema };
