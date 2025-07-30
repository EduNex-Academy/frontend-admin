"use client"

import { useEffect, ReactNode } from "react"
import { useAuth } from "@/hooks/use-auth"
import { authApi } from "@/lib/api/auth"
import { setAuthStateGetter } from "@/lib/api/config"
import { SessionTokenManager } from "@/lib/session-token-manager"

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const authState = useAuth()
  const { setInitialized, updateTokens, logout, login } = authState

  // Set up auth state getter for API client
  useEffect(() => {
    setAuthStateGetter(() => authState)
  }, [authState])

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // First, check if we have a valid access token in sessionStorage
        const sessionToken = SessionTokenManager.getAccessToken()
        if (sessionToken) {
          // We have a valid access token, but we still need user info
          // Try to refresh to get the latest user info and token
          try {
            const authResponse = await authApi.refreshTokenWithCookie()
            updateTokens({
              accessToken: authResponse.accessToken,
              tokenType: authResponse.tokenType,
              expiresIn: authResponse.expiresIn,
              user: authResponse.user
            })
            // Update session storage with new token
            SessionTokenManager.setAccessToken(
              authResponse.accessToken,
              authResponse.tokenType,
              authResponse.expiresIn
            )
            return
          } catch (refreshError) {
            // Refresh failed, clear session storage and try with existing token
            SessionTokenManager.clearAccessToken()
            console.log("Refresh failed, trying with session token")
          }
        }

        // If no session token or refresh failed, try to refresh with HttpOnly cookie
        const authResponse = await authApi.refreshTokenWithCookie()
        
        // If successful, update auth state with new tokens
        updateTokens({
          accessToken: authResponse.accessToken,
          tokenType: authResponse.tokenType,
          expiresIn: authResponse.expiresIn,
          user: authResponse.user
        })

        // Store access token in session storage for page refreshes
        SessionTokenManager.setAccessToken(
          authResponse.accessToken,
          authResponse.tokenType,
          authResponse.expiresIn
        )
      } catch (error) {
        // If refresh fails, user is not authenticated
        console.log("No valid refresh token found or refresh failed")
        SessionTokenManager.clearAccessToken()
        logout()
      } finally {
        // Mark auth as initialized regardless of success/failure
        setInitialized(true)
      }
    }

    initializeAuth()
  }, [setInitialized, updateTokens, logout, login])

  // Listen for auth state changes to update session storage
  useEffect(() => {
    if (authState.isAuthenticated && authState.accessToken && authState.tokenType && authState.expiresIn) {
      SessionTokenManager.setAccessToken(
        authState.accessToken,
        authState.tokenType,
        authState.expiresIn
      )
    } else {
      SessionTokenManager.clearAccessToken()
    }
  }, [authState.isAuthenticated, authState.accessToken, authState.tokenType, authState.expiresIn])

  return <>{children}</>
}
