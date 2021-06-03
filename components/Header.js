// components/Header.js

const headerStyle = {
  backgroundColor: "blue",
  color: "white",
  width: "100%",
  height: "50px",
  lineHeight: "50px",
  textAlign: "center",
  fontSize: "28px"
};

const Header = () => (
  <div className="Header" style={headerStyle}>
    Pictionary
  </div>
);

export default Header;