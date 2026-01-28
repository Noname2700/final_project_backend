const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { CREATED_STATUS, OK_STATUS } = require("../utils/statusCodes");
const InternalServerError = require("../middleware/errors/internalServerError");
const ConflictError = require("../middleware/errors/conflictError");
const BadRequestError = require("../middleware/errors/badRequestError");
const UnauthorizedError = require("../middleware/errors/unAuthorizeError");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  argon2.hash(password, { type: argon2.argon2id }).then((hash) =>
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

      return argon2
        .verify(user.password, password)
        .then((isValid) => {
          if (!isValid) {
            return next(new UnauthorizedError("Invalid email or password"));
          }
          const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
            expiresIn: "7d",
          });
          res.status(OK_STATUS).send({ token });
        })
        .catch(() => next(new UnauthorizedError("Invalid email or password")));
    });
};

module.exports = { createUser, logInUser };
