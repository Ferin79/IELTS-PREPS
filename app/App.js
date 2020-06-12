import React, { useState } from "react";
import { Text, View, SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AuthStackScreen from "./routes/AuthStack";

export default function App() {
  const [isLogin, setIsLogin] = useState(false);
  return (
    <SafeAreaView style={{ display: "flex", flex: 1 }}>
      <NavigationContainer>
        {!isLogin ? (
          <AuthStackScreen />
        ) : (
          <View>
            <Text>Login In</Text>
          </View>
        )}
      </NavigationContainer>
    </SafeAreaView>
  );
}
