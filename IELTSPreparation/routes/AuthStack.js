import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SignIn from "../screens/auth/SignInScreen";
import SignUp from "../screens/auth/SignUpScreen";

const AuthStackScreen = () => {
  const AuthStack = createStackNavigator();
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="Sign In"
        component={SignIn}
        options={{ header: () => null }}
      />
      <AuthStack.Screen
        name="Sign Up"
        component={SignUp}
        options={{ header: () => null }}
      />
    </AuthStack.Navigator>
  );
};

export default AuthStackScreen;
