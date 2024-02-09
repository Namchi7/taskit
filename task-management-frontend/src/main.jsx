// import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
// import dotenv from "dotenv";

import App from "./App.jsx";
import "./index.css";
import { store } from "./components/redux/store.js";

// dotenv.config();

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
  // </React.StrictMode>,
);
