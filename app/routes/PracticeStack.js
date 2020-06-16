import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import PracticeMain from "../screens/practice/Main";
import { View } from "react-native";

const PracticeStackScreen = () => {
  const PracticeStack = createStackNavigator();
  return (
    <PracticeStack.Navigator>
      <PracticeStack.Screen
        name="PracticeMain"
        component={PracticeMain}
        options={{
          header: () => null,
        }}
      />
    </PracticeStack.Navigator>
  );
};

export default PracticeStackScreen;
