import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/home/home";
import Statistics from "../screens/home/statistics";

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
    </HomeStack.Navigator>
  );
};

export default HomeStackScreen;
