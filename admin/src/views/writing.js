import React, { useContext, useState, useCallback, useEffect } from "react";
import Conatiner from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import firebase from "../data/firebase";
import { Context } from "../data/context";
import LoadingScreen from "../components/LoadingScreen";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Writing = () => {
  const { isLoading, setIsLoading, role, institution } = useContext(Context);

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [question, setQuestion] = useState("");

  const [writingData, setWritingData] = useState([]);

  const handleFetchWriting = useCallback(() => {
    setIsLoading(true);
    firebase
      .firestore()
      .collection("writing")
      .where("institute_id", "==", institution)
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
    if (name.trim() === ""  
      && type.trim() === "" 
      && question.trim() === "") 
    {
        return false;
    }
    return true;
  }

  const handleAddModule = (event) => {

    if ( !validate() ) {
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
                      <td>
                        <Button
                          variant="danger"
                          onClick={() => deleteWritingModule(item.id)}
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
                onChange={(event) => setType(event.target.value)}
              >
                <option value="" disabled>
                  Select Type
                </option>
                <option value="letter">Letter</option>
                <option value="summary">150 Words Summary</option>
                <option value="essay">Essay</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label style={{ textTransform: "capitalize" }}>
                Enter Question {"for " + type} :
              </Form.Label>
              <Form.Control
                as="textarea"
                rows="10"
                cols="10"
                required
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
              />
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
