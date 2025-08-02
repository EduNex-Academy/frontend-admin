"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowLeft, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function PasswordResetSuccessPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.userId as string
  const { toast } = useToast()
  
  const [isVerifying, setIsVerifying] = useState(true)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const verifyReset = async () => {
      if (!userId) {
        setError("Invalid user ID")
        setIsVerifying(false)
        return
      }
      try {
        setIsVerified(true)
      } catch (error) {
        console.error("Password reset verification error:", error)
        setError(error instanceof Error ? error.message : "Verification failed")
      } finally {
        setIsVerifying(false)
      }
    }

    verifyReset()
  }, [userId])

  const renderContent = () => {
    if (isVerifying) {
      return (
        <Card className="mx-auto max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            </div>
            <CardTitle className="text-2xl">Verifying Reset</CardTitle>
            <CardDescription>
              Please wait while we verify your password reset...
            </CardDescription>
          </CardHeader>
        </Card>
      )
    }

    if (error) {
      return (
        <Card className="mx-auto max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Verification Failed</CardTitle>
            <CardDescription>
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full" 
              onClick={() => router.push("/login")}
            >
              Try to Login
            </Button>
            
            <div className="text-center">
              <Link href="/forgot-password" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Request new reset
              </Link>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card className="mx-auto max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Password Reset Successful</CardTitle>
          <CardDescription>
            Your password has been successfully updated. You can now log in with your new password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            For security reasons, you'll need to log in again with your new password.
          </p>
          
          <Button 
            className="w-full" 
            onClick={() => router.push("/login")}
          >
            Continue to Login
          </Button>
          
          <div className="text-center">
            <Link href="/forgot-password" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Reset another password
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-indigo-50 via-indigo-100 to-indigo-200 text-indigo-900 overflow-hidden">
      
      {/* Decorative organic blob */}
      <svg
        className="absolute -top-24 -left-24 md:-top-32 md:-left-32 w-[450px] h-[450px] text-indigo-300/40 pointer-events-none"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M41.2,-52.2C52.3,-46.2,60.9,-34,66.3,-20.3C71.7,-6.6,74,8.6,68.5,21.4C63.1,34.2,50,44.7,35.5,51.5C21,58.3,5.1,61.4,-8.4,62.6C-21.9,63.7,-33,63,-44.6,57.7C-56.2,52.4,-68.2,42.6,-71.5,30.1C-74.8,17.5,-69.5,2.4,-63.8,-10.2C-58.2,-22.7,-51.9,-32.6,-43.8,-39.1C-35.6,-45.6,-25.5,-48.8,-14.4,-55C-3.4,-61.3,8.6,-70.5,21.5,-71.4C34.4,-72.3,48.1,-64.1,41.2,-52.2Z"
          transform="translate(100 100)"
        />
      </svg>

      <div className="w-full md:w-1/2 flex flex-col items-start justify-center px-8 md:px-16 lg:px-24 pt-24 md:pt-0 space-y-6 z-10">
        <img
          src="/assets/EduNex-Logo-copy.png"
          alt="EduNex Logo"
          className="w-full max-w-sm md:max-w-xs lg:max-w-sm select-none pointer-events-none drop-shadow-xl"
        />

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-800 tracking-tight leading-snug font-serif">
          Admin Dashboard
        </h1>

        <p className="max-w-md text-base md:text-lg text-gray-700 md:leading-relaxed font-light">
          {isVerified ? "Your password has been successfully reset. You can now log in with your new password." :
           error ? "There was an issue verifying your password reset." :
           "Verifying your password reset..."}
        </p>
      </div>

      {/* Right Column – Dynamic Content */}
      <div className="w-full my-8 md:w-1/2 flex items-center justify-center px-8 md:px-16 lg:px-8 pb-16 md:pb-0 z-10">
        {renderContent()}
      </div>
    </div>
  )
}
