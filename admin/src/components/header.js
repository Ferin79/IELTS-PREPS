import React, { useContext } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Context } from "../data/context";
import { NavLink } from "react-router-dom";

const Header = () => {
  const { isLogin, token } = useContext(Context);
  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <Navbar.Brand href="/">IELTS Admin</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav center">
        <Nav className="mx-auto">
          {isLogin && token ? (
            <>
              <Nav.Link>
                <NavLink to="/">Dashboard</NavLink>
              </Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link>
                <NavLink to="/login">Login</NavLink>
              </Nav.Link>
            </>
          )}
          <Nav.Link>
            <NavLink to="/contact">Contact Us</NavLink>
          </Nav.Link>

          <Nav.Link>
            <NavLink to="/privacy">Privacy Policy</NavLink>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
