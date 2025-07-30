import { apiClient } from './config'
import type { Progress, Certificate } from '@/types'

export interface ProgressResponse {
  progress: Progress[]
  total: number
  page: number
  limit: number
}

export interface CertificatesResponse {
  certificates: Certificate[]
  total: number
  page: number
  limit: number
}

export interface CreateProgressRequest {
  userId: string
  courseId: string
  completedLessons: number
  totalLessons: number
  timeSpent: number
}

export interface UpdateProgressRequest {
  completedLessons?: number
  timeSpent?: number
}

export const progressApi = {
  /**
   * Get all progress records with pagination
   */
  getProgress: async (
    page = 1, 
    limit = 10, 
    filters?: {
      userId?: string
      courseId?: string
    }
  ): Promise<ProgressResponse> => {
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

      const response = await apiClient.get<ProgressResponse>(`/progress?${params}`)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch progress'
      throw new Error(message)
    }
  },

  /**
   * Get user's progress for a specific course
   */
  getUserCourseProgress: async (userId: string, courseId: string): Promise<Progress> => {
    try {
      const response = await apiClient.get<Progress>(`/users/${userId}/courses/${courseId}/progress`)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch user progress'
      throw new Error(message)
    }
  },

  /**
   * Update user's progress
   */
  updateProgress: async (userId: string, courseId: string, progressData: UpdateProgressRequest): Promise<Progress> => {
    try {
      const response = await apiClient.patch<Progress>(`/users/${userId}/courses/${courseId}/progress`, progressData)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update progress'
      throw new Error(message)
    }
  },

  /**
   * Mark lesson as completed
   */
  markLessonCompleted: async (userId: string, courseId: string, lessonId: string): Promise<Progress> => {
    try {
      const response = await apiClient.post<Progress>(`/users/${userId}/courses/${courseId}/lessons/${lessonId}/complete`)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to mark lesson as completed'
      throw new Error(message)
    }
  },

  /**
   * Get progress statistics
   */
  getProgressStats: async (): Promise<{
    totalEnrollments: number
    completedCourses: number
    averageCompletionRate: number
    averageTimeSpent: number
  }> => {
    try {
      const response = await apiClient.get('/progress/stats')
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch progress statistics'
      throw new Error(message)
    }
  },
}

export const certificatesApi = {
  /**
   * Get all certificates with pagination
   */
  getCertificates: async (
    page = 1, 
    limit = 10, 
    filters?: {
      userId?: string
      courseId?: string
      status?: string
    }
  ): Promise<CertificatesResponse> => {
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

      const response = await apiClient.get<CertificatesResponse>(`/certificates?${params}`)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch certificates'
      throw new Error(message)
    }
  },

  /**
   * Get certificate by ID
   */
  getCertificateById: async (id: string): Promise<Certificate> => {
    try {
      const response = await apiClient.get<Certificate>(`/certificates/${id}`)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch certificate'
      throw new Error(message)
    }
  },

  /**
   * Issue certificate
   */
  issueCertificate: async (userId: string, courseId: string): Promise<Certificate> => {
    try {
      const response = await apiClient.post<Certificate>('/certificates/issue', {
        userId,
        courseId,
      })
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to issue certificate'
      throw new Error(message)
    }
  },

  /**
   * Revoke certificate
   */
  revokeCertificate: async (id: string): Promise<Certificate> => {
    try {
      const response = await apiClient.patch<Certificate>(`/certificates/${id}/revoke`)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to revoke certificate'
      throw new Error(message)
    }
  },

  /**
   * Download certificate
   */
  downloadCertificate: async (id: string): Promise<Blob> => {
    try {
      const response = await apiClient.get(`/certificates/${id}/download`, {
        responseType: 'blob',
      })
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to download certificate'
      throw new Error(message)
    }
  },

  /**
   * Get certificate statistics
   */
  getCertificateStats: async (): Promise<{
    totalIssued: number
    issuedThisMonth: number
    revokedCertificates: number
    byCourse: Record<string, number>
  }> => {
    try {
      const response = await apiClient.get('/certificates/stats')
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch certificate statistics'
      throw new Error(message)
    }
  },
}
