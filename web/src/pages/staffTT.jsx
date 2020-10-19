import React, { useState, useEffect } from "react";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Table from "react-bootstrap/esm/Table";
import { ToastContainer, toast } from "react-toastify";
import firebase from "../data/firebase";

const StaffTimeTable = () => {
  const [timetable, setTimetable] = useState([]);
  const [timeslotes, setTimeslotes] = useState([]);

  useEffect(() => {
    firebase
      .firestore()
      .doc(`/timetable/${firebase.auth().currentUser.uid}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setTimetable([...doc.data().timeSlotes]);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });

    firebase
      .firestore()
      .doc(`/timeslotes/1`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          const pushData = Object.values(data);
          setTimeslotes([...pushData]);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  }, []);

  return (
    <Container>
      <Row className="m-5">
        <Col>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Time Slotes</th>
                <th>Student Name</th>
              </tr>
            </thead>
            <tbody>
              {timeslotes.length && timetable.length ? (
                timeslotes.map((item, index) => {
                  return (
                    <tr key={index + 1}>
                      <td>{index + 1}.</td>
                      <td>{item}</td>
                      <td>
                        {timetable[index].student === null ? (
                          ""
                        ) : (
                          <p>
                            {timetable[index].student.firstname}{" "}
                            {timetable[index].student.lastname}
                          </p>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <span></span>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  );
};

export default StaffTimeTable;
