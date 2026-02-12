import pkg from "jsonwebtoken";
const { verify } = pkg;
import config from "../utils/config.js";
import UnAuthorizedError from "../middleware/errors/unAuthorizeError.js";

const { JWT_SECRET } = config;

const auth = (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      console.error("No token found in cookies or Authorization header");
      throw new UnAuthorizedError("Authorization required");
    }

    let payload;
    try {
      payload = verify(token, JWT_SECRET);
    } catch (err) {
      console.error("Token verification error:", err.message);
      if (err.name === "TokenExpiredError") {
        throw new UnAuthorizedError("Token has expired");
      }
      throw new UnAuthorizedError("Invalid token");
    }

    req.user = payload;
    return next();
  } catch (err) {
    return next(err);
  }
};

export default auth;
