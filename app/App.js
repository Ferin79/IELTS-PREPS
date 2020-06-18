import React, { useState, useEffect } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AuthStackScreen from "./routes/AuthStack";
import firebase from "./data/firebase";
import BottomScreen from "./routes/MaterialBottom";
import LoadingScreen from "./screens/components/LoadingScreen";
import SafeViewAndroid from "./screens/components/SafeAndroidView";

export default function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setIsLoading(false);
        setIsLogin(true);
      } else {
        setIsLoading(false);
        setIsLogin(false);
      }
    });
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={SafeViewAndroid.AndroidSafeArea}>
      <StatusBar backgroundColor="black" />
      <NavigationContainer>
        {!isLogin ? <AuthStackScreen /> : <BottomScreen />}
      </NavigationContainer>
    </SafeAreaView>
  );
}
