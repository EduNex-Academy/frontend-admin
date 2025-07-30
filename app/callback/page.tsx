"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { OAuthUtils } from "@/lib/oauth-utils"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SessionTokenManager } from "@/lib/session-token-manager"

export default function CallbackPage() {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const [errorMessage, setErrorMessage] = useState('')
  const hasProcessed = useRef(false)
  const router = useRouter()
  const { login } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    // Prevent double execution using ref and session storage
    if (hasProcessed.current) return
    
    const handleCallback = async () => {
      try {
        // Extract OAuth parameters first
        const { code, state, error, error_description } = OAuthUtils.extractOAuthParams()

        if (!code) {
          throw new Error('No authorization code received')
        }

        // Create a unique session key for this specific code
        const sessionKey = `oauth_processing_${code.substring(0, 10)}`
        
        // Check if this specific code is already being processed
        if (sessionStorage.getItem(sessionKey)) {
          console.log('Code already being processed, skipping...')
          return
        }

        // Mark this code as being processed
        sessionStorage.setItem(sessionKey, 'true')
        hasProcessed.current = true

        if (error) {
          throw new Error(`OAuth error: ${error}${error_description ? ` - ${error_description}` : ''}`)
        }

        // Send the authorization code to the backend
        const response = await api.auth.handleOAuthCallback(code, state)
        
        // Login the user with the received tokens (exclude refreshToken)
        login({
          accessToken: response.accessToken,
          tokenType: response.tokenType,
          expiresIn: response.expiresIn,
          user: response.user
        })

        // Store access token in session storage
        SessionTokenManager.setAccessToken(
          response.accessToken,
          response.tokenType,
          response.expiresIn
        )
        
        setStatus('success')
        toast({
          title: "Success",
          description: "Logged in successfully with Google",
        })
        
        // Clean up session storage
        sessionStorage.removeItem(sessionKey)
        
        // Redirect to dashboard immediately
        router.replace("/dashboard")
        
      } catch (error) {
        console.error('OAuth callback error:', error)
        setStatus('error')
        
        let errorMsg = 'Authentication failed'
        if (error instanceof Error) {
          if (error.message.includes('Code not valid') || error.message.includes('invalid_grant')) {
            errorMsg = 'Authorization code has expired. Please try logging in again.'
          } else {
            errorMsg = error.message
          }
        }
        
        setErrorMessage(errorMsg)
        
        toast({
          title: "Authentication Error",
          description: errorMsg,
          variant: "destructive",
        })
        
        // Redirect to login after error
        setTimeout(() => {
          router.replace("/login")
        }, 3000)
      }
    }

    handleCallback()
  }, [login, router, toast])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="mx-auto max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {status === 'processing' && 'Processing Authentication...'}
            {status === 'success' && 'Authentication Successful!'}
            {status === 'error' && 'Authentication Failed'}
          </CardTitle>
          <CardDescription className="text-center">
            {status === 'processing' && 'Please wait while we complete your Google sign-in...'}
            {status === 'success' && 'Redirecting you to the dashboard...'}
            {status === 'error' && 'Redirecting you back to login...'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {status === 'processing' && (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm text-gray-600">Authenticating with Google...</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-gray-600">Authentication completed successfully!</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-sm text-red-600 text-center">{errorMessage}</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
