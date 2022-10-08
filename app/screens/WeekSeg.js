import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../config/colors';
import Swiper from 'react-native-swiper';
import GoogleAd from '../components/GoogleAd';
import {CONSTANTS} from '@firebase/util';

export default function WeekSeg() {
  const [expenses, setExpenses] = useState([]);
  const route = useRoute();

  useEffect(() => {
    var d1 = new Date().getMonth() + 1;
    var d2 = new Date().getMonth();
    let arr = [];
    let dates = [];
    let newArr = [];
    Object.keys(route?.params.expenses).filter(el => {
      if (el.split('-')[1] == d2) {
        dates.push(el);
      }
    });
    dates.sort().reverse();
    dates.map(el => {
      arr.push({[el]: route?.params.expenses[el]});
    });
    dates = [];

    Object.keys(route?.params.expenses).filter(el => {
      if (el.split('-')[1] == d1) {
        dates.push(el);
      }
    });
    dates.sort().reverse();
    dates.map(el => {
      newArr.push({[el]: route?.params.expenses[el]});
    });
    var final = [];
    final.push(newArr);
    final.push(arr);
    setExpenses(final);
  }, []);

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

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: '25%',
      }}>
      <Text
        style={{
          marginTop: '5%',
          marginBottom: '2%',
          marginHorizontal: '5%',
          fontWeight: '700',
          fontSize: 25,
        }}>
        Expenses
      </Text>
      <View
        style={{
          marginHorizontal: '5%',
          flex: 1,
        }}>
        <Swiper
          showsButtons={false}
          loop={false}
          paginationStyle={{bottom: 10}}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {expenses[0]?.length != 0 ? (
              expenses[0]?.map(el => {
                return Object.keys(el).map((ele, idx) => {
                  return (
                    <View key={idx}>
                      <Text
                        style={{
                          fontWeight: '700',
                          fontSize: 17,
                          marginTop: '5%',
                          marginBottom: '2%',
                        }}>
                        {el[ele][0].date.split('-')[0] +
                          ' / ' +
                          el[ele][0].date.split('-')[1]}
                      </Text>

                      {el[ele].map((exp, index) => {
                        return (
                          <View key={index}>
                            {expenseComponent(
                              exp.amount,
                              exp.category,
                              exp.type,
                              route?.params.categories,
                            )}
                          </View>
                        );
                      })}
                    </View>
                  );
                });
              })
            ) : (
              <>
                <Image
                  source={require('../../assets/icons/no-expense.png')}
                  style={{
                    width: '100%',
                    height: 300,
                    resizeMode: 'stretch',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}></Image>
                <Text
                  style={{
                    marginTop: '25%',
                    fontSize: 23,
                    fontWeight: '700',
                    alignSelf: 'center',
                    color: colors.logoColor,
                  }}>
                  wohooo! no expense.
                </Text>
              </>
            )}
          </ScrollView>
          <ScrollView showsVerticalScrollIndicator={false}>
            {expenses[1]?.length != 0 ? (
              expenses[1]?.map(el => {
                return Object.keys(el).map((ele, idx) => {
                  return (
                    <ScrollView key={idx}>
                      <Text
                        style={{
                          fontWeight: '700',
                          fontSize: 17,
                          marginTop: '5%',
                          marginBottom: '2%',
                        }}>
                        {el[ele][0].date.split('-')[0] +
                          ' / ' +
                          el[ele][0].date.split('-')[1]}
                      </Text>

                      {el[ele].map((exp, index) => {
                        return (
                          <View key={index}>
                            {expenseComponent(
                              exp.amount,
                              exp.category,
                              exp.type,
                              route?.params.categories,
                            )}
                          </View>
                        );
                      })}
                    </ScrollView>
                  );
                });
              })
            ) : (
              <>
                <Image
                  source={require('../../assets/icons/no-expense.png')}
                  style={{
                    width: '100%',
                    height: 300,
                    resizeMode: 'stretch',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}></Image>
                <Text
                  style={{
                    marginTop: '25%',
                    fontSize: 23,
                    fontWeight: '700',
                    alignSelf: 'center',
                    color: colors.logoColor,
                  }}>
                  wohooo! no expense.
                </Text>
              </>
            )}
          </ScrollView>
        </Swiper>
      </View>
      {/* <View style={{marginTop: '2%'}}>
        <GoogleAd />
      </View> */}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({});
