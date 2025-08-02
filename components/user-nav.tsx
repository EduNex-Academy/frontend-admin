"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"
import { authApi } from "@/lib/api/auth"
import { SessionTokenManager } from "@/lib/session-token-manager"
import { LogOut, Settings, User, KeyRound } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export function UserNav() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [imageError, setImageError] = useState(false)

  // Reset image state when user changes
  useEffect(() => {
    setImageError(false)
  }, [user?.profilePictureUrl])

  // Function to get properly formatted Google profile image URL
  const getProfileImageUrl = (url: string | undefined) => {
    if (!url) return null
    
    // If it's a Google profile image, ensure it has proper size parameter
    if (url.includes('googleusercontent.com')) {
      const baseUrl = url.split('=')[0]
      return `${baseUrl}=s96-c`
    }
    
    return url
  }

  const profileImageUrl = getProfileImageUrl(user?.profilePictureUrl)

  const handleLogout = async () => {
    try {
      // Call the logout API first
      await authApi.logout()
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      // Clear session storage
      SessionTokenManager.clearAccessToken()
      
      // If the API call fails, we can still clear the local state
      // and redirect the user to the login page
      logout()
      router.push("/login")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-full justify-start">
          <Avatar className="h-8 w-8 mr-2">
            {profileImageUrl && !imageError ? (
              <img 
                src={profileImageUrl} 
                alt="Avatar"
                className="aspect-square h-full w-full rounded-full object-cover"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                onError={() => setImageError(true)}
              />
            ) : null}
            <AvatarFallback>
              {user?.firstName?.[0] || user?.email?.[0] || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1 text-left">
            <p className="text-sm font-medium leading-none">{user?.firstName || "Admin"}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email || "admin@example.com"}</p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.username || "Admin"}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email || "admin@example.com"}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/change-password')}>
            <KeyRound className="mr-2 h-4 w-4" />
            <span>Change Password</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
