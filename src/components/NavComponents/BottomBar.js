import React, {useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import {icon} from '../../helpers/ImageHelper';

const BottomBar = ({navigation}) => {
  const [press1, setPress1] = useState(true);
  const [press2, setPress2] = useState(false);
  const [press3, setPress3] = useState(false);
  const [press4, setPress4] = useState(false);
  return (
    <View style={styles.buttonViewStyle}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Home');
        }}>
        <Image source={icon.home} style={styles.bottomButtonStyle} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Liked')}>
        <Image source={icon.save} style={styles.bottomButtonStyle} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Post')}>
        <Image source={icon.add} style={styles.bottomButtonStyle} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Image source={icon.account1} style={styles.bottomButtonStyle} />
      </TouchableOpacity>
    </View>
  );
};

export default BottomBar;

const styles = StyleSheet.create({
  bottomButtonStyle: {
    height: 28,
    width: 28,
    justifyContent: 'center',
  },
  buttonViewStyle: {
    height: '8%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 20,
  },
});
