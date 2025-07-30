// Export API configuration
export { apiClient } from './config'

// Export all API modules
export { authApi } from './auth'
export { usersApi } from './users'
export { coursesApi } from './courses'
export { notificationsApi } from './notifications'
export { subscriptionsApi } from './subscriptions'
export { progressApi, certificatesApi } from './progress'

// Import APIs to create unified object
import { authApi } from './auth'
import { usersApi } from './users'
import { coursesApi } from './courses'
import { notificationsApi } from './notifications'
import { subscriptionsApi } from './subscriptions'
import { progressApi, certificatesApi } from './progress'

// Export types for convenience
export type {
  // Users
  UsersResponse,
  CreateUserRequest,
  UpdateUserRequest,
} from './users'

export type {
  // Courses
  CoursesResponse,
  CreateCourseRequest,
  UpdateCourseRequest,
} from './courses'

export type {
  // Notifications
  NotificationsResponse,
  CreateNotificationRequest,
  NotificationTemplate,
} from './notifications'

export type {
  // Subscriptions
  SubscriptionsResponse,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
} from './subscriptions'

export type {
  // Progress & Certificates
  ProgressResponse,
  CertificatesResponse,
  CreateProgressRequest,
  UpdateProgressRequest,
} from './progress'

// Create a unified API object for backward compatibility
export const api = {
  auth: authApi,
  users: usersApi,
  courses: coursesApi,
  notifications: notificationsApi,
  subscriptions: subscriptionsApi,
  progress: progressApi,
  certificates: certificatesApi,
}
