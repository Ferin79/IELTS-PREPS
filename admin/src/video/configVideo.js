import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { v4 as uuid } from "uuid";
import { useHistory } from "react-router-dom";

const uid = uuid();

const ConfigVideo = () => {
  const [userName, setUserName] = useState("");

  const history = useHistory();

  const handleOnPress = () => {
    if (userName.trim() === "") {
      alert("User Name Cannot be empty");
      return;
    }
    history.push(`/StartVideo/${userName.trim().split(" ").join("-")}/${uid}`);
  };
  return (
    <Container>
      <Row className="m-5">
        <Col sm={12} md={6} lg="auto" xl={6}>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                value={userName}
                onChange={(event) => setUserName(event.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Room ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Room ID"
                value={uid}
                readOnly
              />
            </Form.Group>
            <Button variant="outline-primary" onClick={() => handleOnPress()}>
              Start Video Call
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ConfigVideo;
