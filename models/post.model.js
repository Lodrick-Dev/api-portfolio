const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    posterId: {
      type: String,
      required: true,
    },
    projet: {
      type: String,
      required: true,
      minlength: 3,
      maxLength: 100,
      unique: true,
      trim: true,
    },
    image: {
      type: String,
      default: "/uploads/posts/defaultprofil.png",
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    lien: {
      type: String,
      required: true,
      unique: true,
    },
    lienGitApi: {
      type: String,
      unique: true,
    },
    lienGitFront: {
      type: String,
      unique: true,
    },
    skills: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

const PostModel = mongoose.model("publication", postSchema);
module.exports = PostModel;
