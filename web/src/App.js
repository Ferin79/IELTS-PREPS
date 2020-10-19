import React, { useEffect } from "react";
import { HashRouter as Router } from "react-router-dom";
import { ContextProvider } from "./data/context";
import { AuthProvider } from "./data/auth";
import Header from "./components/header";
import Routes from "./routes";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";

function App() {
  useEffect(() => {
    document
      .querySelector(".toggle-sidebar-wrapper-div")
      .addEventListener("click", () => {
        document.querySelector(".nav-menu").classList.remove("active");
      });
  }, []);
  return (
    <div className="App">
      <ContextProvider>
        <AuthProvider>
          <Router>
            <Header />
            <div className="toggle-sidebar-wrapper-div">
              <Routes />
            </div>
          </Router>
        </AuthProvider>
      </ContextProvider>
    </div>
  );
}

export default App;
