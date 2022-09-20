import React, {useState} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRoute} from '@react-navigation/native';
import {Text, Button} from 'react-native-paper';
import {signOut} from 'firebase/auth';
import {authentication} from '../../config/keys';
import {clearStorage} from '../functions/localStorage';

import {CommonActions} from '@react-navigation/native';
import colors from '../config/colors';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

export default function Dashboard({navigation}) {
  const route = useRoute();  
  GoogleSignin.configure({
    webClientId:
    '610375507483-77ini3v81sfaaq4itq1a47q0ihofrrvo.apps.googleusercontent.com'
      // '962761017947-pp2eao01h4lk7mpa5qhfa6hcn1er8a89.apps.googleusercontent.com',
  });

  const handlePress = async () => {
    if (authentication.currentUser) {
      signOut(authentication)
        .then(async () => {
          await clearStorage();
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'LoginScreen'}],
            }),
          );
          console.log('User Signed Out');
        })
        .catch(error => {
          console.log('Error is Signout: ', error);
        });
    } else {
      await GoogleSignin.signOut();
      await clearStorage();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'LoginScreen'}],
        }),
      );
      console.log('User Signed Out');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{marginTop: '10%', paddingHorizontal: '5%'}}>
        <Text style={styles.text}>Hope to see you soon</Text>
        <Text style={styles.name}>
          {route?.params.userDetails.name.indexOf(' ') != -1
            ? route?.params.userDetails.name.substring(
                0,
                route?.params.userDetails.name.indexOf(' '),
              )
            : route?.params.userDetails.name}
        </Text>
      </View>
      <Image
        source={require('../../assets/icons/logout.png')}
        style={{width: '100%', height: '70%', alignSelf: 'center', resizeMode: 'contain'}}></Image>
      <Button
        style={styles.button}
        labelStyle={styles.buttonText}
        mode="contained"
        onPress={async () => {
         await handlePress();
        }}>
        LogOut
      </Button>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginHorizontal: '5%',
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
    left: '5%',
    // right: '5%',
    width: '90%',
    position: 'absolute',
    bottom: 0,
    paddingVertical: 2,
    backgroundColor: colors.logoColor,
  },
  buttonText: {fontSize: 16, fontWeight: '700'},
});
