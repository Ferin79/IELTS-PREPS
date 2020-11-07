import React, { useContext } from "react";
import { Switch, Redirect, Route, useLocation } from "react-router-dom";
import { AuthContext } from "./data/auth";
import { Context } from "./data/context";
import firebase from "./data/firebase";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Staff from "./pages/staff";
import Student from "./pages/student";
import VideoCall from "./pages/VideoCall/VideoCall-NewUi-OldLogic";
import Timetable from "./pages/timetable";
import LoadingScreen from "./pages/loading";
import StaffTimeTable from "./pages/staffTT";
import Messages from "./pages/messages";
import selectModule from "./components/selectModule";
import SpeakingReportAdmin from "./components/speakingReportAdmin";
import StudentHomePage from "./pages/StudentHomePage";
import Profile from "./pages/profile";
import EditStaff from "./pages/editStaff";
import Recording from "./pages/VideoCall/Recording";

const Routes = () => {
  const { currentUser } = useContext(AuthContext);
  const { role, isLoading } = useContext(Context);

  const locatin = useLocation();
  console.log(locatin);

  if (locatin.pathname === "/record") {
    return <Route path="/record" exact component={Recording} />;
  }

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
          <Route path="/message" exact component={Messages} />
          <Route path="/students/:email" exact component={selectModule} />
          <Route path="/profile" exact component={Profile} />
          <Route path="/edit/staff/:email" exact component={EditStaff} />
          <Route
            path="/students/:email/speaking"
            exact
            component={SpeakingReportAdmin}
          />
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
          <Route path="/staff/timetable" exact component={StaffTimeTable} />
          <Route path="/message" exact component={Messages} />
          <Route path="/students/:email" exact component={selectModule} />
          <Route
            path="/students/:email/speaking"
            exact
            component={SpeakingReportAdmin}
          />
          <Route path="/profile" exact component={Profile} />
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
          <Route path="/" exact component={StudentHomePage} />
          <Route path="/student/speaking" exact component={VideoCall} />
          <Route path="/message" exact component={Messages} />
          <Route path="/profile" exact component={Profile} />
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
        <Route path="/login" exact component={Login} />
        <Redirect to="/login" />
      </Switch>
    );
  }
};

export default Routes;
