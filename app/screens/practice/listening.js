import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Dimensions,
  YellowBox,
  TouchableOpacity,
} from "react-native";
import firebase from "../../data/firebase";
import LoadingScreen from "../components/LoadingScreen";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";

const Listening = ({ navigation }) => {
  YellowBox.ignoreWarnings(["Setting a timer"]);
  const COLORS = [
    "#ff7979",
    "#fdcb6e",
    "#0984e3",
    "#00b894",
    "#fd79a8",
    "#7ed6df",
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [examSet, setExamSet] = useState([]);

  const SCREEN_HEIGHT = Dimensions.get("window").height;
  const SCREEN_WIDTH = Dimensions.get("window").width;

  let colorIndex = 0;

  const fetchListeningLists = () => {
    setIsLoading(true);
    firebase
      .firestore()
      .collection("listening")
      .get()
      .then((docs) => {
        const data = [];
        docs.forEach((doc) => {
          console.log({ ...doc.data(), id: doc.id });
          data.push({ ...doc.data(), id: doc.id });
        });
        setExamSet([...data]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchListeningLists();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <SafeAreaView style={{ backgroundColor: "#fff" }}>
      <View
        style={{
          width: SCREEN_WIDTH,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          backgroundColor: "#fff",
          borderBottomWidth: 1,
          borderBottomColor: "grey",
        }}
      >
        <Ionicons
          name="ios-arrow-back"
          size={40}
          style={{ marginLeft: 10 }}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Text
          style={{
            textAlign: "center",
            fontSize: 20,
            marginVertical: 20,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Select Listening Test
        </Text>
      </View>
      <View
        style={{
          height: SCREEN_HEIGHT * 0.8,
          backgroundColor: "#fff",
          width: SCREEN_WIDTH,
          marginVertical: 20,
        }}
      >
        <FlatList
          data={examSet}
          keyExtractor={(item) => item.id}
          onRefresh={() => fetchListeningLists()}
          refreshing={isLoading}
          renderItem={({ item }) => {
            if (colorIndex === 6) {
              colorIndex = 0;
            }
            return (
              <TouchableOpacity
                onPress={() => {
                  const data = examSet.filter((data) => data.id === item.id);
                  navigation.navigate("ListeningTest", { data: data[0] });
                }}
              >
                <View
                  style={{
                    padding: 40,
                    backgroundColor: COLORS[colorIndex++],
                    margin: 10,
                    borderRadius: 50,
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flex: 1,
                        justifyContent: "space-evenly",
                        alignItems: "flex-start",
                      }}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 20,
                          marginVertical: 10,
                        }}
                      >
                        {item.name}
                      </Text>
                      <Text style={{ color: "#fff", fontSize: 14 }}>
                        Complexity:{" "}
                        <Text
                          style={{
                            textTransform: "capitalize",
                            fontWeight: "bold",
                          }}
                        >
                          {item.complexity}
                        </Text>
                      </Text>
                    </View>
                    {item.type === "audio" ? (
                      <MaterialIcons name="audiotrack" size={30} color="#fff" />
                    ) : (
                      <Feather name="video" size={30} color="#fff" />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Listening;
