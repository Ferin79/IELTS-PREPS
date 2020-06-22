import React, { useEffect, useState, useContext } from "react";
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
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { Context } from "../../data/context";
import { Button, Menu, Divider, Provider } from "react-native-paper";

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
  const [filteredExamSet, setFilteredExamSet] = useState([]);
  const [visible, setVisible] = useState(true);

  const SCREEN_HEIGHT = Dimensions.get("window").height;
  const SCREEN_WIDTH = Dimensions.get("window").width;

  const { institute_id } = useContext(Context);

  let colorIndex = 0;

  const filterVideo = () => {
    const result = examSet.filter((exam) => exam.type === "video");
    console.log(result);
    setFilteredExamSet([...result]);
    setVisible(false);
  };
  const filterAudio = () => {
    const result = examSet.filter((exam) => exam.type === "audio");
    console.log(result);
    setFilteredExamSet([...result]);
    setVisible(false);
  };
  const filterComplexityHard = () => {
    const result = examSet.filter((exam) => exam.complexity === "hard");
    console.log(result);
    setFilteredExamSet([...result]);
    setVisible(false);
  };
  const filterComplexityMedium = () => {
    const result = examSet.filter((exam) => exam.complexity === "medium");
    console.log(result);
    setFilteredExamSet([...result]);
    setVisible(false);
  };
  const filterComplexityEasy = () => {
    const result = examSet.filter((exam) => exam.complexity === "easy");
    console.log(result);
    setFilteredExamSet([...result]);
    setVisible(false);
  };

  const filterVisited = () => {
    const result = examSet.filter((exam) => exam.isVisited === true);
    console.log(result);
    setFilteredExamSet([...result]);
    setVisible(false);
  };
  const filterNone = () => {
    setFilteredExamSet([...examSet]);
    setVisible(false);
  };

  const fetchListeningLists = () => {
    setIsLoading(true);
    firebase
      .firestore()
      .collection("listening")
      .where("institute_id", "in", [institute_id, "all"])
      .get()
      .then((docs) => {
        let data = [];
        docs.forEach((doc) => {
          data.push({ ...doc.data(), id: doc.id });
        });
        firebase
          .firestore()
          .collection("listeningUser")
          .where("email", "==", firebase.auth().currentUser.email)
          .get()
          .then((docs) => {
            if (!docs.empty) {
              docs.forEach((doc) => {
                let givenId = doc.data().listeningTestId;
                data.forEach((item, index) => {
                  if (item.id === givenId) {
                    data = data.concat(data.splice(index, 1));
                    item.isVisited = true;
                    item.prevBand = doc.data().band;
                  }
                });
              });
            }
            setExamSet([...data]);
            setFilteredExamSet([...data]);
            setIsLoading(false);
          });
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
    <Provider>
      <SafeAreaView style={{ backgroundColor: "#fff" }}>
        <Menu
          visible={visible}
          onDismiss={() => setVisible(false)}
          anchor={
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button
                style={{
                  padding: 5,
                  backgroundColor: "#0af",
                  width: 150,
                  margin: 25,
                }}
                mode="contained"
                onPress={() => {
                  setVisible(true);
                }}
              >
                Filter
              </Button>
              <Text style={{ marginHorizontal: 10, fontSize: 18 }}>
                Total Available Test: {examSet.length}
              </Text>
            </View>
          }
        >
          <Menu.Item onPress={filterAudio} title="Only Audio" />
          <Menu.Item onPress={filterVideo} title="Only Video" />
          <Divider style={{ backgroundColor: "#000" }} />
          <Menu.Item onPress={filterComplexityHard} title="Hard" />
          <Menu.Item onPress={filterComplexityMedium} title="Medium" />
          <Menu.Item onPress={filterComplexityEasy} title="Easy" />
          <Divider style={{ backgroundColor: "#000" }} />
          <Menu.Item onPress={filterVisited} title="Completed" />
          <Menu.Item onPress={filterNone} title="All" />
        </Menu>

        <View
          style={{
            height: SCREEN_HEIGHT * 0.9,
            backgroundColor: "#fff",
            width: SCREEN_WIDTH,
            marginVertical: 20,
          }}
        >
          <FlatList
            data={filteredExamSet}
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
                      backgroundColor: item.isVisited
                        ? "lightgrey"
                        : COLORS[colorIndex++],
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
                        {item.institute_id === "all" && (
                          <Text
                            style={{ fontSize: 15, color: "#fff", margin: 5 }}
                          >
                            This Test is offered by Admin
                          </Text>
                        )}
                        {item.isVisited && (
                          <Text
                            style={{
                              fontSize: 15,
                              color: "green",
                              marginVertical: 10,
                            }}
                          >
                            Completed
                          </Text>
                        )}

                        {item.isVisited && (
                          <Text
                            style={{
                              fontSize: 15,
                              color: "green",
                              marginVertical: 10,
                            }}
                          >
                            Past Bands: <Text>{item.prevBand}</Text>
                          </Text>
                        )}
                      </View>
                      <View>
                        {item.type === "audio" ? (
                          <MaterialIcons
                            name="audiotrack"
                            size={30}
                            color="#fff"
                          />
                        ) : (
                          <Feather name="video" size={30} color="#fff" />
                        )}
                        {item.isVisited && (
                          <MaterialIcons name="check" size={50} color="green" />
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </SafeAreaView>
    </Provider>
  );
};

export default Listening;
