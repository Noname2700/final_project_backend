import { Router } from "express";
import validation from "../middleware/validation.js";
import users from "../controllers/users.js";
import auth from "../middleware/auth.js";
import refreshTokenController from "../controllers/refreshToken.js";

const { createUser, logInUser, getCurrentUser, logOutUser } = users;
const { validateUserCreation, validateUserInfo } = validation;
const { refreshToken } = refreshTokenController;

const router = Router();
router.post("/signup", validateUserCreation, createUser);
router.post("/signin", validateUserInfo, logInUser);
router.get("/me", auth, getCurrentUser);
router.post("/signout", logOutUser);
router.post("/refresh", refreshToken);
export default router;
