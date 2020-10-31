import React from "react";
import {
  RiCameraLine,
  RiCameraOffLine,
  RiMicFill,
  RiMicOffFill,
} from "react-icons/ri";
import { MdScreenShare } from "react-icons/md";
import { FcEndCall } from "react-icons/fc";
import Spinner from "react-bootstrap/Spinner";

const VideoToggle = ({
  callAccepted,
  toggleVideo,
  videoStatus,
  toggleAudio,
  audioStatus,
  toggleScreenShare,
  screenShareStatus,
  endCall,
  userMediaLoading,
}) => {
  const mediaButtonDisable = !callAccepted;
  if (userMediaLoading) {
    return <Spinner animation="grow" variant="primary" />;
  }
  return (
    <div className="videoToggle-wrapper">
      {videoStatus ? (
        <div className="btn-toggle-styler">
          <RiCameraLine onClick={toggleVideo} size={30} color={videoStatus ? "#000" : "red"} disabled={mediaButtonDisable} />
        </div>
      ) : (
        <div className="btn-toggle-styler">
          <RiCameraOffLine size={30} onClick={toggleVideo} disabled={mediaButtonDisable} color={videoStatus ? "#000" : "red"} />
        </div>
      )}

      {audioStatus ? (
        <div className="btn-toggle-styler">
          <RiMicFill size={30} color={audioStatus ? "#000" : "red"} onClick={toggleAudio} disabled={mediaButtonDisable} />
        </div>
      ) : (
        <div className="btn-toggle-styler">
          <RiMicOffFill
            size={30}
            onClick={toggleAudio}
            color={audioStatus ? "#000" : "red"}
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
};

export default VideoToggle;
