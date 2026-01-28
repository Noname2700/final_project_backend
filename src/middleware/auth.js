import pkg from "jsonwebtoken";
const { verify } = pkg;
import config from "../utils/config.js";
import UnAuthorizedError from "../middleware/errors/unAuthorizeError.js";

const auth = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new UnAuthorizedError("Authorization required");
    }

    const token = authorization.replace("Bearer ", "");
    const payload = verify(token, config.JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    throw new UnAuthorizedError("Authorization required");
  }
};

export default auth;
