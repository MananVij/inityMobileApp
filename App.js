import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  PermissionsAndroid,
  ToastAndroid,
  Text,
  View,
} from 'react-native';

import SmsAndroid from 'react-native-get-sms-android';
import NetInfo from '@react-native-community/netinfo';
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
import ResetPasswordScreen from './app/screens/ResetPasswordScreen';
import WeekSeg from './app/screens/WeekSeg';
import SelectProfile from './app/screens/SelectProfile';
import {onAuthStateChanged} from 'firebase/auth';

// Background Service
import BackgroundService from 'react-native-background-actions';

// Location
import Geolocation from 'react-native-geolocation-service';
import {getUserData} from './API/firebaseMethods';
import SplashScreen from './app/screens/SplashScreen';

//Local Storage
import {retrieveData, retrieveUserSession} from './app/functions/localStorage';
import NotifService from './app/screens/NotifService';

// const requestSMSPermission = async () => {
//   try {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.READ_SMS,
//       {
//         title: 'Cool Photo App Camera Permission',
//         message:
//           'Cool Photo App needs access to your camera ' +
//           'so you can take awesome pictures.',
//         buttonNeutral: 'Ask Me Later',
//         buttonNegative: 'Cancel',
//         buttonPositive: 'OK',
//       },
//     );
//     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//       // console.log('SMS Permission Granted');
//     } else {
//       console.log('SMS Permission denied');
//     }
//   } catch (err) {
//     console.warn(err);
//   }
// };

//   try {
//     const granted = await PermissionsAndroid.request(
//       // PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
//       {
//         title: 'Inity requires Location Permission',
//         message:
//           'We needs access to your location ' +
//           'so you we take track offline expenses.',
//         buttonNeutral: 'Ask Me Later',
//         buttonNegative: 'Cancel',
//         buttonPositive: 'OK',
//       },
//     );
//     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//       // console.log('Background Location Permission Granted');
//     } else {
//       console.log('Background Location Permission denied');
//     }
//   } catch (err) {
//     console.warn(err);
//   }
// };
// const requestLocationPermission = async () => {
//   try {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       // PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION],
//       {
//         title: 'Inity requires Location Permission',
//         message:
//           'We needs access to your location ' +
//           'so you we take track offline expenses.',
//         buttonNeutral: 'Ask Me Later',
//         buttonNegative: 'Cancel',
//         buttonPositive: 'OK',
//       },
//     );
//     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//       // console.log('Location Permission Granted');
//     } else {
//       console.log('Location Permission denied');
//     }
//   } catch (err) {
//     console.warn(err);
//   }
// };

