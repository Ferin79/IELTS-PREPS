import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import firebase from "../data/firebase";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const ModuleStats = ({ match }) => {
  const history = useHistory();

  const module = match.params.module;
  const id = match.params.id;

  const [moduleData, setModuleData] = useState([]);
  const [totalCount, setTotalCount] = useState();
  const [isComponentLoading, setIsComponentLoading] = useState(false);
  const [emptyResults, setEmptyResults] = useState(false);
  const [avgBand, setAvgBand] = useState(0);
  const [selectedStudentIndex, setSelectedStudentIndex] = useState(-1);
  const [nativeModule, setNativeModule] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [modalShow, setModalShow] = React.useState(false);

  const fetchModuleData = useCallback(() => {
    setIsComponentLoading(true);
    setEmptyResults(false);
    firebase
      .firestore()
      .collection(`${module}User`)
      .where(`${module}TestId`, "==", id)
      .get()
      .then((docs) => {
        if (docs.size) {
          setIsComponentLoading(false);
          setTotalCount(docs.size);
          let totalRecievedBands = 0;
          const data = [];
          docs.forEach((doc) => {
            totalRecievedBands =
              parseInt(totalRecievedBands) + parseInt(doc.data().band);
            data.push(doc.data());
          });
          setModuleData([...data]);
          setAvgBand(
            Math.round(parseInt(totalRecievedBands) / parseInt(docs.size))
          );
          firebase
            .firestore()
            .doc(`/${module}/${id}`)
            .get()
            .then((doc) => {
              setNativeModule(doc.data());
              if (module !== "writing") {
                setAnswers([...doc.data().answers]);
              }
            });
        } else {
          setIsComponentLoading(false);
          setEmptyResults(true);
        }
      })
      .catch((error) => {
        setIsComponentLoading(false);
        console.log(error);
      });
  }, [id, module]);

  function MyVerticallyCenteredModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Modal heading
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Centered Modal</h4>
          <p>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
            dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
            ac consectetur ac, vestibulum at eros.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  useEffect(() => {
    fetchModuleData();
  }, [fetchModuleData]);

  if (!module && !id) {
    return history.push("/");
  }
  return !emptyResults ? (
    <Container fluid>
      <Row className="d-flex flex-column justify-content-center align-items-center mt-5">
        <Col sm="12" md="10" xs="12">
          <h4 style={{ margin: 10, textTransform: "capitalize" }}>
            {module}: {nativeModule.name}
          </h4>
          <div className="d-flex flex-row justify-content-center align-items-center">
            <Card border="primary" style={{ width: "18rem" }}>
              <Card.Header></Card.Header>
              <Card.Body>
                <Card.Title>Total Student Appeared</Card.Title>
                <Card.Text>
                  {isComponentLoading ? (
                    <Spinner animation="border" variant="primary" />
                  ) : (
                    totalCount
                  )}
                </Card.Text>
              </Card.Body>
            </Card>
            <Card border="success" style={{ width: "18rem", marginLeft: 20 }}>
              <Card.Header></Card.Header>
              <Card.Body>
                <Card.Title>Average Bands</Card.Title>
                <Card.Text>
                  {isComponentLoading ? (
                    <Spinner animation="border" variant="primary" />
                  ) : (
                    avgBand
                  )}
                </Card.Text>
              </Card.Body>
            </Card>
            <Card style={{ marginLeft: 20 }}>
              <Card.Header>Options</Card.Header>
              <Card.Body className="d-flex flex-row justify-content-center align-items-center">
                {answers.length > 0 && (
                  <DropdownButton
                    style={{ margin: 3 }}
                    id="dropdown-item-button"
                    variant="outline-info"
                    title="See Answers"
                  >
                    {answers.map((item, index) => {
                      return (
                        <Dropdown.Item as="button" key={index}>
                          {index + 1}. {item.value}
                        </Dropdown.Item>
                      );
                    })}
                  </DropdownButton>
                )}

                {nativeModule.audioUrl && (
                  <a
                    style={{ margin: 3 }}
                    className="btn btn-outline-primary"
                    href={nativeModule.audioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Audio
                  </a>
                )}
                {nativeModule.pdfUrl && (
                  <a
                    style={{ margin: 3 }}
                    className="btn btn-outline-primary"
                    href={nativeModule.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View PDF
                  </a>
                )}
                {nativeModule.videoUrl && (
                  <a
                    style={{ margin: 3 }}
                    className="btn btn-outline-primary"
                    href={nativeModule.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Video
                  </a>
                )}
                {nativeModule.question && (
                  <>
                    <Button
                      variant="outline-info"
                      style={{ margin: 3, textTransform: "capitalize" }}
                      onClick={() => setModalShow(true)}
                    >
                      Read {nativeModule.type} Question
                    </Button>

                    <MyVerticallyCenteredModal
                      show={modalShow}
                      onHide={() => setModalShow(false)}
                    />
                  </>
                )}
                {nativeModule.imageUrl && (
                  <a
                    style={{ margin: 3, textTransform: "capitalize" }}
                    className="btn btn-outline-primary"
                    href={nativeModule.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View {nativeModule.type} Image
                  </a>
                )}
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
      <Row className="d-flex flex-row justify-content-center align-items-center mt-5">
        <Col sm="12" md="3" xs="12">
          <div className="m-5">
            {moduleData.length &&
              !isComponentLoading &&
              moduleData.map((item, index) => {
                return (
                  <div
                    className="addHoverCursor"
                    onClick={() => {
                      setSelectedStudentIndex(index);
                    }}
                    key={item.email}
                    style={{
                      padding: 15,
                      backgroundColor:
                        selectedStudentIndex === index ? "black" : "white",
                      borderWidth: 1,
                      borderColor: "#000",
                    }}
                  >
                    <h5
                      style={{
                        color:
                          selectedStudentIndex === index ? "white" : "black",
                      }}
                    >
                      {item.email}
                    </h5>
                  </div>
                );
              })}
          </div>
        </Col>
        <Col sm="12" md="9" xs="12"></Col>
      </Row>
    </Container>
  ) : (
    <div className="d-flex flex-column justify-content-center align-items-center mt-5">
      <h3>No Stats / Invalid Id</h3>
    </div>
  );
};

export default ModuleStats;
