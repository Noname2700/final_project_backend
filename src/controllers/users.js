import { hash as _hash, argon2id, verify } from "argon2";
import jwt from "jsonwebtoken";
const { sign } = jwt;
import statusCodes from "../utils/statusCodes.js";

import InternalServerError from "../middleware/errors/internalServerError.js";
import ConflictError from "../middleware/errors/conflictError.js";
import BadRequestError from "../middleware/errors/badRequestError.js";
import UnauthorizedError from "../middleware/errors/unAuthorizeError.js";
import config from "../utils/config.js";
import User from "../models/user.js";

const { JWT_SECRET } = config;

const { CREATED_STATUS, OK_STATUS } = statusCodes;

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  _hash(password, { type: argon2id }).then((hash) =>
    User.create({ email, password: hash, name })
      .then((user) => {
        const userResponse = user.toObject();
        delete userResponse.password;
        res.status(CREATED_STATUS).send(userResponse);
      })
      .catch((error) => {
        if (error.code === 11000) {
          return next(new ConflictError("Email already in use"));
        }
        return next(
          new InternalServerError("An error occurred while creating the user"),
        );
      }),
  );
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

      return verify(user.password, password)
        .then((isValid) => {
          if (!isValid) {
            return next(new UnauthorizedError("Invalid email or password"));
          }
          const userResponse = user.toObject();
          delete userResponse.password;
          const token = sign({ _id: user._id }, JWT_SECRET, {
            expiresIn: "7d",
          });
          res.status(OK_STATUS).send({ token, ...userResponse });

        })
        .catch(() => next(new UnauthorizedError("Invalid email or password")));
    });
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


export default { createUser, logInUser , getCurrentUser };
