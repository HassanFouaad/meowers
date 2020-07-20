const { body, validationResult } = require("express-validator");
const userValidationRules = () => {
  return [
    // username must be an email
    body("name").notEmpty().withMessage("Please Enter your Name"),
    body("email").notEmpty().withMessage("Please Enter your Email").isEmail().withMessage("Please Enter a vaild email"),
    // password must be at least 5 chars long
    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 chars long")
      .matches(/\d/)
      .withMessage("Pasword must contain a number"),
  ];
};

const validate = (req, res, next) => {
  const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    // Build your resulting errors however you want! String, object, whatever - it works!
    return `${msg}`;
  };
  const result = validationResult(req).formatWith(errorFormatter);
  if (!result.isEmpty()) {
    // Response will contain something like
    // { errors: [ "body[password]: must be at least 10 chars long" ] }
    return res.json({ error: result.array()[0]});
  } return next();
};

module.exports = {
  userValidationRules,
  validate,
};
