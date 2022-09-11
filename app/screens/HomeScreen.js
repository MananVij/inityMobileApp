import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  RefreshControl,
  useColorScheme,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import {authentication} from '../../config/keys';
import {getUserData} from '../../API/firebaseMethods';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import {FAB, Card, Button, IconButton} from 'react-native-paper';

import colors from '../config/colors';
import {TouchableOpacity} from 'react-native';
import {ScrollView} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {StatusBar} from 'expo-status-bar';
import {onAuthStateChanged, getAuth} from 'firebase/auth';
import EncryptedStorage from 'react-native-encrypted-storage';
import NetInfo from '@react-native-community/netinfo';
import {useRoute} from '@react-navigation/native';
import moment from 'moment';

const expenseComponent = (amount, title, type, categories) => {
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
        <Text style={{fontSize: 30}}>{categories[title]}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '80%',
        }}>
        <View style={{marginLeft: 20}}>
          <Text style={{fontWeight: '500', fontSize: 19, fontWeight: '600'}}>
            {title}
          </Text>
          <Text style={{fontWeight: '500', fontSize: 15, fontWeight: '500'}}>
            {type}
          </Text>
        </View>
        <Text style={{fontWeight: '500', fontSize: 19, marginRight: '5%'}}>
          ₹ {amount}
        </Text>
      </View>
    </View>
  );
};
export default function HomeScreen({navigation}, props) {
  const route = useRoute();
  const [isConnected, setIsConnected] = useState(false);

  const [refreshing, setRefreshing] = React.useState(false);
  const [changePercentage, setChangePercentage] = useState(0);
  const [lastSixMonthsExpenses, setLastSixMonthsExpenses] = useState([
    0, 0, 0, 0, 0, 0,
  ]);
  const [lastSixMonthsName, setLastSixMonthsName] = useState([]);

  const [userData, setUserData] = useState([null]);
  const [isOnline, setIsOnline] = React.useState(true);


  useEffect(() => {
    setUserData(route.params.userData);
  }, []);

  useEffect(() => {
    // Fetch connection status first time when app loads as listener is added afterwards
    NetInfo.fetch().then(state => {
      if (isOnline !== state.isConnected) {
        setIsOnline(!!state.isConnected && !!state.isInternetReachable);
      }
    });
  }, []);

  NetInfo.configure({
    reachabilityUrl: 'https://google.com',
    reachabilityTest: async response => response.status === 200,
    reachabilityLongTimeout: 30 * 1000, // 60s
    reachabilityShortTimeout: 5 * 1000, // 5s
    reachabilityRequestTimeout: 15 * 1000, // 15s
  });

  NetInfo.addEventListener(state => {
    if (isOnline !== state.isConnected) {
      setIsOnline(!!state.isConnected && !!state.isInternetReachable);
    }
  });
  
  const setUserDataFxn = async () => {
    // console.log(isOnline, 'in home')
    // if (isOnline) {
    //   console.log('in if home');
      const data = await getUserData();
      setUserData(data);
    // } else {
    //   console.log('in else home.js');
    //   ToastAndroid.show("You're Offline!", ToastAndroid.SHORT);
    // }
  };

  async function retrieveUserSession() {
    try {
      const session = await EncryptedStorage.getItem('user');
      if (session !== undefined) {
        setUserData([JSON.parse(session)]);
      }
    } catch (error) {
      console.log('error in accessing storage: ', error);
    }
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    return new Promise(resolve => {
      setTimeout(async () => {
        await setUserDataFxn();
        setRefreshing(false);
      }, 2000);
    });
  }, []);

  const monthNames = [
    'jan',
    'feb',
    'march',
    'april',
    'may',
    'june',
    'july',
    'aug',
    'sept',
    'oct',
    'nov',
    'dec',
  ];

  useEffect(() => {
    let arr1 = [];
    let arr2 = [];
    const monthName = new Date().getMonth();

    var cnt = 0;
    var i = monthName - 5;
    if (route.params.userData != null) {
      while (cnt < 6) {
        arr1.push(
          monthNames[i].charAt(0).toUpperCase() + monthNames[i].slice(1),
        );
        arr2.push(Number(userData[0]?.monthlyExpense[monthNames[i]]));
        i++;
        cnt++;
      }
      setLastSixMonthsName(arr1);
      setLastSixMonthsExpenses(arr2);
    }
  }, [userData]);

  const data = {
    labels: lastSixMonthsName,
    datasets: [
      {
        data: isNaN(lastSixMonthsExpenses[0])
          ? [0, 0, 0, 0, 0, 0]
          : lastSixMonthsExpenses,
        // data: [0, 0, 0, 0, 0, 0],
      },
    ],
  };

  let chartColor =
    data.datasets[0].data[4] > data.datasets[0].data[5]
      ? colors.green
      : colors.red;

  const thisMonthName = monthNames[new Date().getMonth()];
  const prevMonthName = monthNames[new Date().getMonth() - 1];

  useEffect(() => {
    setChangePercentage(
      route.params.userData != null
        ? (Math.abs(
            userData[0]?.monthlyExpense[thisMonthName] -
              userData[0]?.monthlyExpense[prevMonthName],
          ) /
            userData[0]?.monthlyExpense[prevMonthName]) *
            100
        : 0,
    );
  }, [userData]);

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
          marginTop: '5%',
          paddingBottom: '2%',
          marginHorizontal: '5%',
          marginBottom: 5,
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 25,
            fontWeight: '800',
          }}>
          Hello,{' '}
          {userData[0] == null
            ? ''
            : userData[0].userDetails.name.substring(
                0,
                userData[0].userDetails.name.indexOf(' '),
              )}
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('LogoutScreen', {
              userDetails: route?.params.userData[0].userDetails,
            });
          }}>
          <Image
            style={{resizeMode: 'contain', width: 50, height: 50}}
            source={require('../../assets/avatar/business.png')}></Image>
        </TouchableOpacity>
      </View>
    );
  };
  const monthlyContainer = () => {
    return (
      <Card
        // onPress={() => {
        //   navigation.navigate('ExpenseTrackingScreen', {
        //     userData: route.params.userData,
        //   });
        // }}
        style={{
          // backgroundColor: '#f7f7f7',
          borderRadius: 20,
          marginHorizontal: '5%',
        }}>
        <Card.Content>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: '2%',
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ExpenseTrackingScreen', {
                  userData: route.params.userData,
                });
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginLeft: '4%',
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
                // marginTop: 17,
                fontSize: 18,
                fontWeight: 'bold',
                paddingRight: '4%',
                color: chartColor,
              }}>
              {Math.abs(changePercentage).toFixed(2)}%
            </Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <LineChart
              data={data}
              width={Dimensions.get('window').width} // from react-native
              height={170}
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
        </Card.Content>
      </Card>
    );
  };

  const lastPart = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          position: 'absolute',
          bottom: '3%',
          right: '5%',
        }}>
        <FAB
          icon={'plus'}
          variant={'tertiary'}
          onPress={() => {
            navigation.navigate('AddExpense', {
              userData: route.params.userData,
            });
          }}
        />
      </View>
    );
  };

  const goalSection = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          flexDirection: 'row',
          marginTop: '2%',
        }}>
        <Card
          style={{
            borderRadius: 20,
            // backgroundColor: '#f7f7f7',
            height: 60,
            width: '90%',
          }}>
          <Card.Content>
            <TouchableOpacity
              style={{flexDirection: 'row', justifyContent: 'space-between'}}
              onPress={() => {
                navigation.navigate('', {
                  userData: route.params.userData,
                });
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginLeft: '2%',
                  color: colors.blue,
                }}>
                My Goals
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: colors.blue,
                }}>
                65%
              </Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      </View>
    );
  };

  const todayDate = moment(new Date()).format('DD-MM-YYYY');
  const yesterdayDate = moment().subtract(1, 'days').format('DD-MM-YYYY');

  if (route?.params.userData != null)
    return (
      <SafeAreaView
        style={{
          flex: 1,
          // backgroundColor: 'white'
        }}>
        <ScrollView
          bounces={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <StatusBar backgroundColor={colors.greyColor}></StatusBar>
          {topBar()}
          <View
          // style={{marginBottom: '10%'}}
          >
            {monthlyContainer()}
            {goalSection()}
            <View style={{marginLeft: 20, marginTop: 30, marginRight: 20}}>
              <Text style={{fontWeight: '600', fontSize: 18}}>Today</Text>
              {userData[0] != null &&
              userData[0]?.expenses[todayDate] != undefined ? (
                userData[0].expenses[todayDate].map((exp, index) => {
                  return (
                    <View style={{marginVertical: '2%'}} key={index}>
                      {expenseComponent(
                        exp.amount,
                        exp.category,
                        exp.type,
                        userData[0].categories,
                      )}
                    </View>
                  );
                })
              ) : (
                <>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '600',
                      marginVertical: '5%',
                    }}>
                    No Expense
                  </Text>
                </>
              )}
            </View>
            <View style={{marginLeft: 20, marginTop: '5%', marginRight: 20}}>
              <Text style={{fontWeight: '600', fontSize: 18}}>Yesterday</Text>
              {userData[0] != null &&
              userData[0]?.expenses[yesterdayDate] != undefined ? (
                userData[0]?.expenses[yesterdayDate].map((exp, index) => {
                  return (
                    <View style={{marginVertical: '2%'}} key={index}>
                      {expenseComponent(
                        exp.amount,
                        exp.category,
                        exp.type,
                        userData[0].categories,
                      )}
                    </View>
                  );
                })
              ) : (
                <>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '600',
                      marginVertical: '5%',
                    }}>
                    No Expense
                  </Text>
                </>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={{
              position: 'relative',
              bottom: '3%',
              left: '5%',
              marginTop: '10%',
            }}
            onPress={() => {
              navigation.navigate('WeekSeg', {
                expenses: route?.params.userData[0].expenses,
                categories: route?.params.userData[0].categories,
              });
            }}>
            <Text
              style={{fontSize: 18, fontWeight: 'bold', color: colors.blue}}>
              Explore More →
            </Text>
          </TouchableOpacity>
        </ScrollView>
        {lastPart()}
      </SafeAreaView>
    );
  else
    return (
      <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
        <Image
          source={require('../../assets/logo.gif')}
          style={{alignSelf: 'center', width: '25.4%', height: '12%'}}
        />
      </SafeAreaView>
    );
}
const styles = StyleSheet.create({});


