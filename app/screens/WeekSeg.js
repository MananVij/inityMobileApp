import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function WeekSeg() {
  const [expenses, setExpenses] = useState([]);
  const route = useRoute();
  useEffect(() => {
    var d = new Date().getMonth() + 1;
    let arr = [];
    let dates = [];
    Object.keys(route?.params.expenses).filter(el => {
      if (el.split('-')[1] == d) {
        dates.push(el);
      }
    });
    dates.sort().reverse();
    dates.map(el => {
      arr.push({[el]: route?.params.expenses[el]});
    });
    setExpenses(arr);
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
            ₹ {amount}
          </Text>
        </View>
      </View>
    );
  };

  const renderExpense = el => {};

  return (
    <SafeAreaView
      style={{
        paddingTop: '25%',
        marginLeft: '5%',
        marginBottom: '5%',
        marginHorizontal: '2%',
      }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text
          style={{
            marginTop: '10%',
            marginBottom: '2%',
            fontWeight: '700',
            fontSize: 25,
          }}>
          Expenses
        </Text>
        {expenses.map(el => {
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
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({});
