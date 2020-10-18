import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import { IconContext } from "react-icons";
import sidebarDataFunction from "./sidebarData";
import firebase from "../data/firebase";

const Header = () => {
  const [sidebar, setSidebar] = useState(false);

  const sidebarData = sidebarDataFunction();

  return (
    <>
      <IconContext.Provider
        value={{
          color: "#FFF",
        }}
      >
        <div className="navbar">
          <FiMenu
            className="menu-bars"
            onClick={() => {
              document.querySelector(".nav-menu").classList.add("active");
              setSidebar(true);
            }}
          />
          <Link to="/" className="menu-bars">
            <h5>IELTS PREPS</h5>
          </Link>
        </div>

        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items">
            <li className="navbar-toggle">
              <AiOutlineClose
                className="menu-bars"
                onClick={() => {
                  document
                    .querySelector(".nav-menu")
                    .classList.remove("active");
                  setSidebar(false);
                }}
              />
            </li>
            <li className="user-name-info">
              <p>Welcome,</p>
              <h5>
                {firebase.auth().currentUser
                  ? firebase.auth().currentUser.email
                  : "Guest"}
              </h5>
            </li>
            {sidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
};

export default Header;
