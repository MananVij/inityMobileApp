import {View, Text, StyleSheet, Button} from 'react-native';
import React from 'react';
import {db} from '../../config/keys';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore/lite';

// import {AsyncStorage} from '@react-native-async-storage/async-storage';

export default function New() {
  // const GetDocs = async () => {
  //   const citiesCol = collection(db, 'cities');
  //   const citySnapshot = await getDocs(citiesCol);
  //   const cityList = citySnapshot.docs.map(doc => doc.data());
  //   console.log(cityList);
  // };
  const UploadDocs = async () => {
    const docRef = await addDoc(collection(db, 'cities'), {
      city_name: 'New Delhi',
    });
    console.log('Document written with ID: ', docRef.id);
  };

  const getCities = async () => {
    try {
      const citiesCol = collection(db, 'cities');
      const citySnapshot = await getDocs(citiesCol);
      const cityList = citySnapshot.docs.map(doc => doc.data());
      console.log(cityList);
      
    } catch (error) {
      console.log("error: ", error);
    }
  }

  const DeleteDocs = async () => {
    try {
      await deleteDoc(doc(db, 'cities', ''));
      console.log('doc deleted');
    } catch (error) {
      console.log('err:', error);
    }
  };
  
  // getCities()

  return (
    <View style={styles.hello}>
      <Button onPress={getCities} title="Get Docs"></Button>
      {/* <Button onPress={UploadDocs()} title='Upload Docs'></Button> */}
      {/* <Button onPress={DeleteDocs} title='Delete Docs'></Button> */}
    </View>
  );
}
const styles = StyleSheet.create({
  hello: {
    alignItems: 'center',
    // justifyContent: 'center',
    // alignContent: 'center'
  },
});
