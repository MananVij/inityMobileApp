import React, {useEffect, useState} from 'react';
import {
  Button,
  PermissionsAndroid,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import SmsListener from 'react-native-android-sms-listener';
import SmsAndroid from 'react-native-get-sms-android';
import {addDoc, collection} from 'firebase/firestore/lite';

import {db} from '../../config/keys';

const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      // PermissionsAndroid.PERMISSIONS.READ_SMS,
      {
        title: 'Inity needs to read your SMS',
        message: 'Inity needs to read your SMS ' + 'to track your expenses.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('SMS permission granted');
    } else {
      console.log('SMS permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

const App = () => {
  // const UploadDocs = () => {
  useEffect(() => {
    const filter = {
      box: 'inbox',
    };
    SmsAndroid.list(
      JSON.stringify(filter),
      fail => {
        console.log('fail: ', fail);
      },
      (count, smsList) => {

        if(((JSON.parse(smsList))[0].body).includes('debited')) {
          console.log((JSON.parse(smsList))[0].body)
        }
      },
    );
  }, []);
  // useEffect(() => {
  //   const subscribe = SmsListener.addListener(item => {
  //     // console.log('sms is: ', item.body);
  //   });

  //   return () => subscribe.remove();
  // }, []);

  // };

  // const NewDoc = async () => {
  //   try {
  //     const docRef = await addDoc(collection(db, 'cities'), {
  //       city_name: "Delhi",
  //       country: "India"
  //     });
  //     console.log('Document written with ID: ', docRef.id);

  //   } catch (error) {
  //     console.log("error: ", error);
  //   }
  // }

  // NewDoc()
  //     const UploadDocs = async () => {
  //       try {
  //         const docRef = await addDoc(collection(db, "cities"), {
  //             city_name: "New Delhi",
  //             country: "India"
  //           });
  //           console.log("Document written with ID: ", docRef.id);

  //       } catch (error) {
  //         console.log("error: ", error);
  //       }
  //   }

  // UploadDocs()

  return (
    <View style={styles.container}>
      <Text style={styles.item}>Try permissions</Text>
      <Button title="request permissions" onPress={requestCameraPermission} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  item: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default App;
