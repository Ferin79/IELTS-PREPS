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
import { useHistory } from "react-router-dom";
import firebase from "../data/firebase";

const Staff = () => {
  const history = useHistory();

  const { institution, role } = useContext(Context);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [staffDataList, setStaffDataList] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);

  const handleStaffAdd = async (event) => {
    event.preventDefault();

    if (role.length === 0) {
      toast.error("Please Re-Login to add Staff");
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
            role: "staff",
            institute_id: institution,
            photoUrl:
              "https://firebasestorage.googleapis.com/v0/b/ielts-preps.appspot.com/o/person.png?alt=media",
          }),
        }
      );
      const responseData = await response.json();
      if (responseData.success) {
        fetchStaff();
        setFirstname("");
        setLastname("");
        setEmail("");
        setPassword("");
        setRepeatPassword("");
        toast("Staff Added Successfully");
      } else {
        setIsFormLoading(false);
        toast.error(responseData.error);
      }
    }
    setIsFormLoading(false);
  };
  const fetchStaff = useCallback(() => {
    if (role !== "admin") {
      return;
    }
    setIsTableLoading(true);
    firebase
      .firestore()
      .collection("users")
      .where("institute_id", "==", institution)
      .where("isStaff", "==", true)
      .get()
      .then((docs) => {
        const staffData = [];
        docs.forEach((doc) => {
          staffData.push(doc.data());
        });
        setStaffDataList([...staffData]);
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
          deleteUserType: "staff",
        }),
      }
    );
    const responseData = await response.json();
    if (responseData.success) {
      let dataFilter = staffDataList;
      dataFilter = dataFilter.filter((item) => {
        return item.userId !== userId;
      });
      setStaffDataList([...dataFilter]);
      toast.warning("User Deleted");
    }
    setIsTableLoading(false);
  };

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  if (role === "admin") {
    return (
      <Container fluid>
        <Row className="m-5"></Row>
        <Row>
          <Col
            lg="auto"
            xl="6"
            md="12"
            sm
            className=" overflow-auto"
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
                  {staffDataList.length > 0 ? (
                    staffDataList.map((item, index) => {
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
                                history.push(`/edit/staff/${item.email}`)
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
            className="d-flex flex-column justify-content-center align-items-center"
            style={{ border: "1px solid black" }}
          >
            <h3 className="m-3">Add Staff</h3>
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
                    value={lastname}
                    onChange={(event) => setLastname(event.target.value)}
                  />
                </Form.Group>
              </Form.Row>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="Email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </Form.Group>
              <Form.Row>
                <Form.Group controlId="formBasicEmail" className="mr-5">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Repeat Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    value={repeatPassword}
                    onChange={(event) => setRepeatPassword(event.target.value)}
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
                onClick={handleStaffAdd}
              >
                Add Staff
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
export default Staff;
