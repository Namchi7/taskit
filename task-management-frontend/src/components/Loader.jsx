import styles from "./css/loader.module.css";

function Loader() {
  return (
    <div className={styles.container}>
      <div className={styles.loaderDiv}>
        <div className={styles.loaderMoving}>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
        </div>
        <p className={styles.loaderText}>Loading...</p>
      </div>
    </div>
  );
}

export default Loader;
