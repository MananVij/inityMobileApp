import React from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import color from "../config/colors";

const DATA1 = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "First Item",
    description:
      "Seeking stable returns and can't tolerate market fluctuations.",
    image: require("../assets/risk/low/bridge-walk.png"),
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Second Item",
    description:
      "Seeking stable returns and can't tolerate market fluctuations.",
    image: require("../assets/risk/low/seed.png"),
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Third Item",
    description:
      "Seeking stable returns and can't tolerate market fluctuations.",
    image: require("../assets/risk/low/scooter.png"),
  },
  {
    id: "",
    title: "Third Item",
    description:
      "Seeking stable returns and can't tolerate market fluctuations.",
    image: require("../assets/risk/low/coins.png"),
  },
  {
    id: "1",
    title: "Third Item",
    description:
      "Seeking stable returns and can't tolerate market fluctuations.",
    image: require("../assets/risk/low/coins.png"),
  },
];
const DATA2 = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "Medium Item",
    description:
      "Seeking stable returns and can't tolerate market fluctuations.",
    image: require("../assets/risk/low/bridge-walk.png"),
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Second Item",
    description:
      "Seeking stable returns and can't tolerate market fluctuations.",
    image: require("../assets/risk/low/seed.png"),
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Third Item",
    description:
      "Seeking stable returns and can't tolerate market fluctuations.",
    image: require("../assets/risk/low/scooter.png"),
  },
  {
    id: "",
    title: "Third Item",
    description:
      "Seeking stable returns and can't tolerate market fluctuations.",
    image: require("../assets/risk/low/coins.png"),
  },
];
const DATA3 = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "First Item",
    description:
      "Seeking stable returns and can't tolerate market fluctuations.",
    image: require("../assets/risk/low/bridge-walk.png"),
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Second Item",
    description:
      "Seeking stable returns and can't tolerate market fluctuations.",
    image: require("../assets/risk/low/seed.png"),
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Third Item",
    description:
      "Seeking stable returns and can't tolerate market fluctuations.",
    image: require("../assets/risk/low/scooter.png"),
  },
  {
    id: "",
    title: "Third Item",
    description:
      "Seeking stable returns and can't tolerate market fluctuations.",
    image: require("../assets/risk/low/coins.png"),
  },
];

const Item = ({ title, description, image, text }) => (
  <View style={styles.descriptionContainer}>
    <Image style={styles.image} source={image} />
    <View style={{ justifyContent: "center" }}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  </View>
);

const button = () => {
  return (
    // <TouchableOpacity style={{alignItems: 'center'}} activeOpacity={0.7} onPress={() => {
    //     hello('HomeScreen')
    // }}>
    <View style={styles.button}>
      <Text style={styles.buttonText}>Go Ahead</Text>
    </View>
    // </TouchableOpacity>
  );
};

function TaxSaving({ navigation }) {
  const topDiv = () => {
    return (
      <View style={styles.topHeadingConatiner}>
        <Text style={styles.topFirstHeding}>
          Choose the statements that best describes you!
        </Text>
        <Text style={styles.topSecondHeding}>
          {" "}
          Your risk profile result help us to match products that are right for
          your profile type.
        </Text>
      </View>
    );
  };
  const selectRisk = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          paddingVertical: "2%",
          borderRadius: 2,
          backgroundColor: color.backgroundColor,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setRiskNumber("1")}
        >
          <View
            style={{
              backgroundColor: riskNumber === "1" ? color.logoColor : "#3BB9B4",
              height: 50,
              width: 100,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 5,
            }}
          >
            <Text style={styles.optionNumber}>1</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setRiskNumber("2")}
        >
          <View
            style={{
              backgroundColor: riskNumber === "2" ? color.logoColor : "#3BB9B4",
              height: 50,
              width: 100,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 5,
            }}
          >
            <Text style={styles.optionNumber}>2</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setRiskNumber("3")}
        >
          <View
            style={{
              backgroundColor: riskNumber === "3" ? color.logoColor : "#3BB9B4",
              height: 50,
              width: 100,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 5,
            }}
          >
            <Text style={styles.optionNumber}>3</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const [riskNumber, setRiskNumber] = React.useState("1");

  const renderItem = ({ item }) => (
    <Item
      image={item.image}
      title={item.title}
      description={item.description}
    />
  );

  return (
    <SafeAreaView styles={styles.container}>
      {topDiv()}
      {selectRisk()}
      {/* <View style={{ height: '75%'}}> */}

      {riskNumber == "1" && (
        <View style={{ height: "75.5%" }}>
          <ScrollView style={{ paddingBottom: 100 }} bounces={false}>
            <FlatList
              scrollEnabled={false}
              data={DATA1}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
            {/* <TouchableOpacity > */}
            <TouchableOpacity
              style={{ alignItems: "center" }}
              activeOpacity={0.7}
              onPress={() => {
                navigation.navigate("HomeScreen");
              }}
            >
              {button()}
            </TouchableOpacity>
            {/* </TouchableOpacity>  */}
          </ScrollView>
        </View>
      )}
      {riskNumber == "2" && (
        <View style={{ height: "75.5%" }}>
          <ScrollView style={{ paddingBottom: 100 }} bounces={false}>
            <FlatList
              scrollEnabled={false}
              data={DATA2}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
            {button()}
          </ScrollView>
        </View>
      )}
      {riskNumber == "3" && (
        <View style={{ height: "75.5%" }}>
          <ScrollView style={{ paddingBottom: 100 }} bounces={false}>
            <FlatList
              data={DATA3}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
            {button()}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

export default TaxSaving;
const styles = StyleSheet.create({
  container: {},
  topHeadingConatiner: {
    paddingTop: "5%",
    paddingBottom: "4%",
  },
  topFirstHeding: {
    textAlign: "center",
    fontSize: 27,
    fontWeight: "bold",
    marginHorizontal: "3%",
  },
  topSecondHeding: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "400",
    marginHorizontal: "3%",
  },
  optionNumber: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
  },
  descriptionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: "2%",
    marginHorizontal: "3%",
    paddingVertical: "3%",
    backgroundColor: color.backgroundColor,
    borderRadius: 5,
  },
  categoriesContainer: {
    flexDirection: "column",
    backgroundColor: "#f7f7f7",
    display: "none",
  },
  button: {
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: color.logoColor,
    width: 200,
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  image: {
    height: 100,
    width: 100,
    marginHorizontal: "3%",
  },
  title: {
    fontWeight: "600",
    fontSize: 23,
  },
  description: {
    fontSize: 19,
  },
});
