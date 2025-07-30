import { apiClient } from './config'
import type { Course } from '@/types'

export interface CoursesResponse {
  courses: Course[]
  total: number
  page: number
  limit: number
}

export interface CreateCourseRequest {
  title: string
  description: string
  instructorId: string
  thumbnail: string
  duration: number
  lessons: number
  price: number
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
}

export interface UpdateCourseRequest {
  title?: string
  description?: string
  instructorId?: string
  thumbnail?: string
  duration?: number
  lessons?: number
  price?: number
  category?: string
  level?: 'beginner' | 'intermediate' | 'advanced'
  status?: 'draft' | 'published' | 'archived'
}

export const coursesApi = {
  /**
   * Get all courses with pagination and filters
   */
  getCourses: async (
    page = 1, 
    limit = 10, 
    filters?: {
      search?: string
      category?: string
      level?: string
      status?: string
      instructorId?: string
    }
  ): Promise<CoursesResponse> => {
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

      const response = await apiClient.get<CoursesResponse>(`/courses?${params}`)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch courses'
      throw new Error(message)
    }
  },

  /**
   * Get course by ID
   */
  getCourseById: async (id: string): Promise<Course> => {
    try {
      const response = await apiClient.get<Course>(`/courses/${id}`)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch course'
      throw new Error(message)
    }
  },

  /**
   * Create a new course
   */
  createCourse: async (courseData: CreateCourseRequest): Promise<Course> => {
    try {
      const response = await apiClient.post<Course>('/courses', courseData)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create course'
      throw new Error(message)
    }
  },

  /**
   * Update course
   */
  updateCourse: async (id: string, courseData: UpdateCourseRequest): Promise<Course> => {
    try {
      const response = await apiClient.patch<Course>(`/courses/${id}`, courseData)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update course'
      throw new Error(message)
    }
  },

  /**
   * Delete course
   */
  deleteCourse: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/courses/${id}`)
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete course'
      throw new Error(message)
    }
  },

  /**
   * Publish course
   */
  publishCourse: async (id: string): Promise<Course> => {
    try {
      const response = await apiClient.patch<Course>(`/courses/${id}/publish`)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to publish course'
      throw new Error(message)
    }
  },

  /**
   * Archive course
   */
  archiveCourse: async (id: string): Promise<Course> => {
    try {
      const response = await apiClient.patch<Course>(`/courses/${id}/archive`)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to archive course'
      throw new Error(message)
    }
  },

  /**
   * Get course statistics
   */
  getCourseStats: async (): Promise<{
    totalCourses: number
    publishedCourses: number
    draftCourses: number
    coursesByCategory: Record<string, number>
    coursesByLevel: Record<string, number>
  }> => {
    try {
      const response = await apiClient.get('/courses/stats')
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch course statistics'
      throw new Error(message)
    }
  },

  /**
   * Get course categories
   */
  getCategories: async (): Promise<string[]> => {
    try {
      const response = await apiClient.get<string[]>('/courses/categories')
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch categories'
      throw new Error(message)
    }
  },
}
