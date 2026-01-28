const mongoose = require("mongoose");
const validator = require("validator");

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: [true, "Keyword is required"],
  },
  imageUrl: {
    type: String,
    required: [true, "Image URL is required"],
    validate: {
      validator: (value) => validator.isURL(value, { protocols: ["http", "https"], require_protocol: true }),
      message: "Invalid URL format",
    },
  },
  link: {
    type: String,
    required: [true, "Link is required"],
    validate: {
      validator: (value) => validator.isURL(value, { protocols: ["http", "https"], require_protocol: true }),
      message: "Invalid URL format",
    },
  },
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  date: {
    type: String,
    required: [true, "Date is required"],
  },
  text: {
    type: String,
    required: [true, "Text is required"],
  },
  source: {
    type: String,
    required: [true, "Source is required"],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Owner is required"],
  },
});

module.exports = mongoose.model("Article", articleSchema);
