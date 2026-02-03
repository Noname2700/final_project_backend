import { hash as _hash, argon2id, verify } from "argon2";
import jwt from "jsonwebtoken";
const { sign } = jwt;
import statusCodes from "../utils/statusCodes.js";

import InternalServerError from "../middleware/errors/internalServerError.js";
import ConflictError from "../middleware/errors/conflictError.js";
import BadRequestError from "../middleware/errors/badRequestError.js";
import UnauthorizedError from "../middleware/errors/unAuthorizeError.js";
import NotFoundError from "../middleware/errors/notFoundError.js";
import config from "../utils/config.js";
import User from "../models/user.js";

const {
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
} = config;

const { CREATED_STATUS, OK_STATUS } = statusCodes;

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  _hash(password, {
    type: argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
  })
    .then((hash) =>
      User.create({ email, password: hash, name })
        .then((user) => {
          const userResponse = user.toObject();
          delete userResponse.password;

          const token = sign({ _id: user._id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
          });

          const refreshToken = sign({ _id: user._id }, JWT_REFRESH_SECRET, {
            expiresIn: JWT_REFRESH_EXPIRES_IN,
          });

          res
            .cookie("token", token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
              maxAge: 15 * 60 * 1000,
            })
            .cookie("refreshToken", refreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
              maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            .status(CREATED_STATUS)
            .send({ ...userResponse, token });
        })
        .catch((error) => {
          if (error.code === 11000) {
            return next(new ConflictError("Email already in use"));
          }
          return next(
            new InternalServerError(
              "An error occurred while creating the user",
            ),
          );
        }),
    )
    .catch(() => {
      return next(
        new InternalServerError("An error occurred while hashing the password"),
      );
    });
};

const logInUser = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }
  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError("Invalid email or password"));
      }

      return verify(user.password, password, {
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 1,
      })
        .then((isValid) => {
          if (!isValid) {
            return next(new UnauthorizedError("Invalid email or password"));
          }
          const userResponse = user.toObject();
          delete userResponse.password;

          const token = sign({ _id: user._id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
          });

          const refreshToken = sign({ _id: user._id }, JWT_REFRESH_SECRET, {
            expiresIn: JWT_REFRESH_EXPIRES_IN,
          });

          res
            .cookie("token", token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
              maxAge: 15 * 60 * 1000,
            })
            .cookie("refreshToken", refreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
              maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            .status(OK_STATUS)
            .send({ ...userResponse, token });
        })
        .catch(() => next(new UnauthorizedError("Invalid email or password")));
    })
    .catch(() =>
      next(new InternalServerError("An error occurred during authentication")),
    );
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("User not found"));
      }
      res.status(OK_STATUS).send(user);
    })
    .catch(() =>
      next(
        new InternalServerError(
          "An error occurred while retrieving user information",
        ),
      ),
    );
};

const logOutUser = (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    })
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    })
    .status(OK_STATUS)
    .send({ message: "Logged out successfully" });
};

export default { createUser, logInUser, getCurrentUser, logOutUser };
