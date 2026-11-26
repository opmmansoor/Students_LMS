export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode >= 400 ? res.statusCode : 500;
  let message = err.message || "Internal Server Error";
  if (err.name === "CastError") { statusCode = 400; message = "Invalid ID"; }
  if (err.code === 11000) { statusCode = 409; message = `${Object.keys(err.keyValue || {})[0] || "Value"} already exists`; }
  if (err.name === "ValidationError") { statusCode = 400; message = Object.values(err.errors).map((item) => item.message).join(", "); }
  res.status(statusCode).json({ success: false, message });
};
