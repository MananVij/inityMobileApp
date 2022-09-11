import React, {useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import SmsListener from 'react-native-android-sms-listener';
import SmsAndroid from 'react-native-get-sms-android';
import moment from 'moment';
import AddExpenseAuto from './AddExpenseAuto';
import EncryptedStorage from 'react-native-encrypted-storage';

import BackgroundService from 'react-native-background-actions';

const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

const options = {
  taskName: 'Inity',
  taskTitle: 'Inity',
  taskDesc: 'ExampleTask description',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
  parameters: {
    delay: 1000,
  },
};

const Sms = props => {
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const sender = ['JD-HDFCBK', 'JD-HDFCBK', 'CP-HDFCBK'];
  const [sms, setSms] = useState();

  const checkMsg = () => {
    const filter = {
      box: 'inbox',
      address: new RegExp('w*BK\b'),
      read: 0,
      body: 'debited'
    };
    SmsAndroid.list(
      JSON.stringify(filter),
      fail => {
        console.log('fail: ', fail);
      },
      async (count, smsList) => {
        setSms(JSON.parse(smsList)[0]);
        if (
          (JSON.parse(smsList)[0]?.body.includes('debited') ||
            JSON.parse(smsList)[0]?.body.includes('spent') ||
            JSON.parse(smsList)[0]?.body.includes('credited')) &&
          JSON.parse(smsList)[0]?._id != (await retrieveUserSession())
        ) {
          let amount = JSON.parse(smsList)[0].body.match(
            new RegExp('Rs' + '\\s(\\w+)'),
          )[1];
          let date = moment(
            new Date().toISOString(undefined, {timeZone: 'Asia/Kolkata'}),
          ).format('DD-MM-YYYY');
          setSms({...sms, notified: true});
          console.log(sms, 'in sms.js');

          storeTransaction(JSON.parse(smsList)[0]);
          props.pushNotif();
          setAmount(amount);
          setDate(date);
        }
      },
    );
  };

  async function retrieveUserSession() {
    try {
      const session = await EncryptedStorage.getItem(
        'user_online_transactions',
      );

      if (session !== undefined) {
        return JSON.parse(session)._id;
      }
    } catch (error) {
      console.log('error in accessing the transactions from storage: ', error);
    }
  }

  async function storeTransaction(smsList) {
    try {
      await EncryptedStorage.setItem(
        'user_online_transactions',
        JSON.stringify({
          ...smsList,
        }),
      );
    } catch (error) {
      // There was an error on the native side
    }
  }

  const veryIntensiveTask = async taskDataArguments => {
    // infinite loop for tracking sms
    const {delay} = taskDataArguments;
    await new Promise(async resolve => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
        checkMsg();
        await sleep(delay);
      }
    });
  };

  try {
    let subscription = SmsListener.addListener(message => {
      console.log(message);
      subscription.remove();
    });
  } catch (error) {
    console.log(error);
  }

  useEffect(() => {
    BackgroundService.start(veryIntensiveTask, options);
    BackgroundService.updateNotification({
      taskDesc: 'New ExampleTask description',
    }); // Only Android, iOS will ignore this call
  }, []);

  return (
    <AddExpenseAuto
      userData={props.userData}
      date={props.date}
      newSms={props.newSms}
      amount={props.amount}></AddExpenseAuto>
  );
};

export default Sms;
