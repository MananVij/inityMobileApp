import React, {useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  Image,
  ScrollView,
  View,
  NativeModules
} from 'react-native';
import {signInWithEmailAndPassword, signOut} from 'firebase/auth';
import {
  Button,
  Dialog,
  Portal,
  Paragraph,
  Text,
  Provider,
  TextInput,
} from 'react-native-paper';
import {authentication, webClientId} from '../../config/keys';
import colors from '../config/colors';
import {getUserData, createSignupDoc} from '../../API/firebaseMethods';
import {
  ifAvatarExists,
  storeAvatar,
  storeDataLocally,
} from '../functions/localStorage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {firebase} from '@react-native-firebase/auth';
import {SafeAreaView} from 'react-native-safe-area-context';

const RNFetchBlob = NativeModules.RNFetchBlob
const {config, fs} = RNFetchBlob;

function LoginScreen({navigation}) {
  GoogleSignin.configure({
    webClientId: webClientId,
  });

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
          if (authentication.currentUser.emailVerified) {
            const data = await getUserData();
            await storeDataLocally('userData', data);

            if (data[0].userDetails.gender == '') {
              navigation.replace('SelectProfile', {userData: data});
            } else {
              if (!(await ifAvatarExists())) {
                await storeAvatar(data[0]?.userDetails.avatarLink);
              }
              navigation.replace('HomeScreen', {userData: userData});
            }
          } else {
            signOut(authentication)
              .then(async () => {
                ToastAndroid.show('User not verified.', ToastAndroid.SHORT);
              })
              .catch(error => {
                console.log('Error is Signout: ', error);
              });
          }
        })
        .catch(err => {
          console.log('err: ', err);
          if (err.code == 'auth/wrong-password') {
            setDialogMsg('Wrong Password');
          } else if (err.code == 'auth/user-not-found') {
            setDialogMsg('User not found');
          } else {
            setDialogMsg('Some error occured');
          }
          showDialog();
        });
    }
    setEmail('');
    setPassword('');
  };
  const googleSignIn = async () => {
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
        ToastAndroid.show('User not signed in', ToastAndroid.SHORT);
      else {
        ToastAndroid.show('Some error Occured', ToastAndroid.SHORT);
        console.log(error);
      }
    }
  };
  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

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
          <Text style={styles.heading}>Login</Text>

          <TextInput
            theme={{
              colors: {primary: colors.logoColor, placeholder: 'white'},
            }}
            style={{marginVertical: '0.5%', backgroundColor: 'white'}}
            mode="outlined"
            label={'Email'}
            value={email}
            onChangeText={email => setEmail(email)}></TextInput>
          <TextInput
            theme={{
              colors: {primary: colors.logoColor},
            }}
            style={{marginVertical: '0.5%', backgroundColor: 'white'}}
            mode="outlined"
            label={'Password'}
            value={password}
            secureTextEntry={true}
            onChangeText={password => setPassword(password)}></TextInput>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ResetPasswordScreen');
            }}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          <Button
            mode="contained"
            style={styles.button}
            labelStyle={{fontSize: 19, fontWeight: '700', color: 'white'}}
            loading={loader}
            onPress={async () => {
              setLoader(true);
              await handlePress();
              setLoader(false);
            }}>
            Log In
          </Button>
          <TouchableOpacity
            style={styles.googleButton}
            activeOpacity={0.6}
            onPress={async () => {
              await googleSignIn();
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
              <Text style={{fontSize: 15, fontWeight: '600', color: '#757575'}}>
                Sign In With Google
              </Text>
            </View>
          </TouchableOpacity>
          {/* <GoogleSigninButton
            style={{width: '100%', height: 52, }}
            onPress={async () => {
              await googleSignIn();
            }}></GoogleSigninButton> */}
          <Text style={styles.signupText}>
            Don't have an account?{' '}
            <Text
              style={
                (styles.signupText,
                {textDecorationLine: 'underline', color: colors.logoColor})
              }
              onPress={() => {
                navigation.navigate('SignupScreen');
              }}>
              Create One
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
    marginBottom: '5%',
    color: colors.secondaryHeading,
  },
  forgotPasswordText: {
    marginTop: '2%',
    marginBottom: '6%',
    textAlign: 'right',
    textDecorationLine: 'underline',
    color: colors.secondaryHeading,
  },
  button: {
    borderRadius: 12,
    marginVertical: '2%',
    backgroundColor: '#1e5bfa',
  },
  googleButton: {
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: '2%',
    backgroundColor: 'white',
  },
  signupText: {
    textAlign: 'center',
    marginTop: '7%',
    fontSize: 15,
    fontWeight: '500',
    color: 'black',
  },
});

export default LoginScreen;
