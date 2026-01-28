import { Router } from "express";
import auth from "../middleware/auth.js";
import validation from "../middleware/validation.js";
import articleItemsController from "../controllers/articleItems.js";

const { getCurrentUser, getArticle, saveArticle, deleteArticle } = articleItemsController;
const { validateArticleCreation, validateArticleIdParam } = validation;

const router = Router();

router.get("/", auth, getArticle);
router.get("/me", auth, getCurrentUser);
router.post("/", auth, validateArticleCreation, saveArticle);
router.delete("/:articleId", auth, validateArticleIdParam, deleteArticle);

export default router;
