import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  Text,
  TouchableOpacity,
  Alert,
  PermissionsAndroid
} from 'react-native';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {authentication} from '../../config/keys';
import colors from '../config/colors';

function LoginScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handlePress = () => {
    if (!email) {
      Alert.alert('Email field is required.');
    } else if (!password) {
      Alert.alert('Password field is required.');
    } else {
      signInWithEmailAndPassword(authentication, email, password)
        .then(res => {
          // setIsSignedIn(true);
          navigation.replace("HomeScreen")
        })
        .catch(err => {
          console.log('err: ', err);
        });
    }
    setEmail('');
    setPassword('');
  };

  return (
    <View style={styles.component}>
      <View style={styles.box}>
        <Text style={styles.heading}>Enter your Credentials</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.text}
            placeholder="Username"
            autoFocus={true}
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
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        <TouchableOpacity onPress={handlePress}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Log In</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.signupText}>
          Don't have an account?
          <Text
            style={(styles.signupText, {textDecorationLine: 'underline'})}
            onPress={() => {
              navigation.navigate("SignupScreen");
            }}>
            SignUp
          </Text>
        </Text>
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
    marginBottom: '3%',
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
    textDecorationLine: 'underline',
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: '#1e5bfa',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  signupText: {
    textAlign: 'center',
    marginTop: '7%',
    fontSize: 20,
    fontWeight: '500',
  },
});

export default LoginScreen;
