import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const data = localStorage.getItem("auth");
    if (data) {
        return JSON.parse(data);
    }
    return { token: "" };
  });

  useEffect(() => {
    if (auth?.token) {
      axios.defaults.headers.common["Authorization"] = auth.token;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [auth.token]);

  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing auth context
const useAuth = () => useContext(AuthContext);

// eslint-disable-next-line react-refresh/only-export-components
export { useAuth, AuthProvider };