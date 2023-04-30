import { useState } from "react";
import { useDispatch } from "react-redux";
import { addComment } from "../features/comments/commentSlice";

function CommentForm({ mapId }) {
  const [content, setContent] = useState("");
  const parentComment = useState(null); // Need to add code to change the parentParent into an id if a user wants to reply to another comment.

  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(addComment({ content, parentComment }, mapId));
    setContent("");
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="content">Comment</label>
          <input
            type="content"
            name="content"
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div onClick={onSubmit}>
          <button>Add Comment</button>
        </div>
      </form>
    </div>
  );
}

export default CommentForm;
