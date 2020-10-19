import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import { useHistory } from "react-router-dom";

const StudentHomePage = () => {
  const history = useHistory();
  return (
    <Container>
      <Row className="mt-5">
        <Col
          onClick={() => history.push("/student/speaking")}
          id="speaking"
          lg={true}
          className="d-flex flex-column justify-content-center align-items-center addHoverCursor"
        >
          <Image src={require("../images/speaking.png")} rounded />
          <h5>Speaking</h5>
        </Col>
        <Col
          onClick={() => history.push("/message")}
          lg={true}
          className="d-flex flex-column justify-content-center align-items-center addHoverCursor"
        >
          <Image src={require("../images/message.png")} rounded />
          <h5>Chat</h5>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentHomePage;
