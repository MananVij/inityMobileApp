import {View, TextInput} from 'react-native';
import React, {useState} from 'react';
import colors from '../config/colors';

export default function TextInputModified(
  placeholderValue,
  passwordValue,
  editableValue,
  state,
  setState,
) {
  const [focused, setFocused] = useState(false);
  return (
    <View>
      <TextInput
        secureTextEntry={passwordValue}
        editable={editableValue}
        style={{
          flex: 1,
          height: 48,
          width: '100%',
          borderColor: focused ? colors.logoColor : 'black',
          paddingLeft: 10,
          borderWidth: focused ? 2 : 0.6,
          borderRadius: 3,
          marginBottom: '2%',
          backgroundColor: 'white',
          color: 'black',
          fontSize: 16
        }}
        placeholder={placeholderValue}
        value={state}
        onBlur={() => setFocused(false)}
        onFocus={() => setFocused(true)}
        onChangeText={state => {
          setState(state);
        }}
        placeholderTextColor={'black'}></TextInput>
    </View>
  );
}
