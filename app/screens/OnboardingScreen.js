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
          backgroundColor: '#B8FFF9',
          // backgroundColor: '#B9F8D3',
          image: <Image source={require('../../assets/icons/piggy.png')} style={{marginBottom: '7%'}} />,

          title: (
            <Text
              style={{
                fontSize: 100,
                color: '#2B2B2B',
                // marginBottom: 10,
                fontFamily: 'Lato-Black',
                marginTop: '-25%',
                paddingBottom: '3%',
                paddingHorizontal: '5%'
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
                textAlign: 'center',
              }}>
              expense tracking like never before!
            </Text>
          ),
        },
        {
          backgroundColor: 'lightgreen',
          image: (
            <Image
              source={require('../../assets/onboarding/card.png')}
              // source={require('../../assets/icons/rocket.png')}
              style={{height: '75%', width: '75%', marginTop: '-20%'}}
            />
          ),

          title: (
            <Text
              style={{
                fontSize: 35,
                color: '#171010',
                marginBottom: 10,
                fontFamily: 'Lato-Black',
                marginTop: '-58%',
                marginBottom: '5%',
                paddingHorizontal: '5%',
                textAlign: 'center',
              }}>
              Online transactions are tracked by us so you don't have to.
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
                textAlign: 'left',
              }}>
              {/* online expenses are tracked by us so you don't have to. */}
              {/* Set your financial goals & we'll make sure that you achieve them
              easily. */}
            </Text>
          ),
        },
        {
          backgroundColor: '#90E0EF',
          image: (
            <Image
              source={require('../../assets/onboarding/cart.png')}
              style={{height: '75%', width: '75%', marginTop: '-20%'}}
            />
          ),

          title: (
            <Text
              style={{
                fontSize: 35,
                color: '#171010',
                marginBottom: 10,
                fontFamily: 'Lato-Black',
                marginTop: '-58%',
                marginBottom: '5%',
                paddingHorizontal: '5%',
                textAlign: 'center',
              }}>
              Adding expenses manually is still an option!
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
                textAlign: 'left',
              }}></Text>
          ),
        },
        {
          backgroundColor: 'lightgreen',
          image: (
            <Image
              source={require('../../assets/onboarding/report.png')}
              style={{height: '75%', width: '75%', marginTop: '-20%'}}
            />
          ),

          title: (
            <Text
              style={{
                fontSize: 35,
                color: '#171010',
                marginBottom: 10,
                fontFamily: 'Lato-Black',
                marginTop: '-58%',
                marginBottom: '5%',
                paddingHorizontal: '5%',
                textAlign: 'center',
              }}>
              Find out how much you're spending in a detailed report.
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
                textAlign: 'left',
              }}></Text>
          ),
        },
        {
          backgroundColor: '#90E0EF',
          image: (
            <Image
              source={require('../../assets/onboarding/plane.png')}
              style={{height: '75%', width: '75%', marginTop: '-20%'}}
            />
          ),

          title: (
            <Text
              style={{
                fontSize: 35,
                color: '#171010',
                marginBottom: 10,
                fontFamily: 'Lato-Black',
                marginTop: '-50%',
                paddingHorizontal: '5%',
                textAlign: 'center',
              }}>
              Getting Excited? Come onboard to save and grow!
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
                textAlign: 'left',
              }}></Text>
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
