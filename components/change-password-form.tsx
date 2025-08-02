"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"
import { Loader2, ArrowLeft, CheckCircle, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { validatePassword, isPasswordValid } from "@/lib/utils"
import { PasswordRequirements } from "@/components/ui/password-requirements"

export function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value)
    const errors = validatePassword(value)
    setPasswordErrors(errors)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (!isPasswordValid(newPassword)) {
      toast({
        title: "Error",
        description: "Please ensure your new password meets all requirements",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await api.auth.changePassword(oldPassword, newPassword, confirmPassword)
      setIsSuccess(true)
      toast({
        title: "Success",
        description: "Password changed successfully",
      })
    } catch (error) {
      console.error("Change password error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to change password",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Redirect to login if not authenticated
  if (!user) {
    router.push('/login')
    return null
  }

  if (isSuccess) {
    return (
      <Card className="mx-auto max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Password Changed</CardTitle>
          <CardDescription>
            Your password has been successfully updated
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className="w-full" 
            onClick={() => router.push('/dashboard')}
          >
            Go to Dashboard
          </Button>
          <div className="text-center">
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mx-auto max-w-md w-full">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Change Password</CardTitle>
        <CardDescription className="text-center">
          Enter your current password and choose a new one
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="oldPassword" className="text-sm">Current Password</Label>
            <div className="relative">
              <Input
                id="oldPassword"
                type={showOldPassword ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="h-10 pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => handleNewPasswordChange(e.target.value)}
                className="h-10 pr-10"
                required
                minLength={8}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <PasswordRequirements password={newPassword} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-10 pr-10"
                required
                minLength={8}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-red-600 flex items-center">
                <span className="mr-1">✗</span>
                Passwords do not match
              </p>
            )}
            {confirmPassword && newPassword === confirmPassword && confirmPassword.length > 0 && (
              <p className="text-xs text-green-600 flex items-center">
                <span className="mr-1">✓</span>
                Passwords match
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full h-10" 
            disabled={isLoading || passwordErrors.length > 0 || newPassword !== confirmPassword || !newPassword || !confirmPassword}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Change Password
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to dashboard
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
