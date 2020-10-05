import React, { useEffect, useState, useRef, useContext } from "react";
import "./styles_OldUi.css";
import io from "socket.io-client";
import Peer from "simple-peer";
import { Button, Col, Row, Container, Card, Dropdown } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { CameraVideo, CameraVideoOff, MicMute, Mic, ArrowBarUp } from "react-bootstrap-icons";
import Loader from "react-loader-spinner";
import { Context } from "../../data/context";
import { AuthContext } from "../../data/auth";
import MessageModal from "./MessageModal";
import { TiMessages } from "react-icons/ti";
import { MdCall } from "react-icons/md";

const incommingCallAudio = new Audio(require("../../images/skype_remix_2.mp3"));
incommingCallAudio.loop = true;

const normalVideoConstraints = {
  facingMode: "user", 
  frameRate: { min: 5, ideal: 10, max: 15},
  width: { min: 1024, ideal: 1280, max: 1920 },
  height: { min: 576, ideal: 720, max: 1080 }
}

const lowInternetSpeedVideoConstraints = {
  facingMode: "user", 
  frameRate: { min: 5, ideal: 10, max: 15},
  width: { min: 100, ideal: 100, max: 100 },
  height: { min: 100, ideal: 100, max: 100 }
}

let globalStream = null;

