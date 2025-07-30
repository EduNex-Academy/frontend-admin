"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./use-auth"

/**
 * Hook to protect routes that require authentication
 * Returns loading state while checking auth
 */
export function useAuthGuard(redirectTo: string = "/login") {
  const { isAuthenticated, isInitialized } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isInitialized, router, redirectTo])

  return {
    isLoading: !isInitialized,
    isAuthenticated: isAuthenticated && isInitialized,
  }
}
