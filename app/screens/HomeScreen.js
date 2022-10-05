import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  RefreshControl,
  PermissionsAndroid,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import {authentication} from '../../config/keys';
import {getUserData} from '../../API/firebaseMethods';

import {FAB, Card} from 'react-native-paper';

import colors from '../config/colors';
import {TouchableOpacity} from 'react-native';
import {ScrollView} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {StatusBar} from 'expo-status-bar';
import {onAuthStateChanged, getAuth} from 'firebase/auth';
import {useRoute} from '@react-navigation/native';
import moment from 'moment';
import SplashScreen from './SplashScreen';
import GoogleAd from '../components/GoogleAd';

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
          ₹ {Number(amount).toFixed(2)}
        </Text>
      </View>
    </View>
  );
};
export default function HomeScreen({navigation}, props) {
  const route = useRoute();

  const [refreshing, setRefreshing] = React.useState(false);
  const [changePercentage, setChangePercentage] = useState(0);
  const [lastSixMonthsExpenses, setLastSixMonthsExpenses] = useState([
    0, 0, 0, 0, 0, 0,
  ]);
  const [lastSixMonthsName, setLastSixMonthsName] = useState([]);

  const [userData, setUserData] = useState([null]);

  useEffect(() => {
    setUserData(route.params.userData);
  }, []);

  const setUserDataFxn = async () => {
    try {
      const data = await getUserData(route?.params.userData[0].userDetails.uid);
      if (data) setUserData(data);
      else ToastAndroid.show("You're Offline!", ToastAndroid.SHORT);
    } catch (error) {
      console.log(error);
    }
  };

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
            color: colors.secondaryHeading
          }}>
          Hello,{' '}
          {userData[0] == null
            ? ''
            : userData[0].userDetails.name.indexOf(' ') != -1
            ? userData[0].userDetails.name.substring(
                0,
                userData[0].userDetails.name.indexOf(' '),
              )
            : userData[0].userDetails.name}
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
        onPress={() => {
          navigation.navigate('ExpenseTrackingScreen', {
            userData: route.params.userData,
          });
        }}
        style={{
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
        }}>
        <ScrollView
          bounces={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <StatusBar backgroundColor={colors.backgroundColor}></StatusBar>
          {/* {' '} */}
          {topBar()}
          <View
          // style={{marginBottom: '10%'}}
          >
            {monthlyContainer()}
            {/* {goalSection()} */}
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
        {/* <GoogleAd/> */}
        {lastPart()}

      </SafeAreaView>
    );
  else
    return (
      <Stack.Screen
        options={{headerShown: false}}
        name="SplashScreen"
        component={SplashScreen}
      />
    );
}
const styles = StyleSheet.create({});
