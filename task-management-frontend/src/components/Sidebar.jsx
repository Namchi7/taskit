import styles from "./css/sidebar.module.css";

function Sidebar() {
  return (
    <div className={styles.container}>
      <div className={styles.labels}>
        <div className={styles.labelDiv}>
          <div className={styles.labelIconDiv}></div>
          <div className={styles.labelName}>Pending</div>
        </div>

        <hr />

        <div className={styles.labelDiv}>
          <div className={styles.labelIconDiv}></div>
          <div className={styles.labelName}>Completed</div>
        </div>

        <hr />

        <div className={styles.labelDiv}>
          <div className={styles.labelIconDiv}></div>
          <div className={styles.labelName}>Dropped</div>
        </div>

        <hr />
      </div>

      <div className={styles.user}>
        <hr />
        <div className={styles.userInfo}>
          <div className={styles.userDP}></div>
          <div className={styles.userName}>John Doe</div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
