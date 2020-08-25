import React from "react";
import { HashRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/auth";
import Routes from "./components/routes";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/header";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes />
      </Router>
    </AuthProvider>
  );
};

export default App;
