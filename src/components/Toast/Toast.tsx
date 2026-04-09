// src/components/Toast/Toast.tsx
import React, { useEffect } from "react";
import styles from "./Toasts.module.scss";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = "success",
  duration = 4000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={`${styles.toast} ${styles[type]}`}>
        <div className={styles.content}>
          {type === "success" && <span className={styles.icon}>✓</span>}
          {type === "error" && <span className={styles.icon}>⚠️</span>}
          {type === "info" && <span className={styles.icon}>ℹ️</span>}
          <span className={styles.message}>{message}</span>
        </div>
        <button className={styles.closeButton} onClick={handleClose}>
          ✕
        </button>
      </div>
    </div>
  );
};

export default Toast;
