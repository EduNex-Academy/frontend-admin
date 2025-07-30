import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api'

// Type for auth state
interface AuthState {
  accessToken: string | null
  tokenType: string | null
  updateTokens: (data: {
    accessToken: string
    tokenType: string
    expiresIn: number
    user: any
  }) => void
  logout: () => void
}

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
  withCredentials: true, // Include cookies in requests
})

// Store for auth state access (will be set by AuthProvider)
let getAuthState: (() => AuthState) | null = null

export const setAuthStateGetter = (getter: () => AuthState) => {
  getAuthState = getter
}

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from memory using auth state
    if (getAuthState) {
      const authState = getAuthState()
      if (authState.accessToken) {
        config.headers.Authorization = `${authState.tokenType || 'Bearer'} ${authState.accessToken}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      if (getAuthState) {
        const authState = getAuthState()
        
        try {
          // Try to refresh token using HttpOnly cookie
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
          })
          
          const newAuthData = response.data
          
          // Update auth state with new tokens
          authState.updateTokens({
            accessToken: newAuthData.accessToken,
            tokenType: newAuthData.tokenType,
            expiresIn: newAuthData.expiresIn,
            user: newAuthData.user
          })

          // Update the failed request with new token
          originalRequest.headers.Authorization = `${newAuthData.tokenType || 'Bearer'} ${newAuthData.accessToken}`
          
          // Retry the original request
          return apiClient(originalRequest)
          
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError)
          // Clear auth state and redirect to login
          authState.logout()
          window.location.href = '/login'
        }
      } else {
        // No auth state available, redirect to login
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
