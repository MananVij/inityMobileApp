import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Button,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import SelectDropdown from 'react-native-select-dropdown';
import Moment from 'react-moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../config/colors';
import moment from 'moment';
import {db, userId} from '../../config/keys';
import {
  updateTotalExpense,
  updateCategoryTotalExpense,
} from '../../API/firebaseMethods';

import {collection, addDoc} from 'firebase/firestore/lite';

export default function AddExpense() {
  const categories = [
    'Grocery',
    'Education',
    'Transportation',
    'Party',
    'Medicines',
    'Others',
  ];
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dateSelected, setDateSelected] = useState('');
  const [amount, setAmount] = useState();
  const [note, setNote] = useState();
  const [category, setCategory] = useState('');

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const cancelDatePicker = () => {
    setDatePickerVisibility(false);
    setDateSelected('');
  };

  const handleConfirm = date => {
    setDateSelected(moment(date).format('YYYY-MM-DD'));
    hideDatePicker();
  };

  const UploadDocs = async () => {
    if (!amount) {
      Alert.alert('Please enter amount of expense.');
    } else if (!dateSelected) {
      Alert.alert('Please enter date of expense.');
    } else if (!note) {
      Alert.alert('Please add a note to your expense.');
    } else if (!category) {
      Alert.alert('Please select category of expense.');
    } else {
      try {
        const docRef = await addDoc(collection(db, 'expenses'), {
          userId: userId,
          amount: amount,
          date: dateSelected,
          category: category,
          type: note
        });
        console.log('Document written with ID: ', docRef.id);
        updateTotalExpense(parseFloat(amount));
        updateCategoryTotalExpense(parseFloat(amount), category);
      } catch (e) {
        console.log('error in uploading document: ', e);
      }
    }
  };

  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>
      <View style={{alignSelf: 'flex-start'}}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: 'bold',
            margin: 20,
            marginTop: '10%',
            marginBottom: '8%',
          }}>
          Add Expenses Manually
        </Text>
      </View>
      <Image
        source={require('../assets/peeps.png')}
        style={{width: '80%', height: '40%'}}></Image>
      <ScrollView bounces={false} style={{width: '100%'}}>
        <View style={{width: '90%', alignSelf: 'flex-start', marginLeft: 20}}>
          <TextInput
            style={styles.text}
            placeholder="Enter Amount"
            placeholderTextColor={'black'}
            keyboardType="number-pad"
            step={0.1}
            value={amount}
            onChangeText={amount => setAmount(amount)}></TextInput>

          <SelectDropdown
            data={categories}
            buttonStyle={{
              borderRadius: 5,
              borderColor: colors.logoColor,
              borderWidth: 1,
              backgroundColor: colors.backgroundColor,
              height: 45,
              width: '100%',
              marginBottom: '2%',
            }}
            disableAutoScroll={false}
            dropdownStyle={{borderRadius: 10, elevation: 30}}
            buttonTextStyle={{fontSize: 16, textAlign: 'left', marginLeft: 0}}
            onSelect={selectedItem => {
              setCategory(selectedItem);
              console.log(selectedItem);
            }}
          />
          <TextInput
            style={styles.text}
            placeholder="Enter Note"
            placeholderTextColor={'black'}
            step={0.1}
            value={note}
            onChangeText={note => setNote(note)}></TextInput>
        </View>
        <View
          style={{
            height: 45,
            width: '90%',
            backgroundColor: colors.backgroundColor,
            borderColor: colors.logoColor,
            borderWidth: 1,
            justifyContent: 'center',
            // paddingHorizontal: 10,
            marginBottom: 10,
            marginLeft: 20,
            borderRadius: 5,
          }}>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              // marginVertical: 10,
            }}>
            <Text style={{fontSize: 15, color: 'black', marginLeft: '2%'}}>
              Select Date
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 16, marginRight: 10, color: 'black'}}>
                {dateSelected}{' '}
              </Text>
              <TouchableOpacity
                style={{alignItems: 'center'}}
                onPress={showDatePicker}>
                <MaterialCommunityIcons name="calendar" size={25} />
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={cancelDatePicker}
              />
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: '2%',
            marginTop: '4%',
          }}>
          <TouchableOpacity onPress={UploadDocs}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Add Expense</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  text: {
    height: 45,
    width: '100%',
    borderColor: '#1e5bfa',
    paddingLeft: 10,
    borderWidth: 1,
    borderRadius: 3,
    marginBottom: '2%',
  },
  button: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#1e5bfa',
    marginBottom: '2%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
});
