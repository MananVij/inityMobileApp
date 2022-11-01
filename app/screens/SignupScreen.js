import React, {useState} from 'react';

import {
  StyleSheet,
  Image,
  ToastAndroid,
  ScrollView,
  TouchableOpacity,
  View,
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
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import {firebase} from '@react-native-firebase/auth';
import {authentication, webClientId} from '../../config/keys';
import {getUserData} from '../../API/firebaseMethods';
import {createSignupDoc} from '../../API/firebaseMethods';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {signOut} from 'firebase/auth';
import {SafeAreaView} from 'react-native-safe-area-context';
import {storeDataLocally} from '../functions/localStorage';
import TextInputModified from '../components/TextInputModified';

function LoginScreen({navigation}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loader, setLoader] = useState(false);
  const [dialogMsg, setDialogMsg] = useState('');

  GoogleSignin.configure({
    webClientId: webClientId,
  });

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
      try {
        const user = await createUserWithEmailAndPassword(
          authentication,
          email,
          password,
        )
          .then(async res => {
            authentication.currentUser.displayName = name;
            const signupData = await createSignupDoc(
              authentication.currentUser,
            );
            await updateProfile(authentication.currentUser, {
              displayName: name,
            });

            await sendEmailVerification(authentication.currentUser, {
              url: 'https://inityappindia.page.link/verify',
              handleCodeInApp: true,
            });
            console.log('Email verification link sent');
            signOut(authentication)
              .then(async () => {
                ToastAndroid.show(
                  'Email verifcation link sent to your email.',
                  ToastAndroid.SHORT,
                );
              })
              .catch(error => {
                console.log('Error is Signout: ', error);
              });
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
              console.log(error);
            }
          });
      } catch (error) {
        console.log('error', error);
      }
      setName('');
      setEmail('');
      setPassword('');
    }
  };

  const googleSignup = async () => {
    try {
      await GoogleSignin.signIn().then(async data => {
        const credential = firebase.auth.GoogleAuthProvider.credential(
          data.idToken,
          data.accessToken,
        );
        return firebase
          .auth()
          .signInWithCredential(credential)
          .then(async user => {
            if (user.additionalUserInfo.isNewUser) {
              const googleUser = {
                displayName: user.user.displayName,
                email: user.user.email,
                userId: user.user.uid,
              };
              await createSignupDoc(googleUser);
            }
            const userData = await getUserData(user.user.uid);
            await storeDataLocally('userData', userData);

            if (userData[0]?.userDetails.gender == '') {
              navigation.replace('SelectProfile', {userData: userData});
            } else {
              if (!(await ifAvatarExists())) {
                await storeAvatar(userData[0]?.userDetails.avatarLink);
              }
              navigation.replace('HomeScreen', {userData: userData});
            }
          });
      });
    } catch (error) {
      if (error.message == 'Sign in action cancelled')
        ToastAndroid.show('User not signed up', ToastAndroid.SHORT);
      else {
        ToastAndroid.show('Some error Occured', ToastAndroid.SHORT);
        console.log(error);
      }
    }
  };

  return (
    <Provider>
      <SafeAreaView style={{flex: 1, marginHorizontal: '7%'}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{flex: 1, marginBottom: '5%'}}
          contentContainerStyle={{flexGrow: 1}}>
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

          <Image
            source={require('../../assets/icons/round-logo.png')}
            style={{
              alignSelf: 'center',
              width: 90,
              height: 90,
              marginTop: '38%',
              marginBottom: '15%',
            }}></Image>
          <Text style={styles.heading}>Sign up</Text>
          {TextInputModified('Name', false, true, name, setName)}
          {TextInputModified('Email', false, true, email, setEmail)}
          {TextInputModified('Password', true, true, password, setPassword)}
          <Button
            mode="contained"
            style={styles.button}
            labelStyle={styles.buttonText}
            loading={loader}
            onPress={async () => {
              setLoader(true);
              await handlePress();
              setLoader(false);
            }}>
            Sign Up
          </Button>
          <TouchableOpacity
            style={styles.googleButton}
            activeOpacity={0.6}
            onPress={async () => {
              // setGoogleLoader(true);
              await googleSignup();
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: '1.2%',
              }}>
              <Image
                source={require('../../assets/icons/glogo.png')}
                style={{height: 30, width: 30, marginRight: '5%'}}></Image>
              <Text style={{fontSize: 14, fontWeight: '600', color: '#757575'}}>
                Sign Up With Google
              </Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.signupText}>
            Already have an account?{' '}
            <Text
              style={
                (styles.signupText,
                {textDecorationLine: 'underline', color: colors.logoColor})
              }
              onPress={() => {
                navigation.navigate('LoginScreen');
              }}>
              Login
            </Text>
          </Text>
        </ScrollView>
      </SafeAreaView>
    </Provider>
  );
}
const styles = StyleSheet.create({
  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    // textAlign: 'left',
    marginBottom: '5%',
    color: colors.secondaryHeading,
  },
  googleButton: {
    marginTop: '3%',
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: '2%',
    backgroundColor: 'white',
  },
  button: {
    borderRadius: 12,
    marginTop: '2%',
    backgroundColor: '#1e5bfa',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  signupText: {
    textAlign: 'center',
    marginTop: '2%',
    fontSize: 15,
    fontWeight: '500',
    color: 'black',
  },
});

export default LoginScreen;
