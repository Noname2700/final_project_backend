import rateLimit from "express-rate-limit";
import statusCodes from "../utils/statusCodes.js";

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, 
  message: {

    status: statusCodes.TOO_MANY_REQUESTS_STATUS,
    error: "Too many requests, please try again later.",
  },
});

export default apiLimiter;
