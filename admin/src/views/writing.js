import React, { useContext, useState, useCallback, useEffect } from "react";
import Conatiner from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import firebase from "../data/firebase";
import { Context } from "../data/context";
import LoadingScreen from "../components/LoadingScreen";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ProgressBar from "react-bootstrap/ProgressBar";
import { useHistory } from "react-router-dom";

const Writing = () => {
  const history = useHistory();

  const { isLoading, setIsLoading, role, institution } = useContext(Context);

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [question, setQuestion] = useState("");
  const [isSummary, setIsSummary] = useState(false);
  const [writingData, setWritingData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [isUploadingCompleted, setIsUploadingCompleted] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [percentage, setPercentage] = useState(0);

  // Modal
  // eslint-disable-next-line
  const [modalShow, setModalShow] = useState(false);
  const [detailsModalData, setDetailsModalData] = useState({ data: [] });
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
    firebase
      .firestore()
      .collection("writingUser")
      .where("writingTestId", "==", id)
      .get()
      .then((docs) => {
        let data = [];
        let totalBand = 0;
        // eslint-disable-next-line
        let totalCorrectAnswers = 0;
        // eslint-disable-next-line
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
        };
        console.log(data);
        setDetailsModalData(stats);
        setStudentListInModel(data);
        setModalShow(true);
      });
  };

  const uploadFileToStorage = () => {
    setIsUploading(true);
    setIsUploadingCompleted(false);
    setErrorText("");
    var storageRef = firebase.storage().ref(`${institution}/writing`);

    var uploadTask = storageRef
      .child(`${firebase.auth().currentUser.email}_${Date.now()}`)
      .put(selectedFile);

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
          setImageUrl(downloadURL);
          setIsUploadingCompleted(true);
          setIsUploading(false);
        });
      }
    );
  };

  const handleFetchWriting = useCallback(() => {
    setIsLoading(true);
    firebase
      .firestore()
      .collection("writing")
      .where("institute_id", "==", institution)
      .orderBy("createdAt", "desc")
      .get()
      .then((docs) => {
        const data = [];
        docs.forEach((doc) => {
          data.push({ ...doc.data(), id: doc.id });
        });
        setWritingData([...data]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        alert(error.message);
        setIsLoading(false);
      });
  }, [setIsLoading, institution]);

  const validate = () => {
    if (name.trim() === "" && type.trim() === "" && question.trim() === "") {
      return false;
    }
    return true;
  };

  const handleAddModule = (event) => {
    if (!validate()) {
      toast.error("All fields required");
      console.log("Empty Fields");
      return;
    }

    if (role === "admin" || role === "staff") {
      event.preventDefault();
      setIsLoading(true);
      firebase
        .firestore()
        .collection("writing")
        .add({
          addedBy: firebase.auth().currentUser.email,
          name,
          type,
          question,
          institute_id: institution,
          createdAt: firebase.firestore.Timestamp.now(),
          isSummary,
          imageUrl,
        })
        .then(() => {
          toast("Reading Module Added Successfully");
          setIsLoading(false);
          setName("");
          setType("");
          setQuestion("");
          handleFetchWriting();
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
          alert("Error Occured, Refresh Page and Try Again");
        });
    } else {
      alert("You are Unauthorized to add Reading Module");
    }
    setIsLoading(false);
  };

  const deleteWritingModule = (id) => {
    setIsLoading(true);
    firebase
      .firestore()
      .doc(`/writing/${id}`)
      .delete()
      .then(() => {
        setIsLoading(false);
        toast.warning("Listening Module Deleted");
        let data = writingData;
        data = data.filter((item) => item.id !== id);
        setWritingData([...data]);
      });
  };

  useEffect(() => {
    handleFetchWriting();
  }, [handleFetchWriting]);

  if (isLoading) {
    return <LoadingScreen text="Loading Writing Data" />;
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
                <th>Topic</th>
                <th>Added By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {writingData.length ? (
                writingData.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.type}</td>
                      <td>{item.name}</td>
                      <td>{item.question}</td>
                      <td>{item.addedBy}</td>
                      <td className="d-flex flex-row justify-content-center align-items-center">
                        <Button
                          variant="danger"
                          onClick={() => deleteWritingModule(item.id)}
                        >
                          <i className="fa fa-trash"></i>
                        </Button>
                        <Button
                          className="ml-2"
                          variant="primary"
                          onClick={() => {
                            history.push(`/stats/writing/${item.id}`);
                          }}
                        >
                          <i className="fa fa-info"></i>
                        </Button>
                        {/* 
                        <MyVerticallyCenteredModal
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
          <h3 className="m-5">Add Writing Module</h3>
          <Form className="w-100">
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

            <Form.Group>
              <Form.Label>Select Type</Form.Label>
              <Form.Control
                required
                as="select"
                value={type}
                onChange={(event) => {
                  if (event.target.value === "summary") {
                    setIsSummary(true);
                  } else {
                    setIsSummary(false);
                  }
                  setType(event.target.value);
                }}
              >
                <option value="" disabled>
                  Select Type
                </option>
                <option value="letter">Letter</option>
                <option value="summary">150 Words Summary</option>
                <option value="essay">Essay</option>
              </Form.Control>
            </Form.Group>

            {isSummary && (
              <Form.Group>
                <Form.Label>Select Image</Form.Label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={(event) => {
                    if (
                      event.target.files[0] &&
                      (event.target.files[0].type === "image/jpeg" ||
                        event.target.files[0].type === "image/png" ||
                        event.target.files[0].type === "image/jpg" ||
                        event.target.files[0].type === "image/gif")
                    ) {
                      setSelectedFile(event.target.files[0]);
                    } else {
                      alert("Please Select Valid Image File");
                      setSelectedFile(null);
                    }
                  }}
                />
                <div className="mt-3 mb-3">
                  {isUploading && <ProgressBar now={percentage} />}
                  {isUploading ? (
                    <p>Uploading Please Wait.. ({percentage}%)</p>
                  ) : (
                    <p></p>
                  )}
                  {isUploadingCompleted && <p>Upload Complete</p>}
                  {errorText && <p className="red-text">{errorText}</p>}
                  {imageUrl && (
                    <p className="mt-3">
                      Image is Uploaded to{" "}
                      <a className="uploadLink" href={imageUrl}>
                        {imageUrl}
                      </a>
                    </p>
                  )}
                </div>
                <Button
                  className="mt-3"
                  disabled={!selectedFile}
                  variant="outline-info"
                  onClick={() => {
                    uploadFileToStorage();
                  }}
                >
                  Upload Image File
                </Button>
              </Form.Group>
            )}

            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label style={{ textTransform: "capitalize" }}>
                Enter Question {"for " + type} :
              </Form.Label>
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
                  setQuestion(data);
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
                required
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
              /> */}
            </Form.Group>
            <Button
              type="submit"
              className="mt-5 mb-5 center"
              variant="outline-info"
              onClick={handleAddModule}
            >
              Add Writing Module
            </Button>
          </Form>
        </Col>
      </Row>
      <ToastContainer autoClose={3000} />
    </Conatiner>
  );
};

export default Writing;
