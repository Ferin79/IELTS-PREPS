import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import { List, DataTable, Button } from "react-native-paper";

const Result = ({ navigation, route }) => {
  console.log(route.params);
  const band = route.params.band;
  const correctScore = route.params.correctScore;
  const IncorrectScore = route.params.incorrectScore;
  const notScore = route.params.notattemptScore;
  const userAnswer = route.params.userAnswer;
  const correctAnswer = route.params.correctAnswer;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          {band <= 3 && (
            <Text style={{ fontSize: 30, color: "red", padding: 20 }}>
              Better Luck Next Time !!!
            </Text>
          )}
          {band > 3 && band <= 6 && (
            <Text style={{ fontSize: 30, padding: 20 }}>You Did It ...</Text>
          )}
          {band > 6 && band <= 9 && (
            <Text style={{ fontSize: 30, padding: 20 }}>
              Congratulations !!!
            </Text>
          )}

          {band <= 3 && (
            <Image
              source={require("../../images/crying.gif")}
              style={{ height: 200, width: 200 }}
            />
          )}
          {band > 3 && band <= 6 && (
            <Image
              source={require("../../images/smiling.gif")}
              style={{ height: 200, width: 200 }}
            />
          )}
          {band > 6 && band <= 9 && (
            <Image
              source={require("../../images/partyFace.gif")}
              style={{ height: 200, width: 200 }}
            />
          )}
          <Text style={{ fontSize: 25, padding: 20 }}>
            Band: <Text style={{ fontWeight: "bold" }}>{band}</Text>
          </Text>
        </View>

        <View
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "space-evenly",
            alignItems: "flex-start",
            marginHorizontal: 50,
            marginVertical: 20,
            borderTopWidth: 1,
            padding: 20,
          }}
        >
          <View style={styles.marks}>
            <Text style={{ fontSize: 18 }}>Correct :</Text>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {correctScore}
            </Text>
          </View>

          <View style={styles.marks}>
            <Text style={{ fontSize: 18 }}>Incorrect :</Text>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {IncorrectScore}
            </Text>
          </View>

          <View style={styles.marks}>
            <Text style={{ fontSize: 18 }}>Not Attempted :</Text>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>{notScore}</Text>
          </View>
        </View>

        <View>
          <List.AccordionGroup>
            <List.Accordion title="Answers" id="1">
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>#</DataTable.Title>
                  <DataTable.Title numeric>Correct Answer</DataTable.Title>
                  <DataTable.Title numeric>Your Answer</DataTable.Title>
                </DataTable.Header>

                {correctAnswer.map((item, index) => {
                  return (
                    <DataTable.Row key={index}>
                      <DataTable.Cell>{index + 1}</DataTable.Cell>
                      <DataTable.Cell>{item.value}</DataTable.Cell>
                      <DataTable.Cell>
                        <Text style={{ color: userAnswer[index].color }}>
                          {userAnswer[index].value}
                        </Text>
                      </DataTable.Cell>
                    </DataTable.Row>
                  );
                })}
              </DataTable>
            </List.Accordion>
            <List.Accordion title="Band Scaling" id="2">
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>#</DataTable.Title>
                  <DataTable.Title numeric>Band Score</DataTable.Title>
                </DataTable.Header>

                <DataTable.Row>
                  <DataTable.Cell>40-39</DataTable.Cell>
                  <DataTable.Cell numeric>9</DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell>38-37</DataTable.Cell>
                  <DataTable.Cell numeric>8.5</DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell>36-35</DataTable.Cell>
                  <DataTable.Cell numeric>8.0</DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell>34-33</DataTable.Cell>
                  <DataTable.Cell numeric>7.5</DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell>32-30</DataTable.Cell>
                  <DataTable.Cell numeric>7.0</DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell>29-27</DataTable.Cell>
                  <DataTable.Cell numeric>6.5</DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell>26-23</DataTable.Cell>
                  <DataTable.Cell numeric>6</DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell>22-19</DataTable.Cell>
                  <DataTable.Cell numeric>5.5</DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell>18-15</DataTable.Cell>
                  <DataTable.Cell numeric>5.0</DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell>14-13</DataTable.Cell>
                  <DataTable.Cell numeric>4.5</DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell>12-10</DataTable.Cell>
                  <DataTable.Cell numeric>4.0</DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell>9-8</DataTable.Cell>
                  <DataTable.Cell numeric>3.5</DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell>7-6</DataTable.Cell>
                  <DataTable.Cell numeric>3</DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell>5-4</DataTable.Cell>
                  <DataTable.Cell numeric>2.5</DataTable.Cell>
                </DataTable.Row>
              </DataTable>
            </List.Accordion>
          </List.AccordionGroup>
        </View>

        <View style={{ margin: 50 }}>
          <Button
            style={{ padding: 10, backgroundColor: "#0af" }}
            mode="contained"
            onPress={() => navigation.navigate("PracticeMain")}
          >
            Done
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default Result;

const styles = StyleSheet.create({
  marks: {
    width: "100%",
    display: "flex",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
});
