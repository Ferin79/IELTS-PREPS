import React, { useContext, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import LoadingScreen from "../components/LoadingScreen";
import { Context } from "../data/context";
import { useHistory } from "react-router-dom";

const Dashboard = () => {
  const history = useHistory();
  const { isLoading, role } = useContext(Context);

  useEffect(() => {
    if (role === "admin") {
      document.querySelector("#manageStaff").addEventListener("click", () => {
        history.push("/staff");
      });
    }

    document.querySelector("#manageStudent").addEventListener("click", () => {
      history.push("/student");
    });

    document.querySelector("#listening").addEventListener("click", () => {
      history.push("/listening");
    });
    document.querySelector("#reading").addEventListener("click", () => {
      history.push("/reading");
    });
    document.querySelector("#speaking").addEventListener("click", () => {
      history.push("/speaking");
    });
    document.querySelector("#writing").addEventListener("click", () => {
      history.push("/writing");
    });
  }, [history, role]);

  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <Container>
      <Row className="m-5"></Row>
      <Row>
        {role === "admin" && (
          <Col
            id="manageStaff"
            lg={true}
            className="d-flex flex-column justify-content-center align-items-center addHoverCursor"
          >
            <Image src={require("../images/staff.png")} rounded />
            <h5>Manage Staff</h5>
          </Col>
        )}

        <Col
          id="manageStudent"
          lg={true}
          className="d-flex flex-column justify-content-center align-items-center addHoverCursor"
        >
          <Image src={require("../images/student.png")} rounded />
          <h5>Manage Students</h5>
        </Col>
        <Col
          lg={true}
          className="d-flex flex-column justify-content-center align-items-center addHoverCursor"
        >
          <Image src={require("../images/profile.png")} rounded />
          <h5>Manage Profile</h5>
        </Col>
      </Row>
      <Row className="m-5" style={{ border: "1px solid black" }}></Row>
      <Row>
        <Col
          id="listening"
          lg={true}
          className="d-flex flex-column justify-content-center align-items-center addHoverCursor"
        >
          <Image src={require("../images/headphone.png")} rounded />
          <h5>Listening Module</h5>
        </Col>
        <Col
          id="reading"
          lg={true}
          className="d-flex flex-column justify-content-center align-items-center addHoverCursor"
        >
          <Image src={require("../images/reading.png")} rounded />
          <h5>Reading Module</h5>
        </Col>
        <Col
          id="speaking"
          lg={true}
          className="d-flex flex-column justify-content-center align-items-center addHoverCursor"
        >
          <Image src={require("../images/speaking.png")} rounded />
          <h5>Speaking Module</h5>
        </Col>
        <Col
          id="writing"
          lg={true}
          className="d-flex flex-column justify-content-center align-items-center addHoverCursor"
        >
          <Image src={require("../images/writing.png")} rounded />
          <h5>Writing Module</h5>
        </Col>
      </Row>
    </Container>
  );
};
export default Dashboard;
