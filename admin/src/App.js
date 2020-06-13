import React, { useContext } from "react";
import Header from "./components/header";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { ContextProvider, Context } from "./data/context";
import Home from "./pages/home";
import Dashboard from "./pages/dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./pages/login";
import Staff from "./pages/staff";
import Student from "./pages/student";
import jwtDecode from "jwt-decode";
import Listening from "./views/listening";

const App = () => {
  const DynamicRoutes = () => {
    const {
      token,
      isLogin,
      setToken,
      setIsLogin,
      setInstitution,
      setRole,
    } = useContext(Context);

    const storedData = JSON.parse(localStorage.getItem("credentials"));

    if (
      storedData &&
      storedData.token &&
      storedData.institute_id &&
      storedData.role
    ) {
      const decodeToken = jwtDecode(storedData.token);
      if (!(decodeToken.exp * 1000 < Date.now())) {
        setToken(storedData.token);
        setInstitution(storedData.institute_id);
        setRole(storedData.role);
        setIsLogin(true);
      }
    } else {
      setToken(null);
      setIsLogin(false);
      setInstitution(null);
      setRole(null);
    }

    if (isLogin && token) {
      return (
        <Switch>
          <Route path="/" exact component={Dashboard} />
          <Route path="/staff" component={Staff} />
          <Route path="/student" component={Student} />
          <Route path="/listening" component={Listening} />
          <Redirect to="/" />
        </Switch>
      );
    } else {
      return (
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" component={Login} />
          <Redirect to="/" />
        </Switch>
      );
    }
  };

  return (
    <ContextProvider>
      <BrowserRouter>
        <Header />
        <DynamicRoutes />
      </BrowserRouter>
    </ContextProvider>
  );
};

export default App;
