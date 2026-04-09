import { Outlet } from "react-router";
import { Header } from "../Header";
// import { Footer } from "../Footer";
import styles from "./Layout.module.scss";

export const Layout = () => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <Outlet />
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
};
