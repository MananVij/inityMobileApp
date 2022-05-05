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

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {authentication} from './config/keys';
// import firebase from 'firebase/app';
// import apiKeys from "./config/keys";
// import {onAuthStateChanged} from './config/keys';
// import { authentication } from './config/keys';
// screens
import SignupScreen from './app/screens/SignupScreen';
import LoginScreen from './app/screens/LoginScreen';
import OnboardingScreen from './app/screens/OnboardingScreen';
import SelectAvatar from './app/screens/SelectAvatar';
import TaxSaving from './app/screens/TaxSaving';
import HomeScreen from './app/screens/HomeScreen';
import SplashScreen from './app/screens/SplashScreen';
import ExpenseTrackingScreen from './app/screens/ExpenseTrackingScreen';
import Sms from './app/screens/Sms';
import LogoutScreen from './app/screens/LogoutScreen';
import New from './app/screens/New';
import AddExpense from './app/screens/AddExpense';
import NewScreen from './app/screens/NewScreen';
import {onAuthStateChanged} from 'firebase/auth';

export function isSigned() {
  const [isSignedIn, setIsSignedIn] = useState(false);
}

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
  const pushNotification = data => {
    return data;
  };

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
      if (AppState.currentState === 'background') {
        console.log('app in back');
      <NewScreen pushNotification={pushNotification} ></NewScreen>

        // console.log('count: ', ++count);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const [user, setUser] = useState();
  const [initializing, setInitializing] = useState(true);

  onAuthStateChanged(authentication, user => {
    if (user) {
      setUser(user);
      if (initializing) setInitializing(false);
    }
  });

  if (user) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
        {/* <Stack.Screen
          options={{headerShown: false}}
          name="NewScreen"
          component={NewScreen}
          pushNotification={pushNotification}
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
          <Stack.Screen
          options={{headerShown: false}}
          name="NewScreen"
          component={NewScreen}
          pushNotification={pushNotification}
        />
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
