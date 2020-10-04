import React, { useState } from 'react'
import "./messageModal.css"
import { Button, Card, Form, Modal } from 'react-bootstrap'
import { IoIosSend } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import MessageBox from "../../components/popMessageBox";

export default function MessageModal(props) {   

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton style={{ background: "grey" }}>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.modalData}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ background: "grey" }}>
              <MessageBox messages={props.messages} handleSendMessage={props.handleSendMessage} remoteUser={props.modalData} />
            </Modal.Body>
            <Modal.Footer style={{ background: "grey" }}>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
            <ToastContainer />
        </Modal>
    )
}
