import React from "react";

const PartnerVideo = ({ callAccepted, partnerVideo }) => {
  if (callAccepted) {
    return (
      <>
        <div className="partnervideo-wrapper">
          <video
            className="partnerVideo"
            playsInline
            ref={partnerVideo}
            autoPlay
          />
        </div>
      </>
    );
  } else {
    return <span></span>;
  }
};

export default PartnerVideo;
