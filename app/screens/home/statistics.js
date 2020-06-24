import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Dimensions,
  Text,
  RefreshControl,
} from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";
import { LineChart } from "react-native-chart-kit";
import LoadingScreen from "../components/LoadingScreen";
import firebase from "../../data/firebase";

const Statistics = ({ route }) => {
  const module = route.params.module;
  const [isLoading, setIsLoading] = useState(false);
  const [appearedExam, setAppearedExam] = useState(0);
  const [avgBand, setAvgBand] = useState(0);
  const [bandArray, setBandArray] = useState([]);
  const [emptyResults, setEmptyResults] = useState(false);
  const [allData, setAllData] = useState([]);

  const fetchModuleDeatils = () => {
    setIsLoading(true);
    setEmptyResults(false);
    if (
      module === "listening" ||
      module === "reading" ||
      module === "speaking"
    ) {
      firebase
        .firestore()
        .collection(`${module}User`)
        .where("email", "==", firebase.auth().currentUser.email)
        .orderBy("createdAt", "asc")
        .get()
        .then((docs) => {
          if (docs.size) {
            const data = [];
            const fullData = [];
            let totalRecievedBands = 0;
            docs.forEach((doc) => {
              fullData.push(doc.data());
              totalRecievedBands =
                parseInt(totalRecievedBands) + parseInt(doc.data().band);
              data.push(doc.data().band);
            });
            setAllData([...fullData]);
            setBandArray([...data]);
            setAvgBand(
              Math.round(parseInt(totalRecievedBands) / parseInt(docs.size))
            );
            setAppearedExam(docs.size);
          } else {
            setEmptyResults(true);
          }
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          console.log(error);
        });
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModuleDeatils();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }
  if (emptyResults) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20, padding: 20 }}>NO STATS TO SHOW</Text>
          <Text>Start Practising IELTS module to see your statistics</Text>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchModuleDeatils}
          />
        }
      >
        <View
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            marginTop: 25,
          }}
        >
          <Card>
            <Card.Content>
              <Paragraph>Exam Appears</Paragraph>
              <Title>{appearedExam}</Title>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content>
              <Paragraph>Average Bands</Paragraph>
              <Title>{avgBand}</Title>
            </Card.Content>
          </Card>
        </View>

        <View
          style={{
            marginTop: 30,
          }}
        >
          <Text style={{ fontSize: 15 }}>
            This Graph indicates your progress in {module} module
          </Text>
          <LineChart
            data={{
              datasets: [
                {
                  data: bandArray.length > 0 ? bandArray : [0],
                },
              ],
            }}
            width={Dimensions.get("window").width}
            height={250}
            yAxisInterval={1}
            yAxisLabel="Band "
            chartConfig={{
              backgroundColor: "#e26",
              backgroundGradientFrom: "#ffa726",
              backgroundGradientTo: "#ffa726",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 15,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 0,
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Statistics;
