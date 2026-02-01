import pkg from "jsonwebtoken";
const { verify, sign } = pkg;
import UnAuthorizedError from "../middleware/errors/unAuthorizeError.js";
import config from "../utils/config.js";
import statusCodes from "../utils/statusCodes.js";

const { JWT_SECRET, JWT_REFRESH_SECRET, JWT_EXPIRES_IN } = config;
const { OK_STATUS } = statusCodes;

const refreshToken = (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return next(new UnAuthorizedError("Refresh token not provided"));
  }

  let payload;
  try {
    payload = verify(refreshToken, JWT_REFRESH_SECRET);
  } catch (err) {
    return next(new UnAuthorizedError("Invalid refresh token"));
  }

  const newToken = sign({ _id: payload._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  res
    .cookie("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    })
    .status(OK_STATUS)
    .send({ message: "Token refreshed successfully" });
};

export default { refreshToken };
