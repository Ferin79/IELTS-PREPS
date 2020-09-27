import React, { useContext } from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import { AuthContext } from "./data/auth";
import { Context } from "./data/context";
import firebase from "./data/firebase";
import Login from "./pages/login";
import Home from "./pages/home";
import Dashboard from "./pages/dashboard";
import Staff from "./pages/staff";
import Student from "./pages/student";

const Routes = () => {
  const { currentUser } = useContext(AuthContext);
  const { role } = useContext(Context);
  console.log(role);
  if (currentUser) {
    if (role === "admin") {
      return (
        <Switch>
          <Route path="/" exact component={Dashboard} />
          <Route path="/staff" exact component={Staff} />
          <Route path="/student" exact component={Student} />
          <Route
            path="/logout"
            exact
            render={() => {
              firebase.auth().signOut();
            }}
          />
          <Redirect to="/" />
        </Switch>
      );
    } else if (role === "staff") {
      return (
        <Switch>
          <Route path="/" exact component={Dashboard} />
          <Route path="/student" exact component={Student} />
          <Route
            path="/logout"
            exact
            render={() => {
              firebase.auth().signOut();
            }}
          />
          <Redirect to="/" />
        </Switch>
      );
    } else if (role === "student") {
      return (
        <Switch>
          <Route
            path="/logout"
            exact
            render={() => {
              firebase.auth().signOut();
            }}
          />
          <Redirect to="/" />
        </Switch>
      );
    }
  } else {
    return (
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login" exact component={Login} />
        <Redirect to="/" />
      </Switch>
    );
  }
};

export default Routes;
