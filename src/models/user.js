const mongoose = require("mongoose");
const validator = require("validator");
const argon2 = require("argon2");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: "Invalid email format",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 8 characters long"],
    select: false,
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [2, "Name must be at least 2 characters long"],
    maxlength: [30, "Name must be at most 30 characters long"],
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Invalid email or password"));
      }
      return argon2.compare(user.password, password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Invalid email or password"));
        }
        return user;
      });
    });
};

module.exports = mongoose.model("User", userSchema);
