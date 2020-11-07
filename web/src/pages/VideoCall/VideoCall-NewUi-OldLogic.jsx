import React, { useEffect, useState, useRef, useContext } from "react";
import "./styles.css";
import io from "socket.io-client";
import Peer from "simple-peer";
import { Button, Col, Row, Container, Card, Dropdown } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { Context } from "../../data/context";
import { AuthContext } from "../../data/auth";
import MessageModal from "./MessageModal";
import SubmitSpeakingReport from "../../components/SubmitSpeakingReport";
import firebase from "../../data/firebase";
import Draggable from "react-draggable";
import {
  RiCameraLine,
  RiCameraOffLine,
  RiMicFill,
  RiMicOffFill,
} from "react-icons/ri";
import { MdScreenShare } from "react-icons/md";
import { FcEndCall } from "react-icons/fc";
import Spinner from "react-bootstrap/Spinner";
import Timer from "./Timer";
import { Link } from "react-router-dom";

const incommingCallAudio = new Audio(require("../../images/skype_remix_2.mp3"));
incommingCallAudio.loop = true;

const normalVideoConstraints = {
  facingMode: "user",
  frameRate: { min: 5, ideal: 10, max: 15 },
  width: { min: 1024, ideal: 1280, max: 1920 },
  height: { min: 576, ideal: 720, max: 1080 },
};

const lowInternetSpeedVideoConstraints = {
  facingMode: "user",
  frameRate: { min: 5, ideal: 10, max: 15 },
  width: { min: 100, ideal: 100, max: 100 },
  height: { min: 100, ideal: 100, max: 100 },
};

let globalStream = null;

