mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
let postSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 4,
    maxength: 150,
  },
  body: {
    type: String,
    required: "Body is required",
    minLength: 1,
    maxLength: 2500,
  },
  photo: {
    data: Buffer,
    contentType: String,
  },

  postedBy: {
    type: ObjectId,
    ref: "User",
  },
  created: {
    type: Date,
    default: Date.now,
  },
  likes: [{ type: ObjectId, ref: "User" }],
  comments:[{
    text:String,
    created: {type:Date, default:Date.now},
    postedBy:{type:ObjectId,ref:"User"}
  }]
});

module.exports = mongoose.model("Post", postSchema);
