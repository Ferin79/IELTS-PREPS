import React, { useState, useEffect, useContext, useCallback } from "react";
import Conatiner from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import firebase from "../data/firebase";
import ProgressBar from "react-bootstrap/ProgressBar";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import { Context } from "../data/context";
import LoadingScreen from "../components/LoadingScreen";
import { ToastContainer, toast } from "react-toastify";
import Dropdown from "react-bootstrap/Dropdown";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";

const Listening = () => {
  const history = useHistory();

  const [type, setType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [isUploadingComplete, setIsUploadingComplete] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [answersData, setAnswersData] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [listeningData, setListeningData] = useState([]);
  const [name, setName] = useState("");
  const [complexity, setComplexity] = useState("easy");

  const { isLoading, setIsLoading, role, institution } = useContext(Context);

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
      .collection("listeningUser")
      .where("listeningTestId", "==", id)
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

  const uploadFileToStorage = (fileToUpload, fileType) => {
    setIsUploading(true);
    setIsUploadingComplete(false);
    setErrorText("");
    var storageRef = firebase.storage().ref(`${institution}/listening`);

    var uploadTask = storageRef
      .child(`${firebase.auth().currentUser.email}_${Date.now()}`)
      .put(fileToUpload);

    uploadTask.on(
      "state_changed",
      function (snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setPercentage(Math.round(parseInt(progress)));
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED:
            console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING:
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      function (error) {
        console.log(error);
        setErrorText("Error While Uploading. Please try again");
        setIsUploading(false);
      },
      function () {
        console.log(uploadTask.snapshot.ref.name);
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          console.log("File available at", downloadURL);

          if (fileType === "audio") {
            setAudioUrl(downloadURL);
          }
          if (fileType === "pdf") {
            setPdfUrl(downloadURL);
          }
          if (fileType === "video") {
            setVideoUrl(downloadURL);
          }
          setIsUploadingComplete(true);
          setIsUploading(false);
        });
      }
    );
  };

  const emptyAnswers = () => {
    for (var i = 0; i < 40; i++) {
      if (answersData[i].value.trim() === "") {
        return true;
      }
    }
    return false;
  };

  const addToDB = async (formdata) => {
    setIsLoading(true);
    firebase
      .firestore()
      .collection("/listening")
      .add({
        ...formdata,
        addedBy: firebase.auth().currentUser.email,
        institute_id: institution,
        createdAt: firebase.firestore.Timestamp.now(),
      })
      .then(() => {
        toast("Listening Module Added");
        setAudioUrl(null);
        setVideoUrl(null);
        setPdfUrl(null);
        setIsUploading(false);
        setIsUploadingComplete(false);
        setSelectedFile(null);
        setSelectedPDF(null);
        setErrorText(null);
        fetchListeningData();
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setErrorText(error.message);
        setIsLoading(false);
      });
  };

  const fetchListeningData = useCallback(() => {
    if (role === "student") {
      return;
    }
    setIsLoading(true);
    firebase
      .firestore()
      .collection("listening")
      .where("institute_id", "==", institution)
      .orderBy("createdAt", "desc")
      .get()
      .then((docs) => {
        let data = [];
        docs.forEach((doc) => {
          console.log();

          data.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        console.log([...data]);
        setListeningData([...data]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        alert("Eror Occured");
        setIsLoading(false);
      });
  }, [setIsLoading, role, institution]);

  const deleteListeningModule = (item) => {
    const id = item.id;
    const type = item.type;
    let refUrl = "";
    let refPdfUrl = "";

    if (type === "video") {
      refUrl = item.videoUrl;
    } else if (type === "audio") {
      refUrl = item.audioUrl;
      refPdfUrl = item.pdfUrl;
    }

    setIsLoading(true);
    firebase
      .firestore()
      .doc(`/listening/${id}`)
      .delete()
      .then(() => {
        if (type === "video") {
          firebase
            .storage()
            .refFromURL(refUrl)
            .delete()
            .then(() => {
              setIsLoading(false);
              toast.warning("Listening file deleted");
              toast.warning("Listening Module Deleted");
              let data = listeningData;
              data = data.filter((item) => item.id !== id);
              setListeningData([...data]);
            })
            .catch(function (error) {
              setIsLoading(false);
              toast.warning("Listening Module Deleted");
              toast.error("Listening file not deleted :(");
              let data = listeningData;
              data = data.filter((item) => item.id !== id);
              setListeningData([...data]);
            });
        } else if (type === "audio") {
          firebase
            .storage()
            .refFromURL(refUrl)
            .delete()
            .then(() => {
              firebase
                .storage()
                .refFromURL(refPdfUrl)
                .delete()
                .then(() => {
                  setIsLoading(false);
                  toast.warning("Listening file deleted");
                  toast.warning("Listening Module Deleted");
                  let data = listeningData;
                  data = data.filter((item) => item.id !== id);
                  setListeningData([...data]);
                })
                .catch(function (error) {
                  setIsLoading(false);
                  toast.warning("Listening Module Deleted");
                  toast.error("Listening file not deleted :(");
                  let data = listeningData;
                  data = data.filter((item) => item.id !== id);
                  setListeningData([...data]);
                });
            })
            .catch(function (error) {
              setIsLoading(false);
              toast.warning("Listening Module Deleted");
              toast.error("Listening file not deleted :(");
              let data = listeningData;
              data = data.filter((item) => item.id !== id);
              setListeningData([...data]);
            });
        }
      });
  };

  useEffect(() => {
    fetchListeningData();
    const data = [];
    for (var i = 0; i < 40; i++) {
      data.push({
        id: i,
        value: "",
      });
    }
    setAnswersData([...data]);
  }, [fetchListeningData]);

  if (isLoading) {
    return <LoadingScreen text="Listening Module is Loading..." />;
  } else if (loadingModalData) {
    return <LoadingScreen text="Loading Test Data..." />;
  }

  return (
    <Conatiner fluid>
      <Row className="m-5">
        <Col
          lg="auto"
          sm="12"
          md="6"
          xl="6"
          className="d-flex justify-content-center align-items-flex-start"
        >
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Name</th>
                <th>Complexity</th>
                <th>Answers</th>
                <th>Added By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {listeningData.length ? (
                listeningData.map((item, index) => {
                  let answers = item.answers;
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.type}</td>
                      <td>{item.name}</td>
                      <td>{item.complexity}</td>

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
                          onClick={() => deleteListeningModule(item)}
                        >
                          <i className="fa fa-trash"></i>
                        </Button>
                        <Button
                          variant="primary"
                          className="ml-2"
                          onClick={() => {
                            history.push(`/stats/listening/${item.id}`);
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
          <h3 className="m-5">Add Listening Module</h3>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Enter Name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter Descriptive Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Select Type</Form.Label>
              <Form.Control
                required
                as="select"
                value={type}
                onChange={(event) => {
                  setAudioUrl(null);
                  setVideoUrl(null);
                  setPdfUrl(null);
                  setSelectedFile(null);
                  setSelectedPDF(null);
                  setType(event.target.value);
                  setIsUploading(false);
                  setIsUploadingComplete(false);
                }}
              >
                <option value="" disabled>
                  Select Module Type
                </option>
                <option value="audio">Audio</option>
                <option value="video">Video</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Select Complexity</Form.Label>
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
            </Form.Group>
            {type.trim() !== "" ? (
              <div>
                {type === "audio" && (
                  <Form.Group className="d-flex flex-column justify-content-center align-items-flex-start mt-5">
                    <Form.Label>Select Audio (mp3) File</Form.Label>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(event) => {
                        if (
                          event.target.files[0] &&
                          (event.target.files[0].type === "audio/mp3" ||
                            event.target.files[0].type === "audio/mpeg")
                        ) {
                          console.log(event.target.files[0].type);
                          setSelectedFile(event.target.files[0]);
                        } else {
                          console.log(event.target.files[0].type);
                          setSelectedFile(null);
                          alert("Please Select Valid Audio File");
                        }
                      }}
                    />

                    {audioUrl && (
                      <p className="mt-3">
                        Audio File is Uploaded to{" "}
                        <a className="uploadLink" href={audioUrl}>
                          {audioUrl}
                        </a>
                      </p>
                    )}
                    <Button
                      className="mt-3"
                      disabled={!selectedFile}
                      variant="outline-info"
                      onClick={() => {
                        uploadFileToStorage(selectedFile, "audio");
                      }}
                    >
                      Upload Audio File
                    </Button>
                    <Form.Label className="mt-5">Select PDF File</Form.Label>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(event) => {
                        if (
                          event.target.files[0] &&
                          event.target.files[0].type === "application/pdf"
                        ) {
                          setSelectedPDF(event.target.files[0]);
                        } else {
                          setSelectedPDF(null);
                          alert("Please Select Valid File");
                        }
                      }}
                    />

                    {pdfUrl && (
                      <p className="mt-3">
                        PDF File is Uploaded to{" "}
                        <a className="uploadLink" href={pdfUrl}>
                          {pdfUrl}
                        </a>
                      </p>
                    )}

                    <Button
                      className="mt-3"
                      disabled={!selectedPDF}
                      variant="outline-info"
                      onClick={() => {
                        uploadFileToStorage(selectedPDF, "pdf");
                      }}
                    >
                      Upload PDF File
                    </Button>
                  </Form.Group>
                )}
                {type === "video" && (
                  <Form.Group className="d-flex flex-column justify-content-center align-items-flex-start mt-5">
                    <Form.Label>Select Video (mp4) File</Form.Label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(event) => {
                        if (
                          event.target.files[0] &&
                          event.target.files[0].type === "video/mp4"
                        ) {
                          setSelectedFile(event.target.files[0]);
                        } else {
                          setSelectedFile(null);
                          alert("Please Select Valid File");
                        }
                      }}
                    />
                    {videoUrl && (
                      <p className="mt-3">
                        Video is Uploaded to{" "}
                        <a className="uploadLink" href={videoUrl}>
                          {videoUrl}
                        </a>
                      </p>
                    )}
                    <Button
                      className="mt-3"
                      disabled={!selectedFile}
                      variant="outline-info"
                      onClick={() => {
                        uploadFileToStorage(selectedFile, "video");
                      }}
                    >
                      Upload Video File
                    </Button>
                  </Form.Group>
                )}
                <div className="mt-3 mb-3">
                  {isUploading && <ProgressBar now={percentage} />}
                  {isUploading ? (
                    <p>Uploading Please Wait.. ({percentage}%)</p>
                  ) : (
                    <p></p>
                  )}
                  {isUploadingComplete && <p>Upload Complete</p>}
                </div>

                {errorText && <p className="mt-3 text-danger">{errorText}</p>}
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
                                      style={{ textTransform: "uppercase" }}
                                      autoCapitalize={true}
                                      placeholder="Enter Answer"
                                      onChange={(event) => {
                                        const data = answersData;
                                        data[
                                          item.id
                                        ].value = event.target.value.toUpperCase();
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
                  className="mt-5 mb-5"
                  variant="info"
                  onClick={(event) => {
                    event.preventDefault();
                    if (emptyAnswers()) {
                      toast.error("Please Enter All Answers");
                      console.log("Empty Answer");
                      return;
                    }
                    console.log(answersData);
                    if (type === "audio") {
                      if (audioUrl && pdfUrl) {
                        console.log("Done Uploading Audio and Video");
                        const formData = {
                          type: "audio",
                          audioUrl,
                          pdfUrl,
                          videoUrl: "",
                          answers: answersData,
                          name,
                          complexity,
                        };
                        addToDB(formData);
                      } else {
                        alert("Please upload PDF and Audio Files");
                      }
                    }
                    if (type === "video") {
                      if (videoUrl) {
                        console.log("All Done With Video");
                        const formData = {
                          type: "video",
                          audioUrl: "",
                          pdfUrl: "",
                          videoUrl,
                          answers: answersData,
                          name,
                          complexity,
                        };

                        addToDB(formData);
                      } else {
                        alert("Please upload Video File");
                      }
                    }
                  }}
                >
                  Add Listening Module
                </Button>
              </div>
            ) : (
              <p>Please Select Module Type to procced</p>
            )}
          </Form>
        </Col>
      </Row>
      <ToastContainer autoClose={3000} />
    </Conatiner>
  );
};

export default Listening;
