import { createContext } from 'react'
import type { RegisterRequest, RegistrationResult, User } from '../api/types'

export interface AuthValue {
  user: User | null
  /** True until the stored token has been checked against the API on first load. */
  initialising: boolean
  signIn: (email: string, password: string) => Promise<User>
  register: (payload: RegisterRequest) => Promise<RegistrationResult>
  confirmEmail: (token: string) => Promise<User>
  signOut: () => void
}

export const AuthContext = createContext<AuthValue | null>(null)
