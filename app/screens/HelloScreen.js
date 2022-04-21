import React, { Component, useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  Text,
  FlatList,
  SectionList,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";

import { VictoryPie } from "victory-native";
import { Icon } from "react-native-vector-icons/FontAwesome5";
import colors from "../config/colors";
import { render } from "react-dom";

// Data that we want to display
const expenseData = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    expenseCategory: "First Item",
    expenses: [
      {
        timeStamp: "02 Feb 2022 23:59:59",
        moneySpent: 30,
      },
      {
        timeStamp: "02 Feb 2022 23:59:59",
        moneySpent: 50,
      },
      {
        timeStamp: "02 Feb 2022 23:59:59",
        moneySpent: 10,
      },
    ],
    color: "#F76E11",
    iconAddress: "../assets/risk/low/bridge-walk.png",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    expenseCategory: "Second Item",
    expenses: [
      {
        timeStamp: "02 Feb 2022 23:59:59",
        moneySpent: 20,
      },
      {
        timeStamp: "02 Feb 2022 23:59:59",
        moneySpent: 20,
      },
      {
        timeStamp: "02 Feb 2022 23:59:59",
        moneySpent: 10,
      },
    ],
    color: "#FFE162",
    iconAddress: "../assets/risk/low/seed.png",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    expenseCategory: "Third Item",
    expenses: [
      {
        timeStamp: "02 Feb 2022 23:59:59",
        moneySpent: 50,
      },
      {
        timeStamp: "02 Feb 2022 23:59:59",
        moneySpent: 50,
      },
      {
        timeStamp: "02 Feb 2022 23:59:59",
        moneySpent: 40,
      },
    ],
    color: "#5800FF",
    iconAddress: "../assets/risk/low/scooter.png",
  },
  {
    id: "",
    expenseCategory: "Fourth Item",
    expenses: [
      {
        timeStamp: "02 Feb 2022 23:59:59",
        moneySpent: 10,
      },
      {
        timeStamp: "02 Feb 2022 23:59:59",
        moneySpent: 5,
      },
      {
        timeStamp: "02 Feb 2022 23:59:59",
        moneySpent: 10,
      },
    ],
    color: "#9AE66E",
    iconAddress: "../assets/risk/low/coins.png",
  },
  {
    id: "1",
    expenseCategory: "Fifth Item",
    expenses: [
      {
        timeStamp: "02 Feb 2022 23:59:59",
        moneySpent: 30,
      },
      {
        timeStamp: "02 Feb 2022 23:59:59",
        moneySpent: 50,
      },
      {
        timeStamp: "02 Feb 2022 23:59:59",
        moneySpent: 10,
      },
    ],
    color: "#161E54",
    iconAddress: "../assets/risk/low/coins.png",
  },
];

// Data used to make the animate prop work

// const defaultGraphicData = [
// ]

function HelloScreen(props) {
  //    const [graphicData, setGraphicData] = useState(defaultGraphicData);

  //    useEffect(() => {
  //      setGraphicData(expenseData); // Setting the data that we want to display
  //    }, []);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity activeOpacity={0.7}>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: "#f7f7f7",
            marginVertical: 3,
            paddingVertical: 10,
            shadowColor: "#000",
            shadowOffset: { height: 2, width: 4 },
            shadowOpacity: 0.2,
            borderRadius: 4,
          }}
        >
          <View
            style={{ flexDirection: "row", width: "50%", alignItems: "center" }}
          >
            <View
              style={{
                backgroundColor: item.color,
                width: 17,
                height: 17,
                borderRadius: 2,
                marginLeft: 10,
              }}
            />
            <Text style={{ fontWeight: "500", fontSize: 20, marginLeft: 15 }}>
              {item.expenseCategory}
            </Text>
          </View>
          <View>
            <Text style={{ fontWeight: "500", fontSize: 20, marginRight: 10 }}>
              {item.expense}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const processCategoryDataToDisplay = () => {
    let totalExpense = 0;
    let chartData = expenseData.map((item) => {
      item.expenses.map(() => {
        totalExpense += item.expenses[0].moneySpent;
      });
    });

    let final = [];

    expenseData.map((item) => {
      let categoryExpense = 0;
      item.expenses.map(() => {
        categoryExpense += item.expenses[0].moneySpent;
      });

      let percentageExpense = ((categoryExpense / totalExpense) * 100).toFixed(
        0
      );
      final.push({
        name: item.expenseCategory,
        y: Number(categoryExpense),
        label: `${percentageExpense}%`,
        color: item.color,
      });
    });
    return final;
  };

  const pieChart = () => {
    let chartData = processCategoryDataToDisplay();
    let colorScales = chartData.map((item) => item.color);

    return (
      <View style={{ alignItems: "center" }}>
        <View style={{ alignContent: "center" }}>
          <VictoryPie
            animate={{ easing: "exp" }}
            data={chartData}
            labels={chartData}
            colorScale={colorScales}
            labelRadius={95}
            innerRadius={70}
            style={{
              labels: {
                fill: "white",
                fontWeight: "600",
                fontSize: 20,
              },
            }}
          />
          <View
            style={{
              position: "absolute",
              top: "43%",
              left: "39.5%",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 23, fontWeight: "bold" }}>7</Text>
            <Text style={{ fontSize: 17, fontWeight: "500" }}>Categories</Text>
          </View>
        </View>
        <View style={{ marginHorizontal: "2%" }}>
          <FlatList
            style={{}}
            data={expenseData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    );
  };

  return <SafeAreaView style={styles.console}>{pieChart()}</SafeAreaView>;
}

const styles = StyleSheet.create({
  console: {
    backgroundColor: colors.backgroundColor,
    // flex: 1,
  },

  // Top Container
  topContainer: {
    backgroundColor: colors.backgroundColor,
    // height: '27%',
    elevation: 2,
    paddingLeft: "3%",
    flexDirection: "column",
    justifyContent: "center",
    marginTop: "2%",
    marginBottom: "5%",
  },
  backIcon: {
    height: 38,
    width: 38,
  },
  monthSelectorContainer: {
    backgroundColor: "#f7f7f7",
    height: "120%",
    width: "35%",
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  categorySelector: {
    backgroundColor: "#f7f7f7",
    width: "35%",
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  topBarText: {
    fontSize: 23,
    fontWeight: "500",
    textAlign: "left",
    flexWrap: "wrap",
  },
  dorpdownIcon: {
    height: 25,
    width: 25,
    position: "relative",
  },
  pieContaier: {
    flex: 1,
    // height: '80%',
    backgroundColor: "blue",
  },
  listContainer: {
    backgroundColor: "#000",
    flex: 2,
  },

  // Categories Section
  categoraiesContainer: {
    backgroundColor: "#f7f7f7",
    borderRadius: 5,
    // height: '27%',
    // elevation: 2,
    // paddingLeft: '3%',
    paddingVertical: 10,
    flexDirection: "column",
    justifyContent: "center",
  },
  categoryName: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    height: 40,
    width: "48%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      height: 2,
      width: 4,
    },
    shadowOpacity: 0.2,
  },
});

export default HelloScreen;
