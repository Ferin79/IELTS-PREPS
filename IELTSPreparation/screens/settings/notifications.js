import React from "react";
import { SafeAreaView, View, Text, FlatList } from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";

const Notifications = ({ route }) => {
  const notifications = route.params.notifications;
  return (
    <SafeAreaView>
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            return (
              <Card key={index} style={{ margin: 10 }}>
                <Card.Content>
                  <Title>{item.title}</Title>
                  <Paragraph>{item.body}</Paragraph>
                </Card.Content>
              </Card>
            );
          }}
        />
      ) : (
        <View></View>
      )}
    </SafeAreaView>
  );
};

export default Notifications;
