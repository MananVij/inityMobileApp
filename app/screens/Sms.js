import React, {useEffect, useState} from 'react';
import SmsListener from 'react-native-android-sms-listener';
import SmsAndroid from 'react-native-get-sms-android';
import moment from 'moment';
import AddExpenseAuto from './AddExpenseAuto';

const Sms = (props) => {
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const sender = ['JD-HDFCBK', 'QP-HDFCBK', 'CP-HDFCBK'];
  useEffect(() => {
    const filter = {
      box: 'inbox',
      address: 'QP-HDFCBK',
    };
    SmsAndroid.list(
      JSON.stringify(filter),
      fail => {
        console.log('fail: ', fail);
      },
      (count, smsList) => {
        if (
          (JSON.parse(smsList)[0]?.body.includes('debited') ||
          JSON.parse(smsList)[0]?.body.includes('spent')) 
        ) {
          let amount = (JSON.parse(smsList))[0].body.match(new RegExp('Rs' + '\\s(\\w+)'))[1];
          let date = moment(new Date().toISOString(undefined, {timeZone: 'Asia/Kolkata'})).format('YYYY-MM-DD')
          // console.log(amount, date)
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