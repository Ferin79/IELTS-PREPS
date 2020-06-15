import React from "react";
import Header from "./components/header";
import { BrowserRouter } from "react-router-dom";
import { ContextProvider } from "./data/context";
import { AuthProvider } from "./data/Auth";
import Routes from "./components/Routes";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  return (
    <ContextProvider>
      <AuthProvider>
        <BrowserRouter>
          <Header />
          <Routes />
        </BrowserRouter>
      </AuthProvider>
    </ContextProvider>
  );
};

export default App;
