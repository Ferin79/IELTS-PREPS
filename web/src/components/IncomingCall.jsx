import React from "react";
import Button from "react-bootstrap/Button";

const IncomingCall = (props) => {
  if (
    props.receivingCall &&
    props.users[props.remoteUserId] &&
    props.callerSignal
  ) {
    props.incommingCallAudio.play();

    return (
      <div className="incoming-call-wrapper">
        <h6>Incoming Call</h6>
        <p>from</p>
        <h3>{props.caller}</h3>
        <div className="incomming-call-btn">
          <Button variant="outline-danger" onClick={() => {}}>
            Reject
          </Button>

          <Button variant="outline-success" onClick={props.acceptCall}>
            Accept
          </Button>
        </div>
      </div>
    );
  } else {
    props.incommingCallAudio.pause();
    props.incommingCallAudio.currentTime = 0;
    return <span></span>;
  }
};

export default IncomingCall;
