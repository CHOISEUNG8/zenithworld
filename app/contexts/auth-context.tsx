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
  signup: (userId: string, password: string, name: string, phone?: string, birth_date?: string, gender?: string) => Promise<{ success: boolean, error?: string }>
  logout: () => void
  loading: boolean
  refreshToken: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // 토큰 갱신 함수
  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('refresh-token='))
        ?.split('=')[1];

      if (!refreshToken) {
        return false;
      }

      const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        // 새로운 토큰들을 쿠키에 저장
        document.cookie = `auth-token=${data.access}; path=/; SameSite=Lax`;
        if (data.refresh) {
          document.cookie = `refresh-token=${data.refresh}; path=/; SameSite=Lax`;
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  };

  // 사용자 정보 가져오기 함수
  const fetchUserInfo = async (token: string): Promise<User | null> => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/user/me/", {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
      
      if (response.ok) {
        const userData = await response.json();
        return {
          id: userData.id,
          userId: userData.username,
          name: userData.name,
        };
      }
      return null;
    } catch (error) {
      console.error("Fetch user info failed:", error);
      return null;
    }
  };

  useEffect(() => {
    // 페이지 로드 시 로그인 상태 확인
    const checkAuth = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('auth-token='))
          ?.split('=')[1];
        
        if (!token) {
          setLoading(false);
          return;
        }

        // 먼저 현재 토큰으로 사용자 정보 가져오기 시도
        let userInfo = await fetchUserInfo(token);
        
        if (!userInfo) {
          // 토큰이 만료되었을 수 있으므로 갱신 시도
          const refreshSuccess = await refreshToken();
          if (refreshSuccess) {
            const newToken = document.cookie
              .split('; ')
              .find(row => row.startsWith('auth-token='))
              ?.split('=')[1];
            if (newToken) {
              userInfo = await fetchUserInfo(newToken);
            }
          }
        }

        if (userInfo) {
          setUser(userInfo);
        } else {
          // 인증 실패 시 쿠키 정리
          document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
          document.cookie = "refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        document.cookie = "refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // 주기적으로 토큰 갱신 (23시간마다)
    const interval = setInterval(async () => {
      const currentUser = user; // 현재 user 상태를 캡처
      if (currentUser) {
        await refreshToken();
      }
    }, 23 * 60 * 60 * 1000); // 23시간

    return () => clearInterval(interval);
  }, []); // user 의존성 제거

  const signup = async (userId: string, password: string, name: string, phone?: string, birth_date?: string, gender?: string): Promise<{ success: boolean, error?: string }> => {
    try {
      const token = document.cookie.replace(/(?:(?:^|.*;)*\s*auth-token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      const response = await fetch("/api/auth/login/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ userId, password, name, phone, birth_date, gender }),
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
        // access token과 refresh token을 쿠키에 저장
        document.cookie = `auth-token=${userData.tokens.access}; path=/; SameSite=Lax`;
        document.cookie = `refresh-token=${userData.tokens.refresh}; path=/; SameSite=Lax`;
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
    document.cookie = "refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, loading, refreshToken }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
