import React, {useEffect, useState, useRef} from 'react';
import {StatusBar} from 'expo-status-bar';
import {StyleSheet, PermissionsAndroid, AppState} from 'react-native';

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
// import ResetPasswordScreen from './app/screens/ResetPasswordScreen';
import WeekSeg from './app/screens/WeekSeg';
import {onAuthStateChanged} from 'firebase/auth';
import SmsListener from 'react-native-android-sms-listener';

// Console Notification

// Background Service
import BackgroundService from 'react-native-background-actions';

// Location
import Geolocation from 'react-native-geolocation-service';
import {getUserData} from './API/firebaseMethods';
import SplashScreen from './app/screens/SplashScreen';

//Local Storage
import {storeDataLocally, retrieveData} from './app/functions/localStorage';

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
      // console.log('SMS Permission Granted');
    } else {
      console.log('SMS Permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};
const requestBgLocation = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      // PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      {
        title: 'Inity requires Location Permission',
        message:
          'We needs access to your location ' +
          'so you we take track offline expenses.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      // console.log('Background Location Permission Granted');
    } else {
      console.log('Background Location Permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};
const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      // PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION],
      {
        title: 'Inity requires Location Permission',
        message:
          'We needs access to your location ' +
          'so you we take track offline expenses.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      // console.log('Location Permission Granted');
    } else {
      console.log('Location Permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

export default function App() {
  const pushNotification = data => {
    return data;
  };

  const [userData, setUserData] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const [sms, setSms] = useState([]);
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestSMSPermission();
    requestBgLocation();
    requestLocationPermission();
  }, []);
  useEffect(() => {
    // Fetch connection status first time when app loads as listener is added afterwards
    NetInfo.fetch().then(state => {
      if (isOnline !== state.isConnected) {
        setIsOnline(!!state.isConnected && !!state.isInternetReachable);
      }
    });
  }, []);

  useEffect(() => {
    (async () => {
      setUserDataFxn();
    })();
  }, [isOnline]);

  useEffect(() => {
    BackgroundService.start(veryIntensiveTask, options);
    BackgroundService.updateNotification({
      taskDesc: 'New ExampleTask description',
    }); // Only Android, iOS will ignore this call
  }, []);

  useEffect(() => {
    // Fetch connection status first time when app loads as listener is added afterwards
    NetInfo.fetch().then(state => {
      if (isOnline !== state.isConnected) {
        setIsOnline(!!state.isConnected && !!state.isInternetReachable);
      }
    });
  }, []);

  NetInfo.addEventListener(state => {
    if (isOnline !== state.isConnected) {
      setIsOnline(!!state.isConnected && !!state.isInternetReachable);
    }
  });

  const setUserDataFxn = async () => {
    if (isOnline) {
      const data = await getUserData();
      setUserData([data]);
    } else {
      const data = await retrieveData('userData');
      setUserData(data);
    }
    setLoading(false);
  };

  onAuthStateChanged(authentication, user => {
    if (user) {
      setUser(user);
    }
  });

  const checkMsg = () => {
    const filter = {
      box: 'inbox',
      address: new RegExp('w*BK\b'),
      read: 0,
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
          ).format('DD-MM-YYYY');
          setSms(JSON.parse(smsList));
          setAmount(amount);
          setDate(date);
        }
      },
    );
  };

  const reverseGeocode = async (lat, long) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}&zoom=18&addressdetails=1`,
      );
      const json = await response.json();
      // console.log('reverse geocode: ', json);
      return json.movies;
    } catch (error) {
      console.error('error in reverse geocode:', error);
    }
  };

  const sleep = time =>
    new Promise(resolve => setTimeout(() => resolve(), time));

  const veryIntensiveTask = async taskDataArguments => {
    // infinite loop for tracking sms
    const {delay} = taskDataArguments;
    await new Promise(async resolve => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
        checkMsg();
        Geolocation.getCurrentPosition(
          info => {
            // console.log(info.coords.latitude, info.coords.latitude)
            // reverseGeocode(info.coords.latitude, info.coords.longitude)
          },
          e => {
            console.log(e.code, e.message);
          },
          {enableHighAccuracy: true},
        );
        await sleep(delay);
      }
    });
  };

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

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!loading ? (
          <>
            {user && userData[0] && userData[0].length ? (
              <>
                {!sms.length[0] ? (
                  <>
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
                    <Stack.Screen
                      options={{headerShown: false}}
                      initialParams={{setUser: setUser}}
                      name="LoginScreen"
                      component={LoginScreen}
                    />
                  </>
                ) : (
                  <>
                    <NewScreen
                      userData={userData[0]}
                      pushNotification={pushNotification}
                      amount={amount}
                      date={date}
                      setSms={setSms}></NewScreen>
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
                {/* <Stack.Screen
                  options={{headerShown: false}}
                  name="ResetPasswordScreen"
                  component={ResetPasswordScreen}
                /> */}
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
          <>
            <Stack.Screen
              options={{headerShown: false}}
              name="SplashScreen"
              component={SplashScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
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
