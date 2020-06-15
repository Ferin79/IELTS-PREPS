import React, { useContext, useState, useEffect } from "react";
import Conatiner from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import firebase from "../data/firebase";
import { Context } from "../data/context";
import LoadingScreen from "../components/LoadingScreen";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Reading = () => {
  const { isLoading, setIsLoading, role } = useContext(Context);

  const [section1, setSection1] = useState("");
  const [section2, setSection2] = useState("");
  const [section3, setSection3] = useState("");
  const [section1Ques, setSection1Ques] = useState("");
  const [section2Ques, setSection2Ques] = useState("");
  const [section3Ques, setSection3Ques] = useState("");
  const [answersData, setAnswersData] = useState([]);
  const [name, setName] = useState("");
  const [complexity, setComplexity] = useState("easy");

  const handleAddModule = () => {
    if (role === "admin" || role === "staff") {
      setIsLoading(true);
      firebase
        .firestore()
        .collection("reading")
        .add({})
        .then(() => {
          toast("Reading Module Added Successfully");
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
          alert("Error Occured, Refresh Page and Try Again");
        });
    } else {
      alert("You are Unauthorized to add Reading Module");
    }
  };

  useEffect(() => {
    const data = [];
    for (var i = 0; i < 40; i++) {
      data.push({
        id: i,
        value: "",
      });
    }
    setAnswersData([...data]);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (role === "student") {
    return <h3>You are not suppose to be here</h3>;
  }
  return (
    <Conatiner fluid>
      <Row className="m-5">
        <Col
          lg="auto"
          sm="12"
          md="6"
          xl="6"
          className="d-flex d-column justify-content-center align-items-flex-start"
        >
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Answers</th>
                <th>Added By</th>
                <th>Action</th>
              </tr>
            </thead>
          </Table>
        </Col>
        <Col
          lg="auto"
          sm="12"
          md="6"
          xl="6"
          className="d-flex flex-column justify-content-center align-items-center"
          style={{ border: "1px solid black" }}
        >
          <h3 className="m-5">Add Reading Module</h3>
          <Form className="w-100">
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Enter Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Descriptive Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Form.Group>

            <Form.Control
              required
              as="select"
              value={complexity}
              onChange={(event) => setComplexity(event.target.value)}
            >
              <option value="" disabled>
                Select Complexity Type
              </option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </Form.Control>

            <Form.Label>Enter Passage Here</Form.Label>
            <Accordion>
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    Section 1
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                      <Form.Label>Reading Section 1 Passage</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows="10"
                        cols="10"
                        value={section1}
                        onChange={(event) => {
                          console.log(event.target.value);
                          setSection1(event.target.value);
                        }}
                      />
                    </Form.Group>

                    <Form.Group controlId="exampleForm.ControlTextarea1">
                      <Form.Label>Reading Section 1 Question</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows="10"
                        cols="10"
                        value={section1Ques}
                        onChange={(event) => {
                          console.log(event.target.value);
                          setSection1Ques(event.target.value);
                        }}
                      />
                    </Form.Group>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="1">
                    Section 2
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                      <Form.Label>Reading Section 2 Passage</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows="10"
                        cols="10"
                        value={section2}
                        onChange={(event) => setSection2(event.target.value)}
                      />
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                      <Form.Label>Reading Section 2 Question</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows="10"
                        cols="10"
                        value={section2Ques}
                        onChange={(event) => {
                          console.log(event.target.value);
                          setSection2Ques(event.target.value);
                        }}
                      />
                    </Form.Group>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="2">
                    Section 3
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="2">
                  <Card.Body>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                      <Form.Label>Reading Section 3 Passage</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows="10"
                        cols="10"
                        value={section3}
                        onChange={(event) => setSection3(event.target.value)}
                      />
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                      <Form.Label>Reading Section 3 Question</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows="10"
                        cols="10"
                        value={section3Ques}
                        onChange={(event) => {
                          console.log(event.target.value);
                          setSection3Ques(event.target.value);
                        }}
                      />
                    </Form.Group>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
            <Accordion className="mb-5 mt-5">
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    Edit Answers Here
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    {answersData &&
                      answersData.map((item) => {
                        return (
                          <div key={item.id}>
                            <Form.Group>
                              <Form.Label>Answer {item.id + 1}</Form.Label>
                              <div>
                                <Form.Control
                                  type="text"
                                  required
                                  placeholder="Enter Answer"
                                  onChange={(event) => {
                                    const data = answersData;
                                    data[item.id].value = event.target.value;
                                    setAnswersData([...data]);
                                  }}
                                />
                              </div>
                            </Form.Group>
                          </div>
                        );
                      })}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
            <Button
              type="submit"
              className="mt-5 mb-5 center"
              variant="outline-info"
              onClick={handleAddModule}
            >
              Add Reading Module
            </Button>
          </Form>
        </Col>
      </Row>
      <ToastContainer autoClose={3000} />
    </Conatiner>
  );
};

export default Reading;
