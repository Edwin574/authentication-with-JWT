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
      body: JSON.stringify({ refresh: authTokens?.refresh }),
    });
    let data = await response.json();
    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
      // console.log("respsone after refresh:", JSON.stringify(data));
    } else {
      logOutUser();
    }
    if (loading) {
      setLoading(false);
    }
  };
  let contextData = {
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    logOutUser: logOutUser,
  };
  useEffect(() => {
    if (loading) {
      updateToken();
    }
    let fourMinutes = 1000 * 60 * 4;
    let interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, fourMinutes);
    return () => clearInterval(interval);
  }, [authTokens, loading]);
  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
