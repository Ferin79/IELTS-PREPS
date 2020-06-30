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
import FormText from "react-bootstrap/FormText";

const CheckWriting = () => {
  const { institution } = useContext(Context);
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
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Provide Test Score
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form  onSubmit={(e) => giveScore(e)}>
            <Form.Label>Band</Form.Label>
              <Form.Control
                required
                type="text"
                name='band'
                max={10}
                min={0}
              />
            <Form.Label>Note</Form.Label>
              <Form.Control
                required
                type="text"
                name='note'
                maxLength={100}
              />
              <div class="mt-3"> 
                <Button type="submit" value="submit">Submit</Button> 
                <button class="btn btn-danger ml-3" onClick={props.onHide}>Close</button>                    
              </div>              
            </Form>
        </Modal.Body>
        <Modal.Footer>
          
        </Modal.Footer>
      </Modal>
    );
  };


  const giveScore = (e) => {    
    e.preventDefault();
    const band = e.target.band.value ;    
    const note = e.target.note.value ;    
    if(band > 10 || band < 0) {
      toast.error("Band should be between 0 and 9")
      return;
    }
    console.log(attemptedExamId); 
    console.log(band);
    console.log(note);        
    firebase.firestore().collection("writingUser").doc(`${attemptedExamId}`)
      .update({
        isChecked: true,
        band: band, 
        note: note
      })
      .then(() => {
        toast("Score Updated");
        setModalShow(false);
      }).catch(() => {
        toast.error("Error, try again");
      }); 

  }

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
          data.push({...doc.data(), id: doc.id});
        });
        setWritingData([...data]);        
      })
      .catch((error) => {
        console.log(error);
      });
  }, [institution]);

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
                        <a class="mr-3" href={item.pdfUrl} target="_blank">
                          <Button variant="outline-info">
                            View
                          </Button>
                        </a>
                        <Button variant="outline-info" onClick={()=>{
                          setAttemptedExamId(item.id)                          
                          setModalShow(true)                          
                          }}>
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
