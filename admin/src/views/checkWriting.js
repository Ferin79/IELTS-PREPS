import React, { useEffect, useState, useContext } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import firebase from "../data/firebase";
import { Context } from "../data/context";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import LoadingScreen from "../components/LoadingScreen";

const CheckWriting = () => {
  const { isLoading, setIsLoading, institution } = useContext(Context);

  const [writingData, setWritingData] = useState([]);

  // Modal
  const [modalShow, setModalShow] = useState(false);
  const [attemptedExamId, setAttemptedExamId] = useState(null);
  // const [band, setBand] = useState(null);
  // const [note, setNote] = useState(null);
  const MyVerticallyCenteredModal = (props) => {
    return (
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Provide Test Score
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => giveScore(e)}>
            <Form.Label>Band</Form.Label>
            <Form.Control required type="text" name="band" max={10} min={0} />
            <Form.Label>Note</Form.Label>
            <Form.Control required type="text" name="note" maxLength={100} />

            <Form.Label>PDF</Form.Label>
            <Form.File required name="pdf" accept="application/pdf" />
            <div class="mt-3">
              <Button type="submit" value="submit">
                Submit
              </Button>
              <button class="btn btn-danger ml-3" onClick={props.onHide}>
                Close
              </button>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    );
  };

  const giveScore = (e) => {
    e.preventDefault();
    const band = e.target.band.value;
    const note = e.target.note.value;
    const file = e.target.pdf.files[0];
    console.log(file);
    if (band > 10 || band < 0) {
      toast.error("Band should be between 0 and 9");
      return;
    }
    console.log(attemptedExamId);
    console.log(band);
    console.log(note);

    setModalShow(false);
    setIsLoading(true);

    const uploadTask = firebase
      .storage()
      .ref(`${institution}/CheckedWriting`)
      .child(`${firebase.auth().currentUser.email}_${attemptedExamId}`);

    uploadTask.put(file).on(
      "state_changed",
      function (snapshot) {
        switch (snapshot.state) {
          case firebase.storage.TaskState.RUNNING:
            console.log("Upload running");
            break;
          default:
            break;
        }
      },
      function (error) {
        console.log(error);
      },
      function () {
        uploadTask.getDownloadURL().then((url) => {
          firebase
            .firestore()
            .collection("writingUser")
            .doc(`${attemptedExamId}`)
            .update({
              isChecked: true,
              band: band,
              note: note,
              checkedFile: url,
            })
            .then(() => {
              setIsLoading(false);
              toast("Score uploaded.");
            })
            .catch(() => {
              toast.error("Error, try again");
            });
        });
      }
    );
  };

  useEffect(() => {
    firebase
      .firestore()
      .collection("writingUser")
      .where("institute_id", "==", institution)
      .where("isChecked", "==", false)
      .get()
      .then((docs) => {
        const data = [];
        docs.forEach((doc) => {
          data.push({ ...doc.data(), id: doc.id });
        });
        setWritingData([...data]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [institution]);

  if (isLoading) {
    return <LoadingScreen text="Uploading checked file..." />;
  }

  return (
    <Container>
      <Row>
        <Col
          lg="auto"
          sm="12"
          md="12"
          xl="12"
          className="d-flex justify-content-center align-items-flex-start"
        >
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Email</th>
                <th>Checked</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {writingData.length ? (
                writingData.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.type}</td>
                      <td>{item.email}</td>
                      <td>{item.isChecked ? "Yes" : "No"}</td>
                      <td>
                        <a
                          class="mr-3"
                          href={item.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline-info">View</Button>
                        </a>
                        <Button
                          variant="outline-info"
                          onClick={() => {
                            setAttemptedExamId(item.id);
                            setModalShow(true);
                          }}
                        >
                          Score
                        </Button>
                      </td>
                      <MyVerticallyCenteredModal
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                      />
                    </tr>
                  );
                })
              ) : (
                <p>No Data to Show</p>
              )}
            </tbody>
          </Table>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
};

export default CheckWriting;
