import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "../css/popMessageBox.scss";

const PopMessageBox = ({  }) => {
  const messages = [
    {
      id: 1,
      from: "me",
      to: "Jash Jariwala",
      text: "Hi, How Are You ?",
    },
    {
      id: 2,
      from: "me",
      to: "Jash Jariwala",
      text:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem, quas.",
    },
    {
      id: 3,
      from: "Jash Jariwala",
      to: "me",
      text:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque, aperiam iure atque exercitationem ab ducimus.",
    },
    {
      id: 4,
      from: "Jash Jariwala",
      to: "me",
      text: "Lorem ipsum dolor sit amet consectetur adipisicing.",
    },
    {
      id: 5,
      from: "me",
      to: "Jash Jariwala",
      text: "Hi, How Are You ?",
    },
    {
      id: 6,
      from: "me",
      to: "Jash Jariwala",
      text: "Hi, How Are You ?",
    },
    {
      id: 7,
      from: "me",
      to: "Jash Jariwala",
      text: "Hi, How Are You ?",
    },
    {
      id: 8,
      from: "me",
      to: "Jash Jariwala",
      text: "Hi, How Are You ?",
    },
    {
      id: 9,
      from: "me",
      to: "Jash Jariwala",
      text: "Hi, How Are You ?",
    },
    {
      id: 10,
      from: "me",
      to: "Jash Jariwala",
      text: "Hi, How Are You ?",
    },
    {
      id: 11,
      from: "me",
      to: "Jash Jariwala",
      text: "Hi, How Are You ?",
    },
    {
      id: 12,
      from: "me",
      to: "Jash Jariwala",
      text: "Hi, How Are You ?",
    },
    {
      id: 10,
      from: "me",
      to: "Jash Jariwala",
      text: "Hi, How Are You ?",
    },
    {
      id: 13,
      from: "me",
      to: "Jash Jariwala",
      text: "Hi, How Are You ?",
    },
    {
      id: 14,
      from: "me",
      to: "Jash Jariwala",
      text: "Hi, How Are You ?",
    },
    {
      id: 15,
      from: "me",
      to: "Jash Jariwala",
      text: "Hi, How Are You ?",
    },
  ];

  return (
    <div className="PopMessageBox-wrapper">
      <Accordion>
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="0">
              Message
            </Accordion.Toggle>
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
              <div className="send-message-wrapper"></div>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
};

export default PopMessageBox;
