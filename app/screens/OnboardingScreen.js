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
    <Text style={{fontSize: 16}}>Skip</Text>
  </TouchableOpacity>
);

const Next = ({...props}) => (
  <TouchableOpacity style={{marginHorizontal: 10}} {...props}>
    <Text style={{fontSize: 16}}>Next</Text>
  </TouchableOpacity>
);

const Done = ({...props}) => (
  <TouchableOpacity style={{marginHorizontal: 10}} {...props}>
    <Text style={{fontSize: 16}}>Done</Text>
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
          backgroundColor: 'tomato',
          image: <Image source={require('../assets/favicon.png')} />,
          title: 'Onboarding1',
          subtitle: 'Done with React Native Onboarding Swiper',
        },
        {
          backgroundColor: 'lightyellow',
          image: <Image source={require('../assets/favicon.png')} />,
          title: 'Onboarding2',
          subtitle: 'Done with React Native Onboarding Swiper',
        },
        {
          backgroundColor: 'lightgreen',
          image: <Image source={require('../assets/favicon.png')} />,
          title: 'Onboarding2',
          subtitle: 'Done with React Native Onboarding Swiper',
        },
        {
          backgroundColor: 'lightblue',
          image: <Image source={require('../assets/favicon.png')} />,
          title: 'Onboarding2',
          subtitle: 'Done with React Native Onboarding Swiper',
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