function VideoCall() {
  const peer = useRef(null);

  const { role, institution } = useContext(Context);
  const { currentUser } = useContext(AuthContext);

  const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState({});
  const [roles, setRoles] = useState({});
  const [isAdminOrStaff, setIsAdminOrStaff] = useState(false);
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [calling, setCalling] = useState();
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [userMediaLoading, setUserMediaLoading] = useState(false);

  const [callingPermission, setCallingPermission] = useState(false);

  // const [callButtonDisability, setCallButtonDisability] = useState(false);
  const [remoteUserId, setRemoteUserId] = useState("");

  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();

  const [videoStatus, setVideoStatus] = useState(true);
  const [audioStatus, setAudioStatus] = useState(true);
  const [screenShareStatus, setScreenShareStatus] = useState(false);
  const [timer, setTimer] = useState({ minuites: "00", seconds: "00" });
  const [timerStatus, setTimerStatus] = useState(false);
  const videoCallConstraints = useRef(normalVideoConstraints);

  const [messageModalShow, setMessageModalShow] = useState(false);
  const [messages, setMessages] = useState([]);
  const modalData = useRef(null);

  useEffect(() => {
    // 1. connect to server
    // socket.current = io.connect("http://localhost:8000/");
    // socket.current = io.connect("https://ielts-video-call.herokuapp.com/");
    socket.current = io.connect("");
    navigator.mediaDevices
      .getUserMedia({ video: videoCallConstraints.current, audio: true })
      .then((stream) => {
        setStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
          globalStream = stream;
        }
      })
      .catch((reason) => {
        toast.error("Provide Permission");
      });

    socket.current.on("yourID", (id) => {
      setYourID(id);
      console.log(currentUser.email, role);
      socket.current.emit("initializeUser", {
        uniqueName: currentUser.email,
        role,
      });
    });
    socket.current.on("allUsers", (data) => {
      setUsers(data.users);
      console.log("Update" + data.users);
      setRoles(data.role);
    });

    socket.current.on("cantCall", (data) => {
      console.log("Cant call");
      toast.error(data);
      // setCallButtonDisability(false);
    });

    return () => {
      console.log("disconnect socket");
      socket.current.disconnect();
      const videoTrack = globalStream.getVideoTracks()[0];
      const audioTrack = globalStream.getAudioTracks()[0];
      if (videoTrack.readyState === "live") {
        videoTrack.stop();
      }
      if (audioTrack.readyState === "live") {
        audioTrack.stop();
      }
      incommingCallAudio.pause();
    };
  }, []);

  useEffect(() => {
    socket.current.removeListener("receiveCall");
    // socket.current.on("receiveSignal", (data) => {
    //   console.log("Reciving signal");
    //   setCallerSignal(data.signal);
    //   toast.info("connecting")
    // });

    socket.current.on("receiveCall", (data) => {
      if (callAccepted) {
        console.log("Already on call");
        socket.current.emit("alreadyOnCall", { to: data.from.id });
      } else {
        console.log("Receiving");
        setReceivingCall(true);
        setCaller(data.from.name);
        setRemoteUserId(data.from.id);
        setCallerSignal(data.signal);
      }
    });
  }, [callAccepted]);

  useEffect(() => {
    socket.current.on("callPermissionGranted", (data) => {
      if (!callAccepted && users[data.from]) {
        console.log("Permission Granted from " + users[data.from]);
        setCallingPermission(data.from);
      }
    });
    if (callAccepted && !users[remoteUserId]) {
      setCallAccepted(false);
      peer.current.destroy("Call ended");
    }
  }, [users]);

  useEffect(() => {
    const setUserRoleCondition = role === "student" ? false : true;
    setIsAdminOrStaff(setUserRoleCondition);
  }, []);

  useEffect(() => {
    socket.current.on("receiveMessage", (data) => {
      if (!isAdminOrStaff && callingPermission !== data.from) {
        setCallingPermission(data.from);
      }
      console.log("Receiving message");
      handleReceiveMessage(data.from, data.message);
    });
  }, [callingPermission]);

  function callPeer(id) {
    // setCallButtonDisability(true);
    setCalling(id);

    peer.current = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
      reconnectTimer: true,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          {
            urls: "turn:numb.viagenie.ca",
            credential: "muazkh",
            username: "webrtc@live.com",
          },
          { urls: "stun:global.stun.twilio.com:3478?transport=udp" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      },
    });

    console.log("Call user");
    peer.current.on("signal", (data) => {
      socket.current.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: yourID,
      });
    });
    // socket.current.emit("callUser", { userToCall: id, from: yourID });

    peer.current.on("stream", (stream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    peer.current.on("connect", () => {
      toast.info("Connected");
      setTimerStatus(new Date());
    });

    socket.current.on("callAccepted", (signal) => {
      setCallAccepted(true);
      setRemoteUserId(id);
      peer.current.signal(signal);
      // setCallButtonDisability(true);
      setCalling();
      console.log("accepted");
      toast.info("connecting");
    });

    peer.current.on("error", (error) => {
      console.log(error);
      setRemoteUserId("");
      setCallAccepted(false);
      // setCallButtonDisability(false);
      setCallingPermission(false);

      socket.current.removeListener("callAccepted");
      socket.current.removeListener("videoStatusChange");
      socket.current.removeListener("audioStatusChange");
      if (error !== "Call ended") {
        alert("Connection error or client closed webpage!");
      }
    });

    socket.current.on("callEnded", () => {
      peer.current.destroy("Call ended");
      setRemoteUserId("");
      setCallAccepted(false);
      // setCallButtonDisability(false);
      setCallingPermission(false);

      socket.current.removeListener("callAccepted");
      socket.current.removeListener("videoStatusChange");
      socket.current.removeListener("audioStatusChange");
    });

    socket.current.on("error", (error) => {
      peer.current.destroy(error.message);
    });
  }

  function acceptCall() {
    incommingCallAudio.pause();
    incommingCallAudio.currentTime = 0;
    setCallAccepted(true);
    setReceivingCall(false);
    // setCallButtonDisability(true);
    // setCaller(false);

    peer.current = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
      reconnectTimer: true,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          {
            urls: "turn:numb.viagenie.ca",
            credential: "muazkh",
            username: "webrtc@live.com",
          },
          { urls: "stun:global.stun.twilio.com:3478?transport=udp" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      },
    });

    peer.current.on("signal", (data) => {
      toast.info("connecting");
      socket.current.emit("acceptCall", { signal: data, to: remoteUserId });
    });

    peer.current.on("stream", (stream) => {
      partnerVideo.current.srcObject = stream;
    });

    peer.current.signal(callerSignal);

    peer.current.on("connect", () => {
      toast.info("Connected");
      setTimerStatus(new Date());
    });

    peer.current.on("error", (error) => {
      console.log(error);
      setCallAccepted(false);
      setCaller("");
      setRemoteUserId("");
      setCallerSignal();
      // setCallButtonDisability(false);

      socket.current.removeListener("videoStatusChange");
      socket.current.removeListener("audioStatusChange");
      if (error !== "Call ended") {
        alert("Connection error or client closed webpage!");
      }
    });

    socket.current.on("callEnded", () => {
      peer.current.destroy("Call ended");
      setCallAccepted(false);
      setCaller("");
      setRemoteUserId("");
      setCallerSignal();
      // setCallButtonDisability(false);

      socket.current.removeListener("videoStatusChange");
      socket.current.removeListener("audioStatusChange");
    });
  }

  function endCall() {
    socket.current.emit("endCall", { id: remoteUserId });
    peer.current.destroy("Call ended");
  }

  function giveCallPermission(id) {
    socket.current.emit("giveCallPermission", { from: yourID, to: id });
  }

  function toggleVideo() {
    startUserMediaLoadingTimeout(1000);

    if (screenShareStatus) {
      toggleScreenShare();
    }

    setTimeout(() => {
      const oldTrack = stream.getVideoTracks()[0];

      if (oldTrack.readyState === "ended") {
        navigator.mediaDevices
          .getUserMedia({ video: videoCallConstraints.current })
          .then((newStream) => {
            const newTrack = newStream.getVideoTracks()[0];
            stream.removeTrack(oldTrack);
            stream.addTrack(newTrack);
            setVideoStatus(true);
            if (callAccepted) {
              peer.current.replaceTrack(oldTrack, newTrack, stream);
            }
          });
      } else if (oldTrack.readyState === "live") {
        oldTrack.stop();
        setVideoStatus(false);

        if (callAccepted) {
          peer.current.replaceTrack(oldTrack, oldTrack, stream);
        }
      }
    }, 500);
  }

  function toggleScreenShare() {
    startUserMediaLoadingTimeout(1000);

    if (videoStatus) {
      toggleVideo();
    }

    setTimeout(() => {
      const oldScreenTrack = stream.getVideoTracks()[0];

      if (oldScreenTrack.readyState === "ended") {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then((newStream) => {
            const newTrack = newStream.getVideoTracks()[0];
            stream.removeTrack(oldScreenTrack);
            stream.addTrack(newTrack);
            setScreenShareStatus(true);
            if (callAccepted) {
              peer.current.replaceTrack(oldScreenTrack, newTrack, stream);
            }
            stream.getVideoTracks()[0].addEventListener("ended", () => {
              setScreenShareStatus(false);
            });
          });
      } else if (oldScreenTrack.readyState === "live") {
        oldScreenTrack.stop();
        setScreenShareStatus(false);

        if (callAccepted) {
          peer.current.replaceTrack(oldScreenTrack, oldScreenTrack, stream);
        }
      }
    }, 500);
  }

  function toggleAudio() {
    startUserMediaLoadingTimeout(400);

    const oldTrack = stream.getAudioTracks()[0];

    if (oldTrack.readyState === "ended") {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((newStream) => {
        const newTrack = newStream.getAudioTracks()[0];
        stream.removeTrack(oldTrack);
        stream.addTrack(newTrack);
        setAudioStatus(true);
        if (callAccepted) {
          peer.current.replaceTrack(oldTrack, newTrack, stream);
        }
      });
    } else if (oldTrack.readyState === "live") {
      oldTrack.stop();
      setAudioStatus(false);

      if (callAccepted) {
        peer.current.replaceTrack(oldTrack, oldTrack, stream);
      }
    }
  }

  // function toggleCamera() {
  //   startUserMediaLoadingTimeout(1700);
  //   const newCameraMode = cameraMode === 'user' ? 'environment' : 'user';
  //   const oldTrack = stream.getVideoTracks()[0];
  //   oldTrack.stop()
  //   navigator.mediaDevices.getUserMedia({ video: videoCallConstraints.current }).then(newStream => {
  //     const newTrack = newStream.getVideoTracks()[0]
  //     stream.removeTrack(oldTrack)
  //     stream.addTrack(newTrack)
  //     setVideoStatus(true);
  //     if (callAccepted) {
  //       peer.current.replaceTrack(oldTrack, newTrack, stream);
  //     }
  //   })
  //   setCameraMode(newCameraMode)
  // }

  const handleSendMessage = (e, toUserId) => {
    e.preventDefault();
    const textMessage = e.target.messageText.value;
    if (textMessage === "") {
      toast.error("Message Cannot be empty");
      return;
    }
    setMessages((oldMessage) => [
      ...oldMessage,
      { from: yourID, to: toUserId, text: textMessage },
    ]);
    socket.current.emit("sendMessage", {
      from: yourID,
      to: modalData.current,
      message: textMessage,
    });
    e.target.messageText.value = "";
  };

  const handleReceiveMessage = (from, message) => {
    setMessages((oldMessage) => [
      ...oldMessage,
      { from, to: yourID, text: message },
    ]);
    //open message modal
    modalData.current = from;
    setMessageModalShow(true);
  };

  const handleSpeakingReportSubmit = (e) => {
    e.preventDefault();
    toast.info("Please wait...");
    const email = e.target.email.value;
    const bands = e.target.bands.value;
    const note = e.target.note.value;
    console.log(email, bands, note, currentUser.email);
    const reportData = {
      student: email,
      faculty: currentUser.email,
      bands,
      note,
      createdAt: firebase.firestore.Timestamp.now(),
    };
    firebase
      .firestore()
      .collection("speakingTest")
      .add(reportData)
      .then(() => {
        toast.success("Submitted!");
      });
  };

  const startUserMediaLoadingTimeout = (milisec) => {
    setUserMediaLoading(true);
    setTimeout(() => {
      setUserMediaLoading(false);
    }, milisec);
  };

  let UserVideo = <span></span>;
  let CallUserList;
  let callFaculty;
  if (stream) {
    UserVideo = (
      <Draggable bounds="parent">
        <div className="userVideo-Wrapper">
          <video
            className="userVideo"
            playsInline
            muted
            ref={userVideo}
            autoPlay
          />
        </div>
      </Draggable>
    );
    if (isAdminOrStaff) {
      CallUserList = Object.keys(users).map((key) => {
        if (key === yourID) {
          return null;
        }
        return (
          <Dropdown>
            <Dropdown.Toggle variant="info">{users[key]}</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                onSelect={() => callPeer(key)}
                disabled={callAccepted}
              >
                Call
              </Dropdown.Item>
              <Dropdown.Item
                onSelect={() => giveCallPermission(key)}
                disabled={callAccepted}
              >
                Give Permission
              </Dropdown.Item>
              <Dropdown.Item
                onSelect={() => {
                  modalData.current = key;
                  setMessageModalShow(true);
                }}
              >
                {" "}
                Message{" "}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      });
    } else if (users[callingPermission]) {
      callFaculty = (
        <Card className="border border-secondary bg-transparent">
          <Col style={{ color: "white", border: "3px" }}>
            <Row>{users[callingPermission]} :</Row>
            <Row>
              <Button
                variant="primary"
                onClick={() => callPeer(callingPermission)}
                disabled={callAccepted}
                style={{ margin: 5 }}
              >
                {" "}
                Call{" "}
              </Button>
              <Button
                variant="success"
                onClick={() => {
                  modalData.current = callingPermission;
                  setMessageModalShow(true);
                }}
                style={{ margin: 5 }}
              >
                {" "}
                Message{" "}
              </Button>
            </Row>
          </Col>
        </Card>
      );
    }
  }

  let PartnerVideo;
  let endCallButton;
  let InterviewTime;
  if (callAccepted) {
    PartnerVideo = (
      <div className="partnervideo-wrapper">
        <video
          className="partnerVideo"
          playsInline
          ref={partnerVideo}
          autoPlay
        />
      </div>
    );
    endCallButton = (
      <div className="btn-toggle-styler">
        <FcEndCall size={30} onClick={() => endCall()} />
      </div>
    );
    InterviewTime = (
      <Timer timer={timer} setTimer={setTimer} timerStatus={timerStatus} />
    );
  } else {
    // setTimerStatus(false);
  }
  let SpeakingReport;
  if (callAccepted && isAdminOrStaff) {
    SpeakingReport = (
      <SubmitSpeakingReport
        email={users[remoteUserId]}
        handleSpeakingReportSubmit={handleSpeakingReportSubmit}
        timer={timer}
      />
    );
  }

  let ToggleMediaButtonsLoading = userMediaLoading ? (
    <Spinner animation="grow" variant="primary" />
  ) : (
    <span></span>
  );

  let ToggleMediaButtons;
  const videobutton = videoStatus ? (
    <RiCameraLine size={30} color="green" />
  ) : (
    <RiCameraOffLine size={30} color="red" />
  );
  const audiobutton = audioStatus ? (
    <RiMicFill size={30} color="green" />
  ) : (
    <RiMicOffFill size={30} color="red" />
  );
  const screenShareButton = (
    <MdScreenShare size={30} color={screenShareStatus ? "green" : "red"} />
  );
  ToggleMediaButtons = !callAccepted ? (
    <span></span>
  ) : (
    <div className="videoToggle-wrapper">
      <div className="btn-toggle-styler" onClick={toggleVideo}>
        {videobutton}
      </div>
      <div className="btn-toggle-styler" onClick={toggleAudio}>
        {audiobutton}
      </div>
      <div className="btn-toggle-styler" onClick={toggleScreenShare}>
        {screenShareButton}
      </div>
      {endCallButton}
    </div>
  );

  // let lowInternetSpeedButton = (
  //   <Button onClick={(event) => {
  //     event.target.style.display = "none";
  //     videoCallConstraints.current = lowInternetSpeedVideoConstraints;
  //     if (videoStatus) {
  //       toggleVideo();
  //       setTimeout(() => {
  //         toggleVideo();
  //       }, 1000);
  //     }
  //   }}>Low Internet Speed?</Button>
  // )

  let incommingCall;
  if (receivingCall && users[remoteUserId] && callerSignal) {
    incommingCallAudio.play();

    incommingCall = (
      <div className="incoming-call-wrapper">
        <h6>Incoming Call</h6>
        <p>from</p>
        <h3>{caller}</h3>
        <div className="incomming-call-btn">
          <Button variant="outline-success" onClick={acceptCall}>
            Accept
          </Button>
        </div>
      </div>
    );
  } else {
    incommingCallAudio.pause();
    incommingCallAudio.currentTime = 0;
  }

  let callingUser;
  if (users[calling]) {
    callingUser = (
      <div className="incoming-call-wrapper">
        <h2>Calling {users[calling]}</h2>
      </div>
    );
  }

  return (
    <>
      <Container fluid className="speak-conatiner-wrapper">
        {incommingCall}
        {callingUser}
        <Row>
          <Col className="RenderCallBtn-wrapper">
            {CallUserList} {callFaculty}
          </Col>
        </Row>

        <Row className="row-second-section">
          <div className="all-video-wrapper-section">
            <div className="all-video-wrapper">
              {PartnerVideo}
              {UserVideo}
            </div>
            <div>
              {ToggleMediaButtonsLoading}
              {ToggleMediaButtons}
            </div>
          </div>
          {InterviewTime}
          {SpeakingReport}
          <Link to="/record" target="_blank">
            Record
          </Link>
        </Row>
        <MessageModal
          show={messageModalShow}
          onHide={() => setMessageModalShow(false)}
          modalData={modalData.current}
          messages={messages}
          handleSendMessage={handleSendMessage}
        />

        <ToastContainer autoClose={2000} />
      </Container>
      {/* ABSOLUTE POSITIONED components  */}
      {/* {incommintCall}
      {callingUser}
      {PartnerVideo}
      <div className="userElements">
        {UserVideo} {ToggleMediaButtons}
      </div>
      <div className="userElementsLoadingBox" hidden={!userMediaLoading}>
        <div className="userElementsLoadingSpinner"><LoadingTailSpin /></div>
      </div>
      {endCallButton} */}
      {/* DEFAULT POSITIONED components  */}
      {/* <Container style={{ color: "black" }} fluid>
        <Row>
          {CallUserList} {callFaculty}
        </Row>
        <Row>
          <Col><h4>You: {currentUser.email}</h4> <h6 style={{ color: "green" }}>{yourID && "Online"}</h6></Col>          
        </Row>
        <Row>{SpeakingReport}</Row>
        <ToastContainer autoClose={2000} />
        <MessageModal
          show={messageModalShow}
          onHide={() => setMessageModalShow(false)}
          modalData={modalData.current}
          messages={messages}
          handleSendMessage={handleSendMessage}
        />
      </Container> */}
    </>
  );
}

export default VideoCall;
