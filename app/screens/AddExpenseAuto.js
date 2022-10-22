import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ToastAndroid,
  BackHandler,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import moment from 'moment';
import {addExpense, addCategory} from '../../API/firebaseMethods';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  Button,
  Portal,
  Dialog,
  Paragraph,
  TextInput,
  Provider,
  Text,
} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import colors from '../config/colors';
import {findTxn, removeTxn} from '../functions/localStorage';
import {getAmount} from '../functions/getAmount';

export default function AddExpense(props) {

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
            await removeTxn();
            const trans = await findTxn('txn');
            props.setTrans(trans);
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
        addExpense(props.userData, expenseData);
        showToast('Expense Added');
      } catch (e) {
        console.log('error in uploading document: ', e);
        showToast('Some Error Occured. Please try again!');
      }
    }
  };

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

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
                addCategory(props.userData, newCategoryName, newCategoryEmoji);
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
            }}
            variant="headlineSmall">
            Expense
          </Text>
        </View>
        {addCategoryDialog()}
        <View bounces={false}>
          <View style={{}}>
            <View
              style={{
                flexWrap: 'wrap',
                alignSelf: 'center',
                borderBottomWidth: 2,
                marginTop: 50,
                marginBottom: 60,
                flexDirection: 'row',
              }}>
              <Text style={{fontSize: 60}}>₹</Text>
              <TextInput
                mode="outlined"
                placeholder="1"
                keyboardType="numeric"
                outlineColor="transparent"
                activeOutlineColor="transparent"
                style={{
                  flexWrap: 'wrap',
                  backgroundColor: 'transparent',
                  fontSize: 75,
                  height: 75,
                  textDecorationLine: 'underline',
                  textDecorationColor: 'black',
                  fontWeight: '500',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
                value={amount}
                editable={false}
              />
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
              <TextInput
                mode="outlined"
                label="Memo"
                theme={{color: {primary: colors.logoColor}}}
                autoCapitalize="sentences"
                style={{width: '48%', marginRight: '2%'}}
                value={note}
                onChangeText={note => setNote(note)}
              />

              <TextInput
                mode="outlined"
                label=""
                placeholder={'Date'}
                editable={false}
                value={dateSelected}
                style={{width: '48%', marginRight: '2%'}}
                right={
                  <TextInput.Icon
                    icon="calendar"
                  />
                }
              />
            </View>
          </View>
          <Button
            mode="contained"
            onPress={async () => {
              UploadDocs();
              await removeTxn();
              const trans = await findTxn('txn');
              props.setTrans(trans);
            }}
            style={{
              marginTop: '5%',
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
