import React, { useState, useContext } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Context } from "../data/context";
import LoadingScreen from "../components/LoadingScreen";
import { useHistory } from "react-router-dom";

const Login = () => {
  const history = useHistory();
  const { isLoading, setIsLoading, setToken, setIsLogin } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");

  const handleSubmitLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorText("");
    if (email.trim() === "") {
      setErrorText("Email cannot be empty");
    } else if (password.trim() === "") {
      setErrorText("Password cannot be empty");
    } else {
      const response = await fetch(
        "https://us-central1-ielts-preps.cloudfunctions.net/api/login",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );
      const responseData = await response.json();
      console.log(responseData);
      if (responseData.success) {
        const cred = {
          token: responseData.token,
          role: responseData.role,
          institute_id: responseData.institute_id,
        };
        if (!(responseData.role === "student")) {
          localStorage.setItem("credentials", JSON.stringify(cred));
          setIsLoading(false);
          setToken(responseData.token);
          setIsLogin(true);
          history.push("/");
        } else {
          setErrorText("Students Cannot Login Here....");
        }
      } else {
        setIsLoading(false);
        setErrorText(responseData.error);
      }
    }
    setIsLoading(false);
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
