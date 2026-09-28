import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("schoolUser") || "null"),
  );
  const [token, setToken] = useState(
    () => localStorage.getItem("schoolToken") || "",
  );

  const login = (userData, accessToken) => {
    localStorage.setItem("schoolUser", JSON.stringify(userData));
    localStorage.setItem("schoolToken", accessToken);
    setUser(userData);
    setToken(accessToken);
  };

  const logout = () => {
    localStorage.removeItem("schoolUser");
    localStorage.removeItem("schoolToken");
    setUser(null);
    setToken("");
  };

  const value = useMemo(() => ({ user, token, login, logout }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
