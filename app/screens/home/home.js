import React, { useContext } from "react";
import { View, Text, Button } from "react-native";
import firebase from "../../data/firebase";
import { Context } from "../../data/context";

const Home = () => {
  const { institute_id } = useContext(Context);
  return (
    <View>
      <Text>Home Screen </Text>
      <Text>{institute_id}</Text>
      <Button
        title="Logout"
        onPress={() => {
          firebase.auth().signOut();
        }}
      />
    </View>
  );
};

export default Home;
