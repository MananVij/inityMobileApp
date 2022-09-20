import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  useWindowDimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {collection, getDocs} from 'firebase/firestore/lite';
import {userId, db} from '../../config/keys';
import rgbHex from 'rgb-hex';

import {Text} from 'react-native-paper';

import {VictoryPie, VictoryLabel, VictoryLegend} from 'victory-native';
import colors from '../config/colors';
import {useRoute} from '@react-navigation/native';
import GoogleAd from '../components/GoogleAd';
import Svg from 'react-native-svg';

// Data used to make the animate prop work
const ExpenseTrackingScreen = props => {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const {height, width} = useWindowDimensions();

  const d = new Date();
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
  const [totalExpense, setTotalExpense] = useState([]);
  const [categoryExpenses, setCategoryExpense] = useState();
  const [pieChartData, setPieChartData] = useState({x: 0, y: 1000});
  const [pieChartLegend, setPieChartLegend] = useState([]);

  useEffect(() => {
    let arr = [];
    let arr2 = [];
    let ans = [];

    monthlyDataExpanded.map(el => {
      el.map(ele => {
        if (!arr?.includes(ele?.category)) arr.push(ele.category);
        arr2.push({[ele.category]: ele.amount});
      });
    });

    arr.map(el => {
      let sum = 0;
      arr2.map(ele => {
        if (el == Object.keys(ele)) {
          sum = sum + Number(Object.values(ele));
        }
      });
      ans.push({[el]: sum});
    });
    setCategoryExpense(ans);

    let pie = [];
    let legend = [];
    ans.map(el => {
      pie.push({x: Object.keys(el), y: Number(Object.values(el))});
      legend.push({name: Object.keys(el)[0]});
    });
    setPieChartLegend(legend);
    setPieChartData(pie);
  }, []);

  useEffect(() => {
    setTotalExpense(
      route?.params.userData[0].monthlyExpense[monthNames[d.getMonth()]],
    );
  }, []);

  let categoryListHeightAnimationValue = useRef(
    new Animated.Value(200),
  ).current;

  var date = new Date().getMonth();
  let monthlyDataExpanded = Object.values(
    route?.params.userData[0].expenses,
  ).filter(el => {
    return el[0].date.split('-')[1] - 1 == date;
  });

  const [userExpenses, setUserExpenses] = useState([]);
  const getExpenses = async () => {
    try {
      const expensesCollection = collection(db, 'expenses');
      const exp = await getDocs(expensesCollection);
      const allExpenses = exp.docs.map(doc => doc.data());
      allExpenses.map(expenses => {
        if (expenses.userId == userId) {
          userExpenses.push(expenses);
        }
      });
    } catch (error) {
      console.log('error: ', error);
    }
  };
  getExpenses();

  const topBar = () => {
    return (
      <View style={styles.topContainer}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.topBarText}>My Expenses</Text>
        </View>
      </View>
    );
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity activeOpacity={0.7}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: '#f7f7f7',
            shadowColor: '#000',
            marginBottom: '5%',
            shadowOffset: {height: 2, width: 4},
            shadowOpacity: 0.2,
            borderRadius: 4,
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: '50%',
              alignItems: 'center',
              paddingHorizontal: '2%',
            }}>
            <Text style={{fontWeight: 'bold', fontSize: 20}}>
              {Object.keys(item)}
            </Text>
          </View>
          <View>
            <Text style={{fontWeight: '500', fontSize: 20}}>
              {Object.values(item)}
            </Text>
          </View>
          <View>
            <Text style={{fontWeight: '500', fontSize: 20, paddingLeft: '18%'}}>
              {((Object.values(item) / totalExpense) * 100).toPrecision(2) == 100 ? 100 : ((Object.values(item) / totalExpense) * 100).toPrecision(2)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const pieChart = () => {
    return (
      <View
        style={{
          alignContent: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        <Svg>
          <VictoryPie
            animate={{
              easing: 'exp',
            }}
            padAngle={1}
            startAngle={90}
            endAngle={450}
            data={pieChartData}
            colorScale={'qualitative'}
            labelRadius={95}
            innerRadius={0.2 * width}
            radius={0.43 * width}
            style={{
              labels: {
                fontSize: 13,
                fill: 'white',
                fontWeight: '700',
              },
            }}
          />
          <View>
            <VictoryLabel
              textAnchor="middle"
              style={{fontSize: 25, fontWeight: '600'}}
              x={width*0.5}
              y={height*0.3}
              text={`Expenses\n${totalExpense}`}
            />
          </View>
        </Svg>
      </View>
    );
  };

  const flatListExp = () => {
    return (
      <View style={{marginBottom: '15%'}}>
        <View
          style={{
            // marginTop: '5%',
            marginHorizontal: '5%',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginBottom: '3%',
            }}>
            <Text style={{fontSize: 17, fontWeight: '700'}}>Amount (₹)</Text>
            <Text style={{fontSize: 17, fontWeight: '700', marginLeft: '5%'}}>
              Percentage
            </Text>
          </View>
          <FlatList data={categoryExpenses} renderItem={renderItem} />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: colors.backgroundColor,
        flex: 1,
      }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}>
        {topBar()}
        {pieChartData[0] ? (
          <>
            {pieChart()}
            <Text style={styles.monthName}>
              {monthNames[d.getMonth()].charAt(0).toUpperCase() +
                monthNames[d.getMonth()].slice(1)}
            </Text>
            <View>
              <VictoryLegend
                colorScale={'qualitative'}
                height={80}
                gutter={40}
                x={20}
                itemsPerRow={2}
                groupComponent={2}
                // orientation={'horizontal'}
                data={pieChartLegend}
              />
            </View> 
            {flatListExp()}
          </>
        ) : (
          <>
            <Image
              source={require('../../assets/icons/no-expense.png')}
              style={{
                width: '100%',
                height: 300,
                resizeMode: 'contain',
              }}></Image>
            <Text
              style={{
                position: 'absolute',
                bottom: '10%',
                fontSize: 23,
                fontWeight: '700',
                alignSelf: 'center',
                color: colors.logoColor,
              }}>
              wohooo! no expense.
            </Text>
          </>
        )}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
          }}>
          <GoogleAd />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  console: {
    backgroundColor: colors.backgroundColor,
    flex: 1,
  },

  // Top Container
  topContainer: {
    backgroundColor: colors.backgroundColor,
    paddingLeft: '3%',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: '5%',
  },
  backIcon: {
    height: 38,
    width: 38,
  },
  categorySelector: {
    backgroundColor: '#f7f7f7',
    width: '35%',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  topBarText: {
    // marginTop: '10%',
    marginLeft: '5%',
    fontSize: 23,
    fontWeight: '800',
    textAlign: 'left',
    flexWrap: 'wrap',
  },
  monthName: {
    fontWeight: '700',
    fontSize: 22,
    alignSelf: 'center',
    marginBottom: '5%',
  },
  dorpdownIcon: {
    height: 25,
    width: 25,
    position: 'relative',
  },
  pieContaier: {
    flex: 1,
    // height: '80%',
    backgroundColor: 'blue',
  },
  listContainer: {
    backgroundColor: '#000',
    flex: 2,
  },

  // Categories Section
  categoraiesContainer: {
    backgroundColor: '#f7f7f7',
    borderRadius: 5,
    // height: '27%',
    // elevation: 2,
    // paddingLeft: '3%',
    paddingVertical: 10,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  categoryName: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    height: 40,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      height: 2,
      width: 4,
    },
    shadowOpacity: 0.2,
  },
});

export default ExpenseTrackingScreen;
