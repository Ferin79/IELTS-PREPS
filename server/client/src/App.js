import React from "react";
import { HashRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/auth";
import Routes from "./components/routes";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  return (    
      <AuthProvider>
        <Router>          
          <Routes />
        </Router>
      </AuthProvider>    
  );
};

export default App;
