import React, { useContext } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/auth";
import firebase from "../context/firebase";

const Header = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <Navbar.Brand href="/">IELTS Video</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav center">
        <Nav className="mx-auto">
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
