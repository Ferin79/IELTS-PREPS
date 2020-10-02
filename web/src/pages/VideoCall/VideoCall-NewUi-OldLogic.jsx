import React, { useEffect, useState, useRef, useContext } from "react";
import "./styles.css";
import io from "socket.io-client";
import Peer from "simple-peer";
import { Button, Col, Row, Form, Container, Card } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { CameraVideo, CameraVideoOff, MicMute, Mic, ArrowBarUp } from "react-bootstrap-icons/";
import { Context } from "../../data/context";
import { AuthContext } from "../../data/auth";
import PopMessageBox from "../../components/popMessageBox";
import Spinner from "react-bootstrap/Spinner";
import { RiCameraLine, RiCameraOffLine, RiMicFill, RiMicOffFill } from "react-icons/ri";
import { MdScreenShare } from "react-icons/md";
import { FcEndCall } from "react-icons/fc";

const incommingCallAudio = new Audio(require("../../images/skype_remix_2.mp3"));
incommingCallAudio.loop = true;

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
  // const [cameraMode, setCameraMode] = useState("user");
  const cameraMode = "user";

  useEffect(() => {
    // 1. connect to server
    socket.current = io.connect("http://localhost:8000/");
    // socket.current = io.connect("");
    navigator.mediaDevices.getUserMedia({ video: { facingMode: cameraMode }, audio: true }).then((stream) => {
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
      socket.current.emit("initializeUser", {uniqueName: currentUser.email,role,});
    });
    socket.current.on("allUsers", (data) => {
      setUsers(data.users);
      console.log("Update" + data.users);
      setRoles(data.role);
    });

    socket.current.on("receiveSignal", (data) => {
      console.log("Reciving signal");
      setCallerSignal(data.signal);
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

  function callPeer(id) {
    setCallButtonDisability(true);

    peer.current = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
      // reconnectTimer: true,
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
      setCallingPermission(false);
    });

    peer.current.on("error", (error) => {
      console.log(error);
      setRemoteUserId("");
      setCallAccepted(false);
      setCallButtonDisability(false);

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
      // reconnectTimer: true,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { url: "stun:stun1.l.google.com:19302" },
          { urls: "stun:global.stun.twilio.com:3478?transport=udp" },
        ],
      },
    });

    peer.current.on("signal", (data) => {
      console.log("call accept signal");
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

  function endCall(key) {
    peer.current.destroy("Call ended");
    socket.current.emit("endCall", { id: remoteUserId });
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
        navigator.mediaDevices.getUserMedia({ video: { facingMode: cameraMode } }).then((newStream) => {
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
  //   navigator.mediaDevices.getUserMedia({ video: { facingMode: cameraMode } }).then(newStream => {
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

  const startUserMediaLoadingTimeout = (milisec) => {
    setUserMediaLoading(true);
    setTimeout(() => {
      setUserMediaLoading(false);
    }, milisec);
  };

  let UserVideo = (<span></span>);
  let CallUserList = (<span></span>);
  let callFaculty  = (<span></span>);
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
          <div style={{color: "white"}}>
          {users[key]} :
            <Button variant="primary" onClick={() => callPeer(key)} disabled={callButtonDisability} style={{ margin: 5 }}>
              Call 
            </Button>
            <Button variant="success" onClick={() => giveCallPermission(key)} disabled={callButtonDisability} style={{ margin: 5 }}>
              give Permission
            </Button>
          </div>
        );
      });
    } else if (callingPermission) {
      callFaculty = (
        <Button variant="primary" onClick={() => callPeer(callingPermission)} disabled={callButtonDisability} style={{ margin: 5 }}> Call {users[callingPermission]} </Button>
      );
    }
  }
  if (stream) {
    UserVideo = (
      <div className="userVideo-Wrapper">
        <video className="userVideo" playsInline muted ref={userVideo} autoPlay />
      </div>
    );
    if (isAdminOrStaff) {
      CallUserList = Object.keys(users).map((key) => {
        if (key === yourID) {
          return null;
        }
        return (
          <div style={{color: "white"}}>
          {users[key]} :
            <Button variant="primary" onClick={() => callPeer(key)} disabled={callButtonDisability} style={{ margin: 5 }}>
              Call 
            </Button>
            <Button variant="success" onClick={() => giveCallPermission(key)} disabled={callButtonDisability} style={{ margin: 5 }}>
              give Permission
            </Button>
          </div>
        );
      });
    } else if (callingPermission) {
      callFaculty = (
        <Button variant="primary" onClick={() => callPeer(callingPermission)} disabled={callButtonDisability} style={{ margin: 5 }}> Call {users[callingPermission]} </Button>
      );
    }
  }

  let PartnerVideo = (<span></span>);
  let endCallButton;

  if (callAccepted) {
    PartnerVideo = (
      <>
        <div className="partnervideo-wrapper"> 
          <video className="partnerVideo" playsInline ref={partnerVideo} autoPlay /> 
        </div>
      </>
    );
    endCallButton = (
      <div className="endCallButton">
        <Button variant="danger" onClick={() => endCall()}>End Call</Button>
      </div>
    );
  }

  let ToggleMediaButtons;
  const mediaButtonDisable = !callAccepted;
  if (userMediaLoading) {
    ToggleMediaButtons = <Spinner animation="border" variant="primary" />;
  }
  ToggleMediaButtons = (
    <div className="videoToggle-wrapper">
      {videoStatus ? (
        <div className="btn-toggle-styler">
          <RiCameraLine
            onClick={toggleVideo}
            size={30}
            color={videoStatus ? "green" : "red"}
            disabled={mediaButtonDisable}
          />
        </div>
      ) : (
        <div className="btn-toggle-styler">
          <RiCameraOffLine size={30} onClick={toggleVideo} disabled={mediaButtonDisable} color={videoStatus ? "#000" : "red"} />
        </div>
      )}

      {audioStatus ? (
        <div className="btn-toggle-styler">
          <RiMicFill
            size={30}
            color={audioStatus ? "green" : "red"}
            onClick={toggleAudio}
            disabled={mediaButtonDisable}
          />
        </div>
      ) : (
        <div className="btn-toggle-styler">
          <RiMicOffFill
            size={30}
            onClick={toggleAudio}
            color={audioStatus ? "green" : "red"}
            disabled={mediaButtonDisable}
          />
        </div>
      )}

      <div className="btn-toggle-styler">
        <MdScreenShare
          size={30}
          onClick={toggleScreenShare}
          disabled={mediaButtonDisable}
          color={screenShareStatus ? "green" : "red"}
        />
      </div>
      {callAccepted ? (
        <div className="btn-toggle-styler">
          <FcEndCall size={30} onClick={() => endCall()} />
        </div>
      ) : (
        <span></span>
      )}
      {/* {videoStatus &&
        <Button onClick={toggleCamera} style={{ margin: 5 }} disabled={mediaButtonDisable}> <ArrowRepeat /> </Button>
      } */}
    </div>
  );

  let incommintCall = (<span></span>);
  if (receivingCall && users[remoteUserId] && callerSignal) {
    incommingCallAudio.play();

    incommintCall = (
      <div className="incoming-call-wrapper">
      <h6>Incoming Call</h6>
      <p>from</p>
      <h3>{caller}</h3>
      <div className="incomming-call-btn">
        <Button variant="outline-danger" onClick={() => {}}>
          Reject
        </Button>

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

  return (
    <>
      <Container fluid>
        <Row>
          <Col>{incommintCall}</Col>
        </Row>

        <Row className="row-second-section">
          <div className="all-video-wrapper-section">
            <div className="all-video-wrapper">
              {PartnerVideo} {UserVideo}
            </div>
            {ToggleMediaButtons}
          </div>

          <div className="sidebar-message-section">
            <PopMessageBox />
          </div>
        </Row>

        <Row>
          <Col>{CallUserList} {callFaculty}</Col>
        </Row>

        <ToastContainer autoClose={2000} />
      </Container>
    </>
  );
}

export default VideoCall;
