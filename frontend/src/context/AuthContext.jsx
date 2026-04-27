/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../services/api";

const DEMO_ACCOUNT = {
  fullName: "Demo Student",
  email: "demo.student@szabist-isb.edu.pk",
  password: "DemoPass123!",
  department: "Computer Science",
  batchYear: "2022",
};

const DEMO_SESSION_MODE = "demo";
const API_SESSION_MODE = "api";

const buildDemoUser = () => ({
  id: "demo-user",
  name: DEMO_ACCOUNT.fullName,
  fullName: DEMO_ACCOUNT.fullName,
  email: DEMO_ACCOUNT.email,
  role: "student",
  profileType: "student",
  department: DEMO_ACCOUNT.department,
  batchYear: DEMO_ACCOUNT.batchYear,
  verificationStatus: "verified",
  isSuspended: false,
});

const AuthContext = createContext(null);

const getStoredUser = () => {
  const raw = localStorage.getItem("cc_user");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("cc_token") || "");
  const [user, setUser] = useState(getStoredUser());
  const [isLoading] = useState(false);

  const applySession = useCallback((nextToken, nextUser, mode = API_SESSION_MODE) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem("cc_token", nextToken);
    localStorage.setItem("cc_user", JSON.stringify(nextUser));
    localStorage.setItem("cc_session_mode", mode);
  }, []);

  const applyDemoSession = useCallback(() => {
    const demoToken = `demo-${Date.now()}`;
    const demoUser = buildDemoUser();
    applySession(demoToken, demoUser, DEMO_SESSION_MODE);
    return { token: demoToken, user: demoUser, source: "local-demo" };
  }, [applySession]);

  const clearSession = useCallback(() => {
    setToken("");
    setUser(null);
    localStorage.removeItem("cc_token");
    localStorage.removeItem("cc_user");
    localStorage.removeItem("cc_session_mode");
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await authApi.login(credentials);
    applySession(data.token, data.user);
    return data;
  }, [applySession]);

  const register = useCallback(async (payload) => {
    const { data } = await authApi.register(payload);
    applySession(data.token, data.user);
    return data;
  }, [applySession]);

  const loginDemoAccount = useCallback(async () => {
    const { data } = await authApi.login({
      email: DEMO_ACCOUNT.email,
      password: DEMO_ACCOUNT.password,
    });
    applySession(data.token, data.user);
    return data;
  }, [applySession]);

  const loginWithDemoAccount = useCallback(async () => {
    try {
      return await register(DEMO_ACCOUNT);
    } catch (registerError) {
      try {
        return await loginDemoAccount();
      } catch (loginError) {
        const isNetworkOrServerFailure =
          !registerError.response ||
          !loginError.response ||
          registerError.response?.status >= 500 ||
          loginError.response?.status >= 500 ||
          registerError.response?.status === 404 ||
          loginError.response?.status === 404 ||
          registerError.response?.status === 405 ||
          loginError.response?.status === 405;

        if (isNetworkOrServerFailure) {
          return applyDemoSession();
        }

        throw registerError.response ? registerError : loginError;
      }
    }
  }, [applyDemoSession, loginDemoAccount, register]);

  const refreshProfile = useCallback(async () => {
    if (!token) return;

    const sessionMode = localStorage.getItem("cc_session_mode");
    if (sessionMode === DEMO_SESSION_MODE || token.startsWith("demo-")) {
      return;
    }

    const { data } = await authApi.getProfile();
    setUser(data.user);
    localStorage.setItem("cc_user", JSON.stringify(data.user));
  }, [token]);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  useEffect(() => {
    if (!token) return;
    const timerId = setTimeout(() => {
      refreshProfile().catch(() => clearSession());
    }, 0);

    return () => clearTimeout(timerId);
  }, [token, refreshProfile, clearSession]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isLoading,
      login,
      register,
      loginWithDemoAccount,
      refreshProfile,
      logout,
      setUser,
    }),
    [token, user, isLoading, login, register, loginWithDemoAccount, refreshProfile, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
