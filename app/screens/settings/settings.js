import React, { useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Avatar, Divider } from "react-native-paper";
import {
  AntDesign,
  MaterialCommunityIcons,
  Ionicons,
  Fontisto,
  MaterialIcons,
} from "@expo/vector-icons";
import firebase from "../../data/firebase";
import { Context } from "../../data/context";

const Settings = ({ navigation }) => {
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
              uri:
                "https://firebasestorage.googleapis.com/v0/b/ielts-preps.appspot.com/o/person.png?alt=media&token=c008c65c-aee6-426d-bc1d-aad8143c11b2",
            }}
          />
          <View>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              Ferin Patel
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
          <TouchableOpacity>
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
          <TouchableOpacity>
            <View style={styles.defaultInLineStyle}>
              <View
                style={{
                  ...styles.circleBackground,
                  backgroundColor: "#e84393",
                }}
              >
                <AntDesign name="questioncircleo" size={25} color="#fff" />
              </View>
              <Text style={{ marginLeft: 20, fontSize: 18 }}>
                Ask a Question
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
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
          <TouchableOpacity>
            <View style={styles.defaultInLineStyle}>
              <View
                style={{
                  ...styles.circleBackground,
                  backgroundColor: "#686de0",
                }}
              >
                <Fontisto name="persons" size={25} color="#fff" />
              </View>
              <Text style={{ marginLeft: 20, fontSize: 18 }}>Developers</Text>
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
