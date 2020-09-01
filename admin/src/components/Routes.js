import React, { useContext } from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import { AuthContext } from "../data/Auth";
import Dashboard from "../pages/dashboard";
import Staff from "../pages/staff";
import Student from "../pages/student";
import Listening from "../views/listening";
import Reading from "../views/reading";
import Writing from "../views/writing";
import Login from "../pages/login";
import Home from "../pages/home";
import Profile from "../pages/profile";
import CheckWriting from "../views/checkWriting";
import StudentStats from "../views/studentStats";
import ModuleStats from "../views/moduleStats";

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
        <Route path="/profile" component={Profile} />
        <Route path="/check-writing" component={CheckWriting} />
        <Route path="/students/:email" component={StudentStats} />
        <Route path="/stats/:module/:id" component={ModuleStats} />
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
