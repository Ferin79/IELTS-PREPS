import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Dimensions,
  ScrollView,
  Slider,
  Alert,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { Video, Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

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
        uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      });
    } catch (error) {
      Alert.alert(error.message + "\n\n\n\n Contact Developer");
      console.log(error.message);
    }

    if (IS_MOUNTED) {
      playbackObject.setOnPlaybackStatusUpdate((onPlaybackStatusUpdate) => {
        console.log(onPlaybackStatusUpdate);
        setTotalTime(onPlaybackStatusUpdate.playableDurationMillis);
        setPassTime(onPlaybackStatusUpdate.positionMillis);
        setIsAudioPlaying(onPlaybackStatusUpdate.isPlaying);
      });
    }
  };

  useEffect(() => {
    IS_MOUNTED = true;
    initializeEmptyUserAnswer();
    if (examData.type === "audio") {
      loadAudio();
    }
    return async () => {
      IS_MOUNTED = false;
      await playbackObject.unloadAsync();
    };
  }, []);

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
                borderRadius: 50,
              }}
            >
              <Slider
                maximumValue={totalTime}
                minimumValue={0}
                value={passTime}
                onValueChange={(event) =>
                  playbackObject.setPositionAsync(event)
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
              onPress={() => {}}
            >
              Open PDF
            </Button>
          </View>
        ) : (
          <View>
            <View style={{ backgroundColor: "#000" }}>
              <Video
                ref={(ref) => (videoRef = ref)}
                source={{ uri: examData.videoUrl }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="cover"
                useNativeControls
                style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.4 }}
              />
            </View>
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
                    1. Write down your answers on a piece of paper as you
                    listen.
                  </Text>
                  <Text style={{ fontSize: 16 }}>
                    2. We don't recommend you to fill the answers field below as
                    you listen, because it can leads problems in exam.
                  </Text>
                  <Text style={{ fontSize: 16 }}>
                    3. You can fill the answers after your listening test is
                    over. Then Submit your exam to see score.
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
                  height: SCREEN_HEIGHT * 1.5,
                  width: SCREEN_WIDTH * 0.8,
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginTop: 50,
                }}
              >
                <Button
                  style={{ padding: 20, backgroundColor: "#0af" }}
                  mode="contained"
                  onPress={() => console.log(userAnswer)}
                >
                  Submit Exam
                </Button>
              </View>
            </ScrollView>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
export default ListeningTest;
