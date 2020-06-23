import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Settings from "../screens/settings/settings";
import Profile from "../screens/settings/profile";

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
    </AccountStack.Navigator>
  );
};
export default AccountStackScreen;
