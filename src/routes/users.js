import { Router } from "express";
import validation from "../middleware/validation.js";
import users from "../controllers/users.js";
import auth from "../middleware/auth.js";

const { createUser, logInUser, getCurrentUser } = users;
const { validateUserCreation, validateUserInfo } = validation;

const router = Router();
router.post("/signup", validateUserCreation, createUser);
router.post("/signin", validateUserInfo, logInUser);
router.get("/me", auth,getCurrentUser);

export default router;
