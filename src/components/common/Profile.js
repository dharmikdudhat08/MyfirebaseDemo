import {StyleSheet, Text, View} from 'react-native';
import React, { useEffect, useState } from 'react';
import ProfilePic from './ProfilePic';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { fs, hp, wp } from '../../helpers/GlobalFunction';

const Profile = ({profilePicViewStyle,userNameFontStyle,nameFontStyle,profileImageStyle}) => {
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [uidValue, setUidValue] = useState('');
  useEffect(() => {
    getUid();
  });

  const getUid = async () => {
    const userId = await AsyncStorage.getItem('UID');
    // console.log('uid=======>>>>', userId);
    setUidValue(userId);

    // console.log(userId, 'hellohellohello');
    await firestore()
      .collection('User_Details')
      .doc(userId)
      .get()
      .then(res => {
        // console.log('====================================');
        // console.log(res);
        // console.log('====================================');
        // console.log(res._data.name);
        // console.log(res._data.userName);
        setName(res._data.name);
        setUserName(res._data.userName);
        setPhoneNo(res._data.phoneNo);
      });
  };
  return (
    <View style={profilePicViewStyle}>
      <ProfilePic imageStyle={profileImageStyle} />
      <View style={{marginBottom: hp(1.5)}}>
        <Text style={userNameFontStyle}>{userName}</Text>
        <Text style={nameFontStyle}>{name}</Text>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
    
});
