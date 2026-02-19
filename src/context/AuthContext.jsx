import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Save token to localStorage whenever it changes
  const login = (newToken) => {
    setToken(newToken);
    try {
      const decoded = jwtDecode(newToken);
      setUser(decoded); // set user info from token
    } catch (e) {
      setUser(null);
      console.log("Failed to decode token:", e);
    }
  };
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  const value = {
    token,
    user,
    loading,
    login,
    logout,
    setUser,
    setLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
export default AuthProvider;
