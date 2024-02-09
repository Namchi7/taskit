import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchLoginStatus = createAsyncThunk(
  "fetchLoginStatus",
  async () => {
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    const res = await fetch(`${serverUrl}/check-jwt-token`, {
      method: "GET",
      credentials: "include",
      secure: true,
    });

    const result = await res.json();

    // const result = {
    //   uname: "User",
    //   loggedIn: true,
    // };

    const flags = {
      uname: result.uname,
      loggedIn: result.loggedIn,
    };

    return flags;
  }
);

const loginCheckSlice = createSlice({
  name: "loginCheck",
  initialState: {
    isLoading: false,
    login: false,
    uname: null,
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLoginStatus.pending, (state) => {
      state.isLoading = true;
      state.uname = null;
    });
    builder.addCase(fetchLoginStatus.fulfilled, (state, action) => {
      state.isLoading = false;
      state.login = action.payload.loggedIn;
      state.uname = action.payload.uname;
    });
    builder.addCase(fetchLoginStatus.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
  },
});

export default loginCheckSlice.reducer;
