import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/home/home";
import Statistics from "../screens/home/statistics";
import PDFOpener from "../screens/components/pdfOpener";

const HomeStack = createStackNavigator();

const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeScreen"
        component={Home}
        options={{ header: () => null }}
      />
      <HomeStack.Screen
        name="Statistics"
        component={Statistics}
        options={{
          headerTitle: "Statistics",
          headerTitleAlign: "center",
          headerBackTitle: "Back",
        }}
      />
      <HomeStack.Screen
        name="PDFOpener"
        component={PDFOpener}
        options={{ headerTitle: "PDF Viewer" }}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackScreen;
