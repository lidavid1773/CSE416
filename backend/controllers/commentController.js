// Instead of having to constantly implement a try & catch block for each async function, we want to reuse our error handler
//  which we made to override the default express error handler (errorMiddleware)
const asyncHandler = require("express-async-handler");

const Comment = require("../models/commentModel");
const Map = require("../models/mapModel");

// GET /api/maps/:mapId/comments
const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({
    map: req.params.mapId,
    parentComment: null,
  })
    .populate("user")
    .populate({ path: "replies", populate: { path: "user" } });
  res.status(200).json(comments);
});

// POST /api/maps/:mapId/comments
const addComment = asyncHandler(async (req, res) => {
  const { content, parentComment } = req.body;
  const mapId = req.params.mapId;

  console.log(mapId);

  const map = await Map.findById(mapId);

  if (!map) {
    res.status(400);
    throw new Error("Map not found");
  }

  // Handles adding a comment to a map or to another comment
  const commentObj = new Comment({
    content: content,
    user: req.user,
    map: mapId,
    parentComment: parentComment || null,
  });

  // Store comment into database
  const comment = await commentObj.save();

  if (parentComment) {
    const targetComment = await Comment.findById(parentComment);
    if (!targetComment) {
      res.status(400);
      throw new Error("Parent comment not found");
    }
    targetComment.replies.push(comment._id);
    await targetComment.save();
  }

  res.status(200).json(commentObj);
});

// PUT /api/maps/:mapId/comments/:commentId
const updateComment = asyncHandler(async (req, res) => {});

// DEL /api/maps/:mapId/comments/:commentId
const deleteComment = asyncHandler(async (req, res) => {});

module.exports = {
  getComments,
  addComment,
  updateComment,
  deleteComment,
};
