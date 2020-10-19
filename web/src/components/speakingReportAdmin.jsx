import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import firebase from "../data/firebase";
import { Line } from "react-chartjs-2";
import "../css/speakingAdmin.scss";

const SpeakingReportAdmin = (props) => {
  const email = props.match.params.email;

  const [userData, setUserData] = useState([]);
  const [chartInfo, setChartInfo] = useState({});
  const [avgBands, setAvgBands] = useState(0);

  useEffect(() => {
    firebase
      .firestore()
      .collection("speakingTest")
      .where("student", "==", email)
      .get()
      .then((docs) => {
        if (docs.empty) {
          return;
        }
        const data = [];
        const bandData = {
          dates: [],
          bands: [],
        };
        let total = 0;
        docs.forEach((item) => {
          data.push(item.data());
          const formatedData = new Date(
            item.data().createdAt.toDate()
          ).toLocaleDateString();
          bandData.dates.push(formatedData);
          bandData.bands.push(item.data().bands);
          total = total + parseFloat(item.data().bands);
        });

        const avg = total / data.length;

        setAvgBands(avg);
        setUserData([...data]);
        setChartInfo(bandData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [email]);

  const returnFormatedData = (item) => {
    return new Date(item.toDate()).toLocaleDateString();
  };

  return (
    <Container>
      <Row className="mt-5 w-100">
        <Col className="show-card-info-wrapper">
          <Card className="card-wrapper">
            <Card.Body>
              <Card.Title>{userData.length}</Card.Title>
              <Card.Text>Total Speaking test appeared for</Card.Text>
            </Card.Body>
          </Card>
          <Card className="card-wrapper">
            <Card.Body>
              <Card.Title>{avgBands}</Card.Title>
              <Card.Text>Average Bands</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {chartInfo.dates ? (
        <Row className="mt-5">
          <Col>
            <Line
              data={{
                labels: [...chartInfo.dates],
                datasets: [
                  {
                    label: "Bands",
                    data: [...chartInfo.bands],
                    borderColor: ["rgba(55,160,235,0.2)"],
                    backgroundColor: ["rgba(55,160,235,0.2)"],
                    pointBackgroundColor: ["rgba(55,160,235,0.2)"],
                    pointBorderColor: ["rgba(55,160,235,0.2)"],
                  },
                ],
              }}
              options={{
                title: {
                  display: true,
                  text: `${email} Progress`,
                  fontSize: 25,
                },
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        min: 1,
                        max: 9,
                        stepSize: 0.5,
                      },
                    },
                  ],
                },
              }}
            />
          </Col>
        </Row>
      ) : (
        <span></span>
      )}

      <Row className="mt-5">
        <Col>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Bands</th>
                <th>Note</th>
                <th>Faculty</th>
              </tr>
            </thead>
            <tbody>
              {userData.map((item, index) => {
                return (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <th>{returnFormatedData(item.createdAt)}</th>
                    <th>{item.bands}</th>
                    <th>{item.note}</th>
                    <th>{item.faculty}</th>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default SpeakingReportAdmin;
