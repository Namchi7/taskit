import { configureStore } from "@reduxjs/toolkit";

import loginCheckReducer from "./reducers/loginCheckPage.js";
import allTasksReducer from "./reducers/allUserTasks.js";

export const store = configureStore({
  reducer: {
    isLoggedIn: loginCheckReducer,
    allTasks: allTasksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export default store;
