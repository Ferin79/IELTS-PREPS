import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Settings from "../screens/settings/settings";
import Profile from "../screens/settings/profile";
import Notifications from "../screens/settings/notifications";
import FAQ from "../screens/settings/faq";

const AccountStack = createStackNavigator();

const AccountStackScreen = () => {
  return (
    <AccountStack.Navigator>
      <AccountStack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerTitle: "",
          header: () => null,
        }}
      />
      <AccountStack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerTitle: "",
          header: () => null,
        }}
      />
      <AccountStack.Screen
        name="Notifications"
        component={Notifications}
        options={{
          headerTitle: "Notifications",
          headerBackTitle: "Back",
        }}
      />
      <AccountStack.Screen
        name="FAQ"
        component={FAQ}
        options={{
          headerTitle: "FAQ",
          headerBackTitle: "Back",
        }}
      />
    </AccountStack.Navigator>
  );
};
export default AccountStackScreen;
