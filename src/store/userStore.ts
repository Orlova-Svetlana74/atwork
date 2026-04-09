// src/store/userStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/user';

interface UserState {
  // Данные пользователей
  users: User[];
  
  // Состояния для UI
  selectedUser: User | null;
  isEditModalOpen: boolean;
  
  // Управление архивацией и скрытием
  archivedUsers: number[]; // Массив ID архивированных пользователей
  hiddenUsers: number[];   // Массив ID скрытых пользователей
  
  // Actions
  setUsers: (users: User[]) => void;
  updateUser: (userId: number, updatedUser: User) => void;
  archiveUser: (userId: number) => void;
  hideUser: (userId: number) => void;
  restoreUser: (userId: number) => void;
  showUser: (userId: number) => void;
  
  // Actions для модального окна
  setSelectedUser: (user: User | null) => void; // Добавляем этот метод
  clearSelectedUser: () => void;
  setEditModalOpen: (isOpen: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      // Начальные значения
      users: [],
      selectedUser: null,
      isEditModalOpen: false,
      archivedUsers: [],
      hiddenUsers: [],

      setUsers: (users) => set({ users }),

      updateUser: (userId, updatedUser) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === userId ? updatedUser : user
          ),
          // Если обновляемый пользователь выбран, обновляем и selectedUser
          selectedUser: state.selectedUser?.id === userId 
            ? updatedUser 
            : state.selectedUser,
        })),

      archiveUser: (userId) =>
        set((state) => ({
          archivedUsers: [...state.archivedUsers, userId],
          // Удаляем из скрытых, если был там
          hiddenUsers: state.hiddenUsers.filter((id) => id !== userId),
        })),

      hideUser: (userId) =>
        set((state) => ({
          hiddenUsers: [...state.hiddenUsers, userId],
          // Удаляем из архива, если был там
          archivedUsers: state.archivedUsers.filter((id) => id !== userId),
        })),

      restoreUser: (userId) =>
        set((state) => ({
          archivedUsers: state.archivedUsers.filter((id) => id !== userId),
          // Также убираем из скрытых, если был там
          hiddenUsers: state.hiddenUsers.filter((id) => id !== userId),
        })),

      showUser: (userId) =>
        set((state) => ({
          hiddenUsers: state.hiddenUsers.filter((id) => id !== userId),
          // Также убираем из архива, если был там
          archivedUsers: state.archivedUsers.filter((id) => id !== userId),
        })),

      // Добавляем реализацию методов для модального окна
      setSelectedUser: (user) => set({ selectedUser: user }),
      
      clearSelectedUser: () => set({ selectedUser: null }),
      
      setEditModalOpen: (isOpen) => set({ isEditModalOpen: isOpen }),
    }),
    {
      name: 'user-storage', // key для localStorage
      partialize: (state) => ({
        archivedUsers: state.archivedUsers,
        hiddenUsers: state.hiddenUsers,
        users: state.users, // Сохраняем пользователей в localStorage
      }),
    }
  )
);