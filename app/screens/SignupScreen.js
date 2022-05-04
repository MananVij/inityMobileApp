import React, {useState} from 'react';

import {
  View,
  StyleSheet,
  TextInput,
  Button,
  Text,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import colors from '../config/colors';
import {createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import {authentication, createTotalExpenseDoc} from '../../config/keys';

function LoginScreen({navigation}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const registerUser = () => {
    createUserWithEmailAndPassword(authentication, email, password)
      .then(res => {
        authentication.currentUser.displayName = name;
        console.log('User Created Successfully', authentication);
        createTotalExpenseDoc();
        updateProfile(authentication.currentUser, {displayName: name});
      })
      .catch(err => {
        console.log('error: ', err);
      });
  };

  const handlePress = () => {
    if (!name) {
      Alert.alert('First name is required');
    } else if (!email) {
      Alert.alert('Email field is required.');
    } else if (!password) {
      Alert.alert('Password field is required.');
    } else {
      registerUser();
      navigation.replace('HomeScreen');
    }
  };

  return (
    <View style={styles.component}>
      <View style={styles.box}>
        <Text style={styles.heading}>Enter your Credentials</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.text}
            placeholder="Name"
            autoFocus={true}
            placeholderTextColor={'black'}
            value={name}
            onChangeText={name => setName(name)}></TextInput>
          <TextInput
            style={styles.text}
            placeholder="Email"
            placeholderTextColor={'black'}
            value={email}
            onChangeText={email => setEmail(email)}></TextInput>
          <TextInput
            style={styles.text}
            placeholder="Password"
            secureTextEntry={true}
            placeholderTextColor={'black'}
            value={password}
            onChangeText={password => setPassword(password)}></TextInput>
        </View>
        <TouchableOpacity>
          <View style={styles.button}>
            <Text style={styles.buttonText} onPress={handlePress}>
              Sign Up
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Sign Up With Google</Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: 1,
            marginTop: '5%',
          }}
        />
        <Text style={styles.signinText}>Already have an account?</Text>
        <TouchableOpacity>
          <View style={styles.button}>
            <Text
              style={styles.buttonText}
              onPress={() => {
                navigation.navigate('LoginScreen');
              }}>
              Sign In
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  box: {
    width: '85%',
    alignSelf: 'center',
  },
  component: {
    backgroundColor: colors.backgroundColor,
    flex: 1,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: '5%',
  },
  inputBox: {
    alignItems: 'center',
  },
  text: {
    height: 45,
    width: '100%',
    borderColor: '#1e5bfa',
    paddingLeft: 10,
    borderWidth: 1,
    borderRadius: 3,
    marginBottom: '2%',
  },
  forgotPasswordText: {
    marginBottom: '6%',
    fontSize: 18,
    textAlign: 'right',
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: '#1e5bfa',
    marginTop: '2%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  signinText: {
    textAlign: 'center',
    marginTop: '4%',
    marginBottom: '2%',
    fontSize: 20,
    fontWeight: '500',
  },
});

export default LoginScreen;
