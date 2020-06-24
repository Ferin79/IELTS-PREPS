import React, { useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { Avatar, Divider } from "react-native-paper";
import {
  AntDesign,
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import firebase from "../../data/firebase";
import { Context } from "../../data/context";

const Settings = ({ navigation }) => {
  const { userData } = useContext(Context);

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
          <TouchableOpacity>
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
          <TouchableOpacity
            onPress={() => Alert.alert("FAQ Section Will be Added Soon")}
          >
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
          <TouchableOpacity>
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
          <TouchableOpacity>
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
});
