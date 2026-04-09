// src/services/userService.ts
import type { User } from "@/types/user";

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

export const userService = {
  getUsers: async (limit: number = 6): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/users?_limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return response.json();
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user with id ${id}`);
    }
    return response.json();
  },

  updateUser: async (id: number, userData: Partial<User>): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update user with id ${id}`);
    }
    
    return response.json();
  },
};