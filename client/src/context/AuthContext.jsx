import { createContext, useState, useEffect } from "react";
import { registerUser, loginUser, logoutUser } from "../services/authService";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // While true, App.jsx's PrivateRoute shows "Loading..." instead of
  // redirecting — prevents a flash-redirect to /login on page refresh
  // before we've finished checking localStorage.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  async function register(name, email, password) {
    const data = await registerUser(name, email, password);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }

  async function login(email, password) {
    const data = await loginUser(email, password);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }

  function logout() {
    logoutUser();
    setUser(null);
  }

  const value = { user, loading, register, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
