import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import {collection, getDocs} from 'firebase/firestore/lite';
import {userId, db} from '../../config/keys';
import distinctColors from 'distinct-colors';
import rgbHex from 'rgb-hex';

import {Text} from 'react-native-paper';

import {VictoryPie} from 'victory-native';
import colors from '../config/colors';
import {useRoute} from '@react-navigation/native';
import GoogleAd from '../components/GoogleAd';


// Data used to make the animate prop work
const ExpenseTrackingScreen = props => {
  const route = useRoute();

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

  var palette = distinctColors({
    count: Object.entries(route?.params.userData[0].categories).length,
    hueMin: 50,
    hueMax: 250,
    chromaMin: 40, 
    chromaMax: 150
  });
  var colorPallete = [];
  palette.map(el => {
    colorPallete.push('#' + String(rgbHex(el._rgb[0], el._rgb[1], el._rgb[2])));
  });

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
    ans.map(el => {
      pie.push({x: Object.keys(el), y: Number(Object.values(el))});
    });
    setPieChartData(pie);
  }, []);

  useEffect(() => {
    setTotalExpense(
      route?.params.userData[0].monthlyExpense[monthNames[d.getMonth()]],
    );
  }, []);

  const topBar = () => {
    return (
      <View style={styles.topContainer}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.topBarText}>My Expenses</Text>
        </View>
      </View>
    );
  };

  let categoryListHeightAnimationValue = useRef(
    new Animated.Value(200),
  ).current;

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
            style={{flexDirection: 'row', width: '50%', alignItems: 'center'}}>
            <View
              style={{
                backgroundColor: colorPallete,
                width: 18,
                height: 18,
                borderRadius: 6,
                marginRight: '5%',
              }}
            />
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
              {((Object.values(item) / totalExpense) * 100).toPrecision(2)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  var date = new Date().getMonth();
  let monthlyDataExpanded = Object.values(
    route?.params.userData[0].expenses,
  ).filter(el => {
    return el[0].date.split('-')[1] - 1 == date;
  });

  const pieChart = () => {
    return (
      <View style={{alignItems: 'center'}}>
        <View style={{alignContent: 'center'}}>
          <VictoryPie
            animate={{
              // easing: 'exp', 
              // onLoad: {
              //   sta
              // },
            duration: 1000,
            
          }}
          
            padAngle={2}
            startAngle={90}
            endAngle={450}
            data={pieChartData}
            colorScale={'heatmap'}
            // colorScale={colorPallete}
            // labelRadius={170}
            innerRadius={70}
            style={{
              labels: {
                fontSize: 0,
              },
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: '43%',
              left: '39.5%',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>Expenses</Text>
            <Text style={{fontSize: 23, fontWeight: 'bold'}}>
              {totalExpense}
            </Text>
            <Text style={styles.monthName}>
              {monthNames[d.getMonth()].charAt(0).toUpperCase() +
                monthNames[d.getMonth()].slice(1)}
            </Text>
          </View>
        </View>
        <View style={{marginTop: '7%', marginHorizontal: '5%'}}>
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
          <FlatList
            data={categoryExpenses}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </View>
      </View>
    );
  };

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

  return (
    <SafeAreaView style={styles.console}>
      <ScrollView bounces={false}>
      <GoogleAd/>
        {topBar()}
        {pieChart()}
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
    // height: '27%',
    // elevation: 2,
    paddingLeft: '3%',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: '7%',
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
    marginTop: '10%',
    marginLeft: '5%',
    fontSize: 23,
    fontWeight: '800',
    textAlign: 'left',
    flexWrap: 'wrap',
  },
  monthName: {
    fontWeight: '700',
    fontSize: 22,
    marginTop: '145%',
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
