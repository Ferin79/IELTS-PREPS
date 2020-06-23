import React, { useContext } from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { Context } from "../data/context";
import Home from "../screens/home/home";
import PracticeStackScreen from "./PracticeStack";
import Chat from "../screens/chat/Chat";
import AccountStackScreen from "./AccountStack";

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
          tabBarColor: "#00b894",
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
        name="Chat"
        component={Chat}
        options={{
          tabBarLabel: "Chat",
          tabBarColor: "#6c5ce7",
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-chatboxes" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountStackScreen}
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
