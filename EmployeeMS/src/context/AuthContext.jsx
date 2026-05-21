import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  const [loading, setLoading] = useState(true);

  // ✅ REMOVE API CALL → USE LOCAL STORAGE
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (storedUser) {
        setUser(storedUser);
      }
    } catch (err) {
      console.log("❌ LocalStorage error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 🔥 THIS IS REQUIRED
export const useAuth = () => {
  return useContext(AuthContext);
};