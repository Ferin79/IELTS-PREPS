import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import PracticeMain from "../screens/practice/Main";
import Listening from "../screens/practice/listening";
import Reading from "../screens/practice/reading";
import Writing from "../screens/practice/writing";
import Speaking from "../screens/practice/speaking";
import ListeningTest from "../screens/practice/ListeningTest";

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
      <PracticeStack.Screen
        name="PracticeListening"
        component={Listening}
        options={{
          header: () => null,
        }}
      />
      <PracticeStack.Screen
        name="PracticeReading"
        component={Reading}
        options={{
          header: () => null,
        }}
      />
      <PracticeStack.Screen
        name="PracticeWriting"
        component={Writing}
        options={{
          header: () => null,
        }}
      />
      <PracticeStack.Screen
        name="PracticeSpeaking"
        component={Speaking}
        options={{
          header: () => null,
        }}
      />
      <PracticeStack.Screen
        name="ListeningTest"
        component={ListeningTest}
        options={{
          header: () => null,
        }}
      />
    </PracticeStack.Navigator>
  );
};

export default PracticeStackScreen;
