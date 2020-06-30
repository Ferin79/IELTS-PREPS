import React, { useReducer, useState } from "react";
import StreamPlayer from "agora-stream-player";
import { SnackbarProvider, useSnackbar } from "notistack";
import { useMediaStream } from "./hooks";
import AgoraRTC from "./util/AgoraEnhancer";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

const useStyles = () => ({
  root: {
    flexGrow: 1,
    padding: 12,
  },
  title: {
    fontWeight: 400,
  },
  divider: {
    marginBottom: "32px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-around",
  },
  buttonItem: {
    width: "38.2%",
    margin: 5,
  },
  advanceSettings: {
    marginTop: 16,
  },
});

const defaultState = {
  appId: "4f746271be5f4a1daade603da022bdcf",
  channel: "",
  uid: "",
  token: undefined,
  cameraId: "",
  microphoneId: "",
  mode: "rtc",
  codec: "h264",
};

const reducer = (state, action) => {
  switch (action.type) {
    default:
      return state;
    case "setAppId":
      return Object.assign(Object.assign({}, state), { appId: action.value });
    case "setChannel":
      return Object.assign(Object.assign({}, state), { channel: action.value });
    case "setUid":
      return Object.assign(Object.assign({}, state), { uid: action.value });
    case "setToken":
      return Object.assign(Object.assign({}, state), { token: action.value });
    case "setCamera":
      return Object.assign(Object.assign({}, state), {
        cameraId: action.value,
      });
    case "setMicrophone":
      return Object.assign(Object.assign({}, state), {
        microphoneId: action.value,
      });
    case "setMode":
      return Object.assign(Object.assign({}, state), { mode: action.value });
    case "setCodec":
      return Object.assign(Object.assign({}, state), { codec: action.value });
  }
};

const App = ({ match }) => {
  const classes = useStyles();
  const [appId, setAppId] = useState("4f746271be5f4a1daade603da022bdcf");
  const [channelName, setChannelName] = useState(match.params.channel);
  const [isJoined, setisJoined] = useState(false);
  const [, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [state, dispatch] = useReducer(reducer, defaultState);
  const [agoraClient, setClient] = useState(null);
  let [localStream, remoteStreamList] = useMediaStream(agoraClient);

  const { enqueueSnackbar } = useSnackbar();

  // eslint-disable-next-line
  const update = (actionType) => (e) => {
    return dispatch({
      type: actionType,
      value: e.target.value,
    });
  };

  // Starts the video call

  const join = async () => {
    // Creates a new agora client with given parameters.
    // mode can be 'rtc' for real time communications or 'live' for live broadcasting.
    const client = AgoraRTC.createClient({
      mode: state.mode,
      codec: state.codec,
    });
    // Loads client into the state
    setClient(client);
    setIsLoading(true);
    try {
      const uid = isNaN(Number(state.uid)) ? null : Number(state.uid);

      // initializes the client with appId
      await client.init(appId);

      // joins a channel with a token, channel, user id
      await client.join(state.token, channelName, uid);

      // create a ne stream
      const stream = AgoraRTC.createStream({
        streamID: uid || 12345,
        video: true,
        audio: true,
        screen: false,
      });

      // stream.setVideoProfile('480p_4')

      // Initalize the stream
      await stream.init();

      // Publish the stream to the channel.
      await client.publish(stream);

      // Set the state appropriately
      setIsPublished(true);
      setisJoined(true);
      enqueueSnackbar(`Joined channel ${channelName}`, { variant: "info" });
    } catch (err) {
      enqueueSnackbar(`Failed to join, ${err}`, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // Publish function to publish the stream to Agora. No need to invoke this after join.
  // This is to be invoke only after an unpublish
  // eslint-disable-next-line
  const publish = async () => {
    setIsLoading(true);
    try {
      if (localStream) {
        // Publish the stream to the channel.
        await agoraClient.publish(localStream);
        setIsPublished(true);
      }
      enqueueSnackbar("Stream published", { variant: "info" });
    } catch (err) {
      enqueueSnackbar(`Failed to publish, ${err}`, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // Leaves the channel on invoking the function call.
  const leave = async () => {
    setIsLoading(true);
    try {
      if (localStream) {
        // Closes the local stream. This de-allocates the resources and turns off the camera light
        localStream.close();
        // unpublish the stream from the client
        agoraClient.unpublish(localStream);
      }
      // leave the channel
      await agoraClient.leave();
      setIsPublished(false);
      setisJoined(false);
      enqueueSnackbar("Left channel", { variant: "info" });
    } catch (err) {
      enqueueSnackbar(`Failed to leave, ${err}`, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // Used to unpublish the stream.
  // eslint-disable-next-line
  const unpublish = () => {
    if (localStream) {
      // unpublish the stream from the client
      agoraClient.unpublish(localStream);
      setIsPublished(false);
      enqueueSnackbar("Stream unpublished", { variant: "info" });
    }
  };

  const JoinLeaveBtn = () => {
    return (
      <Button
        className={classes.buttonItem}
        onClick={isJoined ? leave : join}
        variant={isJoined ? "outline-danger" : "outline-info"}
        disabled={isLoading}
      >
        {isJoined ? "Leave" : "Join"}
      </Button>
    );
  };

  return (
    <React.Fragment>
      <Container fluid>
        <Row>
          <Col item xs={12} md={4}>
            <Card>
              <Card.Body>
                <Form noValidate autoComplete="off">
                  <Form.Label>App Id</Form.Label>
                  <Form.Control
                    required
                    readOnly
                    value={appId}
                    onChange={(event) => setAppId(event.target.value)}
                    id="appId"
                    label="App ID"
                    fullWidth
                    margin="normal"
                  />
                  <Form.Label>Channel</Form.Label>
                  <Form.Control
                    required
                    readOnly
                    value={channelName}
                    onChange={(event) => setChannelName(event.target.value)}
                    id="channel"
                    label="Channel"
                    fullWidth
                    margin="normal"
                  />
                </Form>
              </Card.Body>
              <Card.Body className={classes.buttonContainer}>
                <JoinLeaveBtn />
              </Card.Body>
            </Card>
          </Col>

          {/* display area */}
          <Col item xs={12} md={8}>
            {localStream && (
              <StreamPlayer stream={localStream} fit="contain" label="local" />
            )}
            {remoteStreamList.map((stream) => (
              <StreamPlayer
                key={stream.getId()}
                stream={stream}
                fit="contain"
                label={stream.getId()}
              />
            ))}
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default function AppWithNotification({ match }) {
  return (
    <SnackbarProvider
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      autoHideDuration={2500}
      maxSnack={5}
    >
      <App match={match} />
    </SnackbarProvider>
  );
}