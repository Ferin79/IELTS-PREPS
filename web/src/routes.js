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
import VideoCall from "./pages/VideoCall/VideoCall";
import Timetable from "./pages/timetable";
import LoadingScreen from "./pages/loading";

const Routes = () => {
  const { currentUser } = useContext(AuthContext);
  const { role, isLoading } = useContext(Context);

  if (isLoading) {
    return <LoadingScreen />;
  }
  if (currentUser) {
    if (role === "admin") {
      return (
        <Switch>
          <Route path="/" exact component={Dashboard} />
          <Route path="/staff" exact component={Staff} />
          <Route path="/student" exact component={Student} />
          <Route path="/speaking" exact component={VideoCall} />
          <Route path="/timetable" exact component={Timetable} />
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
          <Route path="/speaking" exact component={VideoCall} />
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
          <Route path="/student/speaking" exact component={VideoCall} />
          <Route
            path="/logout"
            exact
            render={() => {
              firebase.auth().signOut();
            }}
          />
          <Redirect to="/student/speaking" />
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
