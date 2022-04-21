import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, SafeAreaView} from 'react-native';
// import * as firebase from 'firebase';
// import {loggingOut} from '../../API/firebaseMethods';
import { signOut } from 'firebase/auth';
import { authentication } from '../../config/keys';
export default function Dashboard({ navigation }) {
  // let currentUserUID = firebase.auth().currentUser.uid;
  const [firstName, setFirstName] = useState("");

  // useEffect(() => {
  //   async function getUserInfo(){
  //     let doc = await firebase
  //     .firestore()
  //     .collection('users')
  //     .doc(currentUserUID)
  //     .get();

  //     if (!doc.exists){
  //       Alert.alert('No user data found!')
  //     } else {
  //       let dataObj = doc.data();
  //       setFirstName(dataObj.firstName)
  //     }
  //   }
  //   getUserInfo();
  // })

  const handlePress = () => {
    signOut(authentication).then(() => {
      console.log('user Signed Out');
      // Sign-out successful.
    }).catch((error) => {
      console.log("Error is Signout: ", error)
      // An error happened.
    });
    // loggingOut();
    navigation.replace('LoginScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleText}>Dashboard</Text>
      <Text style={styles.text}>Hi {firstName}</Text>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} 
      onPress={navigation.navigate("HomeScreen")}
      >
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
    
    container: {

    }
})