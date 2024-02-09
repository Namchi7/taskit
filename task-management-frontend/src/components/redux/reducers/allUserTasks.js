import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAllUserTasks = createAsyncThunk(
  "fetchAllUserTasks",
  async () => {
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const res = await fetch(`${serverUrl}/all-tasks`, {
      method: "GET",
      credentials: "include",
      secure: true,
    });

    const result = await res.json();

    return result;
  }
);

const allUserTaskSlice = createSlice({
  name: "allUserTasks",
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllUserTasks.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAllUserTasks.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchAllUserTasks.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
  },
});

export default allUserTaskSlice.reducer;
