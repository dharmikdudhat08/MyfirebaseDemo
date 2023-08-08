import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, { useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {image} from '../helpers/ImageHelper';
import {hp} from '../helpers/GlobalFunction';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({navigation}) => {
  useEffect(()=>{
    setTimeout(()=>{
      validateLogin();
    },1000)
  },[])
  const validateLogin=async()=>{
    const value = await AsyncStorage.getItem('UID');
    if(value){
      navigation.replace('Bottom')
    }
    else{
      navigation.replace('Login')
    }
  }
  return (
    <LinearGradient
      colors={['#FAF0FA', '#EFFAF4', '#EDF6FF']}
      style={styles.linearGradient}>
      <SafeAreaView>
        <View>
          <Image
            source={image.instagram}
            style={styles.imageStyle}
            resizeMode="contain"
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    alignItems: 'center',
  },
  imageStyle: {
    height: hp(12.31),
    width: hp(12.31),
    marginVertical: hp(12.31),
    alignSelf: 'center',
  },
});
