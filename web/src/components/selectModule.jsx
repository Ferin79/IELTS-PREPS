import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { useHistory } from "react-router-dom";

const SelectModule = (props) => {
  const email = props.match.params.email;

  const history = useHistory();
  return (
    <Container>
      <Row className="m-5">
        <Col>
          <Card
            style={{ width: "18rem" }}
            className="add-card-hover-effect"
            onClick={() => {
              history.push(`/students/${email}/speaking`);
            }}
          >
            <Card.Body>
              <Card.Title>Speaking</Card.Title>
              <Card.Text>View bands and Progess of {email}.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SelectModule;
