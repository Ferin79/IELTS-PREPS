import React from "react";

const UserVideo = ({ stream, userVideo }) => {
  if (stream) {
    return (
      <>
        <div className="userVideo-Wrapper">
          <video
            className="userVideo"
            playsInline
            muted
            ref={userVideo}
            autoPlay
          />
        </div>
      </>
    );
  } else {
    return <span></span>;
  }
};

export default UserVideo;
