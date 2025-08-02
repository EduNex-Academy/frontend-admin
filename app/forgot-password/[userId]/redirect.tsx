"use client"

import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function PasswordResetRedirect() {
  const router = useRouter()
  const params = useParams()
  const userId = params.userId
  const { toast } = useToast()

  useEffect(() => {
    // Show success message
    toast({
      title: "Password Reset Successful",
      description: "Your password has been successfully updated. Redirecting to login...",
    })

    // Log the completion for analytics/debugging
    console.log("Password reset completed for user:", userId)

    // Redirect to login after 2 seconds
    const timer = setTimeout(() => {
      router.push("/login")
    }, 2000)

    return () => clearTimeout(timer)
  }, [userId, router, toast])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-indigo-100 to-indigo-200">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-indigo-800">Password reset successful. Redirecting to login...</p>
      </div>
    </div>
  )
}
