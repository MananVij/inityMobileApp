import React from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import colors from "../config/colors";

function SelectAvatar({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.name}>Hi Rahul</Text>
      <Text style={styles.heading}>Select your Avatar!</Text>
      {/* <ScrollView vertical={true} style={{flex: 1, borderColor: 'red', borderWidth: 5}}> */}
      {/* <View style={{borderColor: 'red', borderWidth: 1}}> */}
      <View
        style={{
          height: "90%",
          flexDirection: "column",
          justifyContent: "space-evenly",
        }}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatarBox}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("TaxSaving");
              }}
            >
              <View>
                <Image
                  style={styles.avatar}
                  source={require("../assets/avatar/business.png")}
                ></Image>
                <Text style={styles.role}>Business Man</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.avatarBox}>
            <TouchableOpacity>
              <View>
                <Image
                  style={styles.avatar}
                  source={require("../assets/avatar/working-professionals.png")}
                ></Image>
                <Text style={styles.role}>Working</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarBox}>
            <TouchableOpacity>
              <View>
                <Image
                  style={styles.avatar}
                  source={require("../assets/avatar/student.png")}
                ></Image>
                <Text style={styles.role}>Students</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.avatarBox}>
            <TouchableOpacity>
              <View>
                <Image
                  style={styles.avatar}
                  source={require("../assets/avatar/home-makers.png")}
                ></Image>
                <Text style={styles.role}>Home Makers</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* </View> */}
      {/* </ScrollView> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundColor,
    flex: 1,
  },
  name: {
    paddingTop: "5%",
    paddingLeft: "5%",
    fontSize: 40,
    fontWeight: "400",
    fontWeight: "500",
  },
  heading: {
    // paddingBottom: '1%',
    paddingLeft: "5%",
    fontSize: 30,
    fontWeight: "400",
  },
  role: {
    fontSize: 20,
    fontWeight: "400",
    fontWeight: "600",
    textAlign: "center",
  },
  avatar: {
    width: "90%",
    height: "90%",
    resizeMode: "contain",
  },
  avatarContainer: {
    flexDirection: "row",
    height: "40%",
    // resizeMode: 'contain',
    justifyContent: "space-evenly",
  },
  avatarBox: {
    backgroundColor: "#f9f9f9",
    borderRadius: 45,
    width: "45%",
    height: "110%",
    alignContent: "center",
    alignItems: "center",
  },
});

export default SelectAvatar;
