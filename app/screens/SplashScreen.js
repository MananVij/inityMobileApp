import React from 'react';
import {SafeAreaView, Image} from 'react-native';

function SplashScreen({navigation}) {
  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <Image
        source={require('../../assets/logo.gif')}
        style={{alignSelf: 'center', width: '26.6%', height: '12.6%', resizeMode: 'center'}}
      />
    </SafeAreaView>
  );
}

export default SplashScreen;
