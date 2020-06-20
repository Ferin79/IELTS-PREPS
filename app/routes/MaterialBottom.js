import React, { useContext } from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Home from "../screens/home/home";
import Test from "../screens/home/test";
import PracticeStackScreen from "./PracticeStack";
import { Context } from "../data/context";

const Tab = createMaterialBottomTabNavigator();

function MyTabs(props) {
  const { setInstitute_id } = useContext(Context);
  setInstitute_id(props.institute_id);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#fff"
      style={{ backgroundColor: "tomato" }}
      shifting
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: "Home",
          tabBarColor: "#0984e3",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Practice"
        component={PracticeStackScreen}
        options={{
          tabBarLabel: "Practice",
          tabBarColor: "#00cec9",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="play-circle-outline"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={Test}
        options={{
          tabBarLabel: "Account",
          tabBarColor: "#fd79a8",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default MyTabs;
