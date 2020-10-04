import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";

const SubmitSpeakingReport = () => {
  const [email, setEmail] = useState("");
  const [bands, setBands] = useState(0);
  const [note, setNote] = useState("");

  const handleFormSubmit = () => {
    if (email.trim() === "") {
      toast.error("Email cannot be empty");
      return;
    }

    //

    setEmail("");
    setBands(0);
    setNote("");
  };

  return (
    <div className="submitspeaking-wrapper">
      <Accordion>
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="0">
              Submit Marks
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  readOnly
                  value={email}
                />
              </Form.Group>

              <Form.Group controlId="formBasicRangeCustom">
                <Form.Label>Bands: {bands}</Form.Label>
                <Form.Control
                  type="range"
                  custom
                  min="0"
                  max="9"
                  step="0.5"
                  value={bands}
                  onChange={(event) => setBands(event.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>Note</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                />
              </Form.Group>

              <Button variant="outline-primary" onClick={handleFormSubmit}>
                Send
              </Button>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
};

export default SubmitSpeakingReport;
