const express = require("express");
const router = express.Router();

const {
  getComments,
  addComment,
  updateComment,
  deleteComment
} = require("../controllers/commentController");

const { protect } = require("../middleware/authMiddleware");

router.get("/:mapId/comments", getComments);
router.post("/:mapId/comments", protect, addComment);
router.put("/:mapId/comments/:commentId", protect, updateComment);
router.delete("/:mapId/comments/:commentId", protect, deleteComment);

module.exports = router;
