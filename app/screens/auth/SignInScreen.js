import React, { useState, useContext } from "react";
import {
  Text,
  View,
  Dimensions,
  SafeAreaView,
  Image,
  TouchableOpacity,
  AsyncStorage,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import firebase from "../../data/firebase";
import LoadingScreen from "../components/LoadingScreen";
import { Context } from "../../data/context";

const SignIn = ({ navigation }) => {
  const SCREEN_HEIGHT = Dimensions.get("window").height;
  const SCREEN_WIDTH = Dimensions.get("window").width;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setInstitute_id } = useContext(Context);

  const signInhandle = () => {
    setErrorText("");
    if (email.trim() === "") {
      setErrorText("Email annot be empty");
      return;
    } else if (password.trim() === "") {
      setErrorText("Password annot be empty");
      return;
    } else {
      setIsLoading(false);
      firebase
        .firestore()
        .doc(`/users/${email}`)
        .get()
        .then(async (doc) => {
          if (doc.exists) {
            if (doc.data().isStudent) {
              await AsyncStorage.setItem(
                "@institute_id",
                doc.data().institute_id
              );
              setInstitute_id(doc.data().institute_id);
              firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then(() => {
                  setIsLoading(false);
                })
                .catch((error) => {
                  setIsLoading(false);
                  console.log(error);
                  setErrorText(error.message);
                });
            } else {
              setIsLoading(false);
              setErrorText("Admin and Staff are not allowed to login here");
            }
          } else {
            setIsLoading(false);
            setErrorText("User Account Not found");
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.log(error);
          setErrorText(error.message);
        });
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={{ display: "flex", flex: 1 }}>
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
              onChangeText={(text) => setEmail(text)}
              style={{
                backgroundColor: "#F5F5F5",
                borderWidth: 1,
                borderColor: "gray",
              }}
            />
            <TextInput
              label="Password"
              secureTextEntry
              onChangeText={(text) => setPassword(text)}
              style={{
                backgroundColor: "#F5F5F5",
                borderWidth: 1,
                borderColor: "gray",
                marginVertical: 20,
              }}
            />
            <Text
              style={{
                textAlign: "center",
                margin: 10,
                fontSize: 15,
                color: "red",
              }}
            >
              {errorText}
            </Text>
            <Button
              mode="contained"
              color="rgb(50,105,210)"
              onPress={() => signInhandle()}
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
                <Text style={{ color: "#336ad0", fontWeight: "bold" }}>
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
