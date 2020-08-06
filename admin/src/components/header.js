import React, { useContext } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { AuthContext } from "../data/Auth";
import { NavLink } from "react-router-dom";
import firebase from "../data/firebase";

const Header = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <Navbar.Brand href="/">IELTS Admin</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav center">
        <Nav className="mx-auto">
          {currentUser ? (
            <>
              <Nav.Link as={NavLink} to="/" className="changeNavColor">
                Dashboard
              </Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link as={NavLink} to="/login" className="changeNavColor">
                Login
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/video/user"
                className="changeNavColor"
              >
                Speaking
              </Nav.Link>
            </>
          )}
          <Nav.Link as={NavLink} to="/contact" className="changeNavColor">
            Contact Us
          </Nav.Link>

          <Nav.Link as={NavLink} to="/privacy" className="changeNavColor">
            Privacy Policy
          </Nav.Link>

          {currentUser && (
            <Nav.Link>
              <button
                id="logoutBtn"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "white",
                }}
                onClick={() => firebase.auth().signOut()}
                href="#/"
              >
                Logout
              </button>
            </Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
