import styles from "./HomePage.module.scss";
import React, { useState } from "react";
import {
  useUpdateUser,
  useArchiveUsers,
  useFilteredUsers,
} from "@/hooks/useUsers";

import { useUserStore } from "@/store/userStore";
import UserCard from "@/components/UserCard/UserCard";
import UserModal from "@/components/UserModal/UserModal";
import Toast from "@/components/Toast/Toast";
import type { User } from "@/types/user";
import { useQueryClient } from "@tanstack/react-query";

export const HomePage: React.FC = () => {
  const queryClient = useQueryClient();
  const {
    activeUsers,
    archivedUsers,
    hiddenUsers,
    isLoading,
    error,
    totalActive,
    totalArchived,
    totalHidden,
  } = useFilteredUsers(6);

  const { updateUser: updateUserMutation } = useUpdateUser();
  const { archiveUser, restoreUser, hideUser, showUser } = useArchiveUsers();

  const { selectedUser, isEditModalOpen, clearSelectedUser, setEditModalOpen } =
    useUserStore();

  // Объединяем все тосты в одно состояние
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "info" | "error";
  }>({
    show: false,
    message: "",
    type: "info",
  });

  // Функция для показа тоста
  const showToastMessage = (
    message: string,
    type: "success" | "info" | "error" = "info",
  ) => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "info" }),
      4000,
    );
  };
  // Функция для принудительного обновления данных
  const refetchData = async () => {
    await queryClient.invalidateQueries({ queryKey: ["users", 6] });
    await queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  const handleCloseModal = () => {
    clearSelectedUser();
    setEditModalOpen(false);
  };

  const handleSaveUser = (userId: number, updatedUser: User) => {
    updateUserMutation(updatedUser);
    handleCloseModal();
  };

  const handleArchive = async (user: User) => {
    try {
      await archiveUser(user.id);
      // Принудительно обновляем данные после архивации
      await refetchData();
      showToastMessage("Пользователь перемещен в архив", "success");
    } catch (error) {
      showToastMessage("Ошибка при архивации пользователя", "error");
    }
  };

  const handleHide = async (user: User) => {
    try {
      await hideUser(user.id);
      await refetchData(); // Добавляем refetch для обновления
      showToastMessage("Пользователь скрыт", "info");
    } catch (error) {
      console.error("Hide error:", error);
      showToastMessage("Ошибка при скрытии пользователя", "error");
    }
  };

  /**
   * Функция для активации (восстановления из архива) пользователя
   * @param {User} user - объект пользователя, который будет активирован
   * @returns {Promise<void>} - promise, который будет выполнен после активации
   */
  const handleActivate = async (user: User) => {
    try {
      // Активировать = восстановить из архива
      // Восстановляем пользователя из архива в активные
      await restoreUser(user.id, user);
      // Принудительно обновляем данные после активации
      await refetchData();
      // Показываем сообщение об успешной активации
      showToastMessage(
        "Пользователь активирован и перемещен в активные",
        "success",
      );
    } catch (error) {
      // Показываем сообщение об ошибке при активации
      showToastMessage("Ошибка при активации пользователя", "error");
    }
  };

  const handleRestore = async (user: User) => {
    try {
      await restoreUser(user.id, user);
      await refetchData();
      showToastMessage("Пользователь восстановлен из архива", "success");
    } catch (error) {
      showToastMessage("Ошибка при восстановлении пользователя", "error");
    }
  };

  const handleShow = async (user: User) => {
    try {
      await showUser(user.id, user);
      await refetchData();
      showToastMessage("Пользователь отображен", "success");
    } catch (error) {
      showToastMessage("Ошибка при отображении пользователя", "error");
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <h2>Error loading users</h2>
        <p>{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.homePage}>
      <div className={styles.container}>
        <div className={styles.blockframe}>
          <header className={styles.header}>
            <h1 className={styles.title}>Активные ({totalActive})</h1>
          </header>
        </div>

        <div className={styles.usersGrid}>
          {activeUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onArchive={handleArchive}
              onHide={handleHide}
              isActive={true}
            />
          ))}
          {activeUsers.length === 0 && (
            <div className={styles.emptyState}>
              <p>Нет активных пользователей</p>
            </div>
          )}
        </div>
        {/* Архивированные пользователи - всегда видны */}
        <div className={styles.blockframe}>
          <header className={styles.header}>
            <h1 className={styles.title}>Архив ({totalArchived})</h1>
          </header>
        </div>

        <div className={styles.usersGrid}>
          {archivedUsers.length > 0 ? (
            archivedUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onActivate={handleActivate}
                isArchived={true}
              />
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>Архив пуст</p>
            </div>
          )}
        </div>

        {totalHidden > 0 && (
          <>
            <header className={styles.header}>
              <h1 className={styles.title}>Скрытые ({totalHidden})</h1>
            </header>
            <div className={styles.usersGrid}>
              {hiddenUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onShow={handleShow}
                  isHidden={true}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {selectedUser && isEditModalOpen && (
        <UserModal
          user={selectedUser}
          onClose={handleCloseModal}
          onSave={handleSaveUser}
        />
      )}

      {/* Единый тост вместо трех */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={4000}
          onClose={() => setToast({ show: false, message: "", type: "info" })}
        />
      )}
    </div>
  );
};
