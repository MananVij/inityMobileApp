import React, {useEffect, useState} from 'react';
import {
  Button,
  PermissionsAndroid,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import SmsListener from 'react-native-android-sms-listener';
import SmsAndroid from 'react-native-get-sms-android';
import {addDoc, collection} from 'firebase/firestore/lite';
import moment from 'moment';
import New from './NewScreen';
import {db} from '../../config/keys';
import NewScreen from './NewScreen';
import AddExpenseAuto from './AddExpenseAuto';

const Sms = (props) => {
  const [date, setDate] = useState('jb');
  const [amount, setAmount] = useState('hb');
  const sender = ['JD-HDFCBK', 'QP-HDFCBK', 'CP-HDFCBK'];
  useEffect(() => {
    const filter = {
      box: 'inbox',
      // address: 'JD-HDFCBK'
      address: 'JD-HDFCBK',
    };
    SmsAndroid.list(
      JSON.stringify(filter),
      fail => {
        console.log('fail: ', fail);
      },
      (count, smsList) => {
        if (
          (JSON.parse(smsList)[0].body.includes('debited') ||
          JSON.parse(smsList)[0].body.includes('spent')) 
          // && (JSON.parse(smsList)[0].body != undefined)
        ) {
          let amount = (JSON.parse(smsList))[0].body.match(new RegExp('Rs' + '\\s(\\w+)'))[1];
          let date = moment(new Date().toISOString(undefined, {timeZone: 'Asia/Kolkata'})).format('YYYY-MM-DD')
          props.pushNotif()
          setAmount(amount)
          setDate(date)
        }
      },
    );
  }, []);

  return <AddExpenseAuto amount = {amount} date = {date}></AddExpenseAuto>;
};

export default Sms;