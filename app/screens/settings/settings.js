import React, { useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
  Modal,
} from "react-native";
import { Avatar, Divider, Badge } from "react-native-paper";
import * as Linking from "expo-linking";
import {
  AntDesign,
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
  Entypo,
} from "@expo/vector-icons";
import firebase from "../../data/firebase";
import { Context } from "../../data/context";

const Settings = ({ navigation }) => {
  const { userData, institute_id } = useContext(Context);
  const [notifications, setNotifications] = useState([]);
  const [showBadge, setShowBadge] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [instituteDetails, setInstituteDetails] = useState({});

  const fetchInstitutionDetails = () => {
    firebase
      .firestore()
      .doc(`/institution/${institute_id}`)
      .get()
      .then((doc) => {
        console.log(doc.data());
        setInstituteDetails({ ...doc.data() });
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    setShowBadge(true);
    fetchInstitutionDetails();
    firebase
      .firestore()
      .collection("notifications")
      .orderBy("createdAt", "desc")
      .get()
      .then((docs) => {
        const data = [];
        docs.forEach((doc) => {
          data.push({ ...doc.data(), id: doc.id });
        });
        setNotifications([...data]);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <SafeAreaView>
      <View>
        <Text
          style={{
            fontSize: 25,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          Settings
        </Text>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            marginTop: 20,
            paddingBottom: 20,
            borderBottomWidth: 0.5,
          }}
        >
          <Avatar.Image
            size={75}
            source={{
              uri: userData.photoUrl,
            }}
          />
          <View>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {userData.firstname} {userData.lastname}
            </Text>
            <Text>{firebase.auth().currentUser.email}</Text>
          </View>
          <AntDesign name="right" size={30} />
        </View>
      </TouchableOpacity>
      <ScrollView>
        <View style={{ margin: 50 }}>
          <TouchableOpacity
            onPress={() => {
              setShowBadge(false);
              navigation.navigate("Notifications", { notifications });
            }}
          >
            <View style={styles.defaultInLineStyle}>
              <View
                style={{
                  ...styles.circleBackground,
                  backgroundColor: "#eb4d4b",
                }}
              >
                <Ionicons name="ios-notifications" size={25} color="#fff" />
              </View>
              <Text style={{ marginLeft: 20, fontSize: 18 }}>
                Notifications
              </Text>
              {showBadge && (
                <Badge
                  style={{
                    backgroundColor: "#0af",
                    color: "#fff",
                    fontSize: 18,
                    marginLeft: Dimensions.get("window").width * 0.3,
                  }}
                  size={25}
                >
                  {notifications.length}
                </Badge>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              firebase
                .auth()
                .sendPasswordResetEmail(await firebase.auth().currentUser.email)
                .then(() => {
                  Alert.alert(
                    "Link Sent",
                    `Password Reset Link has been mailed to Email ${
                      firebase.auth().currentUser.email
                    } Check Your Mail.`
                  );
                })
                .catch((error) => {
                  console.log(error);
                  Alert.alert(error.message);
                });
            }}
          >
            <View style={styles.defaultInLineStyle}>
              <View
                style={{
                  ...styles.circleBackground,
                  backgroundColor: "#f39c12",
                }}
              >
                <MaterialCommunityIcons
                  name="lock-reset"
                  size={25}
                  color="#fff"
                />
              </View>
              <Text style={{ marginLeft: 20, fontSize: 18 }}>
                Reset Password
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("FAQ")}>
            <View style={styles.defaultInLineStyle}>
              <View
                style={{
                  ...styles.circleBackground,
                  backgroundColor: "#22a6b3",
                }}
              >
                <Ionicons name="ios-book" size={25} color="#fff" />
              </View>
              <Text style={{ marginLeft: 20, fontSize: 18 }}>FAQ</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => firebase.auth().signOut()}>
            <View style={styles.defaultInLineStyle}>
              <View
                style={{
                  ...styles.circleBackground,
                  backgroundColor: "#e84393",
                }}
              >
                <AntDesign name="logout" size={25} color="#fff" />
              </View>
              <Text style={{ marginLeft: 20, fontSize: 20, color: "red" }}>
                Logout
              </Text>
            </View>
          </TouchableOpacity>
          <Divider
            style={{
              marginVertical: 10,
              backgroundColor: "#222",
            }}
          />
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <View style={styles.defaultInLineStyle}>
              <View
                style={{
                  ...styles.circleBackground,
                  backgroundColor: "#e056fd",
                }}
              >
                <Ionicons name="ios-contacts" size={30} color="#fff" />
              </View>
              <Text style={{ marginLeft: 20, fontSize: 18 }}>Contact us</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL("mailto: ferinpatel79@gmail.com")}
          >
            <View style={styles.defaultInLineStyle}>
              <View
                style={{
                  ...styles.circleBackground,
                  backgroundColor: "#ff7979",
                }}
              >
                <MaterialIcons name="feedback" size={25} color="#fff" />
              </View>
              <Text style={{ marginLeft: 20, fontSize: 18 }}>
                Feedback (Developers)
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {}}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <AntDesign
                name="closecircleo"
                size={30}
                style={{ marginLeft: 0 }}
                onPress={() => setModalVisible(!modalVisible)}
              />

              <View>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  Institution Details
                </Text>
                <Text style={{ fontSize: 16, marginTop: 20 }}>
                  Institution Name:{" "}
                  <Text
                    style={{ fontWeight: "bold", textTransform: "capitalize" }}
                  >
                    {instituteDetails.name}
                  </Text>
                </Text>
                <Text style={{ fontSize: 16, marginTop: 20 }}>
                  Address:{" "}
                  <Text
                    style={{ fontWeight: "bold", textTransform: "capitalize" }}
                  >
                    {instituteDetails.address}
                  </Text>
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(`tel:${instituteDetails.phone}`)
                  }
                >
                  <Text style={{ fontSize: 16, marginTop: 20 }}>
                    Phone:{" "}
                    <Text
                      style={{
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                    >
                      {instituteDetails.phone}
                    </Text>
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(`mailto: ${instituteDetails.email}`)
                  }
                >
                  <Text style={{ fontSize: 16, marginTop: 20 }}>
                    Email:{" "}
                    <Text style={{ fontWeight: "bold" }}>
                      {instituteDetails.email}
                    </Text>
                  </Text>
                </TouchableOpacity>
              </View>
              <Divider
                style={{ backgroundColor: "#000", marginVertical: 50 }}
              />
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                Developers Details
              </Text>

              <Text style={{ fontSize: 16, marginTop: 30 }}>
                Name: <Text style={{ fontWeight: "bold" }}>Ferin Patel</Text>
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  marginVertical: 10,
                }}
              >
                <Entypo
                  name="email"
                  size={30}
                  onPress={() =>
                    Linking.openURL(`mailto: ferinpatel79@gmail.com`)
                  }
                />
                <AntDesign
                  name="instagram"
                  size={30}
                  color="#fd79a8"
                  onPress={() =>
                    Linking.openURL("https://www.instagram.com/ferin_patel_79/")
                  }
                />
                <AntDesign
                  name="facebook-square"
                  size={30}
                  color="#0984e3"
                  onPress={() =>
                    Linking.openURL(
                      "https://www.facebook.com/profile.php?id=100004905079172"
                    )
                  }
                />
                <AntDesign
                  name="github"
                  size={30}
                  color="#00b894"
                  onPress={() => Linking.openURL("https://github.com/ferin79")}
                />
              </View>

              <Text style={{ fontSize: 16, marginTop: 20 }}>
                Name: <Text style={{ fontWeight: "bold" }}>Jash Jariwala</Text>
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  marginVertical: 10,
                }}
              >
                <Entypo
                  name="email"
                  size={30}
                  onPress={() =>
                    Linking.openURL(`mailto: jashjariwala7911@gmail.com`)
                  }
                />
                <AntDesign
                  name="instagram"
                  size={30}
                  color="#fd79a8"
                  onPress={() =>
                    Linking.openURL(
                      "https://www.instagram.com/__firemarshall_/"
                    )
                  }
                />
                <AntDesign name="facebook-square" size={30} color="#0984e3" />
                <AntDesign
                  name="github"
                  size={30}
                  color="#00b894"
                  onPress={() =>
                    Linking.openURL("https://github.com/JASH-JARIWALA")
                  }
                />
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  defaultInLineStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 20,
  },

  circleBackground: {
    height: 40,
    width: 40,
    borderRadius: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
