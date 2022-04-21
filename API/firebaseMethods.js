import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import {Alert} from 'react-native';

// signup
export async function registration(email, password, name) {
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
    const currentUser = firebase.auth().currentUser;

    const db = firebase.firestore();
    db.collection('users')
      .doc(currentUser.uid)
      .set({
        email: currentUser.email,
        name: name,
      });
  } catch (err) {
    Alert.alert('There is something wrong!', err.message);
  }
}

// signin
export async function signIn(email, password) {
  try {
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
  } catch (err) {
    Alert.alert('There is something wrong!', err.message);
  }
}

// signout
export async function loggingOut() {
  try {
    await firebase.auth().signOut();
  } catch (err) {
    Alert.alert('There is something wrong!', err.message);
  }
}
