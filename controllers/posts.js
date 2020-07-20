const Post = require("../models/posts");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");

const { post } = require("../routes/posts");
const { userById } = require("./user");
const { isBuffer } = require("lodash");
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
exports.postById = (req, res, next, id) => {
  Post.findById(id)
    .select("_id title body created likes photo")

    .populate("postedBy", "_id name photo")
    .populate("comments", "text created")
    .populate("comments.postedBy", "_id name photo")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(400).json({
          error: err,
        });
      }
      req.post = post;
      next();
    });
};

exports.getPosts = (req, res) => {
  const posts = Post.find()
    .populate("postedBy", "_id name comment likes")
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .populate("comments", "text created")
    .populate("comments.postedBy", "_id name photo")
    .populate("post.postedBy")
    .select("_id title body created likes postedBy")
    .sort({ created: -1 })
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => console.log(err));
};

exports.createPost = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "image couldn't be uploaded",
      });
    }
    let post = new Post(fields);
    post.postedBy = req.profile;
    req.profile.salt = undefined;
    req.profile.hashed_password = undefined;
    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }
    post.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json(result);
    });
  });
  let post = new Post(req.body);
  post.save().then((result) => {
    res.status(200).json({
      post: result,
    });
  });
};

exports.postedByUser = (req, res) => {
  Post.find({ postedBy: req.profile._id })
    .populate("postedBy", "_id name body title photo")
    .select("_id title body created likes")
    .sort("_created")
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json(posts);
    });
};

exports.isPoster = (req, res, next) => {
  let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id;
  console.log("req.post: ", req.post);
  console.log("req.auth: ", req.auth);
  console.log("req.post.postedBy._id: ", req.post.postedBy._id);
  console.log("req.auth._id: ", req.auth._id);
  if (!isPoster) {
    return res.status(403).json({ error: "You don't own the post" });
  }
  next();
};
exports.updatePost = (req, res, next) => {
  let post = req.post;
  post = _.extend(post, req.body);
  post.updated = Date.now();
  post.save((err) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.json(post);
  });
};

exports.liked = (req, res, next) => {
  var already = req.post.likes;
  if (already.includes(req.body.userId)) {
    return res.status(400).json({
      error: "AlreadyLiked",
    });
  } else {
    console.log(already)
    next();
  }
};

exports.deletePost = (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(400).json({ error: err });
      }
      if (post) {
        post
          .remove()
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
};

exports.photo = (req, res, next) => {
  res.set("Content-Type", req.post.photo.contentType);
  return res.send(req.post.photo.data);
};

exports.like = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.body.userId },
    },
    { new: true }
  )
    .populate("postedBy", "_id name photo")
    .populate("comments.postedBy", "_id name photo")
    .populate("postedBy", "_id name photo")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({ err });
      } else {
        res.json(result);
      }
    });
};

exports.unlike = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.body.userId },
    },
    { new: true }
  )
    .populate("postedBy", "_id name photo")
    .populate("comments.postedBy", "_id name photo")
    .populate("postedBy", "_id name photo")

    .exec((err, result) => {
      if (err) {
        return res.status(400).json({ err });
      } else {
        res.json(result);
      }
    });
};

exports.comment = (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.body.userId,
  };

  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    { new: true }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")

    .exec((err, result) => {
      if (err) {
        return res.status(400).json({ err });
      } else {
        res.json(result);
      }
    });
};

exports.uncomment = (req, res) => {
  let comment = req.body.comment;
  comment.postedBy = req.body.postedBy;
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { comments: { _id: comment._id } },
    },
    { new: true }
  )
    .populate("postedBy", "_id name photo")
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({ err });
      } else {
        res.json(result);
      }
    });
};

exports.singlePost = (req, res) => {
  return res.json(req.post);
};
