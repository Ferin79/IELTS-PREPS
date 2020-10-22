import React, { useState, useEffect, useContext, useCallback } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import { ToastContainer, toast } from "react-toastify";
import { MdDeleteForever } from "react-icons/md";
import { useHistory } from "react-router-dom";
import firebase from "../data/firebase";
import { Context } from "../data/context";

const Timetable = () => {
  const { institution } = useContext(Context);

  const history = useHistory();

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [interval, setInterval] = useState(20);
  const [timeSlotes, setTimeSlotes] = useState([]);
  const [facultyData, setFacultyData] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [facultyRow, setFacultyRow] = useState([]);
  const [selectedFacultyId, setSelectedFacultyId] = useState(0);
  const [modalShow, setModalShow] = useState(false);
  const [selectedSlotTime, setSelectedSlotTime] = useState(null);
  const [
    selectedFacultyIdForStudentAdd,
    setSelectedFacultyIdForStudentAdd,
  ] = useState(null);
  const [isTimeSlotLoading, setIsTimeSlotLoading] = useState(false);

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
    if (
      window.confirm(
        "By Creating New Time Slots, previous timetable would be deleted. Are you sure ?"
      )
    ) {
      firebase
        .firestore()
        .collection("timetable")
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            doc.ref.delete();
          });
          setFacultyData([]);
          setFacultyRow([]);
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.message);
        });
    } else {
      return;
    }
    if (startTime === "") {
      toast.error("Select Start Time");
      return;
    }
    if (endTime === "") {
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

    firebase
      .firestore()
      .doc("/timeslotes/1")
      .set({ ...times_ara })
      .then(() => {
        toast("Time Slot Created");
        setTimeSlotes(times_ara);
        toast.warn("The Page will be refresh in 5 sec");

        setTimeout(function () {
          history.go(0);
        }, 6000);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  };

  const handleAddFaculty = () => {
    if (!timeSlotes.length) {
      toast.error("Create Time Slot First");
      return;
    }

    const hasData = facultyRow.find(
      (item) => item.userId === selectedFacultyId
    );

    if (hasData) {
      toast.error("Faculty Already Added to Timetable");
      return;
    }

    if (selectedFacultyId === "0" || selectedFacultyId === 0) {
      toast.error("Select Faculty");
      return;
    }
    const data = facultyData.find((item) => item.userId === selectedFacultyId);

    var selectData = facultyData;
    selectData = selectData.filter((item) => item.userId !== selectedFacultyId);
    setFacultyData([...selectData]);

    const data2 = facultyRow;

    data.timeSlotes = [];

    timeSlotes.forEach((item, index) => {
      data.timeSlotes.push({
        id: index,
        startTime: item,
        student: null,
      });
    });
    data2.push(data);
    setFacultyRow([...data2]);

    setSelectedFacultyId(0);
  };

  const handleTimeTableSave = () => {
    facultyRow.forEach((item) => {
      firebase
        .firestore()
        .doc(`/timetable/${item.userId}`)
        .set({ ...item })
        .catch((error) => {
          console.log(error);
          toast.error(error.message);
        });
    });
    toast("Timetable Saved");
  };

  const assignStudentToFaculty = (studentUserId) => {
    const selectedStudentData = studentData.find(
      (item) => item.userId === studentUserId
    );

    const facultyDataRow = facultyRow;

    if (selectedFacultyIdForStudentAdd != null) {
      if (selectedSlotTime != null) {
        facultyDataRow.forEach((item) => {
          if (item.userId === selectedFacultyIdForStudentAdd) {
            item.timeSlotes.forEach((item2) => {
              if (item2.startTime === selectedSlotTime) {
                item2.student = selectedStudentData;
              }
            });
          }
        });

        setSelectedSlotTime(null);
      }

      setFacultyRow([...facultyDataRow]);
      setSelectedFacultyIdForStudentAdd(null);
      setModalShow(false);
    }
  };

  const StudentModal = (props) => {
    return (
      <Modal
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        scrollable
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Select Student
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {studentData.length
                ? studentData.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.firstname}</td>
                        <td>{item.lastname}</td>
                        <td>{item.email}</td>
                        <td>
                          <Button
                            variant="primary"
                            onClick={() => assignStudentToFaculty(item.userId)}
                          >
                            Add
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                : ""}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const fetchUser = useCallback(() => {
    firebase
      .firestore()
      .collection("users")
      .where("institute_id", "==", institution)
      .where("isAdmin", "==", false)
      .get()
      .then((snapshot) => {
        const data = [];
        const data2 = [];
        snapshot.forEach((doc) => {
          if (doc.data().isStaff) {
            data.push(doc.data());
          } else if (doc.data().isStudent) {
            data2.push(doc.data());
          }
        });

        setStudentData([...data2]);
        setFacultyData([...data]);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  }, [institution]);

  const fetchTimeSlotTable = useCallback(() => {
    setIsTimeSlotLoading(true);
    firebase
      .firestore()
      .collection("timetable")
      .get()
      .then((snapshot) => {
        const data = [];
        snapshot.forEach((doc) => {
          data.push(doc.data());
        });

        setFacultyRow([...data]);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });

    firebase
      .firestore()
      .doc("/timeslotes/1")
      .get()
      .then((doc) => {
        const data = doc.data();
        const pushData = Object.values(data);
        setTimeSlotes([...pushData]);
      })
      .catch((error) => {
        console.log(error);
        toast.warn("No Time Slot Found");
      })
      .finally(() => {
        setIsTimeSlotLoading(false);
      });
  }, []);

  const handleDeleteFaculty = (facultyId) => {
    setIsTimeSlotLoading(true);
    firebase
      .firestore()
      .doc(`/timetable/${facultyId}`)
      .delete()
      .then(() => {
        const data = facultyRow.filter((item) => item.userId !== facultyId);
        setFacultyRow([...data]);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      })
      .finally(() => {
        setIsTimeSlotLoading(false);
      });
  };

  const deleteStudentFromSlot = (facultyRowIndex, timeSlotIndex) => {
    console.log(facultyRowIndex);
    console.log(timeSlotIndex);

    const data = facultyRow;

    data[facultyRowIndex].timeSlotes[timeSlotIndex].student = null;

    setFacultyRow([...data]);
  };

  useEffect(() => {
    fetchUser();
    fetchTimeSlotTable();
  }, [fetchTimeSlotTable, fetchUser]);

  return (
    <>
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
      </Container>

      <Container fluid>
        <Row className="mb-5 d-flex justify-content-center align-items-center">
          {isTimeSlotLoading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <Col lg={true} xs={12} md={8}>
              <Table bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Time Slot</th>
                    {facultyRow.length > 0
                      ? facultyRow.map((item, index) => {
                          return (
                            <th key={index}>
                              <h6>
                                {item.firstname} {item.lastname}
                              </h6>
                              <Button
                                onClick={() => handleDeleteFaculty(item.userId)}
                                variant="outline-danger"
                              >
                                Delete
                              </Button>
                            </th>
                          );
                        })
                      : ""}
                  </tr>
                </thead>
                <tbody>
                  {timeSlotes.length > 0
                    ? timeSlotes.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item}</td>
                            {facultyRow.length > 0
                              ? facultyRow.map((faculty, index2) => {
                                  if (faculty.startTime && faculty.endTime) {
                                    if (
                                      !(
                                        faculty.startTime <= item &&
                                        item < faculty.endTime
                                      )
                                    ) {
                                      console.log(
                                        "Comparing " +
                                          faculty.startTime +
                                          "<" +
                                          item +
                                          "<" +
                                          faculty.endTime
                                      );
                                      return (
                                        <td className="disable-block-timetable "></td>
                                      );
                                    }
                                  }
                                  return (
                                    <td
                                      className={`color-cloumn-${index2}`}
                                      key={index2}
                                      onClick={() => {
                                        setSelectedFacultyIdForStudentAdd(
                                          faculty.userId
                                        );
                                        setSelectedSlotTime(item);
                                        setModalShow(true);
                                      }}
                                    >
                                      {faculty.timeSlotes[index].student ? (
                                        <>
                                          <p>
                                            {
                                              faculty.timeSlotes[index].student
                                                .firstname
                                            }{" "}
                                            {
                                              faculty.timeSlotes[index].student
                                                .lastname
                                            }
                                          </p>
                                          <MdDeleteForever
                                            size={25}
                                            color="red"
                                            onClick={() => {
                                              setModalShow(false);
                                              deleteStudentFromSlot(
                                                index2,
                                                index
                                              );
                                            }}
                                          />
                                        </>
                                      ) : (
                                        ""
                                      )}
                                    </td>
                                  );
                                })
                              : ""}
                          </tr>
                        );
                      })
                    : ""}
                </tbody>
                <tfoot>
                  <tr>
                    <th>#</th>
                    <th>Time Slot</th>
                    {facultyRow.length > 0
                      ? facultyRow.map((item, index) => {
                          return (
                            <th key={index}>
                              <h6>
                                {item.firstname} {item.lastname}
                              </h6>
                            </th>
                          );
                        })
                      : ""}
                  </tr>
                </tfoot>
              </Table>
              <Button variant="outline-primary" onClick={handleTimeTableSave}>
                Save Changes
              </Button>
            </Col>
          )}
        </Row>
      </Container>

      <ToastContainer />

      <StudentModal show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
};

export default Timetable;
