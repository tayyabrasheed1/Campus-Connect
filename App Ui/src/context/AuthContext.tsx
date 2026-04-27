import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  batch?: string;
  dept?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithDemo: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

const DEMO_USER: AuthUser = {
  id: "demo-001",
  firstName: "Demo",
  lastName: "Student",
  email: "demo.student@szabist-isb.edu.pk",
  role: "student",
  batch: "CS 2022",
  dept: "Computer Science",
};

// Temporary fallback mode until full student authentication is finalized.
const ENABLE_DUMMY_AUTH = true;
const DEMO_TOKEN = "demo-token-local";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem("cc_user");
      if (stored) return JSON.parse(stored);
      return ENABLE_DUMMY_AUTH ? DEMO_USER : null;
    } catch {
      return ENABLE_DUMMY_AUTH ? DEMO_USER : null;
    }
  });
  const [token, setToken] = useState<string | null>(() => {
    const stored = localStorage.getItem("cc_token");
    return stored || (ENABLE_DUMMY_AUTH ? DEMO_TOKEN : null);
  });

  const saveSession = (u: AuthUser, t: string) => {
    localStorage.setItem("cc_user", JSON.stringify(u));
    localStorage.setItem("cc_token", t);
    setUser(u);
    setToken(t);
  };

  useEffect(() => {
    if (ENABLE_DUMMY_AUTH && (!localStorage.getItem("cc_user") || !localStorage.getItem("cc_token"))) {
      saveSession(DEMO_USER, DEMO_TOKEN);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      saveSession(data.user, data.token);
      return;
    } catch {
      if (ENABLE_DUMMY_AUTH) {
        saveSession(DEMO_USER, DEMO_TOKEN);
        return;
      }
      throw new Error("Login failed");
    }
  }, []);

  const loginWithDemo = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "demo.student@szabist-isb.edu.pk",
          password: "DemoPass123!",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        saveSession(data.user, data.token);
        return;
      }
    } catch {
      // fall through to local demo
    }
    // Local demo fallback
    saveSession(DEMO_USER, DEMO_TOKEN);
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Registration failed");
      saveSession(json.user, json.token);
      return;
    } catch {
      if (ENABLE_DUMMY_AUTH) {
        saveSession(
          {
            ...DEMO_USER,
            firstName: data.firstName || DEMO_USER.firstName,
            lastName: data.lastName || DEMO_USER.lastName,
            email: data.email || DEMO_USER.email,
            role: data.role || DEMO_USER.role,
          },
          DEMO_TOKEN
        );
        return;
      }
      throw new Error("Registration failed");
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("cc_user");
    localStorage.removeItem("cc_token");
    setUser(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        loginWithDemo,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
