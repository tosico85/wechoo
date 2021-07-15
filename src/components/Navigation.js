import React from "react";
import { Link } from "react-router-dom";
import { authService } from "fbase";

const Navigation = () => {
  const onLogOut = () => {
    authService.signOut();
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
      </ul>
      <input type="button" value="Log Out" onClick={onLogOut} />
    </nav>
  );
};

export default Navigation;
