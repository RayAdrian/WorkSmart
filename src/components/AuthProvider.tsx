"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isLoggedIn: boolean;
  username: string | null;
  email: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.status === 401) {
          setIsLoggedIn(false);
          setUsername(null);
          setEmail(null);
          router.push("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.username) {
          setIsLoggedIn(true);
          setUsername(data.username);
          setEmail(data.email || null);
        }
      });
  }, [router]);

  const login = async (username: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      const data = await res.json();
      setIsLoggedIn(true);
      setUsername(data.username);
      setEmail(data.email || null);
      router.push("/dashboard");
    } else {
      const err = await res.json();
      throw new Error(err.error || "Login failed");
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setIsLoggedIn(false);
    setUsername(null);
    setEmail(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, username, email, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
