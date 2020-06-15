import React, { useState, useEffect, useContext, useCallback } from "react";
import Conatiner from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import firebase from "../data/firebase";
import ProgressBar from "react-bootstrap/ProgressBar";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import { Context } from "../data/context";
import LoadingScreen from "../components/LoadingScreen";
import { ToastContainer, toast } from "react-toastify";
import Dropdown from "react-bootstrap/Dropdown";
import "react-toastify/dist/ReactToastify.css";

const Listening = () => {
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

  const { isLoading, setIsLoading, token, role } = useContext(Context);

  const uploadFileToStorage = (fileToUpload, fileType) => {
    setIsUploading(true);
    setIsUploadingComplete(false);
    setErrorText("");
    var storageRef = firebase.storage().ref();

    var uploadTask = storageRef.child(`${Date.now()}`).put(fileToUpload);

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

  const addToDB = async (formdata) => {
    setIsLoading(true);
    const response = await fetch(
      "https://us-central1-ielts-preps.cloudfunctions.net/api/add-listening-module",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
          authorization: `Bearer ${token}`,
        },
        body: formdata,
      }
    );
    const responseData = await response.json();
    console.log(responseData);
    if (responseData.success) {
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
    } else {
      alert(responseData.error);
    }
    setIsLoading(false);
  };

  const fetchListeningData = useCallback(() => {
    if (role === "student") {
      return;
    }
    setIsLoading(true);
    firebase
      .firestore()
      .collection("listening")
      .get()
      .then((docs) => {
        let data = [];
        docs.forEach((doc) => {
          data.push({ ...doc.data(), id: doc.id });
        });
        setListeningData([...data]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        alert("Eror Occured");
        setIsLoading(false);
      });
  }, [setIsLoading, role]);

  const deleteListeningModule = (id) => {
    setIsLoading(true);
    firebase
      .firestore()
      .doc(`/listening/${id}`)
      .delete()
      .then(() => {
        setIsLoading(false);
        toast.warning("Listening Module Deleted");
        let data = listeningData;
        data = data.filter((item) => item.id !== id);
        setListeningData([...data]);
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
                                <Dropdown.Item>
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
                      <td>
                        <Button
                          variant="danger"
                          onClick={() => deleteListeningModule(item.id)}
                        >
                          <i className="fa fa-trash"></i>
                        </Button>
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
                                      placeholder="Enter Answer"
                                      onChange={(event) => {
                                        const data = answersData;
                                        data[item.id].value =
                                          event.target.value;
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
                  onClick={() => {
                    if (type === "audio") {
                      if (audioUrl && pdfUrl) {
                        console.log("Done Uploading Audio and Video");
                        const formData = JSON.stringify({
                          type: "audio",
                          audioUrl,
                          pdfUrl,
                          videoUrl: "",
                          answers: answersData,
                          name,
                          complexity,
                        });
                        addToDB(formData);
                      } else {
                        alert("Please upload PDF and Audio Files");
                      }
                    }
                    if (type === "video") {
                      if (videoUrl) {
                        console.log("All Done With Video");
                        const formData = JSON.stringify({
                          type: "video",
                          audioUrl: "",
                          pdfUrl: "",
                          videoUrl,
                          answers: answersData,
                          name,
                          complexity,
                        });

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
