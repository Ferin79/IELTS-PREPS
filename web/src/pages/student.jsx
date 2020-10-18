import React, { useContext, useState, useEffect, useCallback } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import { Context } from "../data/context";
import { ToastContainer, toast } from "react-toastify";
import firebase from "../data/firebase";
import { useHistory } from "react-router-dom";

const Student = () => {
  const history = useHistory();

  const { institution, role } = useContext(Context);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [studentDataList, setStudentDataList] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);

  const handleStudentAdd = async (event) => {
    event.preventDefault();
    if (role.length === 0) {
      alert("Please Re-Login to add Staff");
      return;
    }
    if (email.length === 0) {
      toast.error("Email cannot be empty");
      return;
    } else if (password.length === 0) {
      toast.error("Password cannot be empty");
      return;
    } else if (firstname.length === 0) {
      toast.error("First Name cannot be empty");
      return;
    } else if (lastname.length === 0) {
      toast.error("Last Name cannot be empty");
      return;
    } else if (repeatPassword.length === 0) {
      toast.error("Repeat Password cannot be empty");
      return;
    } else if (repeatPassword !== password) {
      toast.error("Password Did not match");
      return;
    } else {
      setIsFormLoading(true);
      const response = await fetch(
        "https://us-central1-ielts-preps.cloudfunctions.net/api/register",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({
            firstname,
            lastname,
            email,
            password,
            repeatPassword,
            role: "student",
            institute_id: institution,
            photoUrl:
              "https://firebasestorage.googleapis.com/v0/b/ielts-preps.appspot.com/o/person.png?alt=media",
          }),
        }
      );
      const responseData = await response.json();
      console.log(responseData);
      if (responseData.success) {
        fetchStudent();
        setFirstname("");
        setLastname("");
        setEmail("");
        setPassword("");
        setRepeatPassword("");
        toast("Student Added Successfully");
      } else {
        setIsFormLoading(false);
        toast.error(responseData.error);
      }
    }
    setIsFormLoading(false);
  };

  const fetchStudent = useCallback(() => {
    if (role === "student") {
      return;
    }
    setIsTableLoading(true);
    firebase
      .firestore()
      .collection("users")
      .where("institute_id", "==", institution)
      .where("isStudent", "==", true)
      .get()
      .then((docs) => {
        const studentData = [];
        const staffData = [];
        docs.forEach((doc) => {
          if (doc.data().isStudent) {
            studentData.push(doc.data());
          }
        });
        console.log(studentData, staffData);
        setStudentDataList([...studentData]);
        setIsTableLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsTableLoading(false);
        alert(error);
      });
  }, [institution, setIsTableLoading, role]);

  const handleStaffDelete = async (email, userId) => {
    setIsTableLoading(true);
    const token = await firebase.auth().currentUser.getIdToken();
    const response = await fetch(
      "https://us-central1-ielts-preps.cloudfunctions.net/api/delete-member",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          deleteEmail: email,
          deleteUserId: userId,
          deleteUserType: "student",
        }),
      }
    );
    const responseData = await response.json();
    console.log(responseData);
    if (responseData.success) {
      let dataFilter = studentDataList;
      dataFilter = dataFilter.filter((item) => {
        return item.userId !== userId;
      });
      setStudentDataList([...dataFilter]);
      toast.warning("User Deleted");
    }
    setIsTableLoading(false);
  };

  useEffect(() => {
    fetchStudent();
  }, [fetchStudent]);

  if (role === "admin" || role === "staff") {
    return (
      <Container fluid>
        <Row className="m-5"></Row>
        <Row>
          <Col
            lg="auto"
            xl="6"
            md="12"
            sm
            className="overflow-auto"
            style={{ height: "50vh" }}
          >
            {isTableLoading ? (
              <Spinner animation="border" variant="primary" />
            ) : (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {studentDataList.length > 0 ? (
                    studentDataList.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.firstname}</td>
                          <td>{item.lastname}</td>
                          <td>{item.email}</td>
                          <td>
                            <Button
                              className="mr-3"
                              variant="info"
                              onClick={() =>
                                history.push(`/students/${item.email}`)
                              }
                            >
                              <i className="fa fa-info"></i>
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() =>
                                handleStaffDelete(item.email, item.userId)
                              }
                            >
                              <i className="fa fa-trash"></i>
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <p>No Data To Show</p>
                  )}
                </tbody>
              </Table>
            )}
          </Col>
          <Col
            lg="auto"
            xl="6"
            md="12"
            sm
            className="d-flex flex-column justify-content-center align-items-center "
            style={{ border: "1px solid black" }}
          >
            <h3 className="m-3">Add Student</h3>
            <Form>
              <Form.Row>
                <Form.Group controlId="formBasicEmail" className="mr-5">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter First Name"
                    value={firstname}
                    onChange={(event) => setFirstname(event.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Last Name"
                    onChange={(event) => setLastname(event.target.value)}
                    value={lastname}
                  />
                </Form.Group>
              </Form.Row>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="Email"
                  placeholder="Enter Email"
                  onChange={(event) => setEmail(event.target.value)}
                  value={email}
                />
              </Form.Group>
              <Form.Row>
                <Form.Group controlId="formBasicEmail" className="mr-5">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter Password"
                    onChange={(event) => setPassword(event.target.value)}
                    value={password}
                  />
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Repeat Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    onChange={(event) => setRepeatPassword(event.target.value)}
                    value={repeatPassword}
                  />
                </Form.Group>
              </Form.Row>
            </Form>
            {isFormLoading ? (
              <Spinner animation="border" variant="primary" />
            ) : (
              <Button
                variant="primary"
                type="submit"
                className="m-2"
                onClick={handleStudentAdd}
              >
                Add Student
              </Button>
            )}
          </Col>
        </Row>
        <ToastContainer autoClose={3000} />
      </Container>
    );
  } else {
    return (
      <Container fluid>
        <Row className="m-5">
          <Col className="d-flex flex-column justify-content-center align-items-center">
            <h5>You are Not supposed to be Here</h5>
          </Col>
        </Row>
      </Container>
    );
  }
};
export default Student;
