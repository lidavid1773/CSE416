const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Please add content"]
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    map: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Map",
      required: true
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null
    },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: []
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
