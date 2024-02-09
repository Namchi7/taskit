import styles from "./css/header.module.css";

import { useDispatch } from "react-redux";
import { fetchLoginStatus } from "./redux/reducers/loginCheckPage";

// import searchIcon from "../assets/images/search.png";

function Header() {
  const dispatch = useDispatch();
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const logout = async () => {
    const res = await fetch(`${serverUrl}/logout`, {
      method: "GET",
      credentials: "include",
    });

    const result = await res.json();

    if (result.loggedOut) {
      dispatch(fetchLoginStatus());
    }
  };

  const openCreateTaskModal = () => {
    const createTaskModal = document.querySelector("[data-create-task-modal]");
    createTaskModal.style.display = "flex";
  };

  return (
    <div className={styles.container}>
      <div className={styles.subContainer}>
        <div className={styles.logo}>TaskIt</div>
        <div className={styles.right}>
          {/* <div className={styles.searchDiv}>
            <input
              type="text"
              placeholder="Search Task Title..."
              className={styles.searchInput}
            />
            <div className={styles.searchIconDiv}>
              <img
                src={searchIcon}
                alt="Search"
                className={styles.searchIcon}
              />
            </div>
          </div> */}

          <div
            className={styles.openCreateTask}
            onClick={(e) => {
              e.preventDefault();
              openCreateTaskModal();
            }}
          >
            Create Task
          </div>

          <div
            onClick={(e) => {
              e.preventDefault();
              logout();
            }}
            className={styles.logoutBtn}
          >
            Log Out
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
