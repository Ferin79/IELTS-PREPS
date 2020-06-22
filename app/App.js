import React, { useState, useEffect } from "react";
import { SafeAreaView, StatusBar, AsyncStorage } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AuthStackScreen from "./routes/AuthStack";
import firebase from "./data/firebase";
import BottomScreen from "./routes/MaterialBottom";
import LoadingScreen from "./screens/components/LoadingScreen";
import SafeViewAndroid from "./screens/components/SafeAndroidView";
import { ContextProvider } from "./data/context";

let institute_id = "";

export default function App() {
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
    <SafeAreaView style={SafeViewAndroid.AndroidSafeArea}>
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
