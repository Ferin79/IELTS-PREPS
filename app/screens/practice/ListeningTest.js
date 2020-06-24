import React, { useState, useEffect, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Dimensions,
  ScrollView,
  Slider,
  Alert,
  Image,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { Video, Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import LoadingScreen from "../components/LoadingScreen";
import firebase from "../../data/firebase";
import { Context } from "../../data/context";

let playbackObject = new Audio.Sound();
let IS_MOUNTED = false;

const ListeningTest = ({ navigation, route }) => {
  const examData = route.params.data;

  const SCREEN_WIDTH = Dimensions.get("window").width;
  const SCREEN_HEIGHT = Dimensions.get("window").height;

  const [userAnswer, setUserAnswer] = useState([]);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [totalTime, setTotalTime] = useState(null);
  const [passTime, setPassTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { institute_id } = useContext(Context);

  const initializeEmptyUserAnswer = () => {
    const data = [];
    for (var i = 0; i < 40; i++) {
      data.push({
        index: i + 1,
        value: "",
      });
    }
    setUserAnswer([...data]);
  };

  const loadAudio = async () => {
    try {
      await playbackObject.loadAsync({
        uri: examData.audioUrl,
      });
    } catch (error) {
      Alert.alert(error.message + "\n\n\n\n Contact Developer");
      console.log(error.message);
    }

    if (IS_MOUNTED) {
      playbackObject.setOnPlaybackStatusUpdate((onPlaybackStatusUpdate) => {
        console.log(onPlaybackStatusUpdate);
        setTotalTime(onPlaybackStatusUpdate.durationMillis);
        setPassTime(onPlaybackStatusUpdate.positionMillis);
        setIsAudioPlaying(onPlaybackStatusUpdate.isPlaying);
      });
    }
  };

  const calculateScore = () => {
    setIsLoading(true);
    let correctScore = 0;
    let incorrectScore = 0;
    let notattemptScore = 0;

    let correctAnswer = examData.answers;
    for (var i = 0; i < 40; i++) {
      if (userAnswer[i].value.trim() === "") {
        notattemptScore++;
        userAnswer[i].color = "black";
      } else if (userAnswer[i].value === correctAnswer[i].value) {
        correctScore++;
        userAnswer[i].color = "green";
      } else if (userAnswer[i].value !== correctAnswer[i].value) {
        incorrectScore++;
        userAnswer[i].color = "red";
      } else {
      }
    }
    let band = 0;
    switch (correctScore) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        band = 2.5;
        break;
      case 6:
      case 7:
        band = 3;
        break;
      case 8:
      case 9:
        band = 3.5;
        break;

      case 10:
      case 11:
      case 12:
        band = 4;
        break;
      case 13:
      case 14:
        band = 4.5;
        break;
      case 15:
      case 16:
      case 17:
      case 18:
        band = 5;
        break;
      case 19:
      case 20:
      case 21:
      case 22:
        band = 5.5;
        break;
      case 23:
      case 24:
      case 25:
      case 26:
        band = 6;
        break;
      case 27:
      case 28:
      case 29:
        band = 6.5;
        break;
      case 30:
      case 31:
      case 32:
        band = 7;
        break;
      case 33:
      case 34:
        band = 7.5;
        break;
      case 35:
      case 36:
        band = 8;
        break;
      case 37:
      case 38:
        band = 8.5;
        break;
      case 39:
      case 40:
        band = 9;
        break;
      default:
        console.log("Invalid Band");
        break;
    }
    console.log(correctScore);
    console.log(incorrectScore);
    console.log(notattemptScore);
    console.log(userAnswer);

    firebase
      .firestore()
      .collection("listeningUser")
      .doc(`${firebase.auth().currentUser.email}${examData.id}`)
      .set({
        correctScore,
        incorrectScore,
        notattemptScore,
        userAnswer,
        band,
        email: firebase.auth().currentUser.email,
        createdAt: firebase.firestore.Timestamp.now(),
        listeningTestId: examData.id,
        institute_id,
      })
      .then(() => {
        setIsLoading(false);
        navigation.navigate("Result", {
          correctScore,
          incorrectScore,
          notattemptScore,
          userAnswer,
          correctAnswer,
          band,
        });
      })
      .catch((error) => {
        console.log(error);
        Alert.alert(error.message);
        setIsLoading(false);
      });
  };

  function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  useEffect(() => {
    IS_MOUNTED = true;
    initializeEmptyUserAnswer();
    if (examData.type === "audio") {
      loadAudio();
    }
    return async () => {
      IS_MOUNTED = false;
      if (examData.type === "audio") {
        await playbackObject.unloadAsync();
      }
    };
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <SafeAreaView>
      <View>
        {examData.type === "audio" ? (
          <View>
            <View
              style={{
                width: SCREEN_WIDTH * 0.8,
                marginLeft: "auto",
                marginRight: "auto",
                marginVertical: 20,
                borderWidth: 1,
                padding: 20,
                borderRadius: 30,
                backgroundColor: "#fff",
                shadowOffset: {
                  width: 10,
                  height: 10,
                },
                shadowOpacity: 0.2,
                shadowRadius: 10,
              }}
            >
              <Image
                source={require("../../images/headphones.gif")}
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  height: 150,
                  width: 150,
                }}
              />
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text>{millisToMinutesAndSeconds(passTime)}</Text>
                <Text>{millisToMinutesAndSeconds(totalTime)}</Text>
              </View>
              <Slider
                maximumValue={totalTime}
                minimumValue={0}
                value={passTime}
                onValueChange={async (event) =>
                  await playbackObject.playFromPositionAsync(event)
                }
              />
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {isAudioPlaying ? (
                  <Ionicons
                    name="ios-pause"
                    size={50}
                    onPress={async () => {
                      await playbackObject.pauseAsync();
                    }}
                  />
                ) : (
                  <Ionicons
                    name="ios-play"
                    size={50}
                    onPress={async () => {
                      await playbackObject.playAsync();
                    }}
                  />
                )}
              </View>
            </View>
            <Button
              mode="contained"
              style={{
                width: SCREEN_WIDTH * 0.8,
                padding: 15,
                marginLeft: "auto",
                marginRight: "auto",
                backgroundColor: "#0af",
              }}
              onPress={() => {
                navigation.navigate("PDFOpener", {
                  pdfUrl: examData.pdfUrl,
                });
              }}
            >
              Open PDF
            </Button>
          </View>
        ) : (
          <View>
            <View style={{ backgroundColor: "#000" }}>
              <Video
                source={{ uri: examData.videoUrl }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="cover"
                useNativeControls
                style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.4 }}
              />
            </View>
          </View>
        )}
        <ScrollView>
          <View
            style={{
              height: SCREEN_HEIGHT * 0.4,
              width: SCREEN_WIDTH * 0.95,
              marginLeft: "auto",
              marginRight: "auto",
              backgroundColor: "#ffeaa7",
              marginVertical: 50,
              padding: 10,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                textDecorationLine: "underline",
              }}
            >
              INSTRUCTIONS:
            </Text>
            <View
              style={{
                display: "flex",
                flex: 1,
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 16 }}>
                1. Write down your answers on a piece of paper as you listen.
              </Text>
              <Text style={{ fontSize: 16 }}>
                2. We don't recommend you to fill the answers field below as you
                listen, because it can leads problems in exam.
              </Text>
              <Text style={{ fontSize: 16 }}>
                3. You can fill the answers after your listening test is over.
                Then Submit your exam to see score.
              </Text>
            </View>
          </View>
          <View>
            <Text style={{ fontSize: 20, textAlign: "center" }}>
              Enter Your Answer Here
            </Text>

            {userAnswer &&
              userAnswer.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      width: SCREEN_WIDTH * 0.8,
                      marginLeft: "auto",
                      marginRight: "auto",
                      marginVertical: 10,
                    }}
                  >
                    <TextInput
                      type="outlined"
                      label={item.index + ". Enter Answer"}
                      onChangeText={(text) => {
                        const data = userAnswer;
                        data[index].value = text;
                        setUserAnswer([...data]);
                      }}
                    />
                  </View>
                );
              })}
          </View>
          <View
            style={{
              height: SCREEN_HEIGHT,
              width: SCREEN_WIDTH * 0.8,
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: 50,
            }}
          >
            <Button
              style={{ padding: 20, backgroundColor: "#0af" }}
              mode="contained"
              onPress={() => {
                console.log("Correct Answer");
                console.log(examData.answers);
                console.log("User Answer");
                console.log(userAnswer);
                Alert.alert(
                  "Submit Exam",
                  "Are you sure ??? You want to submit exam and get score.",
                  [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    { text: "OK", onPress: () => calculateScore() },
                  ],
                  { cancelable: false }
                );
              }}
            >
              Submit Exam
            </Button>
          </View>
          <View style={{ height: SCREEN_HEIGHT * 0.3 }}></View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
export default ListeningTest;
