import React, { useContext, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { AuthContext } from "../context/auth";
import firebase from "../context/firebase";

const Login = () => {
  const { setIsProfessor } = useContext(AuthContext);

  const [errorText, setErrorText] = useState("");
  const [isComponentLoading, setIsComponentLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmitLogin = (event) => {
    setErrorText("");
    setIsComponentLoading(true);
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    if (email.trim() === "") {
      setErrorText("Email Cannot be Empty");
      return;
    }
    if (password.trim() === "") {
      setErrorText("Password Cannot be Empty");
      return;
    }
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((data) => {
        firebase
          .firestore()
          .doc(`/users/${data.user.email}`)
          .get()
          .then((data) => {
            if (data.data().isAdmin) {
              setIsProfessor(true);
            } else if (data.data().isStaff) {
              setIsProfessor(true);
            } else {
              setIsProfessor(false);
            }
            var role = "";
            if (data.data().isStudent) {
              role = "student";
            }
            if (data.data().isAdmin) {
              role = "admin";
            }
            if (data.data().isStaff) {
              role = "staff";
            }
            localStorage.setItem(
              "userInfo",
              JSON.stringify({
                role,
                institute_id: data.data().institute_id,
              })
            );
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => {
        setErrorText(error.message);
      })
      .finally(() => {
        setIsComponentLoading(false);
      });
  };

  return (
    <Container>
      <Row className="d-flex justify-content-center align-items-center m-5">
        <Col xl="6" lg={true}>
          <Form onSubmit={handleSubmitLogin}>
            <Form.Group controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            {errorText && <p className="text-danger">* {errorText}</p>}
            {isComponentLoading ? (
              <Spinner animation="border" variant="primary" />
            ) : (
              <Button variant="primary" type="submit">
                Login
              </Button>
            )}
          </Form>
          <p
            className="addHover mt-3"
            onClick={() => {
              if (email.trim() === "") {
                setErrorText("Enter email to send password reset link.");
                return;
              }
              firebase
                .auth()
                .sendPasswordResetEmail(email)
                .then(() => alert("Password reset Link send successfully."))
                .catch((error) => alert(error.message));
            }}
          >
            Forgot Password ?
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
