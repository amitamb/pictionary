// components/Header.js
import AuthContext from '../store/auth-context';
import { useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';

const headerStyle = {
  backgroundColor: "blue",
  color: "white",
  width: "100%",
  height: "50px",
  lineHeight: "50px",
  fontSize: "28px"
};

const Header = () => {

  const ctx = useContext(AuthContext);
  // const [ username, setUsername ] = useState('Guest');

  // useEffect(() => {
  //   setUsername(Auth.getUsername());
  // }, []);

  return <>
    <Navbar bg="light" expand="sm">
      <Container>
        <Navbar.Brand href="/">Pictionary</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link href="/change_username">Hello <b>{ctx.user.username}</b> &nbsp;<FaEdit style={{ verticalAlign: 'baseline' }} /></Nav.Link>
          </Nav>
        </Navbar.Collapse>

      </Container>
    </Navbar>
  </>
};

export default Header;