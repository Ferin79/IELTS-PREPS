import React, { useRef } from "react";
import { Button } from "react-bootstrap";
const Recording = () => {

  const recorder = useRef(false);
  const stream = useRef(false);

  async function startRecording() {
    stream.current = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true
    });
    recorder.current = new MediaRecorder(stream.current);
  
    const chunks = [];
    recorder.current.ondataavailable = e => chunks.push(e.data);
    recorder.current.onstop = (e) => {
      const completeBlob = new Blob(chunks, { type: chunks[0].type });
      console.log(chunks);
      require("downloadjs")(completeBlob, "recording.webm", chunks[0].type);
    };
  
    recorder.current.start();
  }

  function stopRecording() {
    recorder.current.stop();
    stream.current.getVideoTracks()[0].stop();
  }

  return (
    <div>
      <Button onClick={startRecording}>Start Recording</Button>
      <Button onClick={stopRecording} variant="danger">Stop Recording</Button>

    </div>
  );
};

export default Recording;
