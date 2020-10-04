import React from "react";
import Draggable from "react-draggable";

const UserVideo = ({ stream, userVideo }) => {
  if (stream) {
    return (
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
  } else {
    return <span></span>;
  }
};

export default UserVideo;
