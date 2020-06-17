import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { TextInput, Button, Checkbox } from "react-native-paper";
import firebase from "../../data/firebase";

const SignUp = ({ navigation }) => {
  const SCREEN_HEIGHT = Dimensions.get("window").height;
  const SCREEN_WIDTH = Dimensions.get("window").width;

  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  // const [termsAndConditions, setTermsAndConditions] = useState(false);
  // const [errorText, setErrorText] = useState("");

  const [checked, setChecked] = useState(false);

  // const validate = () => {

  //   if (email.trim() === ""){
  //     setErrorText("Email cannot be empty!"); return false;
  //   }else if (firstName.trim() === ""){
  //     setErrorText("firstName cannot be empty!"); return false;
  //   }else if (lastName.trim() === ""){
  //     setErrorText("lastName cannot be empty!"); return false;
  //   }else if (password.trim() === ""){
  //     setErrorText("password cannot be empty!"); return false;
  //   }else if (confirmPassword.trim() === ""){
  //     setErrorText("password cannot be empty!"); return false;
  //   }else if (password != confirmPassword){
  //     setErrorText("Passwords don't match!"); return false;
  //   }

  //   return true;

  // }

  // const signUpPressed = () => {
    
  //   if (validate) {

  //   }

  // }


  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ display: "flex", flex: 1 }}>
          <View
            style={{
              height: SCREEN_HEIGHT * 0.3,
              backgroundColor: "rgba(50,105,210,0.3)",
            }}
          >
            <Text
              style={{
                fontSize: 35,
                color: "#336ad0",
                textAlign: "center",
                marginTop: 20,
              }}
            >
              Sign Up
            </Text>
            <Image
              source={require("../../images/register.png")}
              style={{
                zIndex: 999,
                width: SCREEN_WIDTH * 0.8,
                height: SCREEN_HEIGHT * 0.3,
                transform: [
                  { translateY: (SCREEN_HEIGHT * 0.3) / 4 },
                  { translateX: (SCREEN_WIDTH * 0.8) / 8 },
                ],
              }}
            />
          </View>

          <View
            style={{
              height: SCREEN_HEIGHT * 0.7,
              marginTop: 150,
              marginHorizontal: 25,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <TextInput
                label="First Name"
                onChangeText={(text) => {}}
                style={{
                  width: SCREEN_WIDTH * 0.4,
                  backgroundColor: "#F5F5F5",
                  borderWidth: 1,
                  borderColor: "gray",
                }}
              />
              <TextInput
                label="Last Name"
                onChangeText={(text) => {}}
                style={{
                  width: SCREEN_WIDTH * 0.4,
                  backgroundColor: "#F5F5F5",
                  borderWidth: 1,
                  borderColor: "gray",
                }}
              />
            </View>
            <TextInput
              label="Email"
              onChangeText={(text) => {} }
              style={{
                backgroundColor: "#F5F5F5",
                borderWidth: 1,
                borderColor: "gray",
                marginBottom: 20,
              }}
            />
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <TextInput
                label="Password"
                onChangeText={(text) => {}}
                style={{
                  width: SCREEN_WIDTH * 0.4,
                  backgroundColor: "#F5F5F5",
                  borderWidth: 1,
                  borderColor: "gray",
                }}
              />
              <TextInput
                label="Again Password"
                onChangeText={(text) => {}}
                style={{
                  width: SCREEN_WIDTH * 0.4,
                  backgroundColor: "#F5F5F5",
                  borderWidth: 1,
                  borderColor: "gray",
                }}
              />
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Checkbox
                style={{ borderWidth: 1 }}
                uncheckedColor="#0af"
                color="#0af"
                status={checked ? "checked" : "unchecked"}
                onPress={() => {
                  setChecked((checked) => !checked);
                }}
              />
              <Text>
                I accept the{" "}
                <Text style={{ color: "#336ad0" }}>Terms and Conditions</Text>
              </Text>
            </View>
            <Button
              mode="contained"
              color="rgb(50,105,210)"
              onPress={() => {}}
              style={{ padding: 10 }}
            >
              Sign Up
            </Button>
            <Text style={{ textAlign: "center", opacity: 0.5, margin: 20 }}>
              OR
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Text style={{ textAlign: "center", fontSize: 20 }}>
                Already a member?{" "}
                <Text style={{ color: "#336ad0", fontWeight: "bold" }}>
                  Sign In
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default SignUp;
