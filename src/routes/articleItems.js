const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  validateArticleCreation,
  validateArticleIdParam,
} = require("../middlewares/validation");

const {
  getCurrentUser,
  getArticle,
  saveArticle,
  deleteArticle,
} = require("../controllers/articleItems");

router.get("/", auth, getArticle);
router.get("/me", auth, getCurrentUser);
router.post("/", auth, validateArticleCreation, saveArticle);
router.delete("/:articleId", auth, validateArticleIdParam, deleteArticle);

module.exports = router;