export default function App() {
  const pushNotification = data => {
    return data;
  };

  const [userData, setUserData] = useState([]);
  const [isOnline, setIsOnline] = useState();
  const [sms, setSms] = useState([]);
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [localData, setLocalData] = useState([]);

  // useEffect(() => {
  //   requestSMSPermission();
  // }, []);
  useEffect(() => {
    NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
    });
  }, []);

  useEffect(() => {
    (async () => {
      setUserDataFxn();
    })();
  }, [isOnline]);

  useEffect(() => {
    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS).then(
      res => {
        if (res) {
          BackgroundService.start(veryIntensiveTask, options);
        }
      },
    );
  }, []);

  const setUserDataFxn = async () => {
    const localData = await retrieveData('userData');
    setLocalData(localData);
    if (localData[0] == null) setLoading(false);
    if (localData[0]) {
      if (isOnline) {
        const data = await getUserData(localData[0][0].userDetails.uid);
        setUserData(data);
        setLoading(false);
      } else if (isOnline == false) {
        const data = await retrieveData('userData');
        setUserData(data[0]);
        setLoading(false);
        ToastAndroid.show("You're Offline!", ToastAndroid.SHORT);
      }
      setUser(localData[0][0].userDetails);
    }
  };

  onAuthStateChanged(authentication, user => {
    if (user) {
      setUser(user);
    }
  });

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

  const checkMsg = () => {
    const filter = {
      box: 'inbox',
      read: 0,
    };
    SmsAndroid.list(
      JSON.stringify(filter),
      fail => {
        console.log('fail: ', fail);
      },
      async (count, smsList) => {
        if (
          JSON.parse(smsList)[0]?.body.includes('debited') ||
          JSON.parse(smsList)[0]?.body.includes('spent')
        ) {
          const amount = getAmount(JSON.parse(smsList)[0].body);
          let date = moment(
            new Date().toISOString(undefined, {timeZone: 'Asia/Kolkata'}),
          ).format('DD-MM-YYYY');
          setSms([JSON.parse(smsList)[0]]);
          setAmount(amount);
          setDate(date);
        }
      },
    );
  };

  const sleep = time =>
    new Promise(resolve => setTimeout(() => resolve(), time));

  const veryIntensiveTask = async taskDataArguments => {
    const {delay} = taskDataArguments;
    await new Promise(async resolve => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
        checkMsg();
        await sleep(delay);
      }
    });
  };

  const options = {
    taskName: 'Inity',
    taskTitle: 'Inity',
    taskDesc: 'Recording your Transactions',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    linkingURI: 'https://inityappindia.page.link/verify', // See Deep Linking for more info
    parameters: {
      delay: 1000,
    },
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!loading ? (
          <>
            {user && userData[0] && userData.length ? (
              <>
                {userData[0].userDetails.gender == '' ? (
                  <>
                    <Stack.Screen
                      options={{headerShown: false}}
                      initialParams={{userData: userData}}
                      name="SelectProfile"
                      component={SelectProfile}
                    />
                    <Stack.Screen
                      options={{headerShown: false}}
                      initialParams={{userData: userData}}
                      name="HomeScreen"
                      component={HomeScreen}></Stack.Screen>
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
                    <Stack.Screen
                      options={{headerShown: false}}
                      name="WeekSeg"
                      component={WeekSeg}
                    />
                    <Stack.Screen
                      options={{headerShown: false}}
                      name="LoginScreen"
                      component={LoginScreen}
                    />
                    <Stack.Screen
                      options={{headerShown: false}}
                      name="ResetPasswordScreen"
                      component={ResetPasswordScreen}
                    />
                    <Stack.Screen
                      options={{headerShown: false}}
                      name="SignupScreen"
                      component={SignupScreen}
                    />
                  </>
                ) : (
                  <>
                    {!sms[0] ? (
                      <>
                        <Stack.Screen
                          options={{headerShown: false}}
                          initialParams={{userData: userData}}
                          name="HomeScreen"
                          component={HomeScreen}></Stack.Screen>
                        <Stack.Screen
                          options={{headerShown: false}}
                          name="AddExpense"
                          component={AddExpense}
                        />
                        <Stack.Screen
                          options={{headerShown: false}}
                          name="SelectProfile"
                          component={SelectProfile}
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
                        <Stack.Screen
                          options={{headerShown: false}}
                          name="WeekSeg"
                          component={WeekSeg}
                        />
                        <Stack.Screen
                          options={{headerShown: false}}
                          name="LoginScreen"
                          component={LoginScreen}
                        />
                        <Stack.Screen
                          options={{headerShown: false}}
                          name="ResetPasswordScreen"
                          component={ResetPasswordScreen}
                        />
                        <Stack.Screen
                          options={{headerShown: false}}
                          name="SignupScreen"
                          component={SignupScreen}
                        />
                      </>
                    ) : (
                      <>
                        <Stack.Screen
                          options={{headerShown: false}}
                          name="NewScreen">
                          {props => (
                            <NewScreen
                              {...props}
                              userData={userData[0]}
                              amount={amount}
                              date={date}
                              msg={sms}
                              setSms={setSms}
                            />
                          )}
                        </Stack.Screen>
                      </>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                <Stack.Screen
                  options={{headerShown: false}}
                  name="OnboardingScreen"
                  component={OnboardingScreen}
                />
                <Stack.Screen
                  options={{headerShown: false}}
                  name="SignupScreen"
                  component={SignupScreen}
                />
                <Stack.Screen
                  options={{headerShown: false}}
                  name="SelectProfile"
                  component={SelectProfile}
                />
                <Stack.Screen
                  options={{headerShown: false}}
                  name="ResetPasswordScreen"
                  component={ResetPasswordScreen}
                />
                <Stack.Screen
                  options={{headerShown: false}}
                  name="LoginScreen"
                  component={LoginScreen}
                />
                <Stack.Screen
                  options={{headerShown: false}}
                  initialParams={{userData: userData[0]}}
                  name="HomeScreen"
                  component={HomeScreen}></Stack.Screen>
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
                <Stack.Screen
                  options={{headerShown: false}}
                  name="WeekSeg"
                  component={WeekSeg}
                />
              </>
            )}
          </>
        ) : (
          <Stack.Screen
            options={{headerShown: false}}
            name="SplashScreen"
            component={SplashScreen}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const Stack = createNativeStackNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
