import { useState, useEffect } from "react";
import AgoraRTC from "../util/AgoraEnhancer";
const fakeClient = AgoraRTC.createClient({
  mode: "live",
  codec: "vp8",
});
const noop = () => {};
const useCamera = (client = fakeClient) => {
  const [cameraList, setCameraList] = useState([]);
  useEffect(() => {
    let mounted = true;
    const onChange = () => {
      if (!client) {
        return;
      }
      client
        .getCameras()
        .then((cameras) => {
          if (mounted) {
            setCameraList(cameras);
          }
        })
        .catch(noop);
    };
    client && client.on("camera-changed", onChange);
    onChange();
    return () => {
      mounted = false;
      client &&
        client.gatewayClient.removeEventListener("cameraChanged", onChange);
    };
  }, [client]);
  return cameraList;
};
export default useCamera;
