import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, Button } from "react-native";
import * as Permissions from "expo-permissions";

const Speaking = ({ navigation }) => {
  async function checkMultiPermissions() {
    const { status, expires, permissions } = await Permissions.getAsync(
      Permissions.CAMERA,
      Permissions.AUDIO_RECORDING
    );
    if (status !== "granted") {
      alert("Hey! You have not enabled selected permissions");
    }
  }

  const [appId, setAppId] = useState("4f746271be5f4a1daade603da022bdcf");
  const [channelId, setChannelId] = useState("1234567890");

  useEffect(() => {
    checkMultiPermissions();
  }, []);

  return (
    <ScrollView>
      <View>
        <Text>Speaking</Text>
        <Button
          title="Start Call"
          onPress={() => navigation.navigate("Video", { appId, channelId })}
        />
      </View>
    </ScrollView>
  );
};

export default Speaking;
