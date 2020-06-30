import React, { useState, useContext } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Dimensions,
  ImageBackground,
  Alert,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { TextInput, Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import firebase from "../../data/firebase";
import LoadingScreen from "../components/LoadingScreen";
import { Context } from "../../data/context";

const Profile = ({ navigation }) => {
  const SCREEN_HEIGHT = Dimensions.get("window").height;
  const SCREEN_WIDTH = Dimensions.get("window").width;
  const { userData, setUserData } = useContext(Context);

  const [isLoading, setIsLoading] = useState(false);
  const [firstname, setFirstname] = useState(userData.firstname);
  const [lastname, setLastname] = useState(userData.lastname);

  const pickImage = async () => {
    setIsLoading(true);

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const blobImage = await uriToBlob(result.uri);
      var storageRef = firebase.storage().ref();
      var uploadTask = storageRef.child(`${Date.now()}`).put(blobImage);
      uploadTask.on(
        "state_changed",
        function (snapshot) {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
              console.log("Upload is paused");
              break;
            case firebase.storage.TaskState.RUNNING:
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        function (error) {
          console.log(error);
          setIsLoading(false);
          Alert.alert(error.message);
        },
        function () {
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then(function (downloadURL) {
              console.log("File available at", downloadURL);
              firebase
                .firestore()
                .doc(`/users/${firebase.auth().currentUser.email}`)
                .update({
                  photoUrl: downloadURL,
                })
                .then(async () => {
                  const data = userData;
                  data.photoUrl = downloadURL;
                  setUserData({ ...data });
                  setIsLoading(false);
                })
                .catch((error) => {
                  Alert.alert(error.message);
                  setIsLoading(false);
                });
            })
            .catch((error) => console.log(error));
        }
      );
    }
  };

  const uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };

      xhr.onerror = function () {
        reject(new Error("uriToBlob failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);

      xhr.send(null);
    });
  };

  const handleNameChange = () => {
    if (firstname.trim() === "") {
      Alert.alert("First Name cannot be empty");
    } else if (lastname.trim() === "") {
      Alert.alert("Last Name cannot be empty");
    } else {
      setIsLoading(true);
      firebase
        .firestore()
        .doc(`/users/${firebase.auth().currentUser.email}`)
        .update({
          firstname,
          lastname,
        })
        .then(() => {
          const data = userData;
          data.firstname = firstname;
          data.lastname = lastname;
          setUserData({ ...data });
          setIsLoading(false);
        })
        .catch((error) => console.log(error));
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, height: SCREEN_HEIGHT }}>
        <ImageBackground
          source={{
            uri: userData.photoUrl,
          }}
          style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.4 }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              margin: 20,
            }}
          >
            <FontAwesome
              name="close"
              size={30}
              color="#fff"
              onPress={() => navigation.goBack()}
            />
            <MaterialIcons
              name="edit"
              size={30}
              color="#fff"
              onPress={pickImage}
            />
          </View>
        </ImageBackground>
        <View
          style={{
            height: SCREEN_HEIGHT * 2,
            width: SCREEN_WIDTH * 0.9,
            backgroundColor: "#fff",
            position: "absolute",
            left: (SCREEN_WIDTH - SCREEN_WIDTH * 0.9) / 2,
            top: SCREEN_HEIGHT * 0.3,
          }}
        >
          <TextInput
            label="First Name"
            value={firstname}
            mode="flat"
            onChangeText={(text) => setFirstname(text)}
            style={{ margin: 20, backgroundColor: "#fff" }}
          />

          <TextInput
            label="Last Name"
            value={lastname}
            mode="flat"
            onChangeText={(text) => setLastname(text)}
            style={{ margin: 20, backgroundColor: "#fff" }}
          />

          <Button
            style={{
              marginHorizontal: 50,
              marginVertical: 20,
              backgroundColor: "#0af",
              padding: 10,
            }}
            mode="contained"
            onPress={() => handleNameChange()}
          >
            Update
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
