import React, { useContext, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { Context } from "../../data/context";
import { Avatar, Card, Title, Paragraph } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";

const Home = ({ navigation }) => {
  const { userData } = useContext(Context);

  const speaking = () => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Statistics", { module: "speaking" })
        }
      >
        <Card style={{ margin: 10, backgroundColor: "#0984e3" }}>
          <Card.Content style={styles.defaultCardLayout}>
            <View>
              <Title style={{ color: "#fff" }}>Speaking</Title>
              <Paragraph style={{ color: "#fff" }}>See Stats</Paragraph>
            </View>
            <AntDesign name="right" size={30} color="#fff" />
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            margin: 20,
          }}
        >
          <View>
            <Text style={{ fontSize: 20, color: "grey" }}>Hello,</Text>
            <Text style={{ fontSize: 30, textTransform: "capitalize" }}>
              {userData.firstname}
            </Text>
          </View>
          <Avatar.Image size={70} source={{ uri: userData.photoUrl }} />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View
            style={{
              marginTop: 50,
              backgroundColor: "#fff",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: Dimensions.get("window").width,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Practice");
                }}
              >
                <LinearGradient
                  colors={["#fbc2eb", "#a6c1ee"]}
                  style={{
                    padding: 15,
                    alignItems: "center",
                    borderRadius: 5,
                    height: 250,
                    width: Dimensions.get("window").width * 0.9,
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: "60%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-evenly",
                        alignItems: "flex-start",
                        height: "100%",
                      }}
                    >
                      <Text style={{ fontSize: 18 }}>
                        Practice all modules of IELTS online and get your
                        progress report.
                      </Text>
                      <Text
                        style={{
                          padding: 10,
                          backgroundColor: "#fff",
                          color: "#000",
                        }}
                      >
                        Take Me !!!
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "40%",
                        height: "80%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={require("../../images/test.png")}
                        style={{
                          height: 150,
                          width: Dimensions.get("window").width * 0.3,
                        }}
                      />
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: Dimensions.get("window").width,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Chat");
                }}
              >
                <LinearGradient
                  colors={["#a1c4fd", "#c2e9fb"]}
                  style={{
                    padding: 15,
                    alignItems: "center",
                    borderRadius: 5,
                    height: 250,
                    width: Dimensions.get("window").width * 0.9,
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: "60%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-evenly",
                        alignItems: "flex-start",
                        height: "100%",
                      }}
                    >
                      <Text style={{ fontSize: 18 }}>
                        We are always there for you! Ask all your doubts and
                        study related queries!
                      </Text>
                      <Text
                        style={{
                          padding: 10,
                          backgroundColor: "#fff",
                          color: "#000",
                        }}
                      >
                        CHAT WITH US NOW
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "40%",
                        height: "80%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={require("../../images/chat.png")}
                        style={{
                          height: 200,
                          width: Dimensions.get("window").width * 0.3,
                        }}
                      />
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <View style={{ marginVertical: 30 }}>
          <View style={{ margin: 20 }}>
            <Text style={{ fontSize: 30 }}>Statistics</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Statistics", { module: "listening" })
            }
          >
            <Card style={{ margin: 10, backgroundColor: "#fdcb6e" }}>
              <Card.Content style={styles.defaultCardLayout}>
                <View>
                  <Title style={{ color: "#fff" }}>Listening</Title>
                  <Paragraph style={{ color: "#fff" }}>See Stats</Paragraph>
                </View>
                <AntDesign name="right" size={30} color="#fff" />
              </Card.Content>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Statistics", { module: "reading" })
            }
          >
            <Card style={{ margin: 10, backgroundColor: "#00cec9" }}>
              <Card.Content style={styles.defaultCardLayout}>
                <View>
                  <Title style={{ color: "#fff" }}>Reading</Title>
                  <Paragraph style={{ color: "#fff" }}>See Stats</Paragraph>
                </View>
                <AntDesign name="right" size={30} color="#fff" />
              </Card.Content>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Statistics", { module: "writing" })
            }
          >
            <Card style={{ margin: 10, backgroundColor: "#fd79a8" }}>
              <Card.Content style={styles.defaultCardLayout}>
                <View>
                  <Title style={{ color: "#fff" }}>Writing</Title>
                  <Paragraph style={{ color: "#fff" }}>See Stats</Paragraph>
                </View>
                <AntDesign name="right" size={30} color="#fff" />
              </Card.Content>
            </Card>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  defaultCardLayout: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
