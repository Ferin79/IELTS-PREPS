import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import Toast from "react-bootstrap/Toast";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import firebase from "../data/firebase";
import LoadingScreen from "../components/LoadingScreen";
import { toast } from "react-toastify";

let inputRef;
const Profile = () => {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [userData, setUserData] = useState({});
  const [show, setShow] = useState(false);
  const [isLoading, setisLoading] = useState(false);


  const uploadFile = (fileToUpload, fileType) => {

    setisLoading(true);
    // setErrorText("");
    var storageRef = firebase.storage().ref('profile/');

    var uploadTask = storageRef.child(`${firebase.auth().currentUser.uid}`).put(fileToUpload);

    uploadTask.on(
      "state_changed",
      function (snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        // setPercentage(Math.round(parseInt(progress)));
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED:
            console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING:
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      function (error) {
        console.log(error);
        toast.error("Error While Uploading. Please try again")
        // setErrorText("Error While Uploading. Please try again");
        setisLoading(false);
      },
      function () {
        console.log(uploadTask.snapshot.ref.name);
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          console.log("File available at", downloadURL);
          
          firebase.firestore().doc(`/users/${firebase.auth().currentUser.email}`)
            .update({photoUrl: downloadURL})
          
          toast.info("Profile picture updated");
          setPhotoUrl(downloadURL)          
          setisLoading(false);
        });
      }
    );
  };


  useEffect(() => {
    setisLoading(true);
    firebase
      .firestore()
      .doc(`/users/${firebase.auth().currentUser.email}`)
      .get()
      .then((doc) => {
        let url = doc.data().photoUrl
          ? doc.data().photoUrl
          : "https://firebasestorage.googleapis.com/v0/b/ielts-preps.appspot.com/o/person.png?alt=media";
        setUserData({ ...doc.data() });
        setPhotoUrl(url);
        setisLoading(false);
      })
      .catch((error) => {
        setisLoading(false);
        console.log(error);
      });


  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div
      style={{
        height: "90vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "25vw",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <input
          type="file"
          accept="image/*"
          id="file"
          ref={(ref) => (inputRef = ref)}
          style={{ display: "none" }}
          onChange={(event) => {
            console.log(event.target.files);
            uploadFile(event.target.files[0]);
          }}
        />
        <OverlayTrigger
          key={1}
          placement="top"
          overlay={
            <Tooltip id={`tooltip`}>Click to change profile Pic</Tooltip>
          }
        >
          <Image
            src={photoUrl}
            rounded
            height={100}
            width={100}
            onClick={() => {
              inputRef.click();
            }}
            style={{ cursor: "pointer" }}
          />
        </OverlayTrigger>
        
        {/* {photoUrl && (
          <p className="mt-3">
            Audio File is Uploaded to{" "}
            <a className="uploadLink" href={photoUrl}>
              {photoUrl}
            </a>
          </p>
        )}
         */}
        <div>
          <h4>
            {userData.firstname} {userData.lastname}
          </h4>
          <h6>{userData.email}</h6>
        </div>
      </div>
      <div className="mt-5">
        <Form>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <Form.Group controlId="formBasicEmail">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter First name"
                value={userData.firstname}
                onChange={(event) => {
                  let data = userData;
                  data.firstname = event.target.value;
                  setUserData({ ...data });
                }}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail" className="ml-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Last name"
                value={userData.lastname}
                onChange={(event) => {
                  let data = userData;
                  data.lastname = event.target.value;
                  setUserData({ ...data });
                }}
              />
            </Form.Group>
          </div>
          <Form.Group controlId="formBasicEmail" className="w-100">
            <Form.Label>Email</Form.Label>
            <Form.Control type="text" value={userData.email} readOnly />
          </Form.Group>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <Button
              variant="primary"
              onClick={(event) => {
                event.preventDefault();
                setisLoading(true);
                firebase
                  .firestore()
                  .doc(`/users/${firebase.auth().currentUser.email}`)
                  .update(userData)
                  .then(() => setisLoading(false))
                  .catch((error) => {
                    setisLoading(false);
                    console.log(error);
                  });
              }}
            >
              Update
            </Button>
            <Button
              variant="outline-info"
              onClick={() =>
                firebase
                  .auth()
                  .sendPasswordResetEmail(firebase.auth().currentUser.email)
                  .then(() => {
                    setShow(true);
                  })
                  .catch((error) => console.log(error))
              }
            >
              Reset Password
            </Button>
          </div>
        </Form>
      </div>
      <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
        <Toast.Header>
          <strong className="mr-auto">Success</strong>
        </Toast.Header>
        <Toast.Body>
          Password Reset Link has been sent to your email.
        </Toast.Body>
      </Toast>
    </div>
  );
};

export default Profile;
