import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import firebase from "../data/firebase";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Line } from "react-chartjs-2";

const StudentStats = ({ match }) => {
  const email = match.params.email;

  const history = useHistory();

  const [key, setKey] = useState("listening");
  const [allData, setAllData] = useState([]);
  const [bandArray, setBandArray] = useState({});
  const [avgBand, setAvgBand] = useState(0);
  const [emptyResults, setEmptyResults] = useState(false);
  const [appearedExam, setAppearedExam] = useState(0);
  const [isComponentLoading, setIsComponentLoading] = useState(false);

  useEffect(() => {
    console.log(key);
    setIsComponentLoading(true);
    setEmptyResults(false);
    firebase
      .firestore()
      .collection(`${key}User`)
      .where("email", "==", email)
      .orderBy("createdAt", "asc")
      .get()
      .then((docs) => {
        if (docs.size) {
          const data = [];
          const date = [];
          const fullData = [];
          let totalRecievedBands = 0;
          docs.forEach((doc) => {
            fullData.push(doc.data());
            totalRecievedBands =
              parseInt(totalRecievedBands) + parseInt(doc.data().band);
            data.push(doc.data().band);
            date.push(doc.data().createdAt.toDate().toLocaleString());
          });
          setAllData([...fullData]);
          setBandArray({
            date: [...date],
            data: [...data],
          });
          console.log(date);
          console.log(data);
          setAvgBand(
            Math.round(parseInt(totalRecievedBands) / parseInt(docs.size))
          );
          setAppearedExam(docs.size);
          setIsComponentLoading(false);
        } else {
          setIsComponentLoading(false);
          setEmptyResults(true);
        }
      })
      .catch((error) => {
        setIsComponentLoading(false);
        setEmptyResults(true);
        console.log(error);
      });
  }, [email, key]);

  if (email) {
    return (
      <Container fluid>
        <Row className="d-flex flex-column justify-content-center align-items-center mt-5">
          <h3 className="m-3">Student: {email}</h3>
          <Col sm="12" md="10" xs="12">
            <Tabs
              variant="pills"
              id="controlled-tab-example"
              activeKey={key}
              onSelect={(k) => setKey(k)}
            >
              <Tab eventKey="listening" title="Listening"></Tab>
              <Tab eventKey="reading" title="Reading"></Tab>
              <Tab eventKey="speaking" title="Speaking"></Tab>
              <Tab eventKey="writing" title="Writing"></Tab>
            </Tabs>

            {emptyResults ? (
              <div className="d-flex flex-column justify-content-center align-items-center mt-5">
                <h4>No Stats</h4>
              </div>
            ) : isComponentLoading ? (
              <div className="d-flex flex-column justify-content-center align-items-center mt-5">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <div>
                <div className="mt-3 d-flex justify-content-space-evenly align-items-center">
                  <Card border="primary" style={{ width: "18rem" }}>
                    <Card.Header></Card.Header>
                    <Card.Body>
                      <Card.Title>Total Exam Appeared</Card.Title>
                      <Card.Text>
                        {isComponentLoading ? (
                          <Spinner animation="border" variant="primary" />
                        ) : (
                          appearedExam
                        )}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  <Card
                    border="success"
                    style={{ width: "18rem", marginLeft: 20 }}
                  >
                    <Card.Header></Card.Header>
                    <Card.Body>
                      <Card.Title>Average Bands</Card.Title>
                      <Card.Text>
                        {isComponentLoading ? (
                          <Spinner animation="border" variant="primary" />
                        ) : (
                          avgBand
                        )}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </div>
                <div className="mt-5">
                  <Line
                    data={{
                      labels: bandArray.date,
                      datasets: [
                        {
                          label: "Bands",
                          data: bandArray.data,
                          borderColor: ["rgba(54,162,235,0.2)"],
                          backgroundColor: ["rgba(54,162,235,0.2)"],
                          pointBackgroundColor: ["rgba(54,162,235,0.2)"],
                          pointBorderColor: ["rgba(54,162,235,0.2)"],
                        },
                      ],
                    }}
                    options={{
                      scales: {
                        yAxes: [
                          {
                            ticks: {
                              min: 0,
                              max: 9,
                              stepSize: 0.5,
                            },
                          },
                        ],
                      },
                    }}
                  />
                </div>
                <div className="mt-5">
                  <Accordion>
                    {allData.map((data, index) => {
                      return (
                        <Card>
                          <Card.Header>
                            <Accordion.Toggle
                              as={Button}
                              variant="link"
                              eventKey={index}
                            >
                              {data.createdAt.toDate().toLocaleString()}
                            </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey={index}>
                            <Card.Body>
                              <h6>Correct Answer: {data.correctScore}</h6>
                              <h6>Incorrect Answer: {data.incorrectScore}</h6>
                              <h6>Not Attempted: {data.notattemptScore}</h6>
                              <h3>Bands: {data.band}</h3>
                              <div>
                                <Table
                                  striped
                                  bordered
                                  hover
                                  responsive
                                  variant="dark"
                                >
                                  <thead>
                                    <tr>
                                      <th>#</th>
                                      <th>First Name</th>
                                      <th>Last Name</th>
                                      <th>Username</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>1</td>
                                      <td>Mark</td>
                                      <td>Otto</td>
                                      <td>@mdo</td>
                                    </tr>
                                    <tr>
                                      <td>2</td>
                                      <td>Jacob</td>
                                      <td>Thornton</td>
                                      <td>@fat</td>
                                    </tr>
                                    <tr>
                                      <td>3</td>
                                      <td colSpan="2">Larry the Bird</td>
                                      <td>@twitter</td>
                                    </tr>
                                  </tbody>
                                </Table>
                              </div>
                            </Card.Body>
                          </Accordion.Collapse>
                        </Card>
                      );
                    })}
                  </Accordion>
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    );
  } else {
    history.push("/");
  }
};

export default StudentStats;
