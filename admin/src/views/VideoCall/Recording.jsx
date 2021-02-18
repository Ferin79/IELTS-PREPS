import React, { useRef } from "react";
import { Button } from "react-bootstrap";
import MultiStreamsMixer from 'multistreamsmixer';

const Recording = () => {

  const recorder = useRef(false);
  const displayStream = useRef(false);
  const mixedStream = useRef(false);
  const audioStream = useRef(false);
  const mixedVideo = useRef(false);

  async function startRecording() {
    displayStream.current = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true
    });

    audioStream.current = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    let mixer = new MultiStreamsMixer([audioStream.current, displayStream.current]);

    mixedStream.current = mixer.getMixedStream();
    mixer.frameInterval = 1;
    mixer.startDrawingFrames();

    console.log(mixedStream.current, displayStream.current);

    mixedVideo.current.srcObject = mixedStream.current;

    recorder.current = new MediaRecorder(mixedStream.current);

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
    audioStream.current.getAudioTracks()[0].stop();
    displayStream.current.getVideoTracks()[0].stop();
  }

  return (
    <div>
      <Button onClick={startRecording}>Start Recording</Button>
      <Button onClick={stopRecording} variant="danger">Stop Recording</Button>
      <video playsInline ref={mixedVideo} autoPlay />
    </div>
  );
};

export default Recording;
