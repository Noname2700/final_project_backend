const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);
  console.error("Stack:", err.stack);
  console.error("Full error:", err);

  const { statusCode = 500, message = "An error occurred on the server" } = err;
  res.status(statusCode).json({ message });
};

export default errorHandler;
