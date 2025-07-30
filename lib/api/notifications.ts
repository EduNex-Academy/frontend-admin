import { apiClient } from './config'
import type { EmailNotification } from '@/types'

export interface NotificationsResponse {
  notifications: EmailNotification[]
  total: number
  page: number
  limit: number
}

export interface CreateNotificationRequest {
  type: 'welcome' | 'renewal' | 'completion' | 'announcement'
  recipient?: string
  recipients?: string[]
  subject: string
  content: string
  scheduledAt?: string
}

export interface NotificationTemplate {
  id: string
  name: string
  type: 'welcome' | 'renewal' | 'completion' | 'announcement'
  subject: string
  content: string
  variables: string[]
}

export const notificationsApi = {
  /**
   * Get all notifications with pagination
   */
  getNotifications: async (
    page = 1, 
    limit = 10, 
    filters?: {
      type?: string
      status?: string
      recipient?: string
    }
  ): Promise<NotificationsResponse> => {
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

      const response = await apiClient.get<NotificationsResponse>(`/notifications?${params}`)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch notifications'
      throw new Error(message)
    }
  },

  /**
   * Get notification by ID
   */
  getNotificationById: async (id: string): Promise<EmailNotification> => {
    try {
      const response = await apiClient.get<EmailNotification>(`/notifications/${id}`)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch notification'
      throw new Error(message)
    }
  },

  /**
   * Send notification
   */
  sendNotification: async (notificationData: CreateNotificationRequest): Promise<EmailNotification> => {
    try {
      const response = await apiClient.post<EmailNotification>('/notifications/send', notificationData)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send notification'
      throw new Error(message)
    }
  },

  /**
   * Send bulk notifications
   */
  sendBulkNotification: async (notificationData: CreateNotificationRequest): Promise<EmailNotification[]> => {
    try {
      const response = await apiClient.post<EmailNotification[]>('/notifications/send-bulk', notificationData)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send bulk notification'
      throw new Error(message)
    }
  },

  /**
   * Schedule notification
   */
  scheduleNotification: async (notificationData: CreateNotificationRequest): Promise<EmailNotification> => {
    try {
      const response = await apiClient.post<EmailNotification>('/notifications/schedule', notificationData)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to schedule notification'
      throw new Error(message)
    }
  },

  /**
   * Cancel scheduled notification
   */
  cancelNotification: async (id: string): Promise<void> => {
    try {
      await apiClient.patch(`/notifications/${id}/cancel`)
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to cancel notification'
      throw new Error(message)
    }
  },

  /**
   * Resend failed notification
   */
  resendNotification: async (id: string): Promise<EmailNotification> => {
    try {
      const response = await apiClient.post<EmailNotification>(`/notifications/${id}/resend`)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to resend notification'
      throw new Error(message)
    }
  },

  /**
   * Get notification templates
   */
  getTemplates: async (): Promise<NotificationTemplate[]> => {
    try {
      const response = await apiClient.get<NotificationTemplate[]>('/notifications/templates')
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch templates'
      throw new Error(message)
    }
  },

  /**
   * Create notification template
   */
  createTemplate: async (templateData: Omit<NotificationTemplate, 'id'>): Promise<NotificationTemplate> => {
    try {
      const response = await apiClient.post<NotificationTemplate>('/notifications/templates', templateData)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create template'
      throw new Error(message)
    }
  },

  /**
   * Update notification template
   */
  updateTemplate: async (id: string, templateData: Partial<NotificationTemplate>): Promise<NotificationTemplate> => {
    try {
      const response = await apiClient.patch<NotificationTemplate>(`/notifications/templates/${id}`, templateData)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update template'
      throw new Error(message)
    }
  },

  /**
   * Delete notification template
   */
  deleteTemplate: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/notifications/templates/${id}`)
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete template'
      throw new Error(message)
    }
  },

  /**
   * Get notification statistics
   */
  getNotificationStats: async (): Promise<{
    totalSent: number
    totalPending: number
    totalFailed: number
    sentToday: number
    byType: Record<string, number>
  }> => {
    try {
      const response = await apiClient.get('/notifications/stats')
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch notification statistics'
      throw new Error(message)
    }
  },
}
