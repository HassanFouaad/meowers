/* exports.creatPostValidator = (req, res, next) => {
  req.check("title", "You need to Write a title").notEmpty();
  req.check("title", "title must be longer than 4 chars").isLength({
    min: 4,
    max: 150,
  });
  req.check("body", "You need to have a body inside").notEmpty();
  req.check("body", "Post must be longer than 4 chars").isLength({
    min: 4,
    max: 2000,
  });
  const errors = req.validationErrors();
  // if error what appers?
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  // next middleware
  next();
};

/* exports.userSignupValidator = (req, res, next)=>  {
  //name is not null between 4-15 chars
  req.check("name", "Name is required").notEmpty()
  //Email isnot null, valid and normalized
  req.cheak("email","Email must be not null")
  .matches(/.+\@.+\..+/)
  withMessage("Email must contain example@example.example")
  .isLength({
    min:4,
    max:2000,
  })
    //cheakpassword
    req.check("password", "password is required").notEmpty()
    req.check("password", "...").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i");

    req.check("password")
    .isLength({min:6})
    .withMessage("pasword must be 6 or more characters")
    .matches(/\d/)
    .withMessage("Password must contain 1 letter")
  //cheak for errors
  const errors = req.validationErrors();
  // if error what appers?
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  // next middleware
  next();
}
 */
 
