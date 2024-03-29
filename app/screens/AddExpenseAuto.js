import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ToastAndroid,
  BackHandler,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import moment from 'moment';
import {addExpense} from '../../API/firebaseMethods';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Button, Provider, Text, ActivityIndicator} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {findTxn, removeTxn} from '../functions/localStorage';
import {getAmount} from '../functions/getAmount';
import TextInputModified from '../components/TextInputModified';
import DialogBox from '../components/DialogBox';
import colors from '../config/colors';

export default function AddExpense(props) {
  const {height, width} = useWindowDimensions();

  const showToast = toastMsg => {
    ToastAndroid.show(toastMsg, ToastAndroid.SHORT);
  };

  const refRBSheet = useRef();

  const [dateSelected, setDateSelected] = useState();
  const [amount, setAmount] = useState(props.amount);
  const [note, setNote] = useState();
  const [category, setCategory] = useState('');
  const [categoryEmoji, setCategoryEmoji] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryEmoji, setNewCategoryEmoji] = useState('');
  const [visible, setVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const [backLoader, setBackLoader] = useState(false);

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to go back?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: async () => {
            setBackLoader(true);
            await removeTxn();
            const trans = await findTxn('txn');
            props.setTrans(trans);
            setBackLoader(false);
          },
        },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    (async () => {
      const amount = getAmount(props.trans[0]?.body);
      setAmount(amount);
    })();
  }, [props.trans[0]?._id]);

  useEffect(() => {
    let date = moment(props.trans[0]?.date_sent).format('DD-MM-YYYY');
    setDateSelected(date);
  }, [props]);

  const UploadDocs = async () => {
    if (!amount) {
      Alert.alert('Please enter amount of expense.');
    } else if (!dateSelected) {
      Alert.alert('Please enter date of expense.');
    } else if (!category) {
      Alert.alert('Please select category of expense.');
    } else {
      const expenseData = {
        amount: amount,
        date: dateSelected,
        category: category,
        type: note == undefined ? '' : note,
      };
      try {
        addExpense(props.userData, expenseData);
        showToast('Expense Added');
      } catch (e) {
        console.log('error in uploading document: ', e);
        showToast('Some Error Occured. Please try again!');
      }
    }
  };

  const showDialog = () => setVisible(true);

  const categoryButton = (categoryName, categoryEmoji, index) => {
    return (
      <Button
        key={index}
        mode={category == categoryName ? 'contained' : 'contained-tonal'}
        style={styles.categoryButton}
        onPress={() => {
          setCategory(categoryName);
          setCategoryEmoji(categoryEmoji);
          refRBSheet.current.close();
        }}>
        {categoryEmoji + ' ' + categoryName}
      </Button>
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
            }}>
            {props.userData[0] != undefined ? (
              Object.entries(props.userData[0]?.categories).map((el, index) => {
                return categoryButton(el[0], el[1], index);
              })
            ) : (
              <></>
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
        {DialogBox(
          props?.userData,
          visible,
          newCategoryName,
          newCategoryEmoji,
          setNewCategoryName,
          setNewCategoryEmoji,
        )}
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
                borderBottomWidth: 1,
                fontSize: 75,
                height: height * 0.13,
                fontWeight: '500',
                flexDirection: 'row',
                justifyContent: 'center',
                color: 'black',
              }}
              value={amount}
              editable={false}></TextInput>
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
              Card 💳
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
              {TextInputModified('Memo', false, true, note, setNote)}
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
                style={{padding: 0, marginLeft: width * 0.055}}
                size={50}></Button>
            </View>
          </View>
          <Button
            loading={loader}
            mode="contained"
            onPress={async () => {
              setLoader(true);
              UploadDocs();
              await removeTxn();
              const trans = await findTxn('txn');
              props.setTrans(trans);
              setLoader(false);
            }}
            labelStyle={{color: 'white'}}
            style={{
              marginTop: '5%',
              backgroundColor: colors.logoColor,
            }}>
            Add Expense
          </Button>
        </View>
        <ActivityIndicator
          style={{marginTop: 10}}
          size={'small'}
          hidesWhenStopped={true}
          animating={backLoader}></ActivityIndicator>
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
