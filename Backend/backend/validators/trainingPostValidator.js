const Joi = require("joi");

const updatePostSchema = Joi.object({
  title: Joi.string().min(2).max(50).messages({
    "string.min": "Il titolo deve contenere almeno 2 caratteri",
    "string.max": "Il titolo può contenere massimo 50 caratteri",
  }),
  description: Joi.string().min(5).max(600).messages({
    "string.min": "La descrizione deve contenere almeno 5 caratteri",
    "string.max": "Massimo 600 caratteri nella descrizione",
  }),
  date: Joi.date().iso().messages({
    "date.format": "La data deve essere in formato ISO",
  }),
  address: Joi.string().required().messages({
    "any.required": "L'indirizzo è obbligatorio",
    "string.base": "L'indirizzo deve essere una stringa",
  }),
  maxParticipants: Joi.number().min(1).max(20).messages({
    "number.base": "Il numero massimo di partecipanti deve essere un numero",
    "number.min": "Deve essere almeno 1 partecipante",
    "number.max": "Devono essere massimo 20 partecipanti",
  }),
});

const createPostSchema = Joi.object({
  title: Joi.string().min(2).max(50).required().messages({
    "string.min": "Il titolo deve contenere almeno 2 caratteri",
    "string.max": "Il titolo può contenere massimo 50 caratteri",
    "any.required": "Il titolo è obbligatorio",
  }),
  description: Joi.string().min(5).max(600).required().messages({
    "string.min": "La descrizione deve contenere almeno 5 caratteri",
    "string.max": "Massimo 600 caratteri nella descrizione",
    "any.required": "La descrizione è obbligatoria",
  }),
  date: Joi.date().iso().required().messages({
    "date.format": "La data deve essere in formato ISO",
    "any.required": "La data è obbligatoria",
  }),
  address: Joi.string().required().messages({
    "any.required": "L'indirizzo è obbligatorio",
    "string.base": "L'indirizzo deve essere una stringa",
  }),
  maxParticipants: Joi.number().min(1).max(20).required().messages({
    "number.base": "Il numero massimo di partecipanti deve essere un numero",
    "number.min": "Deve essere almeno 1 partecipante",
    "number.max": "Devono essere massimo 20 partecipanti",
    "any.required": "Il numero massimo di partecipanti è obbligatorio",
  }),
});

module.exports = {
  updatePostSchema,
  createPostSchema,
};
