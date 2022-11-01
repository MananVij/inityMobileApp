import React, {useRef, useState, useEffect} from 'react';
import Swiper from 'react-native-swiper';
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

import {Card, Text, Title, Paragraph} from 'react-native-paper';

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
    let monthCategorizedData = [];
    let categoryExpenses1 = [];
    let categoryExpenses2 = [];

    let d1 = new Date().getMonth() + 1;
    let d2 = new Date().getMonth();

    monthCategorizedData = Object.values(
      route?.params.userData[0].expenses,
    ).filter(el => {
      return el[0].date.split('-')[1] == d1;
    });
    monthCategorizedData = [monthCategorizedData];
    monthCategorizedData.push(
      Object.values(route?.params.userData[0].expenses).filter(el => {
        return el[0].date.split('-')[1] == d2;
      }),
    );

    let categoryArr1 = [];
    let categoryArr2 = [];
    let categoryDataArr = [];

    monthCategorizedData[0].map(el => {
      el.map(ele => {
        if (!categoryArr1.includes(ele?.category))
          categoryArr1.push(ele.category);
        categoryDataArr.push({[ele.category]: ele.amount});
      });
    });

    let finalAns = [categoryDataArr];
    categoryDataArr = [];
    monthCategorizedData[1].map(el => {
      el.map(ele => {
        if (!categoryArr2.includes(ele?.category))
          categoryArr2.push(ele.category);
        categoryDataArr.push({[ele.category]: ele.amount});
      });
    }),
      finalAns.push(categoryDataArr);

    categoryArr1.map(el => {
      let sum = 0;
      finalAns[0].map(ele => {
        if (Object.keys(ele)[0] == el) {
          sum = sum + Number(Object.values(ele)[0]);
        }
      });
      categoryExpenses1.push({[el]: sum});
    });

    let finalCategoryExpenses = [categoryExpenses1];

    categoryArr2.map(el => {
      let sum = 0;
      finalAns[1].map(ele => {
        if (Object.keys(ele)[0] == el) {
          sum = sum + Number(Object.values(ele)[0]);
        }
      });
      categoryExpenses2.push({[el]: sum});
    });

    finalCategoryExpenses.push(categoryExpenses2);
    setCategoryExpense(finalCategoryExpenses);

    let pieChartData1 = [];
    let legendData1 = [];
    let pieChartData2 = [];
    let legendData2 = [];

    finalCategoryExpenses[0].map(el => {
      pieChartData1.push({
        x: Object.keys(el)[0],
        y: Number(Object.values(el)[0]),
      });
      legendData1.push({name: Object.keys(el)[0]});
    });

    finalCategoryExpenses[1].map(el => {
      pieChartData2.push({
        x: Object.keys(el)[0],
        y: Number(Object.values(el)[0]),
      });
      legendData2.push({name: Object.keys(el)[0]});
    });

    let pieChartData = [pieChartData1, pieChartData2];
    let pieChartLegend = [legendData1, legendData2];

    setPieChartLegend(pieChartLegend);
    setPieChartData(pieChartData);
  }, []);
  useEffect(() => {
    let totalExpense = [
      route?.params.userData[0].monthlyExpense[monthNames[d.getMonth()]],
      route?.params.userData[0].monthlyExpense[monthNames[d.getMonth() - 1]],
    ];
    setTotalExpense(totalExpense);
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

  const topBar = () => {
    return (
      <View style={styles.topContainer}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.topBarText}>My Expenses</Text>
        </View>
      </View>
    );
  };

  const pieChart = idx => {
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
            data={pieChartData[idx]}
            colorScale={'qualitative'}
            labelRadius={95}
            innerRadius={0.2 * width}
            radius={0.43 * width}
            style={{
              labels: {
                fontSize: 0,
                fill: 'white',
                fontWeight: '700',
              },
            }}
          />
          <View>
            <VictoryLabel
              textAnchor="middle"
              style={{fontSize: 25, fontWeight: '600'}}
              x={width * 0.5}
              y={height * 0.25}
              text={`Expenses\n${totalExpense[idx]}`}
            />
          </View>
        </Svg>
      </View>
    );
  };

  const expensesCards = monthIdx => {
    return (
      <Card
        elevation={0}
        mode={'elevated'}
        style={{backgroundColor: colors.backgroundColor, paddingBottom: '2%'}}>
        <Card.Content>
          {categoryExpenses[monthIdx].map((item, idx) => (
            <View
              key={idx}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Title
                style={{fontWeight: 'bold', fontSize: 20, width: width * 0.3}}>
                {Object.keys(item)[0]}
              </Title>
              <Title
                style={{
                  fontWeight: 'bold',
                  fontSize: 20,
                  width: width * 0.35,
                  textAlign: 'right',
                }}>
                {Object.values(item)[0]}
              </Title>
              <Title
                style={{
                  fontWeight: 'bold',
                  fontSize: 20,
                  textAlign: 'justify',
                  width: width * 0.25,
                  textAlign: 'right',
                }}>
                {((Object.values(item) / totalExpense[monthIdx]) * 100).toFixed(
                  2,
                ) == 100
                  ? 100
                  : (
                      (Object.values(item) / totalExpense[monthIdx]) *
                      100
                    ).toFixed(2)}
              </Title>
            </View>
          ))}
        </Card.Content>
      </Card>
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
        <View style={{marginBottom: '5%'}}>
          <Swiper
            paginationStyle={{bottom: -15}}
            showsButtons={false}
            loop={false}>
            <View>
              {pieChartData[0]?.length != 0 ? (
                // { pieChartData[1] &&  pieChartData[0][0] ? (
                <>
                  {pieChart(0)}
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
                      // groupComponent={2}
                      // orientation={'horizontal'}
                      data={pieChartLegend[0]}
                    />
                  </View>

                  <View style={{paddingHorizontal: '2%'}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        marginBottom: '1%',
                      }}>
                      <Text style={{fontSize: 17, fontWeight: '700'}}>
                        Amount (₹)
                      </Text>
                      <Text
                        style={{
                          fontSize: 17,
                          fontWeight: '700',
                          marginLeft: '5%',
                        }}>
                        Percentage
                      </Text>
                    </View>

                    {categoryExpenses ? expensesCards(0) : <></>}
                  </View>
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
                  <View style={{marginTop: '10%'}}>
                    <Text style={styles.monthName}>
                      {monthNames[d.getMonth()].charAt(0).toUpperCase() +
                        monthNames[d.getMonth()].slice(1)}
                    </Text>
                  </View>
                  <Text
                    style={{
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
                {/* <GoogleAd /> */}
              </View>
            </View>
            <View style={styles.slide2}>
              {pieChartData[1]?.length != 0 ? (
                // { pieChartData[0] && pieChartData[0][1] != undefined ? (
                <>
                  {pieChart(1)}
                  <Text style={styles.monthName}>
                    {monthNames[d.getMonth() - 1].charAt(0).toUpperCase() +
                      monthNames[d.getMonth() - 1].slice(1)}
                  </Text>
                  <View>
                    <VictoryLegend
                      colorScale={'qualitative'}
                      height={80}
                      gutter={40}
                      x={20}
                      itemsPerRow={2}
                      // groupComponent={2}
                      // orientation={'horizontal'}
                      data={pieChartLegend[1]}
                    />
                  </View>

                  <View style={{paddingHorizontal: '2%'}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        marginBottom: '1%',
                      }}>
                      <Text style={{fontSize: 17, fontWeight: '700'}}>
                        Amount (₹)
                      </Text>
                      <Text
                        style={{
                          fontSize: 17,
                          fontWeight: '700',
                          marginLeft: '5%',
                        }}>
                        Percentage
                      </Text>
                    </View>

                    {categoryExpenses ? expensesCards(1) : <></>}
                  </View>
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
                  <View style={{marginTop: '10%'}}>
                    <Text style={styles.monthName}>
                      {monthNames[d.getMonth() - 1].charAt(0).toUpperCase() +
                        monthNames[d.getMonth() - 1].slice(1)}
                    </Text>
                  </View>
                  <Text
                    style={{
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
                {/* <GoogleAd /> */}
              </View>
            </View>
          </Swiper>
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
