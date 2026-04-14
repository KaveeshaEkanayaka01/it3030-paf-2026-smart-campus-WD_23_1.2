import { createContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser, loginUser, registerUser } from "../api/authApi";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchMe = async () => {
    try {
      if (!localStorage.getItem("token")) {
        setUser(null);
        return;
      }

      const me = await getCurrentUser();
      setUser(me);
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setAuthLoading(true);
      await fetchMe();
      setAuthLoading(false);
    };

    initAuth();
  }, []);

  const login = async (payload) => {
    const data = await loginUser(payload);
    localStorage.setItem("token", data.token);
    await fetchMe();
    return data;
  };

  const register = async (payload) => {
    const data = await registerUser(payload);
    localStorage.setItem("token", data.token);
    await fetchMe();
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const handleOAuthSuccess = async (tokenFromUrl) => {
    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      await fetchMe();
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      authLoading,
      login,
      register,
      logout,
      fetchMe,
      handleOAuthSuccess,
      isAuthenticated: !!user,
    }),
    [user, token, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};