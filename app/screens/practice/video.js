import React, { useEffect } from "react";
import { View, Text, Button } from "react-native";
import * as Linking from "expo-linking";

const Video = ({ navigation, route }) => {
  let link = `https://elegant-kowalevski-7f9401.netlify.app/#/userVideo/${route.params.channelId}`;

  const openBrowser = () => {
    Linking.openURL(link);
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
