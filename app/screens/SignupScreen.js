import React, {useState} from 'react';

import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import colors from '../config/colors';
import {
  Button,
  Provider,
  Text,
  Portal,
  Paragraph,
  Dialog,
} from 'react-native-paper';
import {createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import {authentication} from '../../config/keys';
import {createTotalExpenseDoc} from '../../API/firebaseMethods';
import {createSignupDoc} from '../../API/firebaseMethods';

function LoginScreen({navigation}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loader, setLoader] = useState(false);
  const [dialogMsg, setDialogMsg] = useState('');

  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const handlePress = async () => {
    if (!name) {
      setDialogMsg('Name is required');
      showDialog();
    } else if (!email) {
      setDialogMsg('Email is required');
      showDialog();
    } else if (!password) {
      setDialogMsg('Password is required');
      showDialog();
    } else {
      await createUserWithEmailAndPassword(authentication, email, password)
        .then(res => {
          authentication.currentUser.displayName = name;
          console.log('User Created Successfully', authentication);
          createSignupDoc(authentication.currentUser);
          updateProfile(authentication.currentUser, {displayName: name});
          navigation.replace('HomeScreen');
        })
        .catch(error => {
          console.log(error.code);
          if (error.code == 'auth/email-already-in-use') {
            setDialogMsg('The email address is already in use!');
            showDialog();
          } else if (error.code == 'auth/invalid-email') {
            setDialogMsg('The email address is invalid!');
            showDialog();
          } else {
            setDialogMsg('Something went wrong!');
            showDialog();
            console.log(error.code);
          }
        });
    }
  };

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
          <Button
            style={styles.button}
            onPress={async () => {
              setLoader(true);
              await handlePress();
              setLoader(false);
            }}
            loading={loader}
            labelStyle={styles.buttonText}>
            Sign Up
          </Button>
          <Button style={styles.button} labelStyle={styles.buttonText}>
            Sign Up With Google
          </Button>
          <View
            style={{
              borderBottomColor: 'black',
              borderBottomWidth: 1,
              marginTop: '5%',
            }}
          />
          <Text style={styles.signinText}>Already have an account?</Text>
          <Button
            style={styles.button}
            labelStyle={styles.buttonText}
            onPress={() => {
              navigation.navigate('LoginScreen');
            }}>
            Sign In
          </Button>
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
    paddingVertical: 4,
    marginTop: '2%',
    backgroundColor: '#1e5bfa',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
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
