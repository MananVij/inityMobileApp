import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import {authentication} from '../../config/keys';
import {getTwoDaysExpenses} from '../../API/firebaseMethods';
import NewScreen from './NewScreen';

import colors from '../config/colors';
import {TouchableOpacity} from 'react-native';
import {ScrollView} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {StatusBar} from 'expo-status-bar';
import {onAuthStateChanged, getAuth} from 'firebase/auth';

import {getUserTotalExpenses} from '../../API/firebaseMethods';

const getIcon = title => {
  if (title == 'Party') {
    return (
      <MaterialCommunityIcons
        name="party-popper"
        size={34}></MaterialCommunityIcons>
    );
  } else if (title == 'Transportation') {
    return <FontAwesome5 name="car" size={34}></FontAwesome5>;
  } else if (title == 'Medicines') {
    return <FontAwesome5 name="hospital" size={34}></FontAwesome5>;
  } else if (title == 'Party') {
    return (
      <MaterialCommunityIcons
        name="party-popper"
        size={34}></MaterialCommunityIcons>
    );
  } else if (title == 'Education') {
    return <FontAwesome name="book" size={34}></FontAwesome>;
  } else if (title == 'Grocery') {
    return <MaterialIcons name="local-grocery-store" size={34}></MaterialIcons>;
  } else if (title == 'Others') {
    return <Ionicons name="document" size={34}></Ionicons>;
  }
};

