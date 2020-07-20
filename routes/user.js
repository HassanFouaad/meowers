const express = require("express");
const {
  userById,
  allUsers,
  getUser,
  updateUser,
  deleteUser,
  userPhoto,
  addFollowing,
  addFollower,
  removeFollowing,
  removeFollower,
  findPeople
} = require("../controllers/user");
const { requireSignin } = require("../controllers/auth");

const router = express.Router();

router.put("/users/follow", requireSignin, addFollowing, addFollower);
router.put("/users/unfollow", requireSignin, removeFollowing, removeFollower);

router.get("/users", allUsers);
router.get("/user/:userId", requireSignin, getUser);
router.put("/user/:userId", requireSignin, updateUser);
router.delete("/user/:userId", requireSignin, deleteUser);
router.get("/user/photo/:userId", userPhoto);

// any route containing userId, out app will first execute user by id method
//who to follow
router.get("/user/findpeople/:userId", requireSignin, findPeople);
router.param("userId", userById);

module.exports = router;
