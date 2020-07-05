import React, { useContext, useEffect } from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { Context } from "../data/context";
import PracticeStackScreen from "./PracticeStack";
import Chat from "../screens/chat/Chat";
import AccountStackScreen from "./AccountStack";
import firebase from "../data/firebase";
import HomeStackScreen from "./HomeStack";

const Tab = createMaterialBottomTabNavigator();

function MyTabs(props) {
  const { setUserData, setInstitute_id } = useContext(Context);
  setInstitute_id(props.institute_id);

  useEffect(() => {
    firebase
      .firestore()
      .doc(`/users/${firebase.auth().currentUser.email}`)
      .get()
      .then((doc) => {
        const data = {
          firstname: doc.data().firstname,
          lastname: doc.data().lastname,
          photoUrl:
            doc.data().photoUrl ||
            "https://firebasestorage.googleapis.com/v0/b/ielts-preps.appspot.com/o/person.png?alt=media&token=c008c65c-aee6-426d-bc1d-aad8143c11b2",
        };
        setUserData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Tab.Navigator initialRouteName="HomeScreen" activeColor="#fff" shifting>
      <Tab.Screen
        name="HomeScreen"
        component={HomeStackScreen}
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
