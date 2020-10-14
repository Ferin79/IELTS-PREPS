import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const SubmitSpeakingReport = ({ email, handleSpeakingReportSubmit }) => {
  const [bands, setBands] = useState(0);
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
              <Form onSubmit={handleSpeakingReportSubmit}>
                <Form.Group controlId="email">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    readOnly
                    value={email}
                  />
                </Form.Group>

                <Form.Group controlId="bands">
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

                <Form.Group controlId="note">
                  <Form.Label>Note</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}                 
                  />
                </Form.Group>

                <Button variant="outline-primary" type="submit">
                  Send
              </Button>
              </Form>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
};

export default SubmitSpeakingReport;
