import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getComments, resetState } from "../features/comments/commentSlice";
import { useParams } from "react-router-dom";

const CommentList = () => {
  const dispatch = useDispatch();
  const { comments, isError, message } = useSelector((state) => state.comments);
  const { mapId } = useParams();

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    dispatch(getComments(mapId));

    return () => {
      dispatch(resetState());
    };
  }, [dispatch, isError, message, mapId]);

  console.log(comments);

  return (
    <div>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))
      ) : (
        <h3>No comments</h3>
      )}
    </div>
  );
};

const Comment = ({ comment }) => {
  return (
    <div>
      <div>{comment.user.username}</div>
      <div>{comment.content}</div>
      <div>{new Date(comment.createdAt).toLocaleString("en-US")}</div>
    </div>
  );
};

export default CommentList;
