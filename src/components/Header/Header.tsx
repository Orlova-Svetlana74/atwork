import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../ui/Button";
import styles from "./Header.module.scss";
import logo from "@/assets/logo.svg"; // путь к вашему логотипу
// import atwork from '@/assets/at-work.svg'; // путь к вашему логотипу

export const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <div className={styles.header__topcontainer}>
          <div className={styles.header__logo}>
            <img src={logo} alt="Logo" className={styles.logoImage} />
            <span className={styles.logoText}>at-work</span>
            {/* <Link to="/">MyApp</Link> */}
          </div>
        </div>

        <nav className={styles.nav}>
          {/* <Link to="/" className={styles.navLink}>Home</Link>
          <Link to="/about" className={styles.navLink}>About</Link> */}
          {isAuthenticated && (
            <Link to="/dashboard" className={styles.navLink}>
              Dashboard
            </Link>
          )}
        </nav>

        <div className={styles.actions}>
          {/* {isAuthenticated ? (
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button onClick={() => navigate("/login")}>Login</Button>
          )} */}
        </div>
      </div>
    </header>
  );
};
