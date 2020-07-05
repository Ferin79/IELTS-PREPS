import React, { useState, useEffect } from "react";
import { SafeAreaView, StatusBar, AsyncStorage, YellowBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AuthStackScreen from "./routes/AuthStack";
import firebase from "./data/firebase";
import BottomScreen from "./routes/MaterialBottom";
import LoadingScreen from "./screens/components/LoadingScreen";
import { ContextProvider } from "./data/context";
import _ from "lodash";

let institute_id = "";

export default function App() {
  YellowBox.ignoreWarnings(["Setting a timer"]);
  const _console = _.clone(console);
  console.warn = (message) => {
    if (message.indexOf("Setting a timer") <= -1) {
      _console.warn(message);
    }
  };
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        institute_id = await AsyncStorage.getItem("@institute_id");
        if (institute_id) {
          setIsLoading(false);
          setIsLogin(true);
        } else {
          firebase.auth().signOut();
        }
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
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="#000" />
      <NavigationContainer>
        <ContextProvider>
          {!isLogin ? (
            <AuthStackScreen />
          ) : (
            <BottomScreen institute_id={institute_id} />
          )}
        </ContextProvider>
      </NavigationContainer>
    </SafeAreaView>
  );
}
