import React, {useState} from 'react';

import {View, StyleSheet, Image, ToastAndroid, ScrollView} from 'react-native';
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
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  getRedirectResult,
  sendSignInLinkToEmail,
  signInWithCredential,
  OAuthCredential,
  isSignInWithEmailLink,
} from 'firebase/auth';
import {firebase} from '@react-native-firebase/auth';
import {authentication, provider} from '../../config/keys';
import {createTotalExpenseDoc, getUserData} from '../../API/firebaseMethods';
import {createSignupDoc} from '../../API/firebaseMethods';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {getAuth} from 'firebase/auth';
import {SafeAreaView} from 'react-native-safe-area-context';

const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  // url: '^https://.*.com/.*$inityapp.page.link/download/',
  url: 'https://example.com/?currPage=1',
  // url: '^https://inity-214a0\.firebaseapp\.com/.*$',
  // This must be true.
  handleCodeInApp: true,
  iOS: {
    bundleId: 'com.inity.ios',
  },
  android: {
    packageName: 'com.inity.android',
    installApp: true,
    minimumVersion: '12',
  },
  // dynamicLinkDomain: '^https://inityapp.page.link/download/',
};

function LoginScreen({navigation}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loader, setLoader] = useState(false);
  const [dialogMsg, setDialogMsg] = useState('');

  GoogleSignin.configure({
    webClientId:
      '962761017947-pp2eao01h4lk7mpa5qhfa6hcn1er8a89.apps.googleusercontent.com',
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
      // sendSignInLinkToEmail(authentication, email, actionCodeSettings)
      //   .then(() => {
      //     const manan = isSignInWithEmailLink(authentication, email)
      //     console.log('link sent');
      //     console.log("manan", manan)
      //     // The link was successfully sent. Inform the user.
      //     // Save the email locally so you don't need to ask the user for it again
      //     // if they open the link on the same device.
      //     // window.localStorage.setItem('emailForSignIn', email);
      //     // ...
      //   })
      //   .catch(error => {
      //     const errorCode = error.code;
      //     const errorMessage = error.message;
      //     console.log(errorCode, errorMessage);
      //     // ...
      //   });
      try {
        const user = await createUserWithEmailAndPassword(
          authentication,
          email,
          password,
        )
          .then(async res => {
            console.log(res)
            authentication.currentUser.displayName = name;
            console.log('User Created Successfully', authentication);
            await createSignupDoc(authentication.currentUser);
            await updateProfile(authentication.currentUser, {displayName: name});
            // signOut(authentication)
            // .then(async () => {
            //   await clearStorage();
            //   console.log('User Signed Out');
            // })
            // .catch(error => {
            //   console.log('Error is Signout: ', error);
            // });
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
              console.log(error);
            }
          });
        console.log("user", user);
        await sendEmailVerification(authentication.currentUser, {
          handleCodeInApp: true,
          url: 'https://inityapp.page.link/download',
          iOS: {
            bundleId: 'com.inity.ios',
          },
          android: {
            packageName: 'com.inity.android',
            installApp: true,
            minimumVersion: '12',
          },
          handleCodeInApp: true,
        })
          .then(res => {
            console.log("Verification Link Sent");
          })
          .catch(e => {
            console.log(e, 'manan');
          });
        // await firebase
        //   .auth()
        //   .currentUser.sendEmailVerification({
        //     handleCodeInApp: true,
        //     url: 'https://inityapp.page.link/download',
        //   })
        //   .then(res => {
        //     console.log('Verification Email Sent');
        //   });
      } catch (error) {
        console.log('error', error);
      }
    }
  };

  const googleSignup = async () => {
    try {
      await GoogleSignin.signIn()
        .then(data => {
          const credential = firebase.auth.GoogleAuthProvider.credential(
            data.idToken,
            data.accessToken,
          );
          return firebase.auth().signInWithCredential(credential);
        })
        .then(async user => {
          const googleUser = {
            displayName: user.user.displayName,
            email: user.user.email,
            userId: user.user.uid,
          };
          await createSignupDoc(googleUser);
          const data = await getUserData(googleUser.userId);
          navigation.replace('HomeScreen', {userData: [data]});
        })
        .catch(error => {
          const {code, message} = error;
          console.log(error);
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
              marginTop: '25%',
              marginBottom: '10%',
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
            onPress={async () => {
              await googleSignup();
            }}>
            Sign Up With Google
          </Button>

          {/* <View
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
          </Button> */}
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
    marginTop: '2%',
    backgroundColor: '#1e5bfa',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  signinText: {
    textAlign: 'center',
    marginTop: '4%',
    marginBottom: '2%',
    fontSize: 20,
    fontWeight: '500',
  },
  signupText: {
    textAlign: 'center',
    marginTop: '7%',
    fontSize: 17,
    fontWeight: '500',
  },
});

export default LoginScreen;
