import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { ToastContainer, toast } from "react-toastify";
import firebase from "../data/firebase";

const EditStaff = (props) => {
  const email = props.match.params.email;

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [userId, setUserId] = useState("");

  const handleSaveStaffChanges = () => {
    setIsLoading(true);

    if (startTime.trim() === "") {
      toast.warn("Select Start Time");
      return;
    }
    if (endTime.trim() === "") {
      toast.warn("Select End Time");
      return;
    }
    firebase
      .firestore()
      .doc(`/users/${email}`)
      .update({
        firstname,
        lastname,
        startTime,
        endTime,
      })
      .then(() => {
        firebase.firestore().doc(`/timetable/${userId}`).update({
          firstname,
          lastname,
          startTime,
          endTime,
        });

        toast("Saved Successfully");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    firebase
      .firestore()
      .doc(`/users/${email}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setFirstname(doc.data().firstname);
          setLastname(doc.data().lastname);

          const startTime = doc.data().startTime ? doc.data().startTime : "";
          const endTime = doc.data().endTime ? doc.data().endTime : "";

          setStartTime(startTime);
          setEndTime(endTime);

          setUserId(doc.data().userId);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [email]);
  return (
    <Container>
      <Row className="mt-5">
        <Col>
          <Form>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    placeholder="First name"
                    value={firstname}
                    onChange={(event) => setFirstname(event.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    placeholder="Last name"
                    value={lastname}
                    onChange={(event) => setLastname(event.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                value={email}
                readOnly
              />
            </Form.Group>

            <Row>
              <Col lg={true} xs={12} md={8} className="border-right">
                <Form.Group>
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    type="time"
                    required
                    value={startTime}
                    onChange={(event) => setStartTime(event.target.value)}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    type="time"
                    required
                    value={endTime}
                    onChange={(event) => setEndTime(event.target.value)}
                  />
                </Form.Group>

                {isLoading ? (
                  <Spinner animation="border" variant="primary" />
                ) : (
                  <Button variant="primary" onClick={handleSaveStaffChanges}>
                    Save Changes
                  </Button>
                )}
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  );
};

export default EditStaff;
