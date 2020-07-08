import React, { useContext, useState, useEffect, useCallback } from "react";
import Conatiner from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
import firebase from "../data/firebase";
import { Context } from "../data/context";
import LoadingScreen from "../components/LoadingScreen";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useHistory } from "react-router-dom";

const Reading = () => {
  const history = useHistory();

  const { isLoading, setIsLoading, role, institution } = useContext(Context);

  const [section1, setSection1] = useState("");
  const [section2, setSection2] = useState("");
  const [section3, setSection3] = useState("");
  const [section1Ques, setSection1Ques] = useState("");
  const [section2Ques, setSection2Ques] = useState("");
  const [section3Ques, setSection3Ques] = useState("");
  const [answersData, setAnswersData] = useState([]);
  const [name, setName] = useState("");
  const [complexity, setComplexity] = useState("easy");
  const [readingData, setReadingData] = useState([]);

  // Modal
  // eslint-disable-next-line
  const [modalShow, setModalShow] = useState(false);
  const [detailsModalData, setDetailsModalData] = useState({ data: [] });
  const [loadingModalData, setLoadingModalData] = useState(false);
  const [studentListInModel, setStudentListInModel] = useState([]);

  // eslint-disable-next-line
  const MyVerticallyCenteredModal = (props) => {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Test Statistics
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <h5>Average score :&nbsp; {detailsModalData.averageBand}</h5>
          </Row>
          <Row>
            <h5>
              Average Correct Score :&nbsp;{" "}
              {detailsModalData.averageCorrectScore}
            </h5>
          </Row>
          <Row>
            <h5>
              Average Not Attempted :&nbsp;{" "}
              {detailsModalData.averageNotAttempted}
            </h5>
          </Row>
          <Row>List of students who attempted this test</Row>
          {studentListInModel.map((student) => {
            return (
              <li>
                {student.email} : {student.band}{" "}
              </li>
            );
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  // eslint-disable-next-line
  const showTestData = (id) => {
    setLoadingModalData(true);
    firebase
      .firestore()
      .collection("readingUser")
      .where("ReadingTestId", "==", id)
      .get()
      .then((docs) => {
        let data = [];
        let totalBand = 0;
        let totalCorrectAnswers = 0;
        let totalNotAttempted = 0;
        docs.forEach((doc) => {
          data.push(doc.data());
          totalBand += doc.data().band;
          totalCorrectAnswers += doc.data().correctScore;
          totalNotAttempted += doc.data().notattemptScore;
        });
        const stats = {
          data,
          averageBand: totalBand / data.length,
          averageCorrectScore: totalCorrectAnswers / data.length,
          averageNotAttempted: totalNotAttempted / data.length,
        };
        console.log(data);
        setDetailsModalData(stats);
        setStudentListInModel(data);
        setLoadingModalData(false);
        setModalShow(true);
      });
  };

  const fetchReadingData = useCallback(() => {
    setIsLoading(true);
    firebase
      .firestore()
      .collection("reading")
      .where("institute_id", "==", institution)
      .orderBy("createdAt", "desc")
      .get()
      .then((docs) => {
        const data = [];
        docs.forEach((doc) => {
          data.push({ ...doc.data(), id: doc.id });
        });
        setReadingData([...data]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        alert(error.message);
        setIsLoading(false);
      });
  }, [setIsLoading, institution]);

  // Validation
  const emptyAnswers = () => {
    for (var i = 0; i < 40; i++) {
      if (answersData[i].value.trim() === "") {
        return true;
      }
    }
    return false;
  };

  const handleAddModule = (event) => {
    event.preventDefault();
    if (emptyAnswers()) {
      toast.error("Please Enter All Answers");
      console.log("Empty Answer");
      return;
    }
    console.log(answersData);

    if (role === "admin" || role === "staff") {
      setIsLoading(true);
      firebase
        .firestore()
        .collection("reading")
        .add({
          addedBy: firebase.auth().currentUser.email,
          section1Passage: section1,
          section2Passage: section2,
          section3Passage: section3,
          section1Ques,
          section2Ques,
          section3Ques,
          name,
          answersData,
          complexity,
          institute_id: institution,
          createdAt: firebase.firestore.Timestamp.now(),
        })
        .then(() => {
          toast("Reading Module Added Successfully");
          setIsLoading(false);
          fetchReadingData();
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

  const deleteReadingModule = (id) => {
    setIsLoading(true);
    firebase
      .firestore()
      .doc(`/reading/${id}`)
      .delete()
      .then(() => {
        setIsLoading(false);
        toast.warning("Listening Module Deleted");
        let data = readingData;
        data = data.filter((item) => item.id !== id);
        setReadingData([...data]);
      });
  };

  useEffect(() => {
    fetchReadingData();
    const data = [];
    for (var i = 0; i < 40; i++) {
      data.push({
        id: i,
        value: "",
      });
    }
    setAnswersData([...data]);
  }, [fetchReadingData]);

  if (isLoading) {
    return <LoadingScreen text="Loading Reading Data" />;
  } else if (loadingModalData) {
    return <LoadingScreen text="Loading Test Data..." />;
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
                <th>Name</th>
                <th>Answers</th>
                <th>Added By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {readingData.length ? (
                readingData.map((item, index) => {
                  let answers = item.answersData;
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.complexity}</td>
                      <td>{item.name}</td>
                      <td>
                        <Dropdown>
                          <Dropdown.Toggle
                            variant="outline-dark"
                            id="dropdown-basic"
                          >
                            View Answers
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            {answers.map((answer, index) => {
                              return (
                                <Dropdown.Item key={index}>
                                  <p className="dropdownData">
                                    {index + 1}
                                    {". "}
                                    {answer.value}
                                  </p>
                                </Dropdown.Item>
                              );
                            })}
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                      <td>{item.addedBy}</td>
                      <td className="d-flex flex-row justify-content-center align-items-center">
                        <Button
                          variant="danger"
                          onClick={() => deleteReadingModule(item.id)}
                        >
                          <i className="fa fa-trash"></i>
                        </Button>
                        <Button
                          className="ml-2"
                          variant="primary"
                          onClick={() => {
                            history.push(`/stats/reading/${item.id}`);
                          }}
                        >
                          <i className="fa fa-info"></i>
                        </Button>

                        {/* <MyVerticallyCenteredModal
                          show={modalShow}
                          onHide={() => setModalShow(false)}
                        /> */}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <p>No Data to Show</p>
              )}
            </tbody>
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
                      <CKEditor
                        editor={ClassicEditor}
                        data=""
                        onInit={(editor) => {
                          // You can store the "editor" and use when it is needed.
                          console.log("Editor is ready to use!", editor);
                        }}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          console.log({ event, editor, data });
                          setSection1(data);
                        }}
                        onBlur={(event, editor) => {
                          console.log("Blur.", editor);
                        }}
                        onFocus={(event, editor) => {
                          console.log("Focus.", editor);
                        }}
                      />
                      {/* <Form.Control
                        as="textarea"
                        rows="10"
                        cols="10"
                        value={section1}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            console.log("enter key pressed");
                            setSection1((section1) => section1 + "<br/> ");
                          }
                        }}
                        onChange={(event) => {
                          console.log(event.target.value);

                          setSection1(event.target.value);
                        }}
                      /> */}
                    </Form.Group>

                    <Form.Group controlId="exampleForm.ControlTextarea1">
                      <Form.Label>Reading Section 1 Question</Form.Label>
                      <CKEditor
                        editor={ClassicEditor}
                        data=""
                        onInit={(editor) => {
                          // You can store the "editor" and use when it is needed.
                          console.log("Editor is ready to use!", editor);
                        }}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          console.log({ event, editor, data });
                          setSection1Ques(data);
                        }}
                        onBlur={(event, editor) => {
                          console.log("Blur.", editor);
                        }}
                        onFocus={(event, editor) => {
                          console.log("Focus.", editor);
                        }}
                      />
                      {/* <Form.Control
                        as="textarea"
                        rows="10"
                        cols="10"
                        value={section1Ques}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            console.log("enter key pressed");
                            setSection1Ques(
                              (section1Ques) => section1Ques + "<br/> "
                            );
                          }
                        }}
                        onChange={(event) => {
                          console.log(event.target.value);
                          setSection1Ques(event.target.value);
                        }}
                      /> */}
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
                      <CKEditor
                        editor={ClassicEditor}
                        data=""
                        onInit={(editor) => {
                          // You can store the "editor" and use when it is needed.
                          console.log("Editor is ready to use!", editor);
                        }}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          console.log({ event, editor, data });
                          setSection2(data);
                        }}
                        onBlur={(event, editor) => {
                          console.log("Blur.", editor);
                        }}
                        onFocus={(event, editor) => {
                          console.log("Focus.", editor);
                        }}
                      />
                      {/* <Form.Control
                        as="textarea"
                        rows="10"
                        cols="10"
                        value={section2}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            console.log("enter key pressed");
                            setSection2((section2) => section2 + "<br/> ");
                          }
                        }}
                        onChange={(event) => setSection2(event.target.value)}
                      /> */}
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                      <Form.Label>Reading Section 2 Question</Form.Label>
                      <CKEditor
                        editor={ClassicEditor}
                        data=""
                        onInit={(editor) => {
                          // You can store the "editor" and use when it is needed.
                          console.log("Editor is ready to use!", editor);
                        }}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          console.log({ event, editor, data });
                          setSection2Ques(data);
                        }}
                        onBlur={(event, editor) => {
                          console.log("Blur.", editor);
                        }}
                        onFocus={(event, editor) => {
                          console.log("Focus.", editor);
                        }}
                      />
                      {/* <Form.Control
                        as="textarea"
                        rows="10"
                        cols="10"
                        value={section2Ques}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            console.log("enter key pressed");
                            setSection2Ques(
                              (section2Ques) => section2Ques + "<br/> "
                            );
                          }
                        }}
                        onChange={(event) => {
                          console.log(event.target.value);
                          setSection2Ques(event.target.value);
                        }}
                      /> */}
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
                      <CKEditor
                        editor={ClassicEditor}
                        data=""
                        onInit={(editor) => {
                          // You can store the "editor" and use when it is needed.
                          console.log("Editor is ready to use!", editor);
                        }}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          console.log({ event, editor, data });
                          setSection3(data);
                        }}
                        onBlur={(event, editor) => {
                          console.log("Blur.", editor);
                        }}
                        onFocus={(event, editor) => {
                          console.log("Focus.", editor);
                        }}
                      />
                      {/* <Form.Control
                        as="textarea"
                        rows="10"
                        cols="10"
                        value={section3}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            console.log("enter key pressed");
                            setSection3((section3) => section3 + "<br/> ");
                          }
                        }}
                        onChange={(event) => setSection3(event.target.value)}
                      /> */}
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                      <Form.Label>Reading Section 3 Question</Form.Label>
                      <CKEditor
                        editor={ClassicEditor}
                        data=""
                        onInit={(editor) => {
                          // You can store the "editor" and use when it is needed.
                          console.log("Editor is ready to use!", editor);
                        }}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          console.log({ event, editor, data });
                          setSection3Ques(data);
                        }}
                        onBlur={(event, editor) => {
                          console.log("Blur.", editor);
                        }}
                        onFocus={(event, editor) => {
                          console.log("Focus.", editor);
                        }}
                      />
                      {/* <Form.Control
                        as="textarea"
                        rows="10"
                        cols="10"
                        value={section3Ques}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            console.log("enter key pressed");
                            setSection3Ques(
                              (section3Ques) => section3Ques + "<br/> "
                            );
                          }
                        }}
                        onChange={(event) => {
                          console.log(event.target.value);
                          setSection3Ques(event.target.value);
                        }}
                      /> */}
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
