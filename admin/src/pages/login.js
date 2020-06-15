import React, { useState, useContext } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Context } from "../data/context";
import LoadingScreen from "../components/LoadingScreen";
import { useHistory } from "react-router-dom";
import firebase from "../data/firebase";

const Login = () => {
  const history = useHistory();
  const { isLoading, setIsLoading, setToken, setIsLogin } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");

  const handleSubmitLogin = async (event) => {
    event.preventDefault();

    setErrorText("");
    if (email.trim() === "") {
      setErrorText("Email cannot be empty");
    } else if (password.trim() === "") {
      setErrorText("Password cannot be empty");
    } else {
      setIsLoading(true);
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((res) => {
          const userEmail = res.user.email;
          firebase
            .firestore()
            .collection(`users`)
            .doc(userEmail)
            .get()
            .then(async (snapshot) => {
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

              const token = await firebase.auth().currentUser.getIdToken();

              const cred = {
                token: token,
                role,
                institute_id: snapshot.data().institute_id,
              };
              if (!(role === "student")) {
                localStorage.setItem("credentials", JSON.stringify(cred));
                setIsLoading(false);
                setToken(token);
                setIsLogin(true);
                history.push("/");
              } else {
                setErrorText("Students Cannot Login Here....");
              }
            });
        })
        .catch((error) => {
          console.log(error.message);
          setIsLoading(false);
          setErrorText(error.message);
          setToken(null);
          setIsLogin(false);
        });
    }
  };

  if (isLoading) {
    return <LoadingScreen text="Signing in, Please Wait." />;
  }

  return (
    <Container>
      <Row className="d-flex justify-content-center align-items-center m-5">
        <Col xl="6" lg={true}>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(event) => setEmail(event.target.value)}
              />
            </Form.Group>
          </Form>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </Form.Group>

          <Form.Text className="text-muted mt-1 mb-2 ">
            <h6 className="text-danger">
              {!errorText.length ? "" : `*${errorText}`}
            </h6>
          </Form.Text>

          <Button variant="primary" type="submit" onClick={handleSubmitLogin}>
            Login
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
