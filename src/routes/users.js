import { Router } from "express";
import validation from "../middleware/validation.js";
import users from "../controllers/users.js";

const { createUser, logInUser } = users;
const { validateUserCreation, validateUserInfo } = validation;

const router = Router();
router.post("/signup", validateUserCreation, createUser);
router.post("/signin", validateUserInfo, logInUser);

export default router;
