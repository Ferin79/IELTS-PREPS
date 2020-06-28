import React, { useEffect, useState, useContext } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import firebase from "../data/firebase";
import { Context } from "../data/context";

const CheckWriting = () => {
  const { institution } = useContext(Context);
  const [writingData, setWritingData] = useState([]);

  useEffect(() => {
    firebase
      .firestore()
      .collection("writingUser")
      .where("institute_id", "==", institution)
      .where("isChecked", "==", false)
      .get()
      .then((docs) => {
        const data = [];
        docs.forEach((doc) => {
          data.push(doc.data());
        });
        setWritingData([...data]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [institution]);

  return (
    <Container>
      <Row>
        <Col
          lg="auto"
          sm="12"
          md="6"
          xl="6"
          className="d-flex justify-content-center align-items-flex-start"
        >
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {writingData.length ? (
                writingData.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.type}</td>
                      <td>{item.email}</td>
                      <td>
                        <Button variant="outline-info">
                          <i className="fa fa-info"></i>
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <p>No Data to Show</p>
              )}
            </tbody>
          </Table>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
};

export default CheckWriting;
