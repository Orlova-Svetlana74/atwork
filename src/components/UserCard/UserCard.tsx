import React, { useState, useRef, useEffect } from "react";
import type { User } from "@/types/user";
import { useUserStore } from "@/store/userStore";
import vector from "@/assets/vector.svg";
import styles from "./UserCard.module.scss";

interface UserCardProps {
  user: User;
  onArchive?: (user: User) => void;
  onHide?: (user: User) => void;
  onActivate?: (user: User) => void; // Активировать из архива
  onRestore?: (user: User) => void;
  onShow?: (user: User) => void;
  isArchived?: boolean;
  isHidden?: boolean;
  isActive?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onArchive,
  onHide,
  onActivate,
  onRestore,
  onShow,
  isArchived = false,
  isHidden = false,
  isActive = false,
}) => {
  const setSelectedUser = useUserStore((state) => state.setSelectedUser);
  const setEditModalOpen = useUserStore((state) => state.setEditModalOpen);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleArchiveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    if (onArchive) {
      onArchive(user);
    }
  };

  const handleHideClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    if (onHide) {
      onHide(user);
    }
  };

  const handleActivateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    if (onActivate) {
      onActivate(user);
    }
  };

  const handleRestoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    if (onRestore) {
      onRestore(user);
    }
  };

  const handleShowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    if (onShow) {
      onShow(user);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`;

  const cardClasses = `
    ${styles.userCard} 
    ${isArchived ? styles.archived : ""} 
    ${isHidden ? styles.hidden : ""}
  `.trim();

  return (
    <div className={cardClasses}>
      <div className={styles.avatarContainer}>
        <img
          src={avatarUrl}
          alt={user.username}
          className={styles.avatar}
          loading="lazy"
        />
      </div>
      <div className={styles.content}>
        <div>
          <h3 className={styles.username}>{user.username}</h3>
          <div className={styles.infoItem}>
            <span className={styles.infocity}>{user.address.city}</span>
          </div>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infostyles}>{user.company.name}</span>
        </div>
      </div>

      <div className={styles.menuContainer} ref={menuRef}>
        {/* Для активных карточек - меню с тремя точками */}
        {isActive && (
          <div
            className={styles.infoVector}
            onClick={handleMenuClick}
            role="button"
            tabIndex={0}
            aria-label="Меню">
            <img src={vector} alt="Меню" />
          </div>
        )}

        {/* Для архивированных карточек - меню с тремя точками */}
        {isArchived && (
          <div
            className={styles.infoVector}
            onClick={handleMenuClick}
            role="button"
            tabIndex={0}
            aria-label="Меню">
            <img src={vector} alt="Меню" />
          </div>
        )}

        {/* Для скрытых карточек - кнопка показа */}
        {isHidden && (
          <button
            className={styles.showButton}
            onClick={handleShowClick}
            aria-label="Показать">
            👁️ Показать
          </button>
        )}

        {/* Меню для активных карточек */}
        {isMenuOpen && isActive && (
          <div className={styles.dropdownMenu}>
            <button className={styles.menuItem} onClick={handleEditClick}>
              <span className={styles.menuIcon}>✏️</span>
              Редактировать
            </button>
            <button className={styles.menuItem} onClick={handleArchiveClick}>
              <span className={styles.menuIcon}>📦</span>
              Архивировать
            </button>
            <button className={styles.menuItem} onClick={handleHideClick}>
              <span className={styles.menuIcon}>👁️</span>
              Скрыть
            </button>
          </div>
        )}

        {/* Меню для архивированных карточек */}
        {isMenuOpen && isArchived && (
          <div className={styles.dropdownMenu}>
            <button className={styles.menuItem} onClick={handleEditClick}>
              <span className={styles.menuIcon}>✏️</span>
              Редактировать
            </button>
            <button className={styles.menuItem} onClick={handleActivateClick}>
              <span className={styles.menuIcon}>🔄</span>
              Активировать
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
