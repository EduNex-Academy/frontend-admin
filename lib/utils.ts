import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Password validation utilities
export interface PasswordValidationRule {
  id: string
  label: string
  test: (password: string) => boolean
  errorMessage: string
}

export const passwordRules: PasswordValidationRule[] = [
  {
    id: "minLength",
    label: "At least 8 characters",
    test: (password: string) => password.length >= 8,
    errorMessage: "At least 8 characters long"
  },
  {
    id: "uppercase",
    label: "At least one uppercase letter",
    test: (password: string) => /[A-Z]/.test(password),
    errorMessage: "At least one uppercase letter"
  },
  {
    id: "lowercase",
    label: "At least one lowercase letter",
    test: (password: string) => /[a-z]/.test(password),
    errorMessage: "At least one lowercase letter"
  },
  {
    id: "number",
    label: "At least one number",
    test: (password: string) => /\d/.test(password),
    errorMessage: "At least one number"
  },
  {
    id: "specialChar",
    label: "At least one special character",
    test: (password: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    errorMessage: "At least one special character"
  }
]

export function validatePassword(password: string): string[] {
  return passwordRules
    .filter(rule => !rule.test(password))
    .map(rule => rule.errorMessage)
}

export function isPasswordValid(password: string): boolean {
  return passwordRules.every(rule => rule.test(password))
}
