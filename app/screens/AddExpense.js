import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ToastAndroid,
  TextInput,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import React, {useState, useRef} from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Moment from 'react-moment';
import colors from '../config/colors';
import moment from 'moment';
import {addExpense, addCategory, getUserData} from '../../API/firebaseMethods';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useNavigation} from '@react-navigation/native';

import {useRoute} from '@react-navigation/native';
import {
  Button,
  Portal,
  Dialog,
  Paragraph,
  Provider,
  Text,
} from 'react-native-paper';
import TextInputModified from '../components/TextInputModified';

export default function AddExpense() {
  const showToast = msg => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };
  const navigation = useNavigation();

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const refRBSheet = useRef();

  const [dateSelected, setDateSelected] = useState(
    moment(new Date()).format('DD-MM-YYYY'),
  );
  const [amount, setAmount] = useState();
  const [note, setNote] = useState();
  const [category, setCategory] = useState('');
  const [categoryEmoji, setCategoryEmoji] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryEmoji, setNewCategoryEmoji] = useState('');

  const route = useRoute();

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const cancelDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    setDateSelected(moment(date).format('DD-MM-YYYY'));
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
      const expenseData = {
        amount: amount,
        date: dateSelected,
        category: category,
        type: note,
      };
      try {
        addExpense(route?.params.userData, expenseData);
        showToast('Expense Added');
        navigation.navigate('HomeScreen', {userData: route?.params.userData});
      } catch (e) {
        console.log('error in uploading document: ', e);
        showToast('Some Error Occured. Please try again!');
      }
    }
  };
  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const categoryButton = (categoryName, categoryEmoji, index) => {
    return (
      <View key={index}>
        <Button
          mode={category == categoryName ? 'contained' : 'contained-tonal'}
          style={styles.categoryButton}
          onPress={() => {
            setCategory(categoryName);
            setCategoryEmoji(categoryEmoji);
            refRBSheet.current.close();
          }}>
          {categoryEmoji + ' ' + categoryName}
        </Button>
      </View>
    );
  };

  const addCategoryDialog = () => {
    return (
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Content>
            <Paragraph>Add New Category</Paragraph>
            <TextInput
              label={'Name'}
              mode="outlined"
              value={newCategoryName}
              onChangeText={categoryName =>
                setNewCategoryName(categoryName)
              }></TextInput>
            <TextInput
              label={'Emoji'}
              mode="outlined"
              value={newCategoryEmoji}
              onChangeText={categoryEmoji =>
                setNewCategoryEmoji(categoryEmoji)
              }></TextInput>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                addCategory(
                  route.params.userData,
                  newCategoryName,
                  newCategoryEmoji,
                );
                hideDialog();
              }}>
              Done
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  };

  const bottomSheet = () => {
    return (
      <RBSheet
        dragFromTopOnly={true}
        ref={refRBSheet}
        height={260}
        closeDuration={450}
        openDuration={450}
        closeOnDragDown={true}
        closeOnPressMask={false}
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
        }}>
        <ScrollView>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginBottom: '3%',
              paddingHorizontal: '2%',
            }}>
            {Object.entries(route?.params.userData[0]?.categories).map(
              (el, index) => {
                return categoryButton(el[0], el[1], index);
              },
            )}
            <Button
              mode="contained-tonal"
              style={styles.categoryButton}
              onPress={() => {
                refRBSheet.current.close();
                showDialog();
              }}>
              Add Category
            </Button>
          </View>
        </ScrollView>
      </RBSheet>
    );
  };

  return (
    <Provider>
      <KeyboardAwareScrollView style={{marginHorizontal: '5%'}}>
        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              fontWeight: '700',
              fontSize: 40,
              paddingTop: '30%',
              color: 'black',
            }}
            variant="headlineSmall">
            Expense
          </Text>
        </View>
        {addCategoryDialog()}
        <View bounces={false}>
          <View
            style={{
              flexWrap: 'wrap',
              alignSelf: 'center',
              marginTop: 50,
              marginBottom: 60,
              flexDirection: 'row',
            }}>
            <Text style={{fontSize: 60, color: 'black'}}>₹</Text>
            <TextInput
              placeholder="0"
              numberOfLines={1}
              maxLength={6}
              keyboardType="numeric"
              style={{
                flexWrap: 'wrap',
                textDecorationLine: 'underline',
                borderBottomWidth: 1,
                fontSize: 75,
                height: 100,
                textDecorationColor: 'black',
                fontWeight: '500',
                flexDirection: 'row',
                justifyContent: 'center',
                color: 'black',
              }}
              value={amount}
              onChangeText={amount => {
                setAmount(Number(amount));
              }}></TextInput>
          </View>
          <View
            style={{
              flexWrap: 'wrap',
              flexDirection: 'row',
              alignSelf: 'center',
            }}>
            <Button
              mode="contained-tonal"
              style={{
                width: '48%',
                marginRight: '2%',
                backgroundColor: '#00B4D8',
              }}
              labelStyle={{color: 'white'}}>
              Cash 💸
            </Button>
            <Button
              onPress={() => refRBSheet.current.open()}
              style={{width: '48%', backgroundColor: '#00B4D8'}}
              labelStyle={{color: 'white'}}
              dark={false}
              mode={'contained-tonal'}>
              {category == ''
                ? 'Select Category'
                : `${categoryEmoji} ${category}`}
            </Button>
          </View>
          {bottomSheet()}
          <View style={{flexDirection: 'row', marginTop: '3%'}}>
            <View
              style={{width: '48%', marginTop: '2%', marginHorizontal: '1%'}}>
              {TextInputModified('Memo', false, true, false, note, setNote)}
            </View>
            <View
              style={{
                width: '48%',
                marginTop: '2%',
                marginLeft: '1%',
                flexDirection: 'row',
                backgroundColor: 'white',
                flex: 1,
                borderWidth: 0.7,
                borderColor: 'black',
                borderRadius: 2,
                height: 48,
                paddingLeft: '1%',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TextInput
                value={dateSelected}
                editable={false}
                style={{color: 'black', fontSize: 16}}></TextInput>
              <Button
                icon={'calendar'}
                style={{padding: 0, marginLeft: 40}}
                size={50}
                onPress={() => {
                  showDatePicker();
                }}></Button>
            </View>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              date={new Date()}
              maximumDate={new Date()}
              onConfirm={handleConfirm}
              onCancel={cancelDatePicker}
            />
          </View>
          <Button
            labelStyle={{color: 'white'}}
            mode="contained"
            onPress={UploadDocs}
            style={{
              marginTop: '5%',
              marginBottom: '4%',
              backgroundColor: colors.logoColor,
            }}>
            Add Expense
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </Provider>
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
  categoryButton: {
    marginVertical: '1%',
    marginHorizontal: '1%',
  },
});
