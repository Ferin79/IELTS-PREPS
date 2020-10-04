import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { IoIosSend } from "react-icons/io";
import { toast } from "react-toastify";
import "../css/popMessageBox.scss";

const PopMessageBox = ({ messages, handleSendMessage, remoteUser }) => {  

  return (
    <div className="PopMessageBox-wrapper">
      <Accordion>
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="0">
              Messages
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <div className="read-message-wrapper">
                {messages.length ? (
                  messages.map((item) => {
                    return (
                      <div className="message-item" id={item.id}>
                        {item.from === "me" ? (
                          <span></span>
                        ) : (
                          <p
                            className="message-p-tag"
                            style={{ color: "black" }}
                          >
                            From: {item.from}
                          </p>
                        )}

                        <h6
                          className={
                            item.from !== remoteUser ? "float-right-item" : ""
                          }
                          style={{ color: "black" }}
                        >
                          {item.text}
                        </h6>
                      </div>
                    );
                  })
                ) : (
                  <span>No Messages. Start Chatting ...</span>
                )}
              </div>
              <div className="send-message-wrapper">
                <Form.Group controlId="formBasicEmail" className="form-message">
                  <Form.Control
                    type="text"
                    placeholder="Type Message..."                                       
                    onKeyPress={(e) => {
                      if (e.which === 13) {
                        handleSendMessage(e, remoteUser);                        
                      }
                    }}
                  />
                </Form.Group>
                <IoIosSend size={35} onClick={handleSendMessage} />
              </div>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
};

export default PopMessageBox;
