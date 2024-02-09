import styles from "./css/home.module.css";

import Header from "./Header";
import Tasks from "./Tasks";

function Home() {
  return (
    <div className={styles.container}>
      <Header />
      <Tasks />
    </div>
  );
}

export default Home;
