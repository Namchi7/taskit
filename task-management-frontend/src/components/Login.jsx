import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";

import styles from "./css/login.module.css";
import Loader from "./Loader";
import { fetchLoginStatus } from "./redux/reducers/loginCheckPage";

import openEye from "../assets/images/eye-open.png";
import closedEye from "../assets/images/eye-closed.png";
import { showPopUp } from "./PopUpMessage";

function Login() {
  const dispatch = useDispatch();

  const [loginWait, setLoginWait] = useState(false);
  const [visible, setVisible] = useState(false);

  const unameRef = useRef();
  const passRef = useRef();

  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uname = unameRef.current.value;
    const pass = passRef.current.value;

    setLoginWait(true);

    const res = await fetch(
      `${serverUrl}/login?uname=${uname}&password=${pass}`,
      { method: "GET", credentials: "include" }
    );

    const result = await res.json();

    setLoginWait(false);

    let message = "Unable to login. Check credentials.";

    if (result.loggedIn) {
      dispatch(fetchLoginStatus());
      message = "User Logged In.";
      showPopUp({ success: true, message: message });
    } else {
      showPopUp({ success: false, message: message });
    }
  };

  const passwordVisible = () => {
    setVisible(!visible);
  };

  return (
    <>
      {loginWait && <Loader />}
      <div className={styles.container}>
        <form className={styles.loginForm} onSubmit={(e) => handleSubmit(e)}>
          <div className={styles.loginText}>LogIn</div>
          <div className={styles.fields}>
            <label htmlFor="username" className={styles.formLabel}>
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username..."
              className={styles.formInput}
              ref={unameRef}
            />
          </div>
          <div className={styles.fields}>
            <label htmlFor="password" className={styles.formLabel}>
              Password
            </label>
            <div className={styles.passwordInputDiv}>
              <input
                type={visible ? "text" : "password"}
                name="password"
                placeholder="Enter your password..."
                className={`${styles.formInput} ${styles.passwordInput}`}
                ref={passRef}
              />
              <div
                className={styles.eyeDiv}
                onClick={(e) => {
                  e.preventDefault();
                  passwordVisible();
                }}
              >
                <img
                  src={visible ? closedEye : openEye}
                  alt={visible ? "Hide" : "Show"}
                  className={styles.eyeIcon}
                />
              </div>
            </div>
          </div>
          <input type="submit" value="LogIn" className={styles.loginBtn} />
          <div className={styles.lastRow}>
            <p className={styles.forgotPassword}>Forgot Password?</p>
            <Link to="/signup" className={styles.signup}>
              SignUp
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
