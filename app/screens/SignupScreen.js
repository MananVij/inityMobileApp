import React, {useState} from 'react';

import {StyleSheet, Image, ToastAndroid, ScrollView} from 'react-native';
import colors from '../config/colors';
import {
  Button,
  Provider,
  Text,
  TextInput,
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

function LoginScreen({navigation}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loader, setLoader] = useState(false);
  const [googleLoader, setGoogleLoader] = useState(false);
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
            storeDataLocally('userData', userData);
            navigation.replace('HomeScreen', {userData: userData});

            // await fetchSignInMethodsForEmail(authentication, data.user.email)
            //   .then(async res => {
            //     if (!res.length) {
            //       const googleUser = {
            //         displayName: user.user.displayName,
            //         email: user.user.email,
            //         userId: user.user.uid,
            //       };
            //       console.log('googleUser', googleUser);
            //       await createSignupDoc(googleUser);
            //     }
            //     const userData = await getUserData(googleUser.userId);
            //     navigation.replace('HomeScreen', {userData: userData});
            //   })
            //   .catch(e => {
            //     console.log('error', e);
            //   });
          });
      });
      // .then(async user => {
      //   // await fetchSignInMethodsForEmail(authentication, data.user.email).then(res => {
      //   //   if(!da)

      //   // }).catch(e => {
      //   //   console.log("e", e);
      //   // })
      //   console.log('User Logged In');

      //   // const googleUser = {
      //   //   displayName: user.user.displayName,
      //   //   email: user.user.email,
      //   //   userId: user.user.uid,
      //   // };
      //   // await createSignupDoc(googleUser);
      //   // const data = await getUserData(googleUser.userId);
      //   // navigation.replace('HomeScreen', {userData: data});
      // })
      // .catch(error => {
      //   const {code, message} = error;
      //   console.log(error);
      // });
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
              marginTop: '45%',
              marginBottom: '15%',
            }}></Image>
          <Text style={styles.heading}>Sign up</Text>

          <TextInput
            theme={{
              colors: {primary: colors.logoColor},
            }}
            style={{marginVertical: '0.5%'}}
            mode="outlined"
            label={'Name'}
            placeholderTextColor={'black'}
            value={name}
            onChangeText={name => setName(name)}></TextInput>
          <TextInput
            theme={{
              colors: {primary: colors.logoColor},
            }}
            style={{marginVertical: '0.5%'}}
            mode="outlined"
            label={'Email'}
            value={email}
            onChangeText={email => setEmail(email)}></TextInput>
          <TextInput
            theme={{
              colors: {primary: colors.logoColor},
            }}
            style={{marginVertical: '0.5%', marginBottom: '8%'}}
            mode="outlined"
            label={'Password'}
            secureTextEntry={true}
            value={password}
            onChangeText={password => setPassword(password)}></TextInput>
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
          <Button
            style={styles.button}
            labelStyle={styles.buttonText}
            loading={googleLoader}
            onPress={async () => {
              setGoogleLoader(true);
              await googleSignup();
              setGoogleLoader(false);
            }}>
            Sign Up With Google
          </Button>
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
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: '5%',
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
    marginTop: '7%',
    fontSize: 17,
    fontWeight: '500',
  },
});

export default LoginScreen;
