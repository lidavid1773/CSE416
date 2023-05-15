import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/comment";

const initialState = {
  comments: [],
  isError: false,
  isSuccess: false,
  message: "",
};

const getMessage = (error) => {
  return (
    (error.response && error.response.data && error.response.data.message) ||
    error.message ||
    error.toString()
  );
};

export const getComments = createAsyncThunk(
  "comments/getAll",
  async (id, thunkAPI) => {
    try {
      return await api.getComments(id);
    } catch (error) {
      // send error message as payload
      return thunkAPI.rejectWithValue(getMessage(error));
    }
  }
);

export const addComment = createAsyncThunk(
  "comments/add",
  async ({ commentData, id }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.user.token;
      return await api.addComment(commentData, id, token);
    } catch (error) {
      // send error message as payload
      return thunkAPI.rejectWithValue(getMessage(error));
    }
  }
);

export const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getComments.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.comments = action.payload;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.isSuccess = true;
        // add the comment in the right place. either list or comments or in a comment's replies
        if (action.payload.parentComment) {
          const commentIdx = state.comments.findIndex(
            (comment) => comment._id === action.payload.parentComment
          );
          if (commentIdx !== -1) {
            state.comments[commentIdx].replies.push(action.payload);
          }
        } else {
          state.comments.push(action.payload);
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetState } = commentSlice.actions;
export default commentSlice.reducer;
