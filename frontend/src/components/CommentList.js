const CommentList = ({ comments }) => {
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
