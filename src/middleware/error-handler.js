import { isCelebrateError } from "celebrate";

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);
  console.error("Stack:", err.stack);
  console.error("Full error:", err);

  if (isCelebrateError(err)) {
    const errorBody = err.details.get("body") || err.details.get("params");
    const errorMessage = errorBody
      ? errorBody.details[0].message
      : "Validation error";
    return res.status(400).json({ message: errorMessage });
  }

  const { statusCode = 500, message = "An error occurred on the server" } = err;
  res.status(statusCode).json({ message });
};

export default errorHandler;
