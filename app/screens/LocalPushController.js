import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
class AppStore {
  constructor () {

    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log("TOKEN:", token);
      },
      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
    
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
    
      popInitialNotification: true,
      requestPermissions: true,
    });
  }
  testPush = () => {
    PushNotification.localNotification({
      message: "hello",
      title: 'tellj'
    })
  }
}


export const LocalNotification = () => {
  
  PushNotification.localNotification({
    // autoCancel: true,
    bigText:
      'This is local notification demo in React Native app. Only shown, when expanded.',
    subText: 'Local Notification Demo',
    title: 'Local Notification Title',
    message: 'Expand me to see more',
    vibrate: true,
    vibration: 300,
    playSound: true,
    soundName: 'default',
    actions: '["Yes", "No"]',
    channelId: 1234,
  });
};
