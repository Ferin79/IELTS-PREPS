import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import HTML from "react-native-render-html";
import { List, Divider, Button, TextInput } from "react-native-paper";
import {
  IGNORED_TAGS,
  alterNode,
  makeTableRenderer,
} from "react-native-render-html-table-bridge";
import WebView from "react-native-webview";
import LoadingScreen from "../components/LoadingScreen";
import firebase from "../../data/firebase";
import { Context } from "../../data/context";

const ReadingTest = ({ navigation, route }) => {
  const section1Passage = route.params.data.section1Passage;
  const section1Ques = route.params.data.section1Ques;

  const section2Passage = route.params.data.section2Passage;
  const section2Ques = route.params.data.section2Ques;

  const section3Passage = route.params.data.section3Passage;
  const section3Ques = route.params.data.section3Ques;

  const correactAnswer = route.params.data.answersData;

  const id = route.params.data.id;

  const SCREEN_WIDTH = Dimensions.get("window").width;
  const SCREEN_HEIGHT = Dimensions.get("window").height;

  const [userAnswer, setUserAnswer] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { institute_id } = useContext(Context);

  const config = {
    WebViewComponent: WebView,
  };

  const renderers = {
    table: makeTableRenderer(config),
  };

  const htmlConfig = {
    alterNode,
    renderers,
    ignoredTags: IGNORED_TAGS,
  };

  const calculateScore = () => {
    setIsLoading(true);
    let correctScore = 0;
    let incorrectScore = 0;
    let notattemptScore = 0;

    let correctAnswer = correactAnswer;
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
      .collection("readingUser")
      .doc(`${firebase.auth().currentUser.email}${id}`)
      .set({
        correctScore,
        incorrectScore,
        notattemptScore,
        userAnswer,
        band,
        email: firebase.auth().currentUser.email,
        createdAt: firebase.firestore.Timestamp.now(),
        readingTestId: id,
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

  useEffect(() => {
    initializeEmptyUserAnswer();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView>
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
              alignItems: "flex-start",
            }}
          >
            <Text style={{ fontSize: 16 }}>
              1. Write down your answers on a piece of paper as you Read.
            </Text>
            <Text style={{ fontSize: 16 }}>
              2. We don't recommend you to fill the answers field below as you
              read, because it can leads problems in exam.
            </Text>
            <Text style={{ fontSize: 16 }}>
              3. You can fill the answers after your reading test is over. Then
              Submit your exam to see score.
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              4. Type all answers in Capital letters only.
            </Text>
          </View>
        </View>
        <View style={{ margin: 10 }}>
          <List.AccordionGroup>
            <List.Accordion title="Section 1" id="1">
              <HTML
                html={section1Passage}
                imagesMaxWidth={Dimensions.get("window").width}
                {...htmlConfig}
              />
              <Divider
                style={{ backgroundColor: "#000", padding: 3, margin: 20 }}
              />
              <HTML
                html={section1Ques}
                imagesMaxWidth={Dimensions.get("window").width}
                {...htmlConfig}
              />
            </List.Accordion>
            <List.Accordion title="Section 2" id="2">
              <HTML
                html={section2Passage}
                imagesMaxWidth={Dimensions.get("window").width}
                {...htmlConfig}
              />
              <Divider
                style={{ backgroundColor: "#000", padding: 3, margin: 20 }}
              />
              <HTML
                html={section2Ques}
                imagesMaxWidth={Dimensions.get("window").width}
                {...htmlConfig}
              />
            </List.Accordion>
            <List.Accordion title="Section 3" id="3">
              <HTML
                html={section3Passage}
                imagesMaxWidth={Dimensions.get("window").width}
                {...htmlConfig}
              />
              <Divider
                style={{ backgroundColor: "#000", padding: 3, margin: 20 }}
              />
              <HTML
                html={section3Ques}
                imagesMaxWidth={Dimensions.get("window").width}
                {...htmlConfig}
              />
            </List.Accordion>
          </List.AccordionGroup>
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
                    autoCapitalize="characters"
                    label={item.index + ". Enter Answer"}
                    onChangeText={(text) => {
                      const data = userAnswer;
                      data[index].value = text.toUpperCase();
                      setUserAnswer([...data]);
                    }}
                  />
                </View>
              );
            })}
        </View>
        <View
          style={{
            width: SCREEN_WIDTH * 0.8,
            marginLeft: "auto",
            marginRight: "auto",
            marginVertical: 50,
          }}
        >
          <Button
            style={{ padding: 20, backgroundColor: "#0af" }}
            mode="contained"
            onPress={() => {
              console.log("Correct Answer");
              console.log(correactAnswer);
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
      </ScrollView>
    </SafeAreaView>
  );
};
export default ReadingTest;
