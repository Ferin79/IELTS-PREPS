import React, { useContext, useState, useEffect, useCallback } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Context } from "../data/context";
import LoadingScreen from "../components/LoadingScreen";
import { ToastContainer, toast } from "react-toastify";
import firebase from "../data/firebase";
import "react-toastify/dist/ReactToastify.css";
import Dropdown from "react-bootstrap/Dropdown";


const Student = () => {
  const { isLoading, institution, role, setIsLoading } = useContext(Context);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [studentDataList, setStudentDataList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [underStaff, setUnderStaff] = useState(null);

  const handleStudentAdd = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorText("");
    if (role.length === 0) {
      alert("Please Re-Login to add Staff");
    }
    if (email.length === 0) {
      setErrorText("Email cannot be empty");
    } else if (password.length === 0) {
      setErrorText("Password cannot be empty");
    } else if (firstname.length === 0) {
      setErrorText("First Name cannot be empty");
    } else if (lastname.length === 0) {
      setErrorText("Last Name cannot be empty");
    } else if (repeatPassword.length === 0) {
      setErrorText("Repeat Password cannot be empty");
    } else if (repeatPassword !== password) {
      setErrorText("Password Did not match");
    } else if (!underStaff) {
      setErrorText("Select Under Staff");
    } else {
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
            underStaff: underStaff,
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
        setIsLoading(false);
        setErrorText(responseData.error);
      }
    }
    setIsLoading(false);
  };

  const fetchStudent = useCallback(() => {
    if (role === "student") {
      return;
    }
    setIsLoading(true);
    firebase
      .firestore()
      .collection("users")
      .where("institute_id", "==", institution)
      .get()
      .then((docs) => {        
        const studentData = [];
        const staffData = [];
        docs.forEach((doc) => {
          if (doc.data().isStudent) {            
            studentData.push(doc.data());
          }else if (doc.data().isStaff) {
            staffData.push(doc.data());  
          }
        });
        console.log(studentData, staffData);
        setStudentDataList([...studentData]);
        setStaffList([...staffData]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        alert(error);
      });
  }, [institution, setIsLoading, role]);

  const handleStaffDelete = async (email, userId) => {
    setIsLoading(true);
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
    setIsLoading(false);
  };

  useEffect(() => {
    fetchStudent();
  }, [fetchStudent]);

  if (isLoading) {
    return <LoadingScreen text="Loading Students Details" />;
  }
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
                  <div>
                    <h3>No Data To Show</h3>
                  </div>
                )}
              </tbody>
            </Table>
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
                    onChange={(event) => setFirstname(event.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Last Name"
                    onChange={(event) => setLastname(event.target.value)}
                  />
                </Form.Group>
              </Form.Row>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="Email"
                  placeholder="Enter Email"
                  onChange={(event) => setEmail(event.target.value)}
                />
              </Form.Group>
              <Form.Row>
                <Form.Group controlId="formBasicEmail" className="mr-5">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter Password"
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Repeat Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    onChange={(event) => setRepeatPassword(event.target.value)}
                  />
                </Form.Group>
              </Form.Row>
              

              {/* Under Staff */}
                <Form.Label>Under Staff</Form.Label>
               
                <Dropdown onSelect={(email) => {
                  staffList.forEach(staff => {
                    if(staff.email === email){
                      setUnderStaff(staff);                
                      console.log(staff.email);                    
                    }
                  });
                }}>
                  <Dropdown.Toggle
                    variant="outline-dark"
                    id="dropdown-basic">
                    {underStaff ? underStaff.email  : "Select"}                  
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {staffList.map((staff, index) => {
                      // if(staff == underStaff){
                      //   return (
                      //     <Dropdown.Item key={index} eventKey={staff.email} active>
                      //     <p className="dropdownData">                   
                      //       {staff.firstname}
                      //     </p>
                      //   </Dropdown.Item>
                      // );
                      // }else{
                        return (
                          <Dropdown.Item key={index} eventKey={staff.email}>
                            <p className="dropdownData">                   
                              {staff.firstname}
                            </p>
                        </Dropdown.Item>
                        );
                      // }
                    })}
                  </Dropdown.Menu>
                </Dropdown>

              <Form.Text className="text-muted mt-1 mb-2 ">
                <h6 className="text-danger">
                  {!errorText.length ? "" : `*${errorText}`}
                </h6>
              </Form.Text>

            </Form>
            <Button
              variant="primary"
              type="submit"
              className="m-2"
              onClick={handleStudentAdd}
            >
              Add Student
            </Button>
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
