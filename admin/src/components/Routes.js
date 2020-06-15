import React, { useContext } from "react";
import { AuthContext } from "../data/Auth";
import { Switch, Redirect, Route } from "react-router-dom";
import Dashboard from "../pages/dashboard";
import Staff from "../pages/staff";
import Student from "../pages/student";
import Listening from "../views/listening";
import Reading from "../views/reading";
import Writing from "../views/writing";
import Login from "../pages/login";
import Home from "../pages/home";

const Routes = () => {
  const { currentUser } = useContext(AuthContext);
  if (currentUser) {
    return (
      <Switch>
        <Route path="/" exact component={Dashboard} />
        <Route path="/staff" component={Staff} />
        <Route path="/student" component={Student} />
        <Route path="/listening" component={Listening} />
        <Route path="/reading" component={Reading} />
        <Route path="/writing" component={Writing} />
        <Redirect to="/" />
      </Switch>
    );
  } else {
    return (
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login" component={Login} />
        <Redirect to="/login" />
      </Switch>
    );
  }
};

export default Routes;
