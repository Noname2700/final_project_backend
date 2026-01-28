const router = require("express").Router();
const { createUser, logInUser } = require("../controllers/users");
const {
  validateUserCreation,
  validateUserInfo,
} = require("../middleware/validation");

router.post("/signup", validateUserCreation, createUser);
router.post("/signin", validateUserInfo, logInUser);

module.exports = router;
