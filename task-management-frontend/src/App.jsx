import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";

import "./App.css";

import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from "./utils/ProtectedRoute";
import IsLoggedOut from "./utils/IsLoggedOut";
import { fetchLoginStatus } from "./components/redux/reducers/loginCheckPage";
import PopUpMessage from "./components/PopUpMessage";

function App() {
  const dispatch = useDispatch();
  dispatch(fetchLoginStatus());

  return (
    <div className="App">
      <PopUpMessage />
      <Routes>
        <Route
          exact
          path="/login"
          element={
            <IsLoggedOut>
              <Login />
            </IsLoggedOut>
          }
        />
        <Route
          exact
          path="/signup"
          element={
            <IsLoggedOut>
              <Signup />
            </IsLoggedOut>
          }
        />
        <Route
          exact
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
