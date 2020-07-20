const express = require("express");
const { signup, signin, signout } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const { userValidationRules, validate } = require("../validator/uservalid");
const router = express.Router();

router.post("/signup", userValidationRules(), validate, signup);
router.post("/signin", signin);
router.get("/signout", signout);

// any route containing userId, out app will first execute user by id method

router.param("userId", userById)
module.exports = router;
