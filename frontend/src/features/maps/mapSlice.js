import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/map";

const initialState = {
  map: null,
  maps: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

const getMessage = (error) => {
  return (
    (error.response && error.response.data && error.response.data.message) ||
    error.message ||
    error.toString()
  );
};

export const getMap = createAsyncThunk("maps/getOne", async (id, thunkAPI) => {
  try {
    // const token = thunkAPI.getState().user.user.token;
    // return await api.getMap(id, token);
    return await api.getMap(id);
  } catch (error) {
    // send error message as payload
    return thunkAPI.rejectWithValue(getMessage(error));
  }
});

export const getMaps = createAsyncThunk("maps/getAll", async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().user.user.token;
    return await api.getMaps(token);
  } catch (error) {
    // send error message as payload
    return thunkAPI.rejectWithValue(getMessage(error));
  }
});

export const searchMapsBy = createAsyncThunk(
  "maps/searchBy",
  async (username, thunkAPI) => {
    try {
      return await api.searchMapsBy(username);
    } catch (error) {
      // send error message as payload
      return thunkAPI.rejectWithValue(getMessage(error));
    }
  }
);

export const deleteMap = createAsyncThunk(
  "maps/delete",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.user.token;
      return await api.deleteMap(id, token);
    } catch (error) {
      // send error message as payload
      return thunkAPI.rejectWithValue(getMessage(error));
    }
  }
);

export const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMap.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.map = action.payload;
      })
      .addCase(getMap.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getMaps.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.maps = action.payload;
      })
      .addCase(getMaps.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteMap.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.maps = state.maps.filter((map) => map._id !== action.payload.id);
      })
      .addCase(deleteMap.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(searchMapsBy.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.maps = action.payload;
        state.isLoading = false;
      })
      .addCase(searchMapsBy.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(searchMapsBy.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
        state.isLoading = false;
      });
  },
});

export const { resetState } = mapSlice.actions;
export default mapSlice.reducer;
