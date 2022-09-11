import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRoute} from '@react-navigation/native';
import {Text, Button} from 'react-native-paper';
import {signOut} from 'firebase/auth';
import {authentication} from '../../config/keys';
import {clearStorage} from '../functions/localStorage';

import {CommonActions} from '@react-navigation/native';
import colors from '../config/colors';

export default function Dashboard({navigation}) {
  const route = useRoute();

  const handlePress = () => {
    signOut(authentication)
      .then(async () => {
        console.log('user Signed Out');
        await clearStorage();
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'LoginScreen'}],
          }),
        );
        // Sign-out successful.
      })
      .catch(error => {
        console.log('Error is Signout: ', error);
        // An error happened.
      });
    // navigation.dispatch(StackActions)
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{marginTop: '10%'}}>
        <Text style={styles.text}>Hope to see you soon</Text>
        <Text style={styles.name}>
          {route?.params.userDetails.name.substring(
            0,
            route?.params.userDetails.name.indexOf(' '),
          )}
        </Text>
      </View>

      <Button
        style={styles.button}
        labelStyle={styles.buttonText}
        mode="contained"
        onPress={() => {
          handlePress();
        }}>
        LogOut
      </Button>
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
    fontSize: 25,
    fontWeight: '500',
  },
  name: {
    fontSize: 30,
    fontWeight: '800',
  },
  button: {
    borderRadius: 12,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    paddingVertical: 2,
    backgroundColor: colors.logoColor,
  },
  buttonText: {fontSize: 16, fontWeight: '700'},
});
