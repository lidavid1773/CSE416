import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getComments,
  addComment,
  resetState,
} from "../features/comments/commentSlice";
import { useParams } from "react-router-dom";

const CommentList = () => {
  const dispatch = useDispatch();
  const { comments, isError, message } = useSelector((state) => state.comments);
  const { mapId } = useParams();
  const [content, setContent] = useState("");

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    dispatch(getComments(mapId));

    return () => {
      dispatch(resetState());
    };
  }, [dispatch, isError, message, mapId]);

  const leaveComment = () => {
    const commentData = {
      content,
      parentComment: null,
    };
    dispatch(addComment(commentData, mapId));
  };

  return (
    <div>
      <p>{comments.length} Comment Section</p>

      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment..."
      />
      <button onClick={() => leaveComment()}>Comment</button>

      <div className="comment-section">
        {comments.map((comment) => {
          return (
            <div key={comment._id}>
              <Comment comment={comment} isReply={false} />
              {comment.replies.map((replyComment) => (
                <Comment
                  key={replyComment._id}
                  comment={replyComment}
                  isReply={true}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Comment = ({ comment, isReply }) => {
  const replyToComment = (id) => {
    console.log(`Replying to comment... ${id}`);
  };

  return (
    <>
      {isReply ? (
        <div className="child-comment">
          <div>
            <div className="comment-author">{comment.user.username}</div>
            <div className="comment-date">
              {new Date(comment.createdAt).toLocaleString("en-US")}
            </div>
          </div>
          <div className="comment-content">{comment.content}</div>
        </div>
      ) : (
        <div className="parent-comment">
          <div>
            <div className="comment-author">{comment.user.username}</div>
            <div className="comment-date">
              {new Date(comment.createdAt).toLocaleString("en-US")}
            </div>
          </div>
          <div className="comment-content">{comment.content}</div>
          <div className="reply-button-container">
            <button
              onClick={() => replyToComment(comment._id)}
              className="reply-button"
            >
              Reply
            </button>
            <span className="reply-counter">
              {comment.replies.length} replies
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default CommentList;
