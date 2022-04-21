import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ListView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
// import {FontAwesome } from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import {authentication} from '../../config/keys';

import colors from '../config/colors';
import {TouchableOpacity} from 'react-native';
import {TextInput} from 'react-native';
import {FlatList, ScrollView} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {StatusBar} from 'expo-status-bar';
import {onAuthStateChanged} from 'firebase/auth';

const data = {
  labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      data: [
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
      ],
    },
  ],
};

const todayExpenses = [
  {
    id: '1',
    icon: '',
    amount: 100,
    title: 'Chocolate',
    type: 'Confectionery',
    // date: "Today"
  },
  {
    id: '2',
    icon: '',
    amount: 1200,
    title: 'Nike Store',
    type: 'Clothing',
    // date: "Yesterday"
  },
];
const yesterdfayExpenses = [
  {
    id: '2',
    icon: '',
    amount: 110,
    title: 'Fruit Store',
    type: 'Fruits',
    // date: "Yesterday"
  },
  {
    id: '3',
    icon: '',
    amount: 100,
    title: 'Chocolate',
    type: 'Confectionery',
    // date: "Yesterday"
  },
  {
    id: '4',
    icon: '',
    amount: 150,
    title: 'Uber Cabs',
    type: 'Transport',
    // date: "Yesterday"
  },
];

const expenseComponent = (icon, amount, title, type) => {
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
        }}>
        <Image source={icon} style={{}}></Image>
      </View>

      <View style={{marginLeft: 20}}>
        <Text style={{fontWeight: '500', fontSize: 20, fontWeight: '600'}}>
          {title}
        </Text>
        <Text style={{fontWeight: '500', fontSize: 15, fontWeight: '500'}}>
          {type}
        </Text>
      </View>
      <View style={{marginLeft: 100}}>
        <Text style={{fontWeight: '500', fontSize: 20}}>{amount}</Text>
      </View>
    </View>
  );
};

const Item = ({companyName, stockPrice, perChangeInDay, companyLogo}) => {
  return (
    <View
      style={{
        backgroundColor: colors.backgroundColor,
        marginTop: 15,
        height: 120,
        // width: "65%",
        shadowColor: '#000',
        shadowOffset: {height: 0, width: 0},
        shadowOpacity: 0.2,
        borderRadius: 10,
        marginRight: 10,
        // marginRight: -50,
        justifyContent: 'center',
        elevation: 3,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 15,
          marginHorizontal: 10,
        }}>
        <Image source={companyLogo} style={{width: 50, height: 50}}></Image>
        <Text style={{fontSize: 16.5, fontWeight: 'bold'}}>{stockPrice}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 15,
          marginHorizontal: 10,
        }}>
        <Text style={{fontSize: 16.5, fontWeight: 'bold', marginRight: 15}}>
          {companyName}
        </Text>
        <Text style={{fontSize: 16.5, fontWeight: 'bold'}}>
          {perChangeInDay}
        </Text>
      </View>
    </View>
  );
};

let change = data.datasets[0].data[4] > data.datasets[0].data[5];
let chartColor = change ? colors.green : colors.red;
let changeValue = data.datasets[0].data[5] - data.datasets[0].data[4];
let changePercentage =
  ((data.datasets[0].data[5] - data.datasets[0].data[4]) /
    data.datasets[0].data[0]) *
  100;
const indexGrowth = (Math.random() + 0.2).toFixed(2);

export default function HomeScreen({navigation}) {
  const [firstName, setFirstName] = useState('');
  onAuthStateChanged(authentication, user => {
    if (user) {
      setFirstName(user.displayName);
    }
  });

  const topBar = () => {
    let nameOfUser;


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
              navigation.navigate("ExpenseTrackingScreen")
            }}
            >
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
              navigation.navigate('AddExpense')
            }}
            >
            <MaterialCommunityIcons
              name="plus"
              size={45}
              color={colors.red}
              // style={{ marginBottom: 5 }}
            />
            {/* <Text style={{ fontSize: 10 }}>Dashboard</Text> */}
          </TouchableOpacity>
          {/* <TouchableOpacity style={{ alignItems: "center" }}>
            <MaterialCommunityIcons
              name="rocket-launch"
              size={30}
              style={{ marginBottom: 5 }}
            />
            <Text style={{ fontSize: 10 }}>Track</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ alignItems: "center" }} onPress={ () => {
            navigation.navigate("Sms")
          }
            
          }>
            <FontAwesome5
              name="piggy-bank"
              size={30}
              style={{ marginBottom: 5 }}
            />
            <Text style={{ fontSize: 10 }}>Save Tax</Text>
          </TouchableOpacity> */}
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

  const monthlyComparison = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 30,
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
            <Text
              style={{
                marginTop: 17,
                fontSize: 18,
                fontWeight: 'bold',
                marginLeft: 27,
                marginBottom: 5,
                color: colors.blue,
              }}>
              Your Portfolio{' '}
              <FontAwesome name="chevron-right" color={colors.blue} size={13} />{' '}
            </Text>
            <Text
              style={{
                marginTop: 17,
                fontSize: 18,
                fontWeight: 'bold',
                paddingRight: 27,
                color: chartColor,
              }}>
              {Math.abs(profitPercentage).toFixed(2)}%
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

  const renderItem = ({item}) => {
    return (
      <Item
        companyName={item.companyName}
        stockPrice={item.stockPrice}
        companyLogo={item.companyLogo}
        perChangeInDay={item.perChangeInDay}></Item>
    );
  };

  const latestExpenses = () => {
    return (
      <View style={{marginLeft: 20, marginTop: 30, marginRight: 20}}>
        <Text style={{fontWeight: '600', fontSize: 18}}>Today</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderWidth: 1,
          }}>
          {/* <View style={{flexDirection: "column", justifyContent: "center"}}> */}
          <View
            style={{
              height: 70,
              width: 70,
              borderRadius: 10,
              backgroundColor: '#CAF0F8',
            }}></View>
          <Text style={{fontWeight: '500', fontSize: 20}}>skdjnckjsdncjk</Text>
        </View>
      </View>
    );
  };

  const netWorthContainer = () => {
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
                My Net Worth
              </Text>
            </View>
            <View style={{marginRight: 20, alignSelf: 'flex-end'}}>
              <Text
                style={{fontSize: 19, fontWeight: 'bold', textAlign: 'right'}}>
                ₹{(Math.random() * 10000).toFixed(2)} 💰
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
      <ScrollView bounces={false}>
      <StatusBar backgroundColor={colors.greyColor}></StatusBar>
      {topBar()}
        <View style={{paddingBottom: 80}}>
          {monthlyContainer()}
          {/* {netWorthContainer()} */}
          {goalSection()}
          <View style={{marginLeft: 20, marginTop: 30, marginRight: 20}}>
            <Text style={{fontWeight: '600', fontSize: 18}}>Today</Text>
            {todayExpenses.map(exp => {
              return (
                <View style={{marginVertical: 10}}>
                  {expenseComponent(exp.icon, exp.amount, exp.title, exp.type)}
                </View>
              );
            })}
          </View>
          <View style={{marginLeft: 20, marginTop: 10, marginRight: 20}}>
            <Text style={{fontWeight: '600', fontSize: 18}}>Yesterday</Text>
            {yesterdfayExpenses.map(exp => {
              return (
                <View style={{marginVertical: 10}}>
                  {expenseComponent(exp.icon, exp.amount, exp.title, exp.type)}
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