const expenseComponent = (amount, title, type) => {
  return (
    <View
      style={{
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}>
      <View
        style={{
          height: 70,
          width: 70,
          borderRadius: 25,
          backgroundColor: '#CAF0F8',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {getIcon(title)}
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '80%',
        }}>
        <View style={{marginLeft: 20}}>
          <Text style={{fontWeight: '500', fontSize: 20, fontWeight: '600'}}>
            {title}
          </Text>
          <Text style={{fontWeight: '500', fontSize: 15, fontWeight: '500'}}>
            {type}
          </Text>
        </View>
        <View style={{marginLeft: 100}}>
          <Text style={{fontWeight: '500', fontSize: 20}}>₹ {amount}</Text>
        </View>
      </View>
    </View>
  );
};

export default function HomeScreen({navigation}) {

  const [totalExpense, setTotalExpense] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const expensesOverview = async () => {
    const hey = await getTwoDaysExpenses();
    let count = 0;
    const overview = hey.map(item => {
      item.id = ++count;
      return item;
    });
    setExpenseData(overview);
    return expenseData;
  };

  useEffect(() => {
    (async () => {
      var data = await getUserTotalExpenses();
      setTotalExpense(data[1]);
    })();
  }, []);
  useEffect(() => {
    (async () => {
      await expensesOverview();
    })();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    return new Promise(resolve => {
      setTimeout(() => {
        expensesOverview();
        setRefreshing(false);
      }, 2000);
    });
  }, []);

  const data = {
    labels: ['Dec', 'Jan', 'Feb', 'March', 'April', 'May'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, totalExpense],
      },
    ],
  };

  let change = data.datasets[0].data[4] > data.datasets[0].data[5];
  let chartColor = change ? colors.green : colors.red;
  let changePercentage =
    ((data.datasets[0].data[5] - data.datasets[0].data[4]) /
      data.datasets[0].data[0]) *
    100;
  const auth = getAuth();
  const user = auth.currentUser;

  const [firstName, setFirstName] = useState('');
  onAuthStateChanged(authentication, user => {
    if (user) {
      setFirstName(user.displayName);
    }
  });

  const topBar = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 15,
          marginHorizontal: 20,
          marginBottom: 5,
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 30, fontWeight: '800'}}>
          Hello, {firstName}
        </Text>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('LogoutScreen');
          }}>
          <Image
            style={{resizeMode: 'contain', width: 50, height: 50}}
            source={require('../assets/avatar/business.png')}></Image>
        </TouchableOpacity>
      </View>
    );
  };

  const monthlyContainer = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 15,
        }}>
        <View
          style={{
            backgroundColor: '#f7f7f7',
            width: '90%',
            height: 230,
            borderRadius: 20,
            shadowColor: '#000',
            shadowOffset: {height: 0, width: 0},
            shadowOpacity: 0.2,
            elevation: 3,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ExpenseTrackingScreen');
              }}>
              <Text
                style={{
                  marginTop: 17,
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginLeft: 27,
                  marginBottom: 5,
                  color: colors.blue,
                }}>
                Monthly Change{' '}
                <FontAwesome
                  name="chevron-right"
                  color={colors.blue}
                  size={13}
                />{' '}
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                marginTop: 17,
                fontSize: 18,
                fontWeight: 'bold',
                paddingRight: 27,
                color: chartColor,
              }}>
              {Math.abs(changePercentage).toFixed(2)}%
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}></View>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <LineChart
              data={data}
              width={Dimensions.get('window').width} // from react-native
              height={170}
              // width={420}
              yAxisLbel="₹"
              yAxisSuffix="k"
              withHorizontalLabels={false}
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                //   backgroundGradientFrom: "rgba(0, 0, 0,0)",
                backgroundGradientFromOpacity: 0,
                backgroundGradientToOpacity: 0,
                //   backgroundGradientTo: "#f7f7f7",
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `${chartColor}`,
                //   color: (opacity = 1) => `rgba(119, 217, 112)`,
                labelColor: (opacity = 1) => `rgba(17, 29, 94)`,
                style: {
                  borderRadius: 16,
                  // marginRight: 3000,
                },
                propsForBackgroundLines: {
                  strokeWidth: 0,
                },
                propsForDots: {
                  r: '5',
                  strokeWidth: '2',
                  stroke: '#f7f7f7',
                },
              }}
              bezier
              style={{
                //   marginVertical: 80,
                borderRadius: 8,
              }}
            />
          </View>
        </View>
      </View>
      // </View>
    );
  };

  const lastPart = () => {
    return (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          marginHorizontal: 20,
          marginBottom: 10,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          width: '90%',
        }}>
        <View
          style={{
            backgroundColor: colors.backgroundColor,
            width: 70,
            height: 70,
            borderRadius: 100,
            shadowColor: '#000',
            shadowOffset: {height: -2, width: 0},
            shadowOpacity: 0.2,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            elevation: 3,
            marginBottom: 10,
          }}>
          <TouchableOpacity
            style={{alignItems: 'center'}}
            onPress={() => {
              navigation.navigate('AddExpense');
            }}>
            <MaterialCommunityIcons name="plus" size={45} color={colors.red} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const goalSection = () => {
    return (
      <View style={{marginTop: 15, alignItems: 'center'}}>
        <View
          style={{
            backgroundColor: '#f7f7f7',
            width: '90%',
            height: 60,
            borderRadius: 20,
            shadowColor: '#000',
            shadowOffset: {height: 0, width: 0},
            shadowOpacity: 0.2,
            flexDirection: 'column',
            justifyContent: 'center',
            elevation: 3,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'column', justifyContent: 'center'}}>
              <Text style={{marginLeft: 20, fontSize: 20, fontWeight: '700'}}>
                My Goals
              </Text>
            </View>
            <View style={{marginRight: 20, alignSelf: 'flex-end'}}>
              <Text
                style={{fontSize: 19, fontWeight: 'bold', textAlign: 'right'}}>
                65% 🎉
              </Text>
              {/* <Text style={{fontSize: 18, fontWeight: '600', textAlign: 'center'}}>10% <AntDesign name="caretup" color={colors.green} size={15}></AntDesign></Text> */}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        bounces={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <StatusBar backgroundColor={colors.greyColor}></StatusBar>
        {topBar()}
        <View style={{paddingBottom: 80}}>
          {monthlyContainer()}
          {goalSection()}
          <View style={{marginLeft: 20, marginTop: 30, marginRight: 20}}>
            <Text style={{fontWeight: '600', fontSize: 18}}>Today</Text>
            {expenseData[0]?.map(exp => {
              return (
                <View style={{marginVertical: 10}}>
                  {expenseComponent(exp.amount, exp.category, exp.type)}
                </View>
              );
            })}
          </View>
          <View style={{marginLeft: 20, marginTop: 30, marginRight: 20}}>
            <Text style={{fontWeight: '600', fontSize: 18}}>Yesterday</Text>
            {expenseData[1]?.map(exp => {
              return (
                <View style={{marginVertical: 10}}>
                  {expenseComponent(exp.amount, exp.category, exp.type)}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
      {lastPart()}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({});
