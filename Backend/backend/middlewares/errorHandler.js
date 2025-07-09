const mongoose = require("mongoose");

const errorHandler = (err, req, res, next) => {
  console.error(err); // per log/debug in console

  // Mongoose ObjectId malformato
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
      data: null,
    });
  }

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      success: false,
      message: err.message,
      data: err.errors,
    });
  }

  // Errori con statusCode
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    data: null,
  });
};

module.exports = errorHandler;
