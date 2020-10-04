import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "../css/popMessageBox.scss";
import { Col, Form, Row } from "react-bootstrap";
import { IoIosSend } from "react-icons/io";
import { MdExpandMore } from "react-icons/md";

const PopMessageBox = ({ sendMessage }) => {
  const messages = [];

  return (
    <div className="PopMessageBox-wrapper">
      <Accordion>
        <Card bg='dark'>
          <Card.Header>
            <Form onSubmit={sendMessage}>
              <Form.Group as={Row}>
                <Col sm="9">
                  <Form.Control type="text" placeholder="messsage..." />
                </Col>
                <Col sm="3">
                  <Button variant="primary" type="submit"><IoIosSend /></Button>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    <MdExpandMore />
                  </Accordion.Toggle>
                </Col>
              </Form.Group>
            </Form>

          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <div className="read-message-wrapper">
                {messages.length ? (
                  messages.map((item) => {
                    return (
                      <div
                        className={
                          item.from === "me"
                            ? "message-item float-right"
                            : "message-item"
                        }
                        id={item.id}
                      >
                        {item.from === "me" ? (
                          <span></span>
                        ) : (
                            <p style={{ color: "black" }}>From: {item.from}</p>
                          )}

                        <h6 style={{ color: "black" }}>{item.text}</h6>
                      </div>
                    );
                  })
                ) : (
                    <span>No Messages. Start Chatting ...</span>
                  )}
              </div>
              <div className="send-message-wrapper">
              </div>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
};

export default PopMessageBox;
