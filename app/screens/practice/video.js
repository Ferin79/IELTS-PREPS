import React, { useEffect } from "react";
import { View, Text, Button } from "react-native";
import * as Linking from "expo-linking";
import firebase from "../../data/firebase";

let link = "";
let adminURL = "";
const Video = ({ navigation, route }) => {
  const openBrowser = () => {
    firebase
      .firestore()
      .collection("urls")
      .get()
      .then((docs) => {
        docs.forEach((doc) => {
          adminURL = doc.data().adminURL;
        });
        link = `${adminURL}#/userVideo/${route.params.channelId}`;
        Linking.openURL(link);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    openBrowser();
  }, []);
  return (
    <View
      style={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        margin: 50,
      }}
    >
      <Text>
        If you are not redirected to web browser, then tap on below Button.
      </Text>
      <Button onPress={() => openBrowser()} title="Open" />
      <Button onPress={() => navigation.goBack()} color="red" title="Close" />
    </View>
  );
};

export default Video;
