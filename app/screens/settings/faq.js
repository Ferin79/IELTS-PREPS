import React from "react";
import { SafeAreaView, View, Text } from "react-native";
import { List } from "react-native-paper";

const FAQ = () => {
  return (
    <SafeAreaView>
      <View style={{ margin: 10 }}>
        <List.AccordionGroup>
          <List.Accordion title="What is Online test platform" id="1">
            <Text style={{ margin: 10 }}>
              This is a online based application for conducting online test. We
              have developed a very comprehensive application to cater any kind
              of requirement for online test. This can help you conduct Test,
              Quiz, or provide online assignment to your student. See the
              overview and features of the online test platform.
            </Text>
          </List.Accordion>
          <List.Accordion
            title="What are the advantages in opting for online based examination ?"
            id="2"
          >
            <Text style={{ margin: 10 }}>
              The candidate can review or re-answer any question at any point of
              time during the examination. The candidate can change the option
              of the answer during the exam duration and it is one of the most
              important feature of computer based examination The candidate also
              has the option to mark any answer for review at later stage during
              the examination. There will be a panel on computer screen showing
              all the question nos in different colour scheme which will
              indicate which are the questions answered, left unanswered and
              marked for review Candidate gets the flexibility in choosing the
              exam date of his/her choice as per his/her convenience. It will
              make Candidate feel confident on use of Information technology.
              Cost and Time reduction
            </Text>
          </List.Accordion>
          <List.Accordion title="Do we get admin control ?" id="3">
            <Text style={{ margin: 10 }}>
              Yes, you will get admin rights for your account and you will be
              able to do all Admin related activities.
            </Text>
          </List.Accordion>
        </List.AccordionGroup>
      </View>
    </SafeAreaView>
  );
};

export default FAQ;
