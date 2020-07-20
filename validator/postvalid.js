const { body, validationResult } = require("express-validator");
const userValidationPost = () => {
  return [
    // username must be an email
    body("title").notEmpty().withMessage("Empty Title!"),
    // password must be at least 5 chars long
    body("body")
      .isLength({
        min: 1,
        max: 2000,
      })
      .withMessage("Empty Post"),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ messsage: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = {
  userValidationPost,
  validate,
};
