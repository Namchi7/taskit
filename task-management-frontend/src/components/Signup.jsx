import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";

import styles from "./css/signup.module.css";
import Loader from "./Loader";

import openEye from "../assets/images/eye-open.png";
import closedEye from "../assets/images/eye-closed.png";
import { showPopUp } from "./PopUpMessage";

function Signup() {
  const navigate = useNavigate();

  const [signUpWait, setSignUpWait] = useState(false);

  const [cVisible, setCVisible] = useState(false);
  const [visible, setVisible] = useState(false);

  const [cPassMatch, setCPassMatch] = useState(true);
  const [userExists, setUserExists] = useState(false);

  const unameSRef = useRef();
  const passSRef = useRef();
  const cpassSRef = useRef();

  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const usernameChange = () => {
    setUserExists(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const uname = unameSRef.current.value;
    const pass = passSRef.current.value;
    const cpass = cpassSRef.current.value;

    if (cpass !== pass) {
      console.log("Password does not match");
      return;
    }

    setSignUpWait(true);

    const res = await fetch(
      `${serverUrl}/signup?uname=${uname}&password=${pass}`,
      { method: "GET", credentials: "include" }
    );

    const result = await res.json();

    setSignUpWait(false);

    if (result.success) {
      setUserExists(false);
      navigate("/login");
      const message = "User created. Login to continue.";
      showPopUp({ success: true, message: message });
    }
    if (!result.success) {
      setUserExists(true);
    }
  };

  const matchPassword = (e) => {
    e.preventDefault();
    const pass = passSRef.current.value;
    const cpass = cpassSRef.current.value;

    if (pass !== cpass) {
      setCPassMatch(false);
    } else {
      setCPassMatch(true);
    }
  };

  const passwordVisible = () => {
    setVisible(!visible);
  };

  const cPasswordVisible = () => {
    setCVisible(!cVisible);
  };

  return (
    <>
      {signUpWait && <Loader />}
      <div className={styles.container}>
        <form className={styles.signupForm} onSubmit={(e) => handleSubmit(e)}>
          <div className={styles.signupText}>SignUp</div>
          <div className={styles.fields}>
            <label htmlFor="username" className={styles.formLabel}>
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter a username..."
              onChange={() => usernameChange()}
              className={styles.formInput}
              ref={unameSRef}
            />
            {!userExists ? (
              ""
            ) : (
              <div className={styles.errorText}>User Already Exists!</div>
            )}
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
                ref={passSRef}
                onChange={(e) => matchPassword(e)}
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
          <div className={styles.fields}>
            <label htmlFor="cpassword" className={styles.formLabel}>
              Confirm Password
            </label>
            <div className={styles.passwordInputDiv}>
              <input
                type={cVisible ? "text" : "password"}
                name="cpassword"
                placeholder="Confirm password..."
                className={
                  cPassMatch
                    ? `${styles.formInput} ${styles.passwordInput}`
                    : `${styles.formInput} ${styles.passwordInput} ${styles.mismatch}`
                }
                ref={cpassSRef}
                onChange={(e) => matchPassword(e)}
              />
              <div
                className={styles.eyeDiv}
                onClick={(e) => {
                  e.preventDefault();
                  cPasswordVisible();
                }}
              >
                <img
                  src={cVisible ? closedEye : openEye}
                  alt={cVisible ? "Hide" : "Show"}
                  className={styles.eyeIcon}
                />
              </div>
            </div>
            {cPassMatch ? (
              ""
            ) : (
              <div className={styles.errorText}>
                Password and Confirm Password should match!
              </div>
            )}
          </div>
          <input type="submit" value="SignUp" className={styles.signupBtn} />
          <p className={styles.lastRow}>
            Already have an account?{"  "}
            <Link to="/login" className={styles.login}>
              Login.
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default Signup;
