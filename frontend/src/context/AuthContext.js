import { createContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
  let storedTokens = localStorage.getItem("authTokens");
  let [authTokens, setAuthTokens] = useState(() =>
    storedTokens ? JSON.parse(storedTokens) : null
  );
  let [user, setUser] = useState(() =>
    storedTokens ? jwt_decode(storedTokens) : null
  );
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    console.log("form submitted successfully");
    let response = await fetch("http://127.0.0.1:8000/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: e.target.username.value,
        password: e.target.password.value,
      }),
    });
    let data = await response.json();
    console.log("data:", data);
    console.log("response:", response);
    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      console.log("decoded", jwt_decode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
      navigate("/");
    } else {
      alert("something went wrong");
    }
  };
  const logOutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/login");
  };
  const updateToken = async () => {
    console.log("update token called for refreshing");
    let response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: authTokens.refresh }),
    });
    let data = await response.json();
    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
    } else {
      logOutUser();
    }
  };
  let contextData = {
    user: user,
    loginUser: loginUser,
    logOutUser: logOutUser,
  };
  useEffect(() => {
    let interval=setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [authTokens, loading]);
  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
