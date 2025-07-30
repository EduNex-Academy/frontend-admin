import { apiClient } from './config'
import type { Subscription } from '@/types'

export interface SubscriptionsResponse {
  subscriptions: Subscription[]
  total: number
  page: number
  limit: number
}

export interface CreateSubscriptionRequest {
  userId: string
  plan: 'basic' | 'premium' | 'pro'
  paymentMethod: string
  amount: number
  startDate: string
  endDate: string
}

export interface UpdateSubscriptionRequest {
  plan?: 'basic' | 'premium' | 'pro'
  status?: 'active' | 'cancelled' | 'expired'
  endDate?: string
  paymentMethod?: string
}

export const subscriptionsApi = {
  /**
   * Get all subscriptions with pagination
   */
  getSubscriptions: async (
    page = 1, 
    limit = 10, 
    filters?: {
      userId?: string
      plan?: string
      status?: string
    }
  ): Promise<SubscriptionsResponse> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value)
        })
      }

      const response = await apiClient.get<SubscriptionsResponse>(`/subscriptions?${params}`)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch subscriptions'
      throw new Error(message)
    }
  },

  /**
   * Get subscription by ID
   */
  getSubscriptionById: async (id: string): Promise<Subscription> => {
    try {
      const response = await apiClient.get<Subscription>(`/subscriptions/${id}`)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch subscription'
      throw new Error(message)
    }
  },

  /**
   * Get user's subscription
   */
  getUserSubscription: async (userId: string): Promise<Subscription | null> => {
    try {
      const response = await apiClient.get<Subscription>(`/users/${userId}/subscription`)
      return response.data
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null
      }
      const message = error.response?.data?.message || 'Failed to fetch user subscription'
      throw new Error(message)
    }
  },

  /**
   * Create subscription
   */
  createSubscription: async (subscriptionData: CreateSubscriptionRequest): Promise<Subscription> => {
    try {
      const response = await apiClient.post<Subscription>('/subscriptions', subscriptionData)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create subscription'
      throw new Error(message)
    }
  },

  /**
   * Update subscription
   */
  updateSubscription: async (id: string, subscriptionData: UpdateSubscriptionRequest): Promise<Subscription> => {
    try {
      const response = await apiClient.patch<Subscription>(`/subscriptions/${id}`, subscriptionData)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update subscription'
      throw new Error(message)
    }
  },

  /**
   * Cancel subscription
   */
  cancelSubscription: async (id: string): Promise<Subscription> => {
    try {
      const response = await apiClient.patch<Subscription>(`/subscriptions/${id}/cancel`)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to cancel subscription'
      throw new Error(message)
    }
  },

  /**
   * Renew subscription
   */
  renewSubscription: async (id: string, endDate: string): Promise<Subscription> => {
    try {
      const response = await apiClient.patch<Subscription>(`/subscriptions/${id}/renew`, { endDate })
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to renew subscription'
      throw new Error(message)
    }
  },

  /**
   * Get subscription statistics
   */
  getSubscriptionStats: async (): Promise<{
    totalSubscriptions: number
    activeSubscriptions: number
    cancelledSubscriptions: number
    expiredSubscriptions: number
    revenue: number
    byPlan: Record<string, number>
  }> => {
    try {
      const response = await apiClient.get('/subscriptions/stats')
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch subscription statistics'
      throw new Error(message)
    }
  },

  /**
   * Get subscription plans
   */
  getPlans: async (): Promise<Array<{
    id: string
    name: string
    price: number
    features: string[]
    duration: number
  }>> => {
    try {
      const response = await apiClient.get('/subscriptions/plans')
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch subscription plans'
      throw new Error(message)
    }
  },
}
