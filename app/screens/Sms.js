import React, {useEffect, useState} from 'react';
import {
  Button,
  PermissionsAndroid,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import SmsListener from 'react-native-android-sms-listener';
import SmsAndroid from 'react-native-get-sms-android';
import {addDoc, collection} from 'firebase/firestore/lite';
import New from './NewScreen';
import {db} from '../../config/keys';
import NewScreen from './NewScreen';
// import this.notif.localNotif() from './NotifService';

const Sms = (props) => {
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
          props.pushNotif()
        }
      },
    );
  }, []);

  return (
    <View>
    </View>
  );
};

export default Sms;


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