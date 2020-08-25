import React, { useContext } from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import { AuthContext } from "../context/auth";
import Login from "../views/login";
import VideoChat from "../views/videoChat";

const Routes = () => {
  const { currentUser } = useContext(AuthContext);
  if (currentUser) {
    return (
      <Switch>
        <Route path="/" exact component={VideoChat} />
        <Redirect to="/" />
      </Switch>
    );
  } else {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Redirect to="/login" />
      </Switch>
    );
  }
};

export default Routes;
