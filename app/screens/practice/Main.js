import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  Image,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import Swiper from "react-native-deck-swiper";
import { LinearGradient } from "expo-linear-gradient";

const PracticeMain = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const moduleList = [
    {
      id: 1,
      title: "Listening",
      desc: "Practice over 100 Listening Full Length Test",
      icon: require("../../images/headphones.png"),
      grad1: "#ff9a9e",
      grad2: "#fad0c4",
      to: "PracticeListening",
    },
    {
      id: 2,
      title: "Reading",
      desc: "Practice over 100 Reading Full Length Test",
      icon: require("../../images/book.png"),
      grad1: "#fbc2eb",
      grad2: "#a6c1ee",
      to: "PracticeReading",
    },
    {
      id: 3,
      title: "Speaking",
      desc:
        "Connect Direclty to Institute Instructor via Video Call for Speaking test",
      icon: require("../../images/discussion.png"),
      grad1: "#84fab0",
      grad2: "#8fd3f4",
      to: "PracticeSpeaking",
    },
    {
      id: 4,
      title: "Writing",
      desc: "Submit your Essays, Letters and Summaries ...",
      icon: require("../../images/write.png"),
      grad1: "#a1c4fd",
      grad2: "#c2e9fb",
      to: "PracticeWriting",
    },
  ];
  return (
    <SafeAreaView style={{ display: "flex", flex: 1 }}>
      <View
        style={{
          display: "flex",
          flex: 10,
          justifyContent: "flex-end",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <Swiper
          useViewOverflow={Platform.OS === "ios"}
          cards={moduleList}
          cardIndex={currentIndex}
          onSwiper={() =>
            setCurrentIndex((currentIndex + 1) % moduleList.length)
          }
          stackSize={3}
          stackScale={10}
          stackSeparator={13}
          disableTopSwipe
          disableBottomSwipe
          animateCardOpacity
          backgroundColor={"transparent"}
          infinite
          renderCard={(card) => {
            return (
              <TouchableWithoutFeedback
                style={{ flex: 1 }}
                onPress={() => {
                  navigation.navigate(`${card.to}`);
                }}
              >
                <LinearGradient
                  colors={[card.grad1, card.grad2]}
                  style={{
                    flex: 0.5,
                    borderRadius: 8,
                    shadowRadius: 25,
                    shadowColor: "#000",
                    shadowOpacity: 0.08,
                    shadowOffset: { width: 0, height: 0 },
                    justifyContent: "space-evenly",
                    padding: 20,
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flex: 1,
                      justifyContent: "space-between",
                      flexDirection: "row",
                      margin: 20,
                    }}
                  >
                    <Text style={{ fontSize: 35, color: "#fff" }}>
                      {card.title}
                    </Text>
                    <Image
                      source={card.icon}
                      style={{ height: 75, width: 75 }}
                    />
                  </View>
                  <Text style={{ fontSize: 18, color: "#fff" }}>
                    {card.desc}
                  </Text>
                </LinearGradient>
              </TouchableWithoutFeedback>
            );
          }}
        />
      </View>
      <View
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <Text style={{ fontSize: 15 }}>
          Swipe <Text style={{ fontWeight: "bold" }}>Left</Text> or{" "}
          <Text style={{ fontWeight: "bold" }}>Right</Text> to change
        </Text>
        <Text style={{ fontSize: 15 }}>
          <Text style={{ fontWeight: "bold" }}>Tap</Text> to Select Module
        </Text>
      </View>
    </SafeAreaView>
  );
};
export default PracticeMain;
