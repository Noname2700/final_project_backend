import Article from "../models/articleItem.js";
import InternalServerError from "../middleware/errors/internalServerError.js";
import BadRequestError from "../middleware/errors/badRequestError.js";
import NotFoundError from "../middleware/errors/notFoundError.js";
import ForbiddenError from "../middleware/errors/forbiddenError.js";
import statusCodes from "../utils/statusCodes.js";

const { OK_STATUS, NO_CONTENT_STATUS } = statusCodes;

const getArticle = (req, res, next) => {
  const ownerId = req.user._id;
  Article.find({ owner: ownerId })
    .then((articles) => {
      res.status(OK_STATUS).send(articles);
    })
    .catch(() => {
      next(
        new InternalServerError("An error occurred while retrieving articles"),
      );
    });
};

const saveArticle = (req, res, next) => {
  const ownerId = req.user._id;
  const { keyword, imageUrl, link, title, date, text, source } = req.body;

  Article.create({
    keyword,
    imageUrl,
    link,
    title,
    date,
    text,
    source,
    owner: ownerId,
  })
    .then((article) => {
      res.status(OK_STATUS).send(article);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid article data"));
      } else {
        next(
          new InternalServerError("An error occurred while saving the article"),
        );
      }
    });
};

const deleteArticle = (req, res, next) => {
  const articleId = req.params.articleId;
  const ownerId = req.user._id;

  Article.findById(articleId)
    .then((article) => {
      if (!article) {
        return next(new NotFoundError("Article not found"));
      }
      if (article.owner.toString() !== ownerId) {
        return next(
          new ForbiddenError(
            "You do not have permission to delete this article",
          ),
        );
      }
      return Article.findByIdAndDelete(articleId);
    })
    .then((deletedArticle) => {
      if (deletedArticle) {
        res.status(NO_CONTENT_STATUS).send();
      }
    })
    .catch(() => {
      next(
        new InternalServerError("An error occurred while deleting the article"),
      );
    });
};

export default {
  getArticle,
  saveArticle,
  deleteArticle,
};
