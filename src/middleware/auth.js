import pkg from "jsonwebtoken";
const { verify } = pkg;
import config from "../utils/config.js";
import UnAuthorizedError from "../middleware/errors/unAuthorizeError.js";

const { JWT_SECRET } = config;

const auth = (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new UnAuthorizedError("Authorization required");
    }

    let payload;
    try {
      payload = verify(token, JWT_SECRET);
    } catch (err) {
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
