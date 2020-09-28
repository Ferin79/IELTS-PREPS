import React, { useState, useEffect, useContext } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import { ToastContainer, toast } from "react-toastify";
import firebase from "../data/firebase";
import { Context } from "../data/context";
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";

const Timetable = () => {
  const { institution } = useContext(Context);

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [interval, setInterval] = useState(20);
  const [timeSlotes, setTimeSlotes] = useState([]);
  const [facultyData, setFacultyData] = useState([]);
  const [facultyRow, setFacultyRow] = useState([]);
  const [selectedFacultyId, setSelectedFacultyId] = useState(0);

  function parseTime(s) {
    var c = s.split(":");
    return parseInt(c[0]) * 60 + parseInt(c[1]);
  }

  function convertHours(mins) {
    var hour = Math.floor(mins / 60);
    mins = mins % 60;
    var converted = pad(hour, 2) + ":" + pad(mins, 2);
    return converted;
  }

  function pad(str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
  }

  function calculate_time_slot(start_time, end_time, interval = "30") {
    var i, formatted_time;
    var time_slots = [];
    for (i = start_time; i <= end_time; i = i + interval) {
      formatted_time = convertHours(i);
      time_slots.push(formatted_time);
    }
    return time_slots;
  }

  const handleAddTimeSlot = () => {
    if (startTime === null) {
      toast.error("Select Start Time");
      return;
    }
    if (endTime === null) {
      toast.error("Select End Time");
      return;
    }
    if (interval === 0) {
      toast.error("Interval cannot be zero");
      return;
    }

    var start_time = parseTime(startTime);
    var end_time = parseTime(endTime);
    var times_ara = calculate_time_slot(start_time, end_time, interval);

    setTimeSlotes(times_ara);
    toast("Time Slot Created");
  };

  const handleAddFaculty = () => {
    if (selectedFacultyId === "0" || selectedFacultyId === 0) {
      toast.error("Select Faculty");
      return;
    }
    const data = facultyData.find((item) => item.userId === selectedFacultyId);

    var selectData = facultyData;
    selectData = selectData.filter((item) => item.userId !== selectedFacultyId);
    setFacultyData([...selectData]);

    const data2 = facultyRow;
    data2.push(data);
    setFacultyRow([...data2]);

    setSelectedFacultyId(0);
  };

  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .where("institute_id", "==", institution)
      .where("isStaff", "==", true)
      .get()
      .then((snapshot) => {
        const data = [];
        snapshot.forEach((doc) => {
          data.push(doc.data());
        });

        console.log(data);
        setFacultyData([...data]);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  }, [institution]);

  return (
    <Container>
      <Row className="m-5">
        <Col lg={true} xs={12} md={8} className="border-right">
          <Form.Group>
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              type="time"
              required
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>End Time</Form.Label>
            <Form.Control
              type="time"
              required
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Interval (in Minutes)</Form.Label>
            <Form.Control
              type="number"
              min="1"
              max="60"
              required
              value={interval}
              onChange={(event) => setInterval(event.target.value)}
            />
          </Form.Group>
          <Button type="submit" variant="primary" onClick={handleAddTimeSlot}>
            Add Time Slots
          </Button>
        </Col>

        <Col lg={true} xs={12} md={8}>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Add Faculty</Form.Label>
            <Form.Control
              as="select"
              value={selectedFacultyId}
              onChange={(event) => setSelectedFacultyId(event.target.value)}
            >
              <option value="0" selected disabled>
                Select Faculty
              </option>
              {facultyData.length ? (
                facultyData.map((item, index) => {
                  return (
                    <option key={index} value={item.userId}>
                      {item.firstname} {item.lastname}
                    </option>
                  );
                })
              ) : (
                <option selected disabled>
                  Loading
                </option>
              )}
            </Form.Control>
          </Form.Group>
          <Button type="submit" variant="primary" onClick={handleAddFaculty}>
            Add Faculty
          </Button>
        </Col>
      </Row>

      <Row className="m-5">
        <Col lg={true} xs={12} md={8}>
          {facultyRow.length ? (
            facultyRow.map((item, index) => {
              return (
                <Accordion>
                  <Card key={index}>
                    <Card.Header>
                      <Accordion.Toggle
                        as={Button}
                        variant="link"
                        eventKey={`${index}`}
                      >
                        {item.firstname} {item.lastname}
                      </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey={`${index}`}>
                      <Card.Body>
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Time Slot</th>
                              <th>Student Name</th>
                            </tr>
                          </thead>
                          <tbody>
                            {timeSlotes.length &&
                              timeSlotes.map((item, index) => {
                                return (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item}</td>
                                    <td></td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </Table>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              );
            })
          ) : (
            <p>No Time Table to Show</p>
          )}
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  );
};

export default Timetable;
