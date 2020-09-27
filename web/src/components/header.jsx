import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import { IconContext } from "react-icons";
import sidebarDataFunction from "./sidebarData";

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
          <Link to="#" className="menu-bars">
            <FiMenu onClick={() => setSidebar(true)} />
          </Link>
          <Link to="/" className="menu-bars">
            <h5>IELTS PREPS</h5>
          </Link>
        </div>

        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items">
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <AiOutlineClose onClick={() => setSidebar(false)} />
              </Link>
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
