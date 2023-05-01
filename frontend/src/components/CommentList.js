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

  return (
    <div>
      <p>{comments.length} comments</p>
      {comments.map((comment) => (
        <Comment key={comment._id} comment={comment} />
      ))}
    </div>
  );
};

const Comment = ({ comment }) => {
  return (
    <div className="comment">
      <div>{comment.user.username}</div>
      <div>{comment.content}</div>
      <div>{new Date(comment.createdAt).toLocaleString("en-US")}</div>
    </div>
  );
};

export default CommentList;
