import React, { useState, useContext } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import { ToastContainer, toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import firebase from "../data/firebase";
import { Context } from "../data/context";

const Login = () => {
  const { setInstitution, setRole } = useContext(Context);

  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (email.trim() === "") {
      toast.error("Please Enter Email");
      return;
    }
    if (password.trim() === "") {
      toast.error("Please Enter Password");
      return;
    }
    setIsLoading(true);

    firebase
      .firestore()
      .doc(`/users/${email}`)
      .get()
      .then(async (snapshot) => {
        if (!snapshot.exists) {
          toast.error("User Not Found");
          setIsLoading(false);
          return;
        }
        var role = "";
        if (snapshot.data().isStudent) {
          role = "student";
        }
        if (snapshot.data().isAdmin) {
          role = "admin";
        }
        if (snapshot.data().isStaff) {
          role = "staff";
        }
        setInstitution(snapshot.data().institute_id);
        setRole(role);
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            role,
            institute_id: snapshot.data().institute_id,
          })
        );
        firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then((user) => {
            console.log(user);
            setIsLoading(false);
            history.push("/");
          });
      })
      .catch((error) => {
        console.log(error.message);
        setIsLoading(false);
        toast.error(error.message);
        setInstitution(null);
        setRole(null);
      });
  };

  return (
    <Container>
      <Row className="m-5">
        <Col>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Form.Group>
            {isLoading ? (
              <Spinner animation="border" variant="primary" />
            ) : (
              <Button variant="primary" type="submit" onClick={handleLogin}>
                Submit
              </Button>
            )}
          </Form>
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  );
};

export default Login;
