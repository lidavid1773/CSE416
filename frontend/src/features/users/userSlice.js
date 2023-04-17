import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/user";

// Get user from local storage and set it in the initial state if it exists
const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: user ? user : null,
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

export const register = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      return await api.register(user);
    } catch (error) {
      // send error message as payload
      return thunkAPI.rejectWithValue(getMessage(error));
    }
  }
);

export const login = createAsyncThunk("user/login", async (user, thunkAPI) => {
  try {
    return await api.login(user);
  } catch (error) {
    // send error message as payload
    return thunkAPI.rejectWithValue(getMessage(error));
  }
});

export const logout = createAsyncThunk("user/logout", async () => {
  api.logout();
});

// reducers cannot contain async/thunk functions (will go to extra reducers)
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isSuccess = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.user = null;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.user = null;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { resetState } = userSlice.actions;
export default userSlice.reducer;
