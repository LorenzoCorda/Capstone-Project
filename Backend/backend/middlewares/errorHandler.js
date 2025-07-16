const mongoose = require("mongoose");

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      success: false,
      message: "Formato ID non valido",
      data: null,
    });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      success: false,
      message: err.message,
      data: err.errors,
    });
  }

  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    data: null,
  });
};

module.exports = errorHandler;
