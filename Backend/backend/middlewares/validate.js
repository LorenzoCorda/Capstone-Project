const validate = (schema) => (req, res, next) => {
  const parsedBody = {
    ...req.body,
    maxParticipants: Number(req.body.maxParticipants),
    date: new Date(req.body.date).toISOString(),
  };

  const { error } = schema.validate(parsedBody, { abortEarly: false });

  if (error) {
    const errors = {};
    error.details.forEach((detail) => {
      const key = detail.path.join(".");
      errors[key] = detail.message;
    });

    return res.status(400).json({
      message: "Errore di validazione",
      errors,
    });
  }

  req.body = parsedBody;

  next();
};
module.exports = validate;
