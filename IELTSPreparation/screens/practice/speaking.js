import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import firebase from "../../data/firebase";
import LoadingScreen from "../components/LoadingScreen";
import { AntDesign } from "@expo/vector-icons";

const Speaking = ({ navigation }) => {
  const [videoList, setVideoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchVideoList = () => {
    setIsLoading(true);
    firebase
      .firestore()
      .collection("videoList")
      .get()
      .then((docs) => {
        const data = [];
        docs.forEach((doc) => {
          data.push({ ...doc.data(), id: doc.id });
        });
        setVideoList([...data]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchVideoList();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return videoList.length === 0 ? (
    <ScrollView
      style={{ display: "flex", flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={fetchVideoList} />
      }
    >
      <View
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 20 }}>No Staff is Online</Text>
        <Text>Please Try Again Later</Text>
      </View>
    </ScrollView>
  ) : (
    <FlatList
      data={videoList}
      keyExtractor={(item) => item.id}
      refreshing={isLoading}
      onRefresh={() => fetchVideoList()}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            key={item.id}
            onPress={() =>
              navigation.navigate("Video", { channelId: item.channelName })
            }
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginHorizontal: 50,
                padding: 20,
                backgroundColor: "#fff",
                marginVertical: 10,
              }}
            >
              <Text>{item.channel}</Text>
              <AntDesign name="right" size={30} />
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default Speaking;
