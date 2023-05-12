import React, { useContext } from "react";
import Navigation from "../components/Navigation";
import AuthContext from "../context/AuthContext";

const Login = () => {
  let {loginUser}=useContext(AuthContext)
  return (
    <div>
      <Navigation />

      <form onSubmit={loginUser}>
        <input type="text" name="username" placeholder="Enter username" />
        <input type="password" name="password" placeholder="Enter password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
