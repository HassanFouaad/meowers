const jwt = require("jsonwebtoken");
require("dotenv").config();
const expressJwt = require("express-jwt");
const User = require("../models/users");
exports.signup = async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists)
    return res.status(400).json({
      error: "Email is taken",
    });
  const user = /* await */ new User(req.body);
  await user.save();
  res.status(200).json({ message: "Signed up, Login now!" });
};

exports.signin = (req, res) => {
  //find the user based on email
  const { _id, email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    //if error or no user
    if (err || !user) {
      return res.status(401).json({
        error: "Email doesn't exist, Please SignUP.",
      });
    }
    //if user is found, authenticate
    //if email found make sure that matches the password
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "invaild Password.",
      });
    }
    //generate tokens with id secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    //persist the cookie with the name as "t" in cookie with expiry date
    res.cookie("t", token, { expire: new Date() + 9999 });
    //return response with user and token to frontend
    const { _id, name, email } = user;
    return res.json({ token, user: { _id, name, email } });
    //return response with user and token
  });
};

exports.signout = (req, res) => {
  res.clearCookie("T");
  return res.json({ message: "Signed out successfully" });
};




exports.requireSignin = expressJwt({
  //if the token is vaild, express
  secret: process.env.JWT_SECRET,
  userProperty: "auth"
});
