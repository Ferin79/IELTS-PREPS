import React, { useState, useEffect } from "react";
import { SafeAreaView, StatusBar, AsyncStorage, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import * as Updates from "expo-updates";
import AuthStackScreen from "./routes/AuthStack";
import firebase from "./data/firebase";
import BottomScreen from "./routes/MaterialBottom";
import LoadingScreen from "./screens/components/LoadingScreen";
import { ContextProvider } from "./data/context";

let institute_id = "";

export default function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkForUpdate = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        Alert.alert(
          "Update Available",
          "Your App will be updated. Application will restart automatically after update.",
          [
            {
              text: "OK",
              onPress: async () => {
                console.log("Update Started");
                await Updates.reloadAsync();
              },
            },
          ]
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

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
    checkForUpdate();
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
