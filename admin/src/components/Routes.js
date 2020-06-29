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
import videoStart from "../video/videoStart";
import UserVideo from "../video/userVideo";
import Profile from "../pages/profile";
import SubmittedWriting from "../pages/submittedWriting";

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
        <Route path="/video" component={videoStart} />
        <Route path="/userVideo/:channel" component={UserVideo} />
        <Route path="/profile" component={Profile} />
        <Route path="/submittedWriting" component={SubmittedWriting} />
        <Redirect to="/" />
      </Switch>
    );
  } else {
    return (
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login" component={Login} />
        <Route exact path="/userVideo/:channel" component={UserVideo} />
        <Redirect to="/login" />
      </Switch>
    );
  }
};

export default Routes;
