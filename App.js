import React, {useEffect, useState, useRef} from 'react';
import {StatusBar} from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  AppState,
} from 'react-native';
import {AsyncStorage} from '@react-native-async-storage/async-storage';

import BackgroundTimer from 'react-native-background-timer';
import SmsAndroid from 'react-native-get-sms-android';
import moment from 'moment';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {authentication} from './config/keys';

// screens
import SignupScreen from './app/screens/SignupScreen';
import LoginScreen from './app/screens/LoginScreen';
import OnboardingScreen from './app/screens/OnboardingScreen';
import HomeScreen from './app/screens/HomeScreen';
import ExpenseTrackingScreen from './app/screens/ExpenseTrackingScreen';
import Sms from './app/screens/Sms';
import LogoutScreen from './app/screens/LogoutScreen';
import AddExpense from './app/screens/AddExpense';
import NewScreen from './app/screens/NewScreen';
import {onAuthStateChanged} from 'firebase/auth';
import AddExpenseAuto from './app/screens/AddExpenseAuto';
import SmsListener from 'react-native-android-sms-listener';


const requestSMSPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_SMS,
      {
        title: 'Cool Photo App Camera Permission',
        message:
          'Cool Photo App needs access to your camera ' +
          'so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('SMS Permission Granted');
    } else {
      console.log('SMS Permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

export default function App() {


  SmsListener.addListener(message => {
    console.info(message, 'manan here')
  })


  const pushNotification = data => {
    return data;
  };
  
  const [sms, setSms] = useState(false)
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    BackgroundTimer.runBackgroundTimer(() => {
      const filter = {
        box: 'inbox',
        address: 'QP-HDFCBK',
        read: 0
      };
      SmsAndroid.list(
        JSON.stringify(filter),
        fail => {
          console.log('fail: ', fail);
        },
        (count, smsList) => {
          if (
            JSON.parse(smsList)[0]?.body.includes('debited') ||
            JSON.parse(smsList)[0]?.body.includes('spent')
          ) {
            let amount = JSON.parse(smsList)[0].body.match(
              new RegExp('Rs' + '\\s(\\w+)'),
            )[1];
            let date = moment(
              new Date().toISOString(undefined, {timeZone: 'Asia/Kolkata'}),
            ).format('YYYY-MM-DD');
            setSms(true)
            setAmount(amount);
            setDate(date);
          }
        },
      );
    }, 5000);
  }, []);

  const [user, setUser] = useState();
  const [initializing, setInitializing] = useState(true);

  onAuthStateChanged(authentication, user => {
    if (user) {
      setUser(user);
      if (initializing) setInitializing(false);
    }
  });
  useEffect(() => {
    requestSMSPermission();
  }, []);
  if (user) {
    if(!sms) {
      return (
        <NavigationContainer>
          <Stack.Navigator>
            {/* <Stack.Screen
              options={{headerShown: false}}
              name="NewScreen"
              component={NewScreen}
              // pushNotification={pushNotification}
            /> */}
            <Stack.Screen
              options={{headerShown: false}}
              name="HomeScreen"
              component={HomeScreen}
            />
  
            <Stack.Screen
              options={{headerShown: false}}
              name="AddExpense"
              component={AddExpense}
            />
            <Stack.Screen
              options={{headerShown: false}}
              name="Sms"
              component={Sms}
            />
            <Stack.Screen
              options={{headerShown: false}}
              name="LogoutScreen"
              component={LogoutScreen}
            />
            <Stack.Screen
              options={{headerShown: false}}
              name="ExpenseTrackingScreen"
              component={ExpenseTrackingScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
    else {
      return (
        // <NewScreen pushNotification={pushNotification}></NewScreen>
        <NewScreen pushNotification={pushNotification} setSms={setSms}></NewScreen>
        )
    }
  } else {
    return (
      // <NewScreen pushNotification={pushNotification} ></NewScreen>
      // <Sms pushNotification={pushNotification}></Sms>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            options={{headerShown: false}}
            name="OnboardingScreen"
            component={OnboardingScreen}
          />
          {/* <Stack.Screen
          options={{headerShown: false}}
          name="NewScreen"
          component={NewScreen}
          pushNotification={pushNotification}
        /> */}
          <Stack.Screen
            options={{headerShown: false}}
            name="SignupScreen"
            component={SignupScreen}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="LoginScreen"
            component={LoginScreen}
          />

          <Stack.Screen
            options={{headerShown: false}}
            name="HomeScreen"
            component={HomeScreen}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="AddExpense"
            component={AddExpense}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="Sms"
            component={Sms}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="LogoutScreen"
            component={LogoutScreen}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="ExpenseTrackingScreen"
            component={ExpenseTrackingScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
const Stack = createNativeStackNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
