import React, {Component, useRef, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  Text,
  FlatList,
  SectionList,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import {collection, getDocs} from 'firebase/firestore/lite';
import {userId, db} from '../../config/keys';
import {getUserTotalExpenses} from '../../API/firebaseMethods';

import {VictoryPie} from 'victory-native';
// import { Icon } from "react-native-vector-icons/FontAwesome5";
import colors from '../config/colors';

// Data used to make the animate prop work
const ExpenseTrackingScreen = props => {
  const topBar = () => {
    return (
      <View style={styles.topContainer}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.topBarText}>My Expenses</Text>
            {/* <Text style={(styles.topBarText, {fontSize: 20})}>January</Text>
            <Image
              source={require('../assets/icons/drop-down.png')}
              style={styles.dorpdownIcon}></Image> */}
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
                backgroundColor: item.color,
                width: 17,
                height: 17,
                borderRadius: 2,
                marginLeft: 10,
              }}
            />
            <Text style={{fontWeight: 'bold', fontSize: 20, marginLeft: 15}}>
              {(item.title).charAt(0).toUpperCase() + (item.title).slice(1)}
            </Text>
          </View>
          <View>
            <Text style={{fontWeight: '500', fontSize: 20, marginRight: 10}}>
              {item.expense}
            </Text>
          </View>
          <View>
            <Text style={{fontWeight: '500', fontSize: 20, marginRight: 10}}>
              {item.expensePer}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const pieChart = () => {
    const [pieChartData, setPieChartData] = useState(Number);
    const [flatListData, setFlatListData] = useState([]);
    const [totalExpense, setTotalExpense] = useState([]);
    useEffect(() => {
      (async () => {
        var data = await getUserTotalExpenses();
        setPieChartData(data[0]);
        setTotalExpense(data[1]);
        setFlatListData(data[2]);
      })();
    }, []);
    let colorScales = flatListData?.map(item => item.color);
    return (
      <View style={{alignItems: 'center'}}>
        <View style={{alignContent: 'center'}}>
          <VictoryPie
            animate={{easing: 'exp'}}
            data={pieChartData}
            colorScale={colorScales}
            labelRadius={170}
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
          </View>
        </View>
        <View style={{marginHorizontal: '2%'}}>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Text style={{marginRight: '2%', fontSize: 17, fontWeight: '700'}}>Amount (₹)</Text>
            <Text style={{marrginRight: '150%', fontSize: 17, fontWeight: '700'}}>Percentage</Text>
          </View>
          <FlatList
            data={flatListData}
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
    marginTop: 5,
    fontSize: 23,
    fontWeight: '800',
    textAlign: 'left',
    flexWrap: 'wrap',
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
