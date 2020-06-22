import React, { useState, useContext } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { Button, ProgressBar } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import firebase from "../../data/firebase";
import LoadingScreen from "../components/LoadingScreen";
import { Context } from "../../data/context";
import Lightbox from "react-native-lightbox";

const WritingTest = ({ route, navigation, navigator }) => {
  const data = route.params.data;

  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingCompleted, setIsUploadingCompleted] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [percentage, setPercentage] = useState(null);

  const { institute_id } = useContext(Context);

  const SCREEN_WIDTH = Dimensions.get("window").width;
  const SCREEN_HEIGHT = Dimensions.get("window").height;

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

  const handleFilePickAndUpload = () => {
    DocumentPicker.getDocumentAsync({ type: "application/pdf" })
      .then(async (file) => {
        if (file.type === "success") {
          setIsUploading(true);
          const fileBlob = await uriToBlob(file.uri);
          var storageRef = firebase.storage().ref();
          var uploadTask = storageRef.child(`${Date.now()}`).put(fileBlob);
          uploadTask.on(
            "state_changed",
            function (snapshot) {
              var progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
              setPercentage(Math.round(parseInt(progress)));
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
              setIsUploadingCompleted(false);
            },
            function () {
              console.log(uploadTask.snapshot.ref.name);
              uploadTask.snapshot.ref
                .getDownloadURL()
                .then(function (downloadURL) {
                  console.log("File available at", downloadURL);
                  setIsUploading(false);
                  setIsUploadingCompleted(true);
                  setPdfUrl(downloadURL);
                });
            }
          );
        }
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Error Selecting File, Try Again");
      });
  };

  const submitExam = () => {
    if (pdfUrl.trim() !== "") {
      setIsLoading(true);
      firebase
        .firestore()
        .collection("writingUser")
        .doc(`${firebase.auth().currentUser.email}${data.id}`)
        .set({
          pdfUrl,
          email: firebase.auth().currentUser.email,
          createdAt: firebase.firestore.Timestamp.now(),
          writingTestId: data.id,
          isChecked: false,
          institute_id,
        })
        .then(() => {
          setIsLoading(false);
          console.log("Added To Database");
        })
        .catch((error) => {
          console.log(error);
          Alert.alert(error.message);
          setIsLoading(false);
        });
    } else {
      Alert.alert("Upload File First");
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View
          style={{
            height: SCREEN_HEIGHT * 0.4,
            width: SCREEN_WIDTH * 0.95,
            marginLeft: "auto",
            marginRight: "auto",
            backgroundColor: "#ffeaa7",
            marginVertical: 50,
            padding: 10,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              textDecorationLine: "underline",
            }}
          >
            INSTRUCTIONS:
          </Text>
          <View
            style={{
              display: "flex",
              flex: 1,
              justifyContent: "space-evenly",
              alignItems: "flex-start",
            }}
          >
            <Text style={{ fontSize: 16 }}>
              1. Write down your answers on a piece of paper.
            </Text>
            <Text style={{ fontSize: 16 }}>2. Create PDF file Only.</Text>
            <Text style={{ fontSize: 16 }}>
              3. Please Write your name on every page of PDF.
            </Text>
            <Text style={{ fontSize: 16 }}>
              4. Please remember, we will not check your essay if image/PDF has
              black/dark background.
            </Text>
          </View>
        </View>
        {data.isSummary && (
          <Lightbox navigator={navigator}>
            <Image
              source={{ uri: data.imageUrl }}
              style={{
                height: SCREEN_HEIGHT * 0.3,
                width: SCREEN_WIDTH * 0.9,
                resizeMode: "contain",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            />
          </Lightbox>
        )}
        <View style={{ margin: 20 }}>
          <Text style={{ fontSize: 20 }}>{data.question}</Text>
        </View>

        <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
          {isUploading && <ProgressBar progress={percentage} />}
          {isUploadingCompleted && (
            <View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("PDFOpener", { pdfUrl });
                }}
              >
                <Text>Check Your Uploaded PDF here: </Text>
                <Text style={{ color: "#0af" }}>{pdfUrl}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {isUploadingCompleted ? (
          <View>
            <Button
              style={{
                padding: 15,
                backgroundColor: "red",
                marginVertical: 20,
                marginHorizontal: 20,
              }}
              mode="contained"
              onPress={() => {
                setIsUploading(false);
                setPdfUrl(null);
                setIsUploadingCompleted(false);
              }}
            >
              Clear and Upload Another
            </Button>
            <Button
              style={{ padding: 15, backgroundColor: "#0af", margin: 50 }}
              mode="contained"
              onPress={() => submitExam()}
            >
              Submit
            </Button>
          </View>
        ) : (
          <Button
            style={{ padding: 15, backgroundColor: "#0af", margin: 50 }}
            mode="contained"
            onPress={() => handleFilePickAndUpload()}
          >
            Upload pdf
          </Button>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
export default WritingTest;
