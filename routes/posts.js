const express = require("express");
const {
  getPosts,
  createPost,
  postedByUser,
  postById,
  liked,
  isPoster,
  deletePost,
  updatePost,
  photo,
  comment,
  uncomment,
  like,
  unlike,
  singlePost,
} = require("../controllers/posts");
const { requireSignin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

const { userValidationPost, validate } = require("../validator/postvalid");

const router = express.Router();
//like and unlikes
router.put("/posts/like", like);
router.put("/posts/unlike", unlike);

//Comments
router.put("/posts/comment", comment);
router.put("/posts/uncomment", uncomment);
router.post(
  "/post/new/:userId",
  requireSignin,
  createPost,
  userValidationPost(),
  validate
);
router.get("/posts", getPosts);
router.get("/post/postId", singlePost);
router.get("/posts/by/:userId", requireSignin, postedByUser);
router.put("/post/:postId", requireSignin, isPoster, updatePost);
router.delete("/deletepost/:postId", deletePost);
router.get("/post/photo/:postId", photo);

router.param("userId", userById);
router.param("postId", postById);
// any route containing userId, out app will first execute user by id method

module.exports = router;
