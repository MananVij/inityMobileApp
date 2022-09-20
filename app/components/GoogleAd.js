import {View, Text} from 'react-native';
import React from 'react';
import mobileAds, {
  MaxAdContentRating,
  BannerAd,
  AppOpenAd,
  TestIds,
  BannerAdSize,
} from 'react-native-google-mobile-ads';
import { adUnitId } from '../../config/keys';

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

  return (
    <BannerAd unitId={adUnitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
  );
}
