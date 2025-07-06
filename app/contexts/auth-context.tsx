"use client"

export const dynamic = "force-dynamic";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  userId: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (userId: string, password: string) => Promise<{ success: boolean, error?: string }>
  signup: (userId: string, password: string, name: string) => Promise<{ success: boolean, error?: string }>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // 페이지 로드 시 로그인 상태 확인
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const signup = async (userId: string, password: string, name: string): Promise<{ success: boolean, error?: string }> => {
    try {
      const response = await fetch("/api/auth/login/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password, name }),
      })

      if (response.ok) {
        return { success: true }
      } else {
        const data = await response.json()
        return { success: false, error: data.error || "회원가입 실패" }
      }
    } catch (error) {
      console.error("Signup failed:", error)
      return { success: false, error: "네트워크 오류 또는 서버 오류" }
    }
  }

  const login = async (userId: string, password: string): Promise<{ success: boolean, error?: string }> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        return { success: true };
      } else {
        const data = await response.json();
        return { success: false, error: data.error || "로그인 실패" };
      }
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, error: "네트워크 오류 또는 서버 오류" };
    }
  }

  const logout = () => {
    setUser(null)
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
