import React from 'react';
import { Link } from 'react-router-dom';
const Navigation = () => {
  return (
    <div>
          <Link to='/'>Home</Link>
          <span> | </span>
      <Link to='/login'>Login</Link>
    </div>
  );
}

export default Navigation;
