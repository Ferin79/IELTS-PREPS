import React from "react";
import { View, SafeAreaView, ActivityIndicator, Text } from "react-native";

const LoadingScreen = ({ text }) => {
  return (
    <SafeAreaView
      style={{
        display: "flex",
        flex: 1,
      }}
    >
      <View
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size={"large"} color="#0af" />
        <Text style={{ fontSize: 20, marginVertical: 20 }}>{text}</Text>
      </View>
    </SafeAreaView>
  );
};

export default LoadingScreen;
