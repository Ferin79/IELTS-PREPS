import React, { useContext, useState, useCallback, useEffect } from "react";
import Conatiner from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import firebase from "../data/firebase";
import { Context } from "../data/context";
import LoadingScreen from "../components/LoadingScreen";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ProgressBar from "react-bootstrap/ProgressBar";
import Container from "react-bootstrap/Container";

// Added_Under_Staff field in user table  to know which user is under which staff 

const SubmittedWriting = () => {
    const { isLoading, setIsLoading, role, institution } = useContext(Context);
    const [writingData, setWritingData] = useState([])

    const handleFetchWriting = useCallback(() => {
        setIsLoading(true);
        firebase
        .firestore()
        .collection("writingUser")
        .where("institute_id", "==", institution)
        .orderBy("createdAt", "desc")
        .get()
        .then((docs) => {
            const data = [];
            docs.forEach((doc) => {
            data.push({ ...doc.data(), id: doc.id });
            });

            // // User data
            // firebase.firestore().collection("users")

            setWritingData([...data]);
            setIsLoading(false);
            console.log(data);
        })
        .catch((error) => {
            console.log(error);
            alert(error.message);
            setIsLoading(false);
        });
    }, [setIsLoading, institution]);


    useEffect(() => {
        handleFetchWriting();
    }, [handleFetchWriting]);


    if (isLoading) {
        return  <LoadingScreen text="Loading"/> 
    }
    
    if (role === "student") {
       return <h3>You are not suppose to be here</h3>;
    }

    return(
        <Container fluid>
            <Row className="m-5">
                <Col
                lg="auto"
                sm="12"
                md="12"
                xl="12"
                className="d-flex d-column justify-content-center align-items-flex-start"
                >
                <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Time</th>
                        <th>Student</th>
                        <th>Checked</th>
                        <th>PDF</th>
                        {/* <th>Action</th>
                        <th>Details</th> */}
                    </tr>
                    </thead>
                    <tbody>
                    {writingData.length ? (
                        writingData.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.createdAt.toDate().toString()}</td>
                                <td>{item.email}</td>
                                <td>{item.isChecked}</td>
                                <td><a  href={item.pdfUrl}>PDF</a></td>                           
                            </tr>
                        );
                        })
                    ) : (
                        <p>No Data to Show</p>
                    )}
                    </tbody>
                </Table>
                </Col>
            </Row>
        </Container>
    );


};

export default SubmittedWriting;
