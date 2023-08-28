import {Image, StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import {icon} from '../../helpers/ImageHelper';
import {fs, hp, wp} from '../../helpers/GlobalFunction';

const TextInputBar = ({source, placeHolder, onChangeText}) => {
  return (
    <View style={styles.inputStyle}>
      <Image
        source={source}
        style={styles.inputIconStyle}
        resizeMode="contain"
      />
      <TextInput
        style={styles.tetxInputStyle}
        placeholder={placeHolder}
        autoCapitalize="none"
        autoCorrect={false}
        fontSize={fs(17, 812)}
        co
        placeholderTextColor={'#D3D3D3'}
        onChangeText={onChangeText}
      />
    </View>
  );
};

export default TextInputBar;

const styles = StyleSheet.create({
  inputStyle: {
    backgroundColor: '#FFFEFE',
    height: hp(7.38),
    width: '93%',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 7,
    alignItems: 'center',
    paddingLeft: wp(5),
    marginVertical: hp(1),
    flexDirection: 'row',
  },
  inputIconStyle: {
    height: hp(3.07),
    width: hp(3.07),
    tintColor: 'grey',
  },
  tetxInputStyle: {
    marginLeft: wp(4),
    color:'black'
  },
});
