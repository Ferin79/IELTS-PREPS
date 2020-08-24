import React, { useContext } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { AuthContext } from "../context/auth";
import { useHistory } from "react-router-dom";

const Login = () => {
  const history = useHistory();
  const { isProfessor } = useContext(
    AuthContext
  );

  const handleSubmitLogin = (event) => {
    event.preventDefault();
    const email = event.target.email.value
    const password = event.target.password.value
  
  };


  return (
    <Container>
      <Row className="d-flex justify-content-center align-items-center m-5">
        <Col xl="6" lg={true}>

          <Form onSubmit={handleSubmitLogin}>
            <Form.Group controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />              
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>            
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>

        </Col>
      </Row>
    </Container>
  );
};

export default Login;
