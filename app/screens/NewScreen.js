import React, {Component} from 'react';
import {Alert} from 'react-native';
import NotifService from './NotifService';
import Sms from './Sms';

export default class NewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.notif = new NotifService(
      this.onRegister.bind(this),
      this.onNotif.bind(this),
    );
  }

  pushNotif = () => {
    this.notif.localNotif();
  };

  onRegister(token) {
    this.setState({registerToken: token.token, fcmRegistered: true});
  }

  onNotif(notif) {
    Alert.alert(notif.title, notif.message);
  }

  handlePerm(perms) {
    Alert.alert('Permissions', JSON.stringify(perms));
  }
  render() {
    return (
      <Sms
        pushNotif={this.pushNotif}
        amount={this.props.amount}
        newSms={this.props.setSms}
        date={this.props.date}
        userData={this.props.userData}></Sms>
    );
  }
}
