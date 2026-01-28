import { Joi, celebrate } from "celebrate";
import validator from "validator";
const { isURL } = validator;

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 30;
const PASSWORD_MIN_LENGTH = 6;
const ITEM_ID_LENGTH = 24;

const validateUrl = (value, helpers) => {
  if (isURL(value)) {
    return value;
  }
  return helpers.error("Invalid URL format");
};

const validateUserCreation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.email": 'The "email" field must be a valid email address',
      "string.empty": 'The "email" field must be filled',
    }),

    password: Joi.string()
      .min(PASSWORD_MIN_LENGTH)
      .required()
      .messages({
        "string.min": `The "password" field must be at least ${PASSWORD_MIN_LENGTH} characters long`,
        "string.empty": 'The "password" field must be filled',
      }),

    name: Joi.string()
      .min(NAME_MIN_LENGTH)
      .max(NAME_MAX_LENGTH)
      .required()
      .messages({
        "string.min": `The "name" field must be at least ${NAME_MIN_LENGTH} characters long`,
        "string.max": `The "name" field must be at most ${NAME_MAX_LENGTH} characters long`,
        "string.empty": 'The "name" field must be filled',
      }),
  }),
});

const createIdvalidator = (paramName) =>
  celebrate({
    params: Joi.object().keys({
      [paramName]: Joi.string()
        .length(ITEM_ID_LENGTH)
        .hex()
        .required()
        .messages({
          "string.length": `The "${paramName}" parameter must be ${ITEM_ID_LENGTH} characters long`,
          "string.hex": `The "${paramName}" parameter must be a valid hexadecimal string`,
          "any.required": `The "${paramName}" parameter is required`,
        }),
    }),
  });

const validateUserInfo = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.email": 'The "email" field must be a valid email address',
      "string.empty": 'The "email" field must be filled',
    }),

    password: Joi.string()
      .min(PASSWORD_MIN_LENGTH)
      .required()
      .messages({
        "string.min": `The "password" field must be at least ${PASSWORD_MIN_LENGTH} characters long`,
        "string.empty": 'The "password" field must be filled',
      }),

    name: Joi.string()
      .min(NAME_MIN_LENGTH)
      .max(NAME_MAX_LENGTH)
      .required()
      .messages({
        "string.min": `The "name" field must be at least ${NAME_MIN_LENGTH} characters long`,
        "string.max": `The "name" field must be at most ${NAME_MAX_LENGTH} characters long`,
        "string.empty": 'The "name" field must be filled',
      }),
  }),
});

const authenticateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.email": 'The "email" field must be a valid email address',
      "string.empty": 'The "email" field must be filled',
    }),

    password: Joi.string()
      .min(PASSWORD_MIN_LENGTH)
      .required()
      .messages({
        "string.min": `The "password" field must be at least ${PASSWORD_MIN_LENGTH} characters long`,
        "string.empty": 'The "password" field must be filled',
      }),
  }),
});

const validateArticleCreation = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required().messages({
      "string.empty": 'The "keyword" field must be filled',
    }),
    imageUrl: Joi.string().custom(validateUrl).required().messages({
      "string.empty": 'The "imageUrl" field must be filled',
      "string.uri": 'The "imageUrl" field must be a valid URL',
    }),
    link: Joi.string().custom(validateUrl).required().messages({
      "string.empty": 'The "link" field must be filled',
      "string.uri": 'The "link" field must be a valid URL',
    }),
    title: Joi.string().required().messages({
      "string.empty": 'The "title" field must be filled',
    }),
    date: Joi.string().required().messages({
      "string.empty": 'The "date" field must be filled',
    }),
    text: Joi.string().required().messages({
      "string.empty": 'The "text" field must be filled',
    }),
    source: Joi.string().required().messages({
      "string.empty": 'The "source" field must be filled',
    }),
  }),
});

const validateArticleIdParam = celebrate({
  params: Joi.object().keys({
    articleId: Joi.string()
      .length(ITEM_ID_LENGTH)
      .hex()
      .required()
      .messages({
        "string.length": `The "articleId" parameter must be ${ITEM_ID_LENGTH} characters long`,
        "string.hex":
          'The "articleId" parameter must be a valid hexadecimal string',
        "any.required": 'The "articleId" parameter is required',
      }),
  }),
});

const validateArticleId = createIdvalidator("articleId");

export default {
  validateUserCreation,
  validateUserInfo,
  authenticateUser,
  validateArticleCreation,
  validateArticleIdParam,
  validateArticleId,
};
