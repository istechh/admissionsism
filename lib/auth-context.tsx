"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { dataStore, type User } from './store'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => User | null
  logout: () => void
  register: (email: string, password: string, nom: string, prenom: string) => User
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = dataStore.getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)

    const unsubscribe = dataStore.subscribe(() => {
      setUser(dataStore.getCurrentUser())
    })

    return unsubscribe
  }, [])

  const login = (email: string, password: string) => {
    const loggedInUser = dataStore.login(email, password)
    setUser(loggedInUser)
    return loggedInUser
  }

  const logout = () => {
    dataStore.logout()
    setUser(null)
  }

  const register = (email: string, password: string, nom: string, prenom: string) => {
    const newUser = dataStore.registerCandidat(email, password, nom, prenom)
    setUser(newUser)
    return newUser
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
