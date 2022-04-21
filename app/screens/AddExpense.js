import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Button,
  TextInput,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import React, {useState, useEffect} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import SelectDropdown from 'react-native-select-dropdown';
import Moment from 'react-moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../config/colors';
import moment from 'moment';
import {async} from '@firebase/util';

export default function AddExpense() {
  const categories = ['Egypt', 'Canada', 'Australia', 'Ireland', 'Others'];
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dateSelected, setDateSelected] = useState('');
  const [amount, setAmount] = useState();
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
    console.log('A date has been picked: ', moment(date).format('YYYY-MM-DD'));
    setDateSelected(moment(date).format('YYYY-MM-DD'));
    hideDatePicker();
  };

  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>
            <Image
                source={require('../assets/avatar/hello.png')}
                style={{width: '80%', height: '50%'}}></Image>

          <ScrollView bounces={false} style={{width: '100%'}}>
            <View style={{alignSelf: 'flex-start'}}>
                <Text
                style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    margin: 20,
                    marginTop: 50,
                    marginBottom: 30,
                }}>
                Add Expenses Manually
                </Text>
            </View>
            <View style={{width: '90%', alignSelf: 'flex-start', marginLeft: 20}}>
                <TextInput
                style={styles.text}
                placeholder="Enter Amount"
                autoFocus={true}
                placeholderTextColor={'black'}
                keyboardType="number-pad"
                step={0.1}
                value={amount}
                onChangeText={amount => setAmount(amount)}
                ></TextInput>

                <SelectDropdown
                data={categories}
                buttonStyle={{
                    borderRadius: 5,
                    borderColor: colors.logoColor,
                    borderWidth: 1,
                    backgroundColor: colors.backgroundColor,
                    height: 45,
                    width: '100%',
                }}
                disableAutoScroll={false}
                dropdownStyle={{borderRadius: 10, elevation: 30}}
                buttonTextStyle={{fontSize: 16, textAlign: 'left', marginLeft: 0}}
                onSelect={selectedItem => {
                    setCategory(selectedItem)
                    console.log(selectedItem);
                }}
                />
            </View>
            <View
                style={{
                height: 45,
                width: '90%',
                backgroundColor: colors.backgroundColor,
                borderColor: colors.logoColor,
                borderWidth: 1,
                justifyContent: 'center',
                paddingHorizontal: 10,
                marginVertical: 10,
                marginLeft: 20,
                borderRadius: 5,
                }}>
                <View
                style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    marginVertical: 10,
                }}>
                <Text style={{fontSize: 15, color: 'black'}}>Select Date</Text>
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

            <TouchableOpacity onPress={{}}>
                <View style={styles.button}>
                <Text style={styles.buttonText}>Add Expense</Text>
                </View>
            </TouchableOpacity>

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
    // height:
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
});
