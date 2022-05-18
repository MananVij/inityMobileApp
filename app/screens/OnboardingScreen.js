import React from 'react';
import {StyleSheet, Image, TouchableOpacity, Text} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import colors from '../config/colors';

const Dots = ({selected}) => {
  let backgroundColor;

  backgroundColor = selected ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.3)';

  return (
    <View
      style={{
        width: 6,
        height: 6,
        marginHorizontal: 3,
        backgroundColor,
      }}
    />
  );
};

const Skip = ({...props}) => (
  <TouchableOpacity style={{marginHorizontal: 10}} {...props}>
    <Text style={{fontSize: 17, fontWeight: '600', marginLeft: '5%'}}>
      Skip
    </Text>
  </TouchableOpacity>
);

const Next = ({...props}) => (
  <TouchableOpacity style={{marginHorizontal: 10}} {...props}>
    <Text style={{fontSize: 17, fontWeight: '600', marginRight: '5%'}}>
      Next
    </Text>
  </TouchableOpacity>
);

const Done = ({...props}) => (
  <TouchableOpacity style={{marginHorizontal: 10}} {...props}>
    <Text style={{fontSize: 17, fontWeight: '600', marginRight: '5%'}}>
      Done
    </Text>
  </TouchableOpacity>
);

function OnboardingScreen({navigation}) {
  return (
    <Onboarding
      SkipButtonComponent={Skip}
      NextButtonComponent={Next}
      DoneButtonComponent={Done}
      onSkip={() => navigation.replace('LoginScreen')}
      onDone={() => navigation.navigate('LoginScreen')}
      pages={[
        {
          backgroundColor: '#B9F8D3',
          title: (
            <Text
              style={{
                fontSize: 130,
                color: '#2B2B2B',
                marginBottom: 10,
                fontFamily: 'Lato-Black',
                marginTop: '-25%',
                paddingBottom: '3%'
              }}>
              Inity
            </Text>
          ),
          subtitle: (
            <Text
              style={{
                fontSize: 25,
                fontFamily: 'Poppins-Medium',
                textAlign: 'center',
                color: '#2B2B2B',
                paddingHorizontal: 20,
                textAlign: 'center'
              }}>
              The all in one personal finance app.
            </Text>
          ),
        },
        {
          backgroundColor: 'lightyellow',
          image: <Image source={require('../../assets/icons/piggy.png')} style={{marginTop: '-15%', width: '90%', marginBottom : '-5%'}} />,
          title: (
            <Text
              style={{
                fontSize: 40,
                color: '#171010',
                marginBottom: 10,
                fontFamily: 'Lato-Black',
                marginLeft: '-5%',
                marginBottom: '5%'
              }}>
              track your money.
            </Text>
            
          ),
          subtitle: (
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Poppins-Medium',
                textAlign: 'center',
                color: '#2B2B2B',
                paddingHorizontal: '8%',
                textAlign: 'left'
              }}>
              Track your money hasslefree and {'\n'} in much more simplified manner!
            </Text>
          ),
        },
        {
          backgroundColor: 'lightgreen',
          image: (
            <Image
              source={require('../../assets/icons/rocket.png')}
              style={{height: '75%', width: '75%', marginTop: '-20%'}}
            />
          ),

          title: (
            <Text
              style={{
                fontSize: 40,
                color: '#171010',
                marginBottom: 10,
                fontFamily: 'Lato-Black',
                marginTop: '-58%',
                marginBottom: '5%'
              }}>
              set your goals.
            </Text>
          ),
          subtitle: (
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Poppins-Medium',
                textAlign: 'center',
                color: '#2B2B2B',
                paddingHorizontal: '5%',
                textAlign: 'left'
              }}>
              Set your financial goals & we'll make sure that you achieve them
              easily.
            </Text>
          ),
        },
        {
          backgroundColor: '#E8F9FD',
          image: (
            <Image
              source={require('../../assets/icons/commodities.png')}
              style={{marginTop: '-15%', width: '90%', marginBottom : '-5%'}}
            />
          ),

          title: (
            <Text
              style={{
                fontSize: 40,
                color: '#171010',
                marginBottom: 10,
                fontFamily: 'Lato-Black',
                marginBottom: '5%',
              }}>
              easy & simplified investing.
            </Text>
          ),
          subtitle: (
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Poppins-Medium',
                textAlign: 'center',
                color: '#2B2B2B',
                paddingHorizontal: 20,
                textAlign: 'left'
              }}>
              Invest in stocks, commodities & indices in a new manner.
            </Text>
          ),
        },
      ]}
    />
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundColor,
    flex: 1,
  },
});
export default OnboardingScreen;
