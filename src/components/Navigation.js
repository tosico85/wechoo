import React from "react";
import { Link } from "react-router-dom";
import { authService } from "fbase";

const Navigation = () => {
  const onLogOut = () => {
    authService.signOut();
  };

  return (
    <nav className="header">
      <ul className="header__menu">
        <li className="header__menu-item">
          <Link to="/">Home</Link>
        </li>
        <li className="header__menu-item">
          <Link to="/profile">Profile</Link>
        </li>
      </ul>
      <span className="header__logout" onClick={onLogOut}>
        Log Out
      </span>
    </nav>
  );
};

export default Navigation;