const LoadingTailSpin = () => {
  return (
    <Loader
      type="TailSpin"
      color="#00BFFF"
    // timeout={3000}
    />
  );
};

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
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [userMediaLoading, setUserMediaLoading] = useState(false);

  const [callingPermission, setCallingPermission] = useState(false);

  const [callButtonDisability, setCallButtonDisability] = useState(false);
  const [remoteUserId, setRemoteUserId] = useState("");

  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();

  const [videoStatus, setVideoStatus] = useState(true);
  const [audioStatus, setAudioStatus] = useState(true);
  const [screenShareStatus, setScreenShareStatus] = useState(false);
  const videoCallConstraints = useRef(normalVideoConstraints)

  const [messageModalShow, setMessageModalShow] = useState(false);
  const [messages, setMessages] = useState([]);
  const modalData = useRef(null);


  useEffect(() => {
    // 1. connect to server
    // socket.current = io.connect("http://localhost:8000/");
    socket.current = io.connect("https://ielts-video-call.herokuapp.com/");
    // socket.current = io.connect("");
    navigator.mediaDevices.getUserMedia({ video: videoCallConstraints.current, audio: true }).then((stream) => {
      setStream(stream);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
        globalStream = stream
      }
    })
      .catch((reason) => {
        toast.error("Provide Permission");
      });

    socket.current.on("yourID", (id) => {
      setYourID(id);
      console.log(currentUser.email, role);
      socket.current.emit("initializeUser", { uniqueName: currentUser.email, role, });
    });
    socket.current.on("allUsers", (data) => {
      setUsers(data.users);
      console.log("Update" + data.users);
      setRoles(data.role);
    });

    socket.current.on("receiveSignal", (data) => {
      console.log("Reciving signal");
      setCallerSignal(data.signal);
      toast.info("connecting")
    });

    socket.current.on("receiveCall", (data) => {
      console.log("Receiving");
      setReceivingCall(true);
      setCallButtonDisability(true);
      setCaller(data.from.name);
      setRemoteUserId(data.from.id);
      // setCallerSignal(data.signal);
    });

    return (() => {
      console.log("disconnect socket");
      socket.current.disconnect();
      const videoTrack = globalStream.getVideoTracks()[0];
      const audioTrack = globalStream.getAudioTracks()[0];
      if (videoTrack.readyState === "live") { videoTrack.stop(); }
      if (audioTrack.readyState === "live") { audioTrack.stop(); }
    })

  }, []);

  useEffect(() => {
    socket.current.on("callPermissionGranted", (data) => {
      if (users[data.from]) {
        console.log("Permission Granted from " + users[data.from]);
        setCallingPermission(data.from);
      }
    });
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
    })
  }, [callingPermission])


  function callPeer(id) {
    setCallButtonDisability(true);

    peer.current = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
      reconnectTimer: true,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { url: "stun:stun1.l.google.com:19302" },
          { urls: "stun:global.stun.twilio.com:3478?transport=udp" },
        ],
      },
    });

    console.log("Call user");
    peer.current.on("signal", (data) => {
      socket.current.emit("callerSignal", {
        userToCall: id,
        signalData: data,
        from: yourID,
      });
    });
    socket.current.emit("callUser", { userToCall: id, from: yourID });

    peer.current.on("stream", (stream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    peer.current.on("connect", () => {
      toast.info("Connected");
    });

    socket.current.on("callAccepted", (signal) => {
      setCallAccepted(true);
      setRemoteUserId(id);
      peer.current.signal(signal);
      setCallButtonDisability(true);
      console.log("accepted");
      toast.info("connecting")
    });

    peer.current.on("error", (error) => {
      console.log(error);
      setRemoteUserId("");
      setCallAccepted(false);
      setCallButtonDisability(false);
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
      setCallButtonDisability(false);
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
    setCallButtonDisability(true);
    // setCaller(false);

    peer.current = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
      reconnectTimer: true,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { url: "stun:stun1.l.google.com:19302" },
          { urls: "stun:global.stun.twilio.com:3478?transport=udp" },
        ],
      },
    });

    peer.current.on("signal", (data) => {
      toast.info("connecting")
      socket.current.emit("acceptCall", { signal: data, to: remoteUserId });
    });

    peer.current.on("stream", (stream) => {
      partnerVideo.current.srcObject = stream;
    });

    peer.current.signal(callerSignal);

    peer.current.on("connect", () => {
      toast.info("Connected");
    });

    peer.current.on("error", (error) => {
      console.log(error);
      setCallAccepted(false);
      setCaller("");
      setRemoteUserId("");
      setCallerSignal();
      setCallButtonDisability(false);

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
      setCallButtonDisability(false);

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
        navigator.mediaDevices.getUserMedia({ video: videoCallConstraints.current }).then((newStream) => {
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
        navigator.mediaDevices.getDisplayMedia({ video: true, audio: true }).then((newStream) => {
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
    const textMessage = e.target.value;
    if (textMessage === "") {
      toast.error("Message Cannot be empty");
      return;
    }
    setMessages(oldMessage => [...oldMessage, { from: yourID, to: toUserId, text: textMessage }]);
    socket.current.emit("sendMessage", { from: yourID, to: modalData.current, message: textMessage });
    e.target.value = ""
  };

  const handleReceiveMessage = (from, message) => {
    setMessages(oldMessage => [...oldMessage, { from, to: yourID, text: message }])
    //open message modal
    modalData.current = from; setMessageModalShow(true)
  };

  const startUserMediaLoadingTimeout = (milisec) => {
    setUserMediaLoading(true);
    setTimeout(() => {
      setUserMediaLoading(false);
    }, milisec);
  };

  let UserVideo;
  let CallUserList;
  let callFaculty;
  if (stream) {
    UserVideo = (
      <video className="userVideo" playsInline muted ref={userVideo} autoPlay />
    );
    if (isAdminOrStaff) {
      CallUserList = Object.keys(users).map((key) => {
        if (key === yourID) {
          return null;
        }
        return (
          <Dropdown>
            <Dropdown.Toggle variant="info" >{users[key]}</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onSelect={() => callPeer(key)} disabled={callButtonDisability} >Call</Dropdown.Item>
              <Dropdown.Item onSelect={() => giveCallPermission(key)} disabled={callButtonDisability} >Give Permission</Dropdown.Item>
              <Dropdown.Item onSelect={() => { modalData.current = key; setMessageModalShow(true) }}> Message </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      });
    } else if (users[callingPermission]) {
      callFaculty = (
        <Card className='border border-secondary bg-transparent'>
          <Col style={{ color: "white", border: '3px' }}>
            <Row>{users[callingPermission]} :</Row>
            <Row>
              <Button variant="primary" onClick={() => callPeer(callingPermission)} disabled={callButtonDisability} style={{ margin: 5 }}> <MdCall /> </Button>
              <Button variant="success" onClick={() => { modalData.current = callingPermission; setMessageModalShow(true) }} style={{ margin: 5 }}><TiMessages /></Button>
            </Row>
          </Col>
        </Card>
      );
    }
  }

  let PartnerVideo;
  let endCallButton;

  if (callAccepted) {
    PartnerVideo = (
      <video className="partnerVideo" playsInline ref={partnerVideo} autoPlay />
    );
    endCallButton = (
      <div className="endCallButton">
        <Button variant="danger" onClick={() => endCall()}>End Call</Button>
      </div>
    );
  }

  let ToggleMediaButtons;
  const videobutton = videoStatus ? "success" : "danger";
  const audiobutton = audioStatus ? "success" : "danger";
  const screenSharebutton = screenShareStatus ? "success" : "danger";
  const videoIcon = videoStatus ? (<CameraVideo size={20} />) : (<CameraVideoOff size={20} />);
  const audioIcon = audioStatus ? <Mic size={20} /> : <MicMute size={20} />;
  const screenShareIcon = <ArrowBarUp size={20} />;
  const mediaButtonDisable = !callAccepted;
  ToggleMediaButtons = (
    <Row className="justify-content-md-center">
      <Button variant={videobutton} onClick={toggleVideo} style={{ margin: 5 }} disabled={mediaButtonDisable}> {videoIcon} </Button>
      <Button variant={audiobutton} onClick={toggleAudio} style={{ margin: 5 }} disabled={mediaButtonDisable}> {audioIcon} </Button>
      <Button variant={screenSharebutton} onClick={toggleScreenShare} style={{ margin: 5 }} disabled={mediaButtonDisable}> {screenShareIcon} </Button>
      {/* {videoStatus &&
        <Button onClick={toggleCamera} style={{ margin: 5 }} disabled={mediaButtonDisable}> <ArrowRepeat /> </Button>
      } */}
    </Row>
  );

  let lowInternetSpeedButton = (
    <Button onClick={(event) => {
      event.target.style.display = "none";
      videoCallConstraints.current = lowInternetSpeedVideoConstraints;
      if (videoStatus) { 
        toggleVideo(); 
        setTimeout(() => {
          toggleVideo();
        }, 1000);
      }
    }}>Low Internet Speed?</Button>
  )

  let incommintCall;
  if (receivingCall && users[remoteUserId] && callerSignal) {
    incommingCallAudio.play();

    incommintCall = (
      <div className="incommingCall">
        <Card className="text-center" style={{ background: "black", color: "white" }}>
          <Card.Header>
            <h2>{caller} is calling you</h2>
          </Card.Header>
          <Card.Body>
            <Card.Title></Card.Title>
            <Container>
              <Row>
                {/* <Col><Button size="lg" variant="danger" onClick={() => {}}>Reject</Button></Col> */}
                <Col><Button size="lg" variant="success" onClick={acceptCall}>Accept</Button></Col>
              </Row>
            </Container>
          </Card.Body>
          <Card.Footer className="text-muted"></Card.Footer>
        </Card>
      </div>
    );
  } else {
    incommingCallAudio.pause();
    incommingCallAudio.currentTime = 0;
  }

  return (
    <>
      {/* ABSOLUTE POSITIONED components  */}
      {incommintCall}
      {PartnerVideo}
      <div className="userElements">
        {UserVideo} {ToggleMediaButtons}
      </div>
      <div className="userElementsLoadingBox" hidden={!userMediaLoading}>
        <div className="userElementsLoadingSpinner"><LoadingTailSpin /></div>
      </div>
      {endCallButton}
      {/* DEFAULT POSITIONED components  */}
      <Container style={{ color: "white" }} fluid>
        <Row>
          {CallUserList} {callFaculty}
        </Row>
        <Row>
          <Col><h4>You: {currentUser.email}</h4> <h6 style={{ color: "green" }}>{yourID && "Online"}</h6> {lowInternetSpeedButton}</Col>
        </Row>
        <ToastContainer autoClose={2000} />
        <MessageModal
          show={messageModalShow}
          onHide={() => setMessageModalShow(false)}
          modalData={modalData.current}
          messages={messages}
          handleSendMessage={handleSendMessage}
        />
      </Container>
    </>
  );
}

export default VideoCall;
