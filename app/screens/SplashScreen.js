// import React from "react"; //rsf
import React, { useEffect } from 'react';
// import * as firebase from 'firebase';
// import {loggingOut} from '../../API/firebaseMethods';
import {
  View,
  StyleSheet,
  Image,
  Button,
  Text,
  TouchableOpacity,
} from "react-native";
import SignUp from './SignupScreen';
import LoginScreen from './LoginScreen';
function SplashScreen({ navigation }) {

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require("../../assets/logo.png")} style={styles.logo} />
      </View>
    </View>
  );
}
//rnss
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1e5bfa",
    flex: 1,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 6,
  },
  logo: {
    height: 200,
    width: 200,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 20,
    backgroundColor: "#f7f7f7",
  },
  buttonText: {
    color: "#1e5bfa",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
});
export default SplashScreen;
