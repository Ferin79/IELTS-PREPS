import React, { useEffect, useState, useContext } from "react";
import {
  ScrollView,
  View,
  Text,
  Alert,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
  YellowBox,
  Modal,
  ImageBackground,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons, MaterialIcons, AntDesign } from "@expo/vector-icons";
import firebase from "../../data/firebase";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { Notifications } from "expo";
import LoadingScreen from "../components/LoadingScreen";
import { Banner } from "react-native-paper";
import { Context } from "../../data/context";

let IS_MOUNTED = false;

const Chat = ({ navigation }) => {
  let scrollViewRef;
  YellowBox.ignoreWarnings(["Setting a timer"]);

  var colorIndex = 0;
  const colors = [
    "rgba(225,0,0,0.5)",
    "rgba(0,225,0,0.5)",
    "rgba(0,0,225,0.5)",
    "rgba(225,225,0,0.5)",
    "rgba(0,225,225,0.5)",
    "rgba(225,0,225,0.5)",
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState([]);
  const [typedMessage, setTypedMessage] = useState("");
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [expoPushToken, setExpoPushToken] = useState("");
  const [showBanner, setShowBanner] = useState(false);

  const { institute_id } = useContext(Context);

  const registerForPushNotificationsAsync = async () => {
    setIsLoading(true);
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      const token = await Notifications.getExpoPushTokenAsync();
      console.log(token);
      setExpoPushToken(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    setIsLoading(false);
  };
  const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        Alert.alert(
          "Sorry, we need camera roll permissions to make this work!"
        );
      }
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
  const _pickImage = async () => {
    if (IS_MOUNTED) {
      try {
        setIsLoading(true);
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 1,
        });
        if (!result.cancelled) {
          uriToBlob(result.uri).then((blob) => {
            firebase
              .storage()
              .ref()
              .child(`${firebase.auth().currentUser.uid}-${Date.now()}`)
              .put(blob, {
                contentType: "image/jpeg",
              })
              .then((snapshot) => {
                firebase
                  .firestore()
                  .collection("chat")
                  .add({
                    uid: firebase.auth().currentUser.uid,
                    sender: firebase.auth().currentUser.email,
                    imageUrl: firebase.auth().currentUser.photoURL,
                    text: "",
                    createdAt: new Date().toISOString(),
                    institute_id,
                    image: `https://firebasestorage.googleapis.com/v0/b/ielts-preps.appspot.com/o/${snapshot.metadata.name}?alt=media`,
                  })
                  .then(() => {
                    console.log("Added to Database");
                    if (IS_MOUNTED) {
                      setIsLoading(false);
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              });
          });
        } else {
          if (IS_MOUNTED) {
            setIsLoading(false);
          }
        }
      } catch (E) {
        console.log(E);
        if (IS_MOUNTED) {
          setIsLoading(false);
        }
      }
    }
  };
  useEffect(() => {
    IS_MOUNTED = true;
    setShowBanner(true);
    getPermissionAsync();
    firebase
      .firestore()
      .collection("chat")
      .where("institute_id", "==", institute_id)
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        let changes = snapshot.docChanges();
        const receivedMessage = [];
        changes.forEach((change) => {
          receivedMessage.push(change.doc.data());
        });
        setMessage((message) => {
          return [...receivedMessage, ...message];
        });
      });
    return () => {
      console.log("Component Unmounted");
      IS_MOUNTED = false;
    };
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <KeyboardAwareScrollView
      style={{
        display: "flex",
        flex: 1,
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
      }}
    >
      <Banner
        visible={showBanner}
        actions={[
          {
            label: "OK",
            onPress: () => setShowBanner(false),
          },
          {
            label: "Go Back",
            onPress: () => {
              navigation.navigate("Home");
              setShowBanner(false);
            },
          },
        ]}
        icon={({ size }) => (
          <Ionicons name="ios-warning" color="#f39c12" size={size} />
        )}
      >
        The Messages can seen by everyone with an institution. Sent message
        cannot be deleted.
      </Banner>
      <View
        style={{
          height: Dimensions.get("window").height * 0.75,
          backgroundColor: "lightgrey",
          width: Dimensions.get("window").width,
        }}
      >
        <ScrollView
          style={{ flex: 1 }}
          ref={(ref) => {
            scrollViewRef = ref;
          }}
          onContentSizeChange={() =>
            scrollViewRef.scrollToEnd({ animated: true })
          }
        >
          {message.length > 0 ? (
            message
              .map((item, index) => {
                const dateConverted = new Date(item.createdAt);
                if (colorIndex === 6) {
                  colorIndex = 0;
                }

                if (item.uid === firebase.auth().currentUser.uid) {
                  return (
                    <View
                      key={index}
                      style={{
                        padding: 10,
                        backgroundColor: "grey",
                        minWidth: Dimensions.get("window").width * 0.3,
                        maxWidth: Dimensions.get("window").width * 0.7,
                        height: "auto",
                        marginVertical: 5,
                        borderRadius: 50,
                        marginLeft: "auto",
                        overflow: "hidden",
                      }}
                    >
                      {item.image.trim() === "" ? (
                        <Text
                          style={{
                            fontSize: 20,
                            color: "#FFF",
                            paddingLeft: 20,
                          }}
                        >
                          {item.text}
                        </Text>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedImageUrl(item.image);
                            setModalVisible(true);
                          }}
                        >
                          <Image
                            source={{ uri: item.image }}
                            style={{
                              flex: 1,
                              height: 500,
                              width: Dimensions.get("window").width * 0.7,
                              borderRadius: 50,
                            }}
                          />
                        </TouchableOpacity>
                      )}
                      <Text
                        style={{
                          textAlign: "right",
                          fontSize: 10,
                          color: "#fff",
                          paddingRight: 20,
                        }}
                      >
                        {dateConverted.toLocaleTimeString()}
                      </Text>
                    </View>
                  );
                } else {
                  return (
                    <View
                      key={index}
                      style={{
                        padding: 10,
                        backgroundColor: colors[colorIndex++],
                        maxWidth: Dimensions.get("window").width * 0.7,
                        height: "auto",
                        marginVertical: 5,
                        borderRadius: 50,
                        overflow: "hidden",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#fff",
                          paddingLeft: 20,
                          paddingTop: 10,
                        }}
                      >
                        From: {item.sender}
                      </Text>
                      {item.image.trim() === "" ? (
                        <Text
                          style={{
                            fontSize: 20,
                            color: "#FFF",
                            paddingLeft: 20,
                          }}
                        >
                          {item.text}
                        </Text>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedImageUrl(item.image);
                            setModalVisible(true);
                          }}
                        >
                          <Image
                            source={{ uri: item.image }}
                            style={{
                              flex: 1,
                              height: 500,
                              width: Dimensions.get("window").width * 0.7,
                              borderRadius: 50,
                            }}
                          />
                        </TouchableOpacity>
                      )}
                      <Text
                        style={{
                          textAlign: "right",
                          fontSize: 10,
                          color: "#fff",
                          paddingRight: 20,
                        }}
                      >
                        {dateConverted.toLocaleTimeString()}
                      </Text>
                    </View>
                  );
                }
              })
              .reverse()
          ) : (
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                height: Dimensions.get("window").height * 0.7,
              }}
            >
              <Text style={{ fontSize: 25 }}>No Messages ...</Text>
              <Text style={{ margin: 10 }}>Start Conversation</Text>
            </View>
          )}
        </ScrollView>
      </View>
      <View
        style={{
          height: Dimensions.get("window").height * 0.1,
          width: Dimensions.get("window").width,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        <View style={{ flex: 4 }}>
          <TextInput
            placeholder="Type Message ....."
            value={typedMessage}
            onChangeText={(event) => setTypedMessage(event)}
            style={{ width: "80%", height: "100%" }}
          />
        </View>
        <TouchableOpacity onPress={_pickImage}>
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              padding: 20,
            }}
          >
            <MaterialIcons name="attach-file" size={30} color="#0af" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            const data = typedMessage;
            if (data.trim() === "") {
              return;
            }
            setTypedMessage("");
            firebase
              .firestore()
              .collection("chat")
              .add({
                uid: firebase.auth().currentUser.uid,
                sender: firebase.auth().currentUser.email,
                imageUrl: firebase.auth().currentUser.photoURL,
                image: "",
                createdAt: new Date().toISOString(),
                text: data,
                institute_id,
              })
              .then(() => {
                console.log("Added to Database");
              })
              .catch((error) => {
                console.log(error);
              });
          }}
        >
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              padding: 20,
            }}
          >
            <Ionicons name="md-send" size={30} color="#0af" />
          </View>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View
          style={{
            height: Dimensions.get("window").height,
            width: Dimensions.get("window").width,
          }}
        >
          <ImageBackground
            source={{ uri: selectedImageUrl }}
            style={{ flex: 1, height: null, width: null }}
          >
            <TouchableOpacity
              onPress={() => {
                setSelectedImageUrl("");
                setModalVisible(false);
              }}
            >
              <AntDesign
                name="closecircleo"
                size={30}
                color="#000"
                style={{ margin: 25, padding: 10 }}
              />
            </TouchableOpacity>
          </ImageBackground>
        </View>
      </Modal>
    </KeyboardAwareScrollView>
  );
};

export default Chat;
