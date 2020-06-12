import React from "react";
import {
  Text,
  View,
  Dimensions,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";

const SignIn = ({ navigation }) => {
  const SCREEN_HEIGHT = Dimensions.get("window").height;
  const SCREEN_WIDTH = Dimensions.get("window").width;

  return (
    <SafeAreaView style={{ display: "flex", flex: 1 }}>
      <ScrollView>
        <View style={{ display: "flex", flex: 1 }}>
          <View
            style={{
              height: SCREEN_HEIGHT * 0.3,
              backgroundColor: "rgba(70,130,100,0.3)",
            }}
          >
            <Text
              style={{
                fontSize: 35,
                color: "#0e8264",
                textAlign: "center",
                marginTop: 20,
              }}
            >
              Sign In
            </Text>
            <Image
              source={require("../../images/LoginUI.png")}
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
            <TextInput
              label="Email"
              onChangeText={(text) => {}}
              style={{
                backgroundColor: "#F5F5F5",
                borderWidth: 1,
                borderColor: "gray",
              }}
            />
            <TextInput
              label="Password"
              onChangeText={(text) => {}}
              style={{
                backgroundColor: "#F5F5F5",
                borderWidth: 1,
                borderColor: "gray",
                marginVertical: 20,
              }}
            />
            <Button
              mode="contained"
              color="rgb(70,130,100)"
              onPress={() => console.log("Pressed")}
              style={{ padding: 10 }}
            >
              Sign In
            </Button>
            <TouchableOpacity>
              <Text
                style={{
                  textAlign: "center",
                  textDecorationLine: "underline",
                  margin: 10,
                }}
              >
                Forgot Password
              </Text>
            </TouchableOpacity>
            <Text style={{ textAlign: "center", opacity: 0.5, margin: 10 }}>
              OR
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Sign Up");
              }}
            >
              <Text style={{ textAlign: "center", fontSize: 20 }}>
                Wait!!! New User?{" "}
                <Text style={{ color: "#0e8264", fontWeight: "bold" }}>
                  Sign Up
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
