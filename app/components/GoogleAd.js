import {View, Text} from 'react-native';
import React from 'react';
import mobileAds, {
  MaxAdContentRating,
  BannerAd,
  AppOpenAd,
  TestIds,
  BannerAdSize,
} from 'react-native-google-mobile-ads';

export default function GoogleAd() {
  // AppOpenAd.createForAdRequest(TestIds.APP_OPEN);
  mobileAds()
    .setRequestConfiguration({
      // Update all future requests suitable for parental guidance
      maxAdContentRating: MaxAdContentRating.PG,

      // Indicates that you want your content treated as child-directed for purposes of COPPA.
      tagForChildDirectedTreatment: true,

      // Indicates that you want the ad request to be handled in a
      // manner suitable for users under the age of consent.
      tagForUnderAgeOfConsent: true,

      // An array of test device IDs to allow.
      testDeviceIdentifiers: ['EMULATOR'],
    })
    .then(() => {
      // Request config successfully set!
    });
  mobileAds()
    .initialize()
    .then(adapterStatuses => {
      // Initialization complete!
    });
  const adUnitId = __DEV__
    ? TestIds.APP_OPEN
    : 'ca-app-pub-3940256099942544/6300978111';
  return (
    <View>
      {/* <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.BANNER}
          // requestOptions={{
            //   requestNonPersonalizedAdsOnly: true,
            // }}
          /> */}
      <BannerAd unitId={TestIds.BANNER} size={BannerAdSize.FULL_BANNER} />
    </View>
  );
}
