import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
const Home = () => {
  return (
    <Container fluid>
      <Row className="m-5">
        <Col
          lg="auto"
          md="6"
          sm="12"
          xl="6"
          className="d-flex flex-column justify-content-center align-items-flex-start"
        >
          <p style={{ fontSize: 50 }}>Around The World</p>
          <br />
          <p style={{ fontSize: 25 }}>Fly High In your Dreams</p>
        </Col>
        <Col
          lg="auto"
          md="6"
          sm="12"
          xl="6"
          className="d-flex justify-content-center align-items-center"
        >
          <img
            src={require("../images/world .png")}
            alt="Around the World"
            className="img-fluid"
          />
        </Col>
      </Row>
    </Container>
  );
};
export default Home;
