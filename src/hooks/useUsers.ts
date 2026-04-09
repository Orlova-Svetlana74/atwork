import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import { useUserStore } from "@/store/userStore";
import { useEffect } from "react";
import type { User } from "@/types/user";

export const useUsers = (limit: number = 6) => {
  const queryClient = useQueryClient();
  const { setUsers, users: storedUsers } = useUserStore();

  const query = useQuery({
    queryKey: ["users", limit],
    queryFn: () => userService.getUsers(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  // Используем useEffect для обработки успешной загрузки данных
  useEffect(() => {
    if (query.data && storedUsers.length === 0) {
      setUsers(query.data);
    }
  }, [query.data, storedUsers.length, setUsers]);

  // Используем useEffect для обработки ошибок
  useEffect(() => {
    if (query.error) {
      console.error("Failed to fetch users:", query.error);
    }
  }, [query.error]);

  return query;
};

export const useUser = (id: number) => {
  const queryClient = useQueryClient();
  const { users: storedUsers, updateUser } = useUserStore();

  // Находим пользователя в store для initialData
  const initialData = storedUsers.find(u => u.id === id);

  const query = useQuery({
    queryKey: ["user", id],
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
    initialData: initialData,
  });

  // Используем useEffect для обновления store при получении данных
  useEffect(() => {
    if (query.data && query.data.id === id) {
      updateUser(id, query.data);
    }
  }, [query.data, id, updateUser]);

  return query;
};

// Хук для мутаций (обновление пользователя)
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useUserStore();

  const updateUserMutation = (updatedUser: User) => {
    // Обновляем в store
    updateUser(updatedUser.id, updatedUser);
    
    // Обновляем кэш React Query
    queryClient.setQueryData(['users', 6], (oldData: User[] | undefined) => {
      if (!oldData) return oldData;
      return oldData.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      );
    });
    
    queryClient.setQueryData(['user', updatedUser.id], updatedUser);
    
    return updatedUser;
  };

  return {
    updateUser: updateUserMutation,
  };
};

// Хук для работы с архивом
export const useArchiveUsers = () => {
  const queryClient = useQueryClient();
  const { archivedUsers, archiveUser, restoreUser, hideUser, showUser } = useUserStore();

  const archiveUserMutation = async (userId: number) => {
    archiveUser(userId);
    
    // Обновляем кэш активных пользователей
    queryClient.setQueryData(['users', 6], (oldData: User[] | undefined) => {
      if (!oldData) return oldData;
      return oldData.filter(user => user.id !== userId);
    });
  };

  const restoreUserMutation = async (userId: number, userData?: User) => {
    restoreUser(userId);
    
    // Если переданы данные пользователя, добавляем их обратно в активные
    if (userData) {
      queryClient.setQueryData(['users', 6], (oldData: User[] | undefined) => {
        if (!oldData) return [userData];
        return [...oldData, userData];
      });
    }
  };

  const hideUserMutation = async (userId: number) => {
    hideUser(userId);
    
    // Обновляем кэш активных пользователей
    queryClient.setQueryData(['users', 6], (oldData: User[] | undefined) => {
      if (!oldData) return oldData;
      return oldData.filter(user => user.id !== userId);
    });
  };

  const showUserMutation = async (userId: number, userData?: User) => {
    showUser(userId);
    
    // Если переданы данные пользователя, добавляем их обратно в активные
    if (userData) {
      queryClient.setQueryData(['users', 6], (oldData: User[] | undefined) => {
        if (!oldData) return [userData];
        return [...oldData, userData];
      });
    }
  };

  return {
    archivedUsers,
    archiveUser: archiveUserMutation,
    restoreUser: restoreUserMutation,
    hideUser: hideUserMutation,
    showUser: showUserMutation,
  };
};

// Хук для получения всех пользователей с учетом их состояния
export const useFilteredUsers = (limit: number = 6) => {
  const { data: users, isLoading, error, refetch } = useUsers(limit);
  const { archivedUsers, hiddenUsers } = useUserStore();

  const activeUsers = users?.filter(
    user => !archivedUsers.includes(user.id) && !hiddenUsers.includes(user.id)
  ) || [];

  const archivedUsersList = users?.filter(
    user => archivedUsers.includes(user.id)
  ) || [];

  const hiddenUsersList = users?.filter(
    user => hiddenUsers.includes(user.id)
  ) || [];

  return {
    activeUsers,
    archivedUsers: archivedUsersList,
    hiddenUsers: hiddenUsersList,
    isLoading,
    error,
    totalActive: activeUsers.length,
    totalArchived: archivedUsersList.length,
    totalHidden: hiddenUsersList.length,
    refetch, // Добавляем refetch в возвращаемый объект
  };
};