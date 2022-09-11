import {View, Text, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {Button, TextInput} from 'react-native-paper';
import {getAuth, sendPasswordResetEmail} from 'firebase/auth';
import colors from '../config/colors';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const auth = getAuth();
export default function ResetPasswordScreen() {

  const [email, setEmail] = useState('');
  const sendResetEmail = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        // ..
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        // ..
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <ScrollView style={{height: '100%', flex: 1}}> */}
      <Text style={styles.text}>Reset your Password</Text>
      <TextInput
        style={{position: 'absolute', width: '100%', bottom: '10%'}}
        mode="outlined"
        label="Email"
        value={email}
        onChangeText={email => setEmail(email)}></TextInput>
      <Button
        style={styles.button}
        labelStyle={styles.buttonText}
        mode="contained"
        onPress={() => {
          sendResetEmail();
        }}>
        Send Email
      </Button>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: '5%',
    marginBottom: '15%',
  },
  text: {
    fontSize: 23,
    fontWeight: '800',
    marginTop: '10%',
  },
  name: {
    fontSize: 30,
    fontWeight: '800',
  },
  button: {
    borderRadius: 12,
    width: '100%',
    // marginTop: '10%',
    position: 'absolute',
    bottom: 0,

    // paddingVertical: 2,
    backgroundColor: colors.logoColor,
  },
  buttonText: {fontSize: 16, fontWeight: '700'},
});
