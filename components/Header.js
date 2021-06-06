// components/Header.js
import Auth from '../support/auth'
import { Component } from 'react';

const headerStyle = {
  backgroundColor: "blue",
  color: "white",
  width: "100%",
  height: "50px",
  lineHeight: "50px",
  textAlign: "center",
  fontSize: "28px"
};

const usernameStyle = {
  width: "100%",
  height: "24px",
  textAlign: "center",
  fontSize: "20px",
  lineHeight: "24px",
};

const Header = () => (
  <div>
    <div className="Header" style={headerStyle}>
      Pictionary
    </div>
    <div className="Username" style={usernameStyle}>
      Playing as {Auth.getUsername()}
    </div>
  </div>
);

export default Header;