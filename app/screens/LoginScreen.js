import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {Button, Dialog, Portal, Paragraph, Provider} from 'react-native-paper';
import {authentication} from '../../config/keys';
import colors from '../config/colors';
import { getUserData } from '../../API/firebaseMethods';
import { retrieveData, storeDataLocally } from '../functions/localStorage';

function LoginScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loader, setLoader] = useState(false);
  const [dialogMsg, setDialogMsg] = useState('');

  const handlePress = async () => {
    if (!email) {
      setDialogMsg('Email is required');
      showDialog();
    } else if (!password) {
      setDialogMsg('Password is required');
      showDialog();
    } else {
      await signInWithEmailAndPassword(authentication, email, password)
        .then(async res => {
          const data = await getUserData();
          storeDataLocally("userData", data);
          navigation.replace('HomeScreen', {userData: data});
        })
        .catch(err => {
          console.log('err: ', err);
          if(err.code == 'auth/wrong-password')
          {
            setDialogMsg('Wrong Password');
            showDialog();
          }
        });
    }
    setEmail('');
    setPassword('');
  };
  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  return (
    <Provider>
      <View>
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Content>
              <Paragraph>{dialogMsg}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Ok</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
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
          <TouchableOpacity onPress={() => {navigation.navigate('ResetPasswordScreen')}}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text> 
          </TouchableOpacity>
          <Button
            mode="contained"
            style={styles.button}
            labelStyle={{fontSize: 19, fontWeight: '700'}}
            loading={loader}
            onPress={async () => {
              setLoader(true);
              await handlePress();
              setLoader(false);
            }}>
            Log In
          </Button>
          <Text style={styles.signupText}>
            Don't have an account?
            <Text
              style={(styles.signupText, {textDecorationLine: 'underline'})}
              onPress={() => {
                navigation.navigate('SignupScreen');
              }}>
              SignUp
            </Text>
          </Text>
        </View>
      </View>
    </Provider>
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
    paddingVertical: 2,
    // paddingHorizontal: 10,
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
