import { useState, useEffect } from "react";
import AgoraRTC from "../util/AgoraEnhancer";
const fakeClient = AgoraRTC.createClient({
  mode: "live",
  codec: "vp8",
});
const noop = () => {};
const useMicrophone = (client = fakeClient) => {
  const [microphoneList, setMicrophoneList] = useState([]);
  useEffect(() => {
    let mounted = true;
    const onChange = () => {
      if (!client) {
        return;
      }
      client
        .getRecordingDevices()
        .then((microphones) => {
          if (mounted) {
            setMicrophoneList(microphones);
          }
        })
        .catch(noop);
    };
    client && client.on("recording-device-changed", onChange);
    onChange();
    return () => {
      mounted = false;
      client &&
        client.gatewayClient.removeEventListener(
          "recordingDeviceChanged",
          onChange
        );
    };
  }, [client]);
  return microphoneList;
};
export default useMicrophone;
