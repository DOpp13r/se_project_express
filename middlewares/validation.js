const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

// clothing item body when an item is created
module.exports.validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": "The minimum length must be 2",
      "string.max": "The maximum length must be 30",
      "string.empty": "The 'name' field must be filled in",
    }),

    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),

    weather: Joi.string().valid("hot", "warm", "cold").required(),
  }),
});

// user info body when a user is created
module.exports.validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": "The minimum length must be 2",
      "string.max": "The maximum length must be 30",
      "string.empty": "The 'name' field must be filled in",
    }),

    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'the "avatar" field must be a valid url',
    }),

    email: Joi.string().required().email().messages({
      "string.email": "Enter a valid email",
      "string.empty": 'The "email" field must be filled in',
    }),

    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

// user info is checked when updated
module.exports.validateUpdateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": "The minimum length must be 2",
      "string.max": "The maximum length must be 30",
      "string.empty": "The 'name' field must be filled in",
    }),

    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'the "avatar" field must be a valid url',
    }),
  }),
});

// authentication when a user logs in
module.exports.validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.email": "Enter a valid email",
      "string.empty": 'The "email" field must be filled in',
    }),

    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

// user and clothing item IDs when accessed
module.exports.validateID = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().required().hex().length(24).messages({
      "string.length": "The 'ID' must be 24 characters long",
      "string.empty": "The 'ID' field must be filled in",
    }),
  }),
});
