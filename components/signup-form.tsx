"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { SessionTokenManager } from "@/lib/session-token-manager"

export function SignupForm() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])
  const { login } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Password validation rules
  const validatePassword = (password: string): string[] => {
    const errors: string[] = []
    if (password.length < 8) {
      errors.push("At least 8 characters long")
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("At least one uppercase letter")
    }
    if (!/[a-z]/.test(password)) {
      errors.push("At least one lowercase letter")
    }
    if (!/\d/.test(password)) {
      errors.push("At least one number")
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push("At least one special character")
    }
    return errors
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    const errors = validatePassword(value)
    setPasswordErrors(errors)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate password
    const passwordValidationErrors = validatePassword(password)
    if (passwordValidationErrors.length > 0) {
      toast({
        title: "Password Error",
        description: "Please ensure your password meets all requirements",
        variant: "destructive",
      })
      return
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await api.auth.register({
        username: email, // Using email as username
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        role: "ADMIN"
      })
      
      // Handle the new API response structure
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
      
      toast({
        title: "Success",
        description: "Account created successfully",
      })
      router.push("/dashboard")
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true)
    try {
      // This will redirect to Google OAuth, so no response handling needed here
      await api.auth.loginWithGoogle()
    } catch (error) {
      console.error("Google signup error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Google signup failed",
        variant: "destructive",
      })
      setIsGoogleLoading(false)
    }
    // Note: setIsGoogleLoading(false) is not called on success because the page will redirect
  }

  return (
    <Card className="mx-auto max-w-md w-full">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
        <CardDescription className="text-center">Create your admin account to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="firstName" className="text-sm">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="h-9"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="lastName" className="text-sm">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="h-9"
                required
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="email" className="text-sm">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-9"
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="phoneNumber" className="text-sm">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="h-9"
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password" className="text-sm">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className="h-9"
              required
            />
            <div className="mt-1 p-1.5 bg-gray-50/50 rounded">
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
                <li className={`text-xs flex items-center ${password.length >= 8 ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="mr-1 text-xs">{password.length >= 8 ? '✓' : '✗'}</span>
                  At least 8 characters
                </li>
                <li className={`text-xs flex items-center ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="mr-1 text-xs">{/[A-Z]/.test(password) ? '✓' : '✗'}</span>
                  At least one uppercase letter
                </li>
                <li className={`text-xs flex items-center ${/[a-z]/.test(password) ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="mr-1 text-xs">{/[a-z]/.test(password) ? '✓' : '✗'}</span>
                  At least one lowercase letter
                </li>
                <li className={`text-xs flex items-center ${/\d/.test(password) ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="mr-1 text-xs">{/\d/.test(password) ? '✓' : '✗'}</span>
                  At least one number
                </li>
                <li className={`text-xs flex items-center ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="mr-1 text-xs">{/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? '✓' : '✗'}</span>
                  At least one special character
                </li>
                {!/[A-Z]/.test(password) && password.length > 0 && (
                  <li className="text-xs flex items-center text-yellow-600 col-span-2">
                    <span className="mr-1 text-xs">!</span>
                    Your password does not contain an uppercase letter.
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="confirm-password" className="text-sm">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-9"
              required
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-red-600 flex items-center">
                <span className="mr-1">✗</span>
                Passwords do not match
              </p>
            )}
            {confirmPassword && password === confirmPassword && confirmPassword.length > 0 && (
              <p className="text-xs text-green-600 flex items-center">
                <span className="mr-1">✓</span>
                Passwords match
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full h-9"
            disabled={isLoading || passwordErrors.length > 0 || password !== confirmPassword || !password || !confirmPassword}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </form>

        <div className="mt-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full mt-3 h-9 bg-transparent"
            onClick={handleGoogleSignup}
            disabled={isGoogleLoading}
          >
            {isGoogleLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
            </svg>
            <span className="text-sm">Continue with Google</span>
          </Button>
        </div>

        <div className="mt-3 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
