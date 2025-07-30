import { apiClient } from './config'
import type { User } from '@/types'

export interface UsersResponse {
  users: User[]
  total: number
  page: number
  limit: number
}

export interface CreateUserRequest {
  username: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  role: string
  password: string
}

export interface UpdateUserRequest {
  username?: string
  email?: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  role?: string
  isActive?: boolean
  profilePictureUrl?: string
}

export const usersApi = {
  /**
   * Get all users with pagination
   */
  getUsers: async (page = 1, limit = 10, search?: string): Promise<UsersResponse> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      
      if (search) {
        params.append('search', search)
      }

      const response = await apiClient.get<UsersResponse>(`/users?${params}`)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch users'
      throw new Error(message)
    }
  },

  /**
   * Get user by ID
   */
  getUserById: async (id: string): Promise<User> => {
    try {
      const response = await apiClient.get<User>(`/users/${id}`)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch user'
      throw new Error(message)
    }
  },

  /**
   * Create a new user
   */
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    try {
      const response = await apiClient.post<User>('/users', userData)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create user'
      throw new Error(message)
    }
  },

  /**
   * Update user
   */
  updateUser: async (id: string, userData: UpdateUserRequest): Promise<User> => {
    try {
      const response = await apiClient.patch<User>(`/users/${id}`, userData)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update user'
      throw new Error(message)
    }
  },

  /**
   * Delete user
   */
  deleteUser: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/users/${id}`)
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete user'
      throw new Error(message)
    }
  },

  /**
   * Activate/Deactivate user
   */
  toggleUserStatus: async (id: string, isActive: boolean): Promise<User> => {
    try {
      const response = await apiClient.patch<User>(`/users/${id}/status`, { isActive })
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update user status'
      throw new Error(message)
    }
  },

  /**
   * Get user statistics
   */
  getUserStats: async (): Promise<{
    totalUsers: number
    activeUsers: number
    newUsersThisMonth: number
    usersByRole: Record<string, number>
  }> => {
    try {
      const response = await apiClient.get('/users/stats')
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch user statistics'
      throw new Error(message)
    }
  },
}
