import { apiClient } from './config'
import { TokenManager } from '../token-manager'
import { authConfig } from '../auth-config'
import type { RegisterRequest, AuthResponse, AuthCallbackRequest, LoginUrls } from '@/types'

export const authApi = {
    /**
     * Login with email and password
     */
    login: async (username: string, password: string): Promise<AuthResponse> => {
        try {
            const response = await apiClient.post<AuthResponse>(authConfig.endpoints.login, {
                username, // email === username
                password,
            })
            return response.data
        } catch (error: any) {
            const message = error.response?.data?.message || 'Login failed'
            throw new Error(message)
        }
    },

    /**
     * Register a new user
     */
    register: async (registerData: RegisterRequest): Promise<AuthResponse> => {
        try {
            const response = await apiClient.post<AuthResponse>(authConfig.endpoints.register, registerData)
            return response.data
        } catch (error: any) {
            const message = error.response?.data?.message || 'Registration failed'
            throw new Error(message)
        }
    },

    /**
     * Get authentication URLs from backend
     */
    getLoginUrls: async (userRole: string): Promise<LoginUrls> => {
        try {
            const response = await apiClient.get<LoginUrls>(authConfig.endpoints.loginUrls, {
                params: { userRole }
            })
            return response.data
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to get login URLs'
            throw new Error(message)
        }
    },

    /**
     * Handle OAuth callback with authorization code
     */
    handleOAuthCallback: async (code: string, state?: string | null): Promise<AuthResponse> => {
        try {
            const requestData: AuthCallbackRequest = {
                code,
                userRole: 'ADMIN',
                state: state || undefined
            }
            const response = await apiClient.post<AuthResponse>(authConfig.endpoints.oauthCallback, requestData)
            return response.data
        } catch (error: any) {
            const message = error.response?.data?.message || 'OAuth authentication failed'
            throw new Error(message)
        }
    },

    /**
     * Initiate Google OAuth login
     */
    loginWithGoogle: async (): Promise<void> => {
        try {
            const urls = await authApi.getLoginUrls('ADMIN')
            // Redirect to Google OAuth URL
            window.location.href = urls.googleLogin
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to initiate Google login'
            throw new Error(message)
        }
    },

    /**
     * Refresh access token using HttpOnly cookie
     */
    refreshTokenWithCookie: async (): Promise<AuthResponse> => {
        try {
            const response = await apiClient.post<AuthResponse>(authConfig.endpoints.refreshToken)
            return response.data
        } catch (error: any) {
            const message = error.response?.data?.message || 'Token refresh failed'
            throw new Error(message)
        }
    },

    /**
     * Refresh access token (legacy method for backward compatibility)
     */
    refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
        return TokenManager.refreshToken(refreshToken)
    },

    /**
     * Logout user
     */
    logout: async (): Promise<void> => {
        try {
            // Call logout endpoint to clear HttpOnly cookies
            await apiClient.post(authConfig.endpoints.logout)
        } catch (error: any) {
            // Log error but don't throw - we still want to clear local state
            console.error('Logout API error:', error)
        }
    },

    /**
     * Verify email
     */
    verifyEmail: async (token: string): Promise<void> => {
        try {
            await apiClient.post('/auth/verify-email', { token })
        } catch (error: any) {
            const message = error.response?.data?.message || 'Email verification failed'
            throw new Error(message)
        }
    },

    /**
     * Request password reset
     */
    requestPasswordReset: async (email: string): Promise<void> => {
        try {
            await apiClient.post('/auth/request-password-reset', { email })
        } catch (error: any) {
            const message = error.response?.data?.message || 'Password reset request failed'
            throw new Error(message)
        }
    },

    /**
     * Reset password
     */
    resetPassword: async (token: string, newPassword: string): Promise<void> => {
        try {
            await apiClient.post('/auth/reset-password', { token, newPassword })
        } catch (error: any) {
            const message = error.response?.data?.message || 'Password reset failed'
            throw new Error(message)
        }
    },
}
