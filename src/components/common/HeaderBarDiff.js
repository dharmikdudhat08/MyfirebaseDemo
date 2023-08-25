import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {fs, hp, wp} from '../../helpers/GlobalFunction';
import {icon} from '../../helpers/ImageHelper';
import {useNavigation} from '@react-navigation/native';

const HeaderBarDiff = ({name}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.headerStyle}>
      <TouchableOpacity
        style={styles.drawerIconStyle}
        onPress={() => navigation.goBack('')}>
        <Image
          source={icon.back}
          resizeMode="contain"
          style={{height: 15, width: 15}}
        />
      </TouchableOpacity>
      <Text style={styles.headerFontStyle}>{name}</Text>
    </View>
  );
};

export default HeaderBarDiff;

const styles = StyleSheet.create({
  drawerIconStyle: {
    width: hp(4.92),
    height: wp(10.66),
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
    marginTop: hp(1.23),
  },
  headerFontStyle: {
    fontSize: fs(22, 812),
    fontWeight: 'bold',
  },
});
