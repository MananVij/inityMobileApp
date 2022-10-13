import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
  ToastAndroid,
  TouchableOpacity,
  NativeModules,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {Button, Card, Title} from 'react-native-paper';
import colors from '../config/colors';
import {chooseGender} from '../../API/firebaseMethods';
import {useRoute} from '@react-navigation/native';
import {base64} from '@firebase/util';
import {storeAvatar, storeDataLocally} from '../functions/localStorage';
const RNFetchBlob = NativeModules.RNFetchBlob;
const {config, fs} = RNFetchBlob;

export default function SelectProfile({navigation}) {
  const route = useRoute();
  const [genderIndex, setGenderIndex] = useState(-1);
  const {height, width} = useWindowDimensions();
  const [gender, setGender] = useState('');
  const [avatarIndex, setAvatarIndex] = useState();
  const [avatarLink, setAvatarLink] = useState('');
  const [loading, setLoading] = useState(false)
  
  const submitButton = () => {
    return (
      <Button
        mode="contained"
        loading={loading}
        onPress={async () => {
          setLoading(true)
          if (gender && avatarIndex != undefined) {
            const response = await chooseGender(
              route?.params.userData[0],
              gender,
              avatarIndex,
              avatarLink,
            );
            if (response) {
              navigation.replace('HomeScreen', {
                userData: route?.params.userData,
              });
            } else {
              ToastAndroid.show('Some Error Occured', ToastAndroid.SHORT);
            }
          } else {
            Alert.alert('Please Choose Avatar');
          }
          setLoading(false)
        }}
        style={{
          marginHorizontal: '8%',
          borderRadius: 13,
          marginBottom: '3%',
          backgroundColor: colors.logoColor,
          color: 'white',
        }}>
        Submit
      </Button>
    );
  };

  const genderCard = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <Card
            onPress={() => {
              setGenderIndex(0);
              setAvatarIndex();
              setGender('M');
            }}
            style={{
              borderRadius: 15,
              width: width * 0.4,
              height: height * 0.27,
              backgroundColor: genderIndex == 0 ? '#C5EBFC' : 'white',
            }}>
            <View
              style={{
                alignItems: 'center',
                marginVertical: '5%',
                justifyContent: 'center',
              }}>
              <Image
                source={{
                  uri: 'https://firebasestorage.googleapis.com/v0/b/inity-ac018.appspot.com/o/avatars%2Fmen%2F0.png?alt=media&token=7c8cd154-5794-45ce-ab1b-c1e66705c0ba',
                }}
                resizeMode={'contain'}
                style={{height: height * 0.17, width: width * 0.5}}
              />
              <Text
                style={{paddingTop: '10%', fontWeight: '600', fontSize: 16}}>
                He/Him̦
              </Text>
            </View>
          </Card>
          <Card
            style={{
              borderRadius: 15,
              width: width * 0.4,
              height: height * 0.27,
              backgroundColor: genderIndex == 1 ? '#FEBDB8' : 'white',
            }}
            onPress={() => {
              setGenderIndex(1);
              setAvatarIndex();
              setGender('F');
            }}>
            <View
              style={{
                alignItems: 'center',
                marginVertical: '5%',
                justifyContent: 'center',
              }}>
              <Image
                source={{
                  uri: 'https://firebasestorage.googleapis.com/v0/b/inity-ac018.appspot.com/o/avatars%2Fwomen%2F6.png?alt=media&token=522e825e-91f1-47aa-a41f-0974827f5a64',
                }}
                resizeMode={'contain'}
                style={{height: height * 0.17, width: width * 0.5}}
              />
              <Text
                style={{paddingTop: '10%', fontWeight: '600', fontSize: 16}}>
                She/Her
              </Text>
            </View>
          </Card>
        </View>
      </View>
    );
  };

  const avatarCard = () => {
    return (
      <>
        {genderIndex == -1 ? (
          <></>
        ) : genderIndex == 0 ? (
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  marginBottom: '5%',
                }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setAvatarIndex(0);
                    setAvatarLink(
                      'https://firebasestorage.googleapis.com/v0/b/inity-ac018.appspot.com/o/avatars%2Fmen%2F1.png?alt=media&token=ce37820d-bce6-4e86-ae9b-321260a313c1',
                    );
                  }}>
                  <Image
                    source={{
                      uri: 'https://firebasestorage.googleapis.com/v0/b/inity-ac018.appspot.com/o/avatars%2Fmen%2F1.png?alt=media&token=ce37820d-bce6-4e86-ae9b-321260a313c1',
                    }}
                    resizeMode={'cover'}
                    style={{
                      height: height * 0.18,
                      width: width * 0.3,
                      borderColor: colors.green,
                      borderWidth: avatarIndex == 0 ? 3 : 0,
                      borderRadius: 22,
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setAvatarIndex(1);
                    setAvatarLink(
                      'https://firebasestorage.googleapis.com/v0/b/inity-ac018.appspot.com/o/avatars%2Fmen%2F2.png?alt=media&token=98c6c545-a97e-4f95-bec8-f27e0f131b92',
                    );
                  }}>
                  <Image
                    source={{
                      uri: 'https://firebasestorage.googleapis.com/v0/b/inity-ac018.appspot.com/o/avatars%2Fmen%2F2.png?alt=media&token=98c6c545-a97e-4f95-bec8-f27e0f131b92',
                    }}
                    resizeMode={'cover'}
                    style={{
                      height: height * 0.18,
                      width: width * 0.3,
                      borderColor: colors.green,
                      borderWidth: avatarIndex == 1 ? 3 : 0,
                      borderRadius: 22,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  marginBottom: '5%',
                }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setAvatarIndex(2);
                    setAvatarLink(
                      'https://firebasestorage.googleapis.com/v0/b/inity-ac018.appspot.com/o/avatars%2Fmen%2F3.png?alt=media&token=7d461a5e-f830-4e3c-bbbc-baba65e94474',
                    );
                  }}>
                  <Image
                    source={{
                      uri: 'https://firebasestorage.googleapis.com/v0/b/inity-ac018.appspot.com/o/avatars%2Fmen%2F3.png?alt=media&token=7d461a5e-f830-4e3c-bbbc-baba65e94474',
                    }}
                    resizeMode={'cover'}
                    style={{
                      height: height * 0.18,
                      width: width * 0.3,
                      borderColor: colors.green,
                      borderWidth: avatarIndex == 2 ? 3 : 0,
                      borderRadius: 22,
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setAvatarIndex(3);
                    setAvatarLink(
                      'https://firebasestorage.googleapis.com/v0/b/inity-ac018.appspot.com/o/avatars%2Fmen%2F5.png?alt=media&token=69ac39ab-2cdc-4194-890a-bfd2fcaf919d',
                    );
                  }}>
                  <Image
                    source={{
                      uri: 'https://firebasestorage.googleapis.com/v0/b/inity-ac018.appspot.com/o/avatars%2Fmen%2F5.png?alt=media&token=69ac39ab-2cdc-4194-890a-bfd2fcaf919d',
                    }}
                    resizeMode={'cover'}
                    style={{
                      height: height * 0.18,
                      width: width * 0.3,
                      borderColor: colors.green,
                      borderWidth: avatarIndex == 3 ? 3 : 0,
                      borderRadius: 22,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  marginBottom: '5%',
                }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setAvatarIndex(4);
                    setAvatarLink(
                      'https://firebasestorage.googleapis.com/v0/b/inity-ac018.appspot.com/o/avatars%2Fmen%2F6.png?alt=media&token=b62ec9d5-d06a-42b2-a072-d2344b4cd18c',
                    );
                  }}>
                  <Image
                    source={{
                      uri: 'https://firebasestorage.googleapis.com/v0/b/inity-ac018.appspot.com/o/avatars%2Fmen%2F6.png?alt=media&token=b62ec9d5-d06a-42b2-a072-d2344b4cd18c',
                    }}
                    resizeMode={'cover'}
                    style={{
                      height: height * 0.18,
                      width: width * 0.3,
                      borderColor: colors.green,
                      borderWidth: avatarIndex == 4 ? 3 : 0,
                      borderRadius: 22,
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setAvatarLink(
                      'https://firebasestorage.googleapis.com/v0/b/inity-ac018.appspot.com/o/avatars%2Fmen%2F7.png?alt=media&token=a0497e73-0b7f-4e6f-9b60-9b1e56884544',
                    );
                    setAvatarIndex(5);
                  }}>
                  <Image
                    source={{
                      uri: 'https://firebasestorage.googleapis.com/v0/b/inity-ac018.appspot.com/o/avatars%2Fmen%2F7.png?alt=media&token=a0497e73-0b7f-4e6f-9b60-9b1e56884544',
                    }}
                    resizeMode={'cover'}
                    style={{
                      height: height * 0.18,
                      width: width * 0.3,
                      borderColor: colors.green,
                      borderWidth: avatarIndex == 5 ? 3 : 0,
                      borderRadius: 22,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {submitButton()}
          </ScrollView>
        ) : (
          <>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginBottom: '5%',
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      setAvatarIndex(6);
                      setAvatarLink(
                        'https://firebasestorage.googleapis.com/v0/b/inity-ac018.appspot.com/o/avatars%2Fwomen%2F1.png?alt=media&token=5986a7da-5474-4d9b-b8c6-e80cefa05d15',
                      );
                    }}>
                    <Image
                      source={{
                        uri: 'https://firebasestorage.googleapis.com/v0/b/inity-ac018.appspot.com/o/avatars%2Fwomen%2F1.png?alt=media&token=5986a7da-5474-4d9b-b8c6-e80cefa05d15',
                      }}
                      resizeMode={'cover'}
                      style={{
                        height: height * 0.18,
                        width: width * 0.3,
                        borderColor: colors.green,
                        borderWidth: avatarIndex == 6 ? 3 : 0,
                        borderRadius: 22,
                      }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      setAvatarIndex(7);
                      setAvatarLink(
                        'https://firebasestorage.googleapis.com/v0/b/inity-ac018.appspot.com/o/avatars%2Fwomen%2F2.png?alt=media&token=638469fc-8f9b-4d43-ba73-ebe04b932619',
                      );
                    }}>
                    <Image
                      source={{
                        uri: 'https://firebasestorage.googleapis.com/v0/b/inity-ac018.appspot.com/o/avatars%2Fwomen%2F2.png?alt=media&token=638469fc-8f9b-4d43-ba73-ebe04b932619',
                      }}
                      resizeMode={'cover'}
                      style={{
                        height: height * 0.18,
                        width: width * 0.3,
                        borderColor: colors.green,
                        borderWidth: avatarIndex == 7 ? 3 : 0,
                        borderRadius: 22,
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginBottom: '5%',
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      setAvatarIndex(8);
                      setAvatarLink(
                        'https://firebasestorage.googleapis.com/v0/b/inity-ac018.appspot.com/o/avatars%2Fwomen%2F3.png?alt=media&token=dbd1c830-1b2d-4ae7-b34a-3e63884ec98e',
                      );
                    }}>
                    <Image
                      source={{
                        uri: 'https://firebasestorage.googleapis.com/v0/b/inity-ac018.appspot.com/o/avatars%2Fwomen%2F3.png?alt=media&token=dbd1c830-1b2d-4ae7-b34a-3e63884ec98e',
                      }}
                      resizeMode={'cover'}
                      style={{
                        height: height * 0.18,
                        width: width * 0.3,
                        borderColor: colors.green,
                        borderWidth: avatarIndex == 8 ? 3 : 0,
                        borderRadius: 22,
                      }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      setAvatarIndex(9);
                      setAvatarLink(
                        'https://firebasestorage.googleapis.com/v0/b/inity-ac018.appspot.com/o/avatars%2Fwomen%2F8.png?alt=media&token=6860a4c7-8e56-4de3-a61c-7ee5fbdad5ba',
                      );
                    }}>
                    <Image
                      source={{
                        uri: 'https://firebasestorage.googleapis.com/v0/b/inity-ac018.appspot.com/o/avatars%2Fwomen%2F8.png?alt=media&token=6860a4c7-8e56-4de3-a61c-7ee5fbdad5ba',
                      }}
                      resizeMode={'cover'}
                      style={{
                        height: height * 0.18,
                        width: width * 0.3,
                        borderColor: colors.green,
                        borderWidth: avatarIndex == 9 ? 3 : 0,
                        borderRadius: 22,
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginBottom: '5%',
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      setAvatarIndex(10);
                      setAvatarLink(
                        'https://firebasestorage.googleapis.com/v0/b/inity-ac018.appspot.com/o/avatars%2Fwomen%2F0.png?alt=media&token=d545525a-60a6-4482-b81e-1d23acc55a63',
                      );
                    }}>
                    <Image
                      source={{
                        uri: 'https://firebasestorage.googleapis.com/v0/b/inity-ac018.appspot.com/o/avatars%2Fwomen%2F0.png?alt=media&token=d545525a-60a6-4482-b81e-1d23acc55a63',
                      }}
                      resizeMode={'cover'}
                      style={{
                        height: height * 0.18,
                        width: width * 0.3,
                        borderColor: colors.green,
                        borderWidth: avatarIndex == 10 ? 3 : 0,
                        borderRadius: 22,
                      }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      setAvatarLink(
                        'https://firebasestorage.googleapis.com/v0/b/inity-ac018.appspot.com/o/avatars%2Fwomen%2F4.png?alt=media&token=14192350-585a-491f-ac34-d41dee79d902',
                      );
                      setAvatarIndex(11);
                    }}>
                    <Image
                      source={{
                        uri: 'https://firebasestorage.googleapis.com/v0/b/inity-ac018.appspot.com/o/avatars%2Fwomen%2F4.png?alt=media&token=14192350-585a-491f-ac34-d41dee79d902',
                      }}
                      resizeMode={'cover'}
                      style={{
                        height: height * 0.18,
                        width: width * 0.3,
                        borderColor: colors.green,
                        borderWidth: avatarIndex == 2 ? 3 : 0,
                        borderRadius: 22,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {submitButton()}
            </ScrollView>
          </>
        )}
      </>
    );
  };
  return (
    <SafeAreaView style={{paddingHorizontal: '5%', flex: 1}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text
          style={{
            fontSize: 25,
            fontWeight: '700',
            marginTop: '8%',
            marginLeft: '2%',
            marginBottom: '5%',
          }}>
          Choose Your Gender
        </Text>
        {genderCard()}
        <Text
          style={{
            fontSize: 19,
            fontWeight: '500',
            marginVertical: '5%',
            marginLeft: '2%',
          }}>
          {genderIndex != -1 ? 'Choose Avatar' : ''}
        </Text>
        {avatarCard()}
      </ScrollView>
    </SafeAreaView>
  );
}
