import React from "react";
import { HashRouter as Router } from "react-router-dom";
import Header from "./components/header";
import Routes from "./routes";
import { ContextProvider } from "./data/context";
import { AuthProvider } from "./data/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";

function App() {
  return (
    <div className="App">
      <ContextProvider>
        <AuthProvider>
          <Router>
            <Header />
            <Routes />
          </Router>
        </AuthProvider>
      </ContextProvider>
    </div>
  );
}

export default App;
