import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

function AdminVideo() {
  const [stream, setStream] = useState(null);
  const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState({});
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);

  const socket = useRef();
  const partnerVideo = useRef();
  const userVideo = useRef();

  useEffect(() => {
    socket.current = io.connect("http://localhost:8000");
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      })
      .catch((error) => {
        alert(error.message);
        console.log(error);
      });

    socket.current.on("yourID", (id) => {
      setYourID(id);
    });

    socket.current.on("allUsers", (users) => {
      setUsers(users);
    });

    socket.current.on("hey", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });
  }, []);

  function callPeer(id) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.current.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: yourID,
      });
    });

    peer.on("stream", (stream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.current.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
  }

  function acceptCall() {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.current.emit("acceptCall", { signal: data, to: caller });
    });

    peer.on("stream", (stream) => {
      partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
  }

  let UserVideo;
  if (stream) {
    UserVideo = (
      <video
        playsInline
        muted
        ref={userVideo}
        autoPlay
        style={{ height: 500, width: 500 }}
      />
    );
  }

  let PartnerVideo;
  if (callAccepted) {
    PartnerVideo = (
      <video
        playsInline
        ref={partnerVideo}
        autoPlay
        style={{ height: 500, width: 500 }}
      />
    );
  }

  let incomingCall;
  if (receivingCall) {
    incomingCall = (
      <div>
        <h1>{caller} is calling you</h1>
        <button onClick={acceptCall}>Accept</button>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <div>
        {UserVideo}
        {PartnerVideo}
      </div>
      <div>
        {Object.keys(users).map((key) => {
          if (key === yourID) {
            return null;
          }
          return (
            <button key={key} onClick={() => callPeer(key)}>
              Call {key}
            </button>
          );
        })}
      </div>
      {incomingCall}
    </div>
  );
}

export default AdminVideo;
