import Article from "../models/articleItem.js";
import InternalServerError from "../middleware/errors/internalServerError.js";
import NotFoundError from "../middleware/errors/notFoundError.js";
import BadRequestError from "../middleware/errors/badRequestError.js";
import statusCodes from "../utils/statusCodes.js";


const { OK_STATUS, NO_CONTENT_STATUS } = statusCodes;


const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("User not found"));
      }
      res.status(OK_STATUS).send(user);
    })
    .catch(() =>
      next(
        new InternalServerError(
          "An error occurred while retrieving user information",
        ),
      ),
    );
};

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
    .catch(() => {
      next(
        new InternalServerError("An error occurred while saving the article"),
      );
    });
};

const deleteArticle = (req, res, next) => {
  const articleId = req.params.articleId;
  const ownerId = req.user._id;

  Article.findOneAndDelete({ _id: articleId, owner: ownerId })
    .then((deletedArticle) => {
      if (!deletedArticle) {
        return next(
          new BadRequestError("Article not found or not owned by user"),
        );
      }
      res.status(NO_CONTENT_STATUS).send();
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
  getCurrentUser,
};
