import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {HeaderBar, Photos, ProfilePic} from '../components';
import {image} from '../helpers/ImageHelper';
import {fs, hp, wp} from '../helpers/GlobalFunction';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LikedScreen = () => {
  const [userName, setUserName] = useState('');
  const [originalName, setOriginalName] = useState('');
  
  const uidValue = useSelector(state => state.idtoken);

  useEffect(() => {
    name();
  });
  const name = async () => {
    const uid = await AsyncStorage.getItem('UID');
    const user = await firestore()
      .collection('User_Details')
      .doc(`${uid}`)
      .get();
    console.log('UID---->', user);
    setUserName(user._data.userName);
    setOriginalName(user._data.name);
  };

  return (
    <LinearGradient
      colors={['#FAF0FA', '#EFFAF4', '#EDF6FF']}
      style={styles.linearGradient}>
      <SafeAreaView>
        <View>
          <HeaderBar
            name={'Saved post'}
            headerFontStyle={styles.headerFontStyle}
          />
        </View>
        <View style={styles.profilePicViewStyle}>
          <ProfilePic imageStyle={styles.imageStyle} />
          <View style={{marginBottom: hp(1.5)}}>
            <Text style={styles.fontStyle}>{userName}</Text>
            <Text style={styles.fontStyle1}>{originalName}</Text>
          </View>
        </View>
       
        
      </SafeAreaView>
    </LinearGradient>
  );
};

export default LikedScreen;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  imageStyle: {
    height: hp(7),
    width: hp(7),
    alignSelf: 'stretch',
    borderRadius: 100,
  },
  profilePicViewStyle: {
    marginTop: hp(4),
    marginHorizontal: wp(4),
    flexDirection: 'row',
    alignItems: 'center',
  },
  fontStyle: {
    fontSize: fs(20, 812),
    marginHorizontal: wp(4),
    marginVertical: hp(0.61),
    // fontWeight:'bold'
  },
  fontStyle1: {
    fontSize: fs(17, 812),
    marginHorizontal: 15,
    color: 'grey',
    // fontWeight:'bold'
  },
  headerFontStyle: {
    fontSize: fs(22, 812),
    fontWeight: 'bold',
    alignSelf: 'center',
  },
 
});
