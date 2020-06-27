import React, { useContext, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import LoadingScreen from "../components/LoadingScreen";
import { Context } from "../data/context";
import { useHistory } from "react-router-dom";
import firebase from "../data/firebase";

const Dashboard = () => {
  const history = useHistory();
  const { isLoading, role, institution } = useContext(Context);
  const [show, setShow] = useState(false);
  const [Title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSend = async () => {
    if (Title.trim() === "" || description.trim() === "") {
      alert("Please fill out all fields");
      return;
    }

    setShow(false);

    firebase
      .firestore()
      .collection("usersNotificationToken")
      .where("institute_id", "==", institution)
      .get()
      .then((docs) => {
        const tokenList = [];
        docs.forEach((doc) => {
          tokenList.push(doc.data().token);
        });
        firebase
          .firestore()
          .collection("notifications")
          .add({
            title: Title,
            body: description,
            institute_id: institution,
            email: firebase.auth().currentUser.email,
            createdAt: firebase.firestore.Timestamp.now(),
          })
          .then(async () => {
            const message = {
              to: tokenList,
              sound: "default",
              title: Title,
              body: description,
            };
            await fetch("https://exp.host/--/api/v2/push/send", {
              method: "POST",
              body: JSON.stringify(message),
            });
          });
      })
      .catch((error) => console.log(error));
  };

  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <Container>
      <Row className="m-5"></Row>
      <Row>
        {role === "admin" && (
          <Col
            onClick={() => history.push("/staff")}
            id="manageStaff"
            lg={true}
            className="d-flex flex-column justify-content-center align-items-center addHoverCursor"
          >
            <Image src={require("../images/staff.png")} rounded />
            <h5>Manage Staff</h5>
          </Col>
        )}

        <Col
          onClick={() => history.push("/student")}
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
          onClick={() => history.push("/listening")}
          id="listening"
          lg={true}
          className="d-flex flex-column justify-content-center align-items-center addHoverCursor"
        >
          <Image src={require("../images/headphone.png")} rounded />
          <h5>Listening Module</h5>
        </Col>
        <Col
          onClick={() => history.push("/reading")}
          id="reading"
          lg={true}
          className="d-flex flex-column justify-content-center align-items-center addHoverCursor"
        >
          <Image src={require("../images/reading.png")} rounded />
          <h5>Reading Module</h5>
        </Col>
        <Col
          onClick={() => history.push("/video")}
          id="speaking"
          lg={true}
          className="d-flex flex-column justify-content-center align-items-center addHoverCursor"
        >
          <Image src={require("../images/speaking.png")} rounded />
          <h5>Speaking Module</h5>
        </Col>
        <Col
          onClick={() => history.push("/writing")}
          id="writing"
          lg={true}
          className="d-flex flex-column justify-content-center align-items-center addHoverCursor"
        >
          <Image src={require("../images/writing.png")} rounded />
          <h5>Writing Module</h5>
        </Col>
      </Row>
      <Row className="m-5" style={{ border: "1px solid black" }}></Row>
      <Row>
        <Col
          onClick={() => handleShow()}
          id="listening"
          lg={true}
          className="d-flex flex-column justify-content-center align-items-center addHoverCursor"
        >
          <Image src={require("../images/notification.png")} rounded />
          <h5>Send Notifications</h5>
        </Col>
      </Row>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Title is 1-2 Words"
              value={Title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Enter 1 line Description"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleSend()}>
            Send
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
export default Dashboard;
