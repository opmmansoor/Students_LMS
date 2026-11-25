
// Handle routes that do not exist
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global error handler
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode >= 400 ? res.statusCode : 500;
  let message = err.message || "Internal Server Error";

  // MongoDB invalid ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID";
  }

  // MongoDB duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = field
      ? `${field} already exists`
      : "Duplicate value already exists";
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");
  }

  res.status(statusCode).json({
    success: false,
    message
  });
};
