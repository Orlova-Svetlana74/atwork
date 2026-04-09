import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { User } from "@/types/user";
import Toast from "@/components/Toast/Toast";
import styles from "./UserModal.module.scss";

// Схема валидации
const userProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(64, "Имя не должно превышать 64 символов")
    .regex(/^[a-zA-Zа-яА-Я\s]+$/, "Имя может содержать только буквы"),

  nickname: z
    .string()
    .min(2, "Никнейм должен содержать минимум 2 символа")
    .max(64, "Никнейм не должен превышать 64 символов")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Никнейм может содержать только буквы, цифры и нижнее подчеркивание",
    ),

  email: z.string().email("Введите корректный email адрес"),

  city: z
    .string()
    .min(2, "Название города должно содержать минимум 2 символа")
    .max(64, "Название города не должно превышать 64 символов"),

  phone: z
    .string()
    .min(10, "Введите корректный номер телефона")
    .max(20, "Номер телефона слишком длинный"),

  company: z
    .string()
    .min(2, "Название компании должно содержать минимум 2 символа")
    .max(64, "Название компании не должно превышать 64 символов"),
});

type UserProfileFormData = z.infer<typeof userProfileSchema>;

interface UserModalProps {
  user: User;
  onClose: () => void;
  onSave: (userId: number, data: User) => void;
}

const UserModal: React.FC<UserModalProps> = ({ user, onClose, onSave }) => {
  const [showToast, setShowToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: user.name,
      nickname: user.username,
      email: user.email,
      city: user.address.city,
      phone: user.phone,
      company: user.company.name,
    },
  });

  useEffect(() => {
    reset({
      name: user.name,
      nickname: user.username,
      email: user.email,
      city: user.address.city,
      phone: user.phone,
      company: user.company.name,
    });
  }, [user, reset]);

  const onSubmit = async (data: UserProfileFormData) => {
    setIsSaving(true);

    const updatedData: User = {
      ...user,
      name: data.name,
      username: data.nickname,
      email: data.email,
      phone: data.phone,
      address: {
        ...user.address,
        city: data.city,
      },
      company: {
        ...user.company,
        name: data.company,
      },
    };

    // Имитация сохранения (можно заменить на реальный API запрос)
    setTimeout(() => {
      onSave(user.id, updatedData);
      setIsSaving(false);
      setShowToast(true);

      // Закрываем модальное окно после показа тоста
      setTimeout(() => {
        onClose();
      }, 500);
    }, 500);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`;

  return (
    <>
      <div className={styles.overlay} onClick={handleOverlayClick}>
        <div className={styles.modal}>
          <div className={styles.header}>
            <div className={styles.userInfo}>
              <div>
                <h2 className={styles.title}>Редактирование профиля</h2>
                {/* <p className={styles.subtitle}>ID: {user.id}</p> */}
              </div>
              <div className={styles.imageuser}>
                <img
                  src={avatarUrl}
                  alt={user.username}
                  className={styles.avatar}
                />
              </div>
            </div>
            <button
              type="button"
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Закрыть">
              ✕
            </button>
          </div>

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.field}>
              <label className={styles.dataform} htmlFor="name">Имя</label>
              <input
                type="text"
                id="name"
                placeholder="Иван"
                className={errors.name ? styles.error : ""}
                {...register("name")}
              />
              {errors.name && (
                <span className={styles.errorMessage}>
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="nickname">Никнейм</label>
              <input
                type="text"
                id="nickname"
                placeholder="Ivan1234"
                className={errors.nickname ? styles.error : ""}
                {...register("nickname")}
              />
              {errors.nickname && (
                <span className={styles.errorMessage}>
                  {errors.nickname.message}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="email">Почта</label>
              <input
                type="email"
                id="email"
                placeholder="ivan1234@mail.ru"
                className={errors.email ? styles.error : ""}
                {...register("email")}
              />
              {errors.email && (
                <span className={styles.errorMessage}>
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="city">Город</label>
              <input
                type="text"
                id="city"
                placeholder="Санкт-Петербург"
                className={errors.city ? styles.error : ""}
                {...register("city")}
              />
              {errors.city && (
                <span className={styles.errorMessage}>
                  {errors.city.message}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="phone">Телефон</label>
              <input
                type="tel"
                id="phone"
                placeholder="8 (999) 111-23-23"
                className={errors.phone ? styles.error : ""}
                {...register("phone")}
              />
              {errors.phone && (
                <span className={styles.errorMessage}>
                  {errors.phone.message}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="company">Название компании</label>
              <input
                type="text"
                id="company"
                placeholder="AT-WORK"
                className={errors.company ? styles.error : ""}
                {...register("company")}
              />
              {errors.company && (
                <span className={styles.errorMessage}>
                  {errors.company.message}
                </span>
              )}
            </div>

            <div className={styles.buttons}>
              {/* <button
                type="button"
                className={styles.cancelButton}
                onClick={onClose}
                disabled={isSaving}>
                Отмена
              </button> */}
              <button
                type="submit"
                className={styles.saveButton}
                disabled={isSaving || !isDirty}>
                {isSaving ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showToast && (
        <Toast
          message="Данные успешно сохранены!"
          type="success"
          duration={4000}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
};

export default UserModal;
