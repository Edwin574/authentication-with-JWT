import React from 'react';

const Login = () => {
  return (
    <div>
          <form>
              <input type='text' name='username' placeholder='Enter username'/>
              <input type='password' name='password' placeholder='Enter password' />
              <button type='submit'>Login</button>
          </form>
    </div>
  );
}

export default Login;
