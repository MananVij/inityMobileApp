import React, {useEffect, useState} from 'react';
import SmsListener from 'react-native-android-sms-listener';
import SmsAndroid from 'react-native-get-sms-android';
import AddExpenseAuto from './AddExpenseAuto';

import BackgroundService from 'react-native-background-actions';
import {retrieveUserSession, storeTransaction} from '../functions/localStorage';

const sleep = time =>
  new Promise(resolve =>
    setTimeout(() => {
      resolve();
      return 1;
    }, time),
  );

const options = {
  taskName: 'Inity',
  taskTitle: 'Inity',
  taskDesc: 'Recording Your Transactions',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
  parameters: {
    delay: 1000,
  },
};

const getAmount = smsBody => {
  if (smsBody.includes('Rs.')) {
    const arr = smsBody.split('Rs.')[1]?.split(' ');
    return arr[0] == '' ? arr[1] : arr[0];
  } else if (smsBody.includes('Rs')) {
    const arr = smsBody.split('Rs')[1]?.split(' ');

    return arr[0] == '' ? arr[1] : arr[0];
  } else if (smsBody.includes('INR')) {
    const arr = smsBody.split('INR')[1]?.split(' ');
    return arr[0] == '' ? arr[1] : arr[0];
  }
};

const Sms = props => {
  const [sms, setSms] = useState();

  const checkMsg = () => {
    const filter = {
      box: 'inbox',
      read: 0,
      body: 'debited',
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
          JSON.parse(smsList)[0]?._id != (await retrieveUserSession())?._id
        ) {
          await storeTransaction(JSON.parse(smsList)[0]);
          props.pushNotif();
        }
      },
    );
  };

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

  useEffect(() => {
    BackgroundService.start(veryIntensiveTask, options);
  }, []);
  return (
    <AddExpenseAuto
      userData={props.userData}
      trans={props.trans}
      setTrans={props.setTrans}
      amount={props.amount}></AddExpenseAuto>
  );
};

export default Sms;
