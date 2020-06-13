import React, { useState } from "react";
import Conatiner from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import firebase from "../data/firebase";
import ProgressBar from "react-bootstrap/ProgressBar";

const Listening = () => {
  const [isMp4, setisMp4] = useState(null);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadPercentage, setUploadPercentage] = useState("0");
  const [isUploading, setIsUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [uploadError, setUploadError] = useState("");

  const uploadFileToStorage = () => {
    setIsUploading(true);
    var storageRef = firebase.storage().ref();

    var uploadTask = storageRef.child(`${Date.now()}`).put(selectedFile);

    uploadTask.on(
      "state_changed",
      function (snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadPercentage(progress);
        console.log("Upload is " + progress + "% done");
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
        setIsFileUploaded(false);
        setUploadError(error);
        setBtnDisabled(true);
        setSelectedFile(null);
        setVideoUrl(null);
        setIsFileUploaded(null);
      },
      function () {
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          console.log("File available at", downloadURL);
          setVideoUrl(downloadURL);
          setBtnDisabled(true);
          setSelectedFile(null);
          setIsFileUploaded(true);
        });
      }
    );
  };
  return (
    <Conatiner fluid>
      <Row className="m-5">
        <Col
          lg="auto"
          sm="12"
          md="6"
          xl="6"
          className="d-flex justify-content-center align-items-center"
        >
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Audio/Video</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Mark</td>
              </tr>
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
            <Form.Check
              type="switch"
              id="custom-switch"
              label="Video File"
              onChange={(event) => {
                if (isMp4 === null) {
                  console.log(!!event.target.value);
                  setisMp4(!!event.target.value);
                } else {
                  console.log("From Else " + !isMp4);
                  setisMp4((isMp4) => !isMp4);
                }
              }}
            />
            <div className="mt-3 mb-3">
              <Form.File id="formcheck-api-regular">
                <Form.File.Label>
                  Select {isMp4 ? "Mp4" : "Mp3"} File
                </Form.File.Label>
                <br />
                <input
                  type="file"
                  accept={
                    isMp4
                      ? "video/mp4,video/x-m4v,video/*"
                      : "audio/mp3, audio/*"
                  }
                  onChange={(event) => {
                    if (isMp4) {
                      if (event.target.files[0].type === "video/mp4") {
                        setBtnDisabled(false);
                        setSelectedFile(event.target.files[0]);
                      } else {
                        setBtnDisabled(true);
                        setSelectedFile(null);
                        alert("Invalid File Selected. Please Select Mp4 File");
                      }
                    } else {
                      if (event.target.files[0].type === "audio/mp3") {
                        setBtnDisabled(false);
                        setSelectedFile(event.target.files[0]);
                      } else {
                        setBtnDisabled(true);
                        setSelectedFile(null);
                        alert("Invalid File Selected. Please Select Mp3 File");
                      }
                    }
                  }}
                />
              </Form.File>
            </div>
            <Button
              disabled={btnDisabled && selectedFile == null}
              variant="outline-info"
              className="mt-3 mb-3"
              onClick={uploadFileToStorage}
            >
              Upload File
            </Button>
            {isUploading && <ProgressBar now={uploadPercentage} />}
            {isUploading ? (
              <p>
                Uploading.... Please Wait.{" "}
                {`(${Math.round(parseInt(uploadPercentage))}%)`}
              </p>
            ) : (
              <p></p>
            )}
            {uploadError && (
              <p className="text-danger">
                Upload error. Please Refresh the page and Try again.
              </p>
            )}
            {isFileUploaded && <p>Complete</p>}
          </Form>

          <Button disabled={!isFileUploaded} className="mt-5 mb-5">
            Add Listening Module
          </Button>
        </Col>
      </Row>
    </Conatiner>
  );
};

export default Listening;
