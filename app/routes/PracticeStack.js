import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import PracticeMain from "../screens/practice/Main";
import Listening from "../screens/practice/listening";
import Reading from "../screens/practice/reading";
import Writing from "../screens/practice/writing";
import Speaking from "../screens/practice/speaking";
import ListeningTest from "../screens/practice/ListeningTest";
import PDFOpener from "../screens/components/pdfOpener";
import Result from "../screens/practice/Result";
import ReadingTest from "../screens/practice/ReadingTest";
import WritingTest from "../screens/practice/WritingTest";

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
          headerTitle: "",
          headerBackTitle: "Back",
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
          headerTitle: "Listening Test",
        }}
      />
      <PracticeStack.Screen
        name="ReadingTest"
        component={ReadingTest}
        options={{
          headerTitle: "Reading Test",
        }}
      />
      <PracticeStack.Screen
        name="WritingTest"
        component={WritingTest}
        options={{
          headerTitle: "Writing Test",
        }}
      />
      <PracticeStack.Screen
        name="PDFOpener"
        component={PDFOpener}
        options={{ headerTitle: "PDF Viewer" }}
      />
      <PracticeStack.Screen
        name="Result"
        component={Result}
        options={{
          header: () => null,
        }}
      />
    </PracticeStack.Navigator>
  );
};

export default PracticeStackScreen;
