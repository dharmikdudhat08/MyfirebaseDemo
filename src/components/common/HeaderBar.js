import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {icon} from '../../helpers/ImageHelper';
import {fs, hp, wp} from '../../helpers/GlobalFunction';
import {DrawerActions, useNavigation} from '@react-navigation/native';

const HeaderBar = ({name, headerFontStyle, onPress}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.headerStyle}>
      <TouchableOpacity style={styles.drawerIconStyle} onPress={onPress}>
        <Image
          source={icon.drawer}
          resizeMode="contain"
          style={styles.imageStyle}
        />
      </TouchableOpacity>
      <Text style={headerFontStyle}>{name}</Text>
    </View>
  );
};

export default HeaderBar;

const styles = StyleSheet.create({
  drawerIconStyle: {
    width: hp(5.54),
    height: hp(5.54),
    backgroundColor: '#fff1e6',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: wp(5.3),
    shadowColor: '#d3d3d3',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 2,
    shadowRadius: 5,
  },
  headerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(1.2),
  },
  imageStyle: {
    height: hp(2.4),
    width: hp(2.4),
  },
});
