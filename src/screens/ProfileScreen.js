import {
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {All, HeaderBar, Photos, ProfilePic, Videos} from '../components';
import {icon, image} from '../helpers/ImageHelper';
import {fs, hp, wp} from '../helpers/GlobalFunction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';

const ProfileScreen = ({navigation}) => {
  useEffect(() => {
    name();
  });
  const [press1, setPress1] = useState(true);
  const [press2, setPress2] = useState(false);
  const [press3, setPress3] = useState(false);
  const [userName, setUserName] = useState('');

  // useEffect(() => {}, [press1, press2, press3]);

  const onPress1 = () => {
    setPress1(true);
    setPress2(false);
    setPress3(false);
    console.log('====================================');
    console.log(press1, 'press1');
    console.log('====================================');
  };
  const onPress2 = () => {
    setPress2(true);
    setPress1(false);
    setPress3(false);
    console.log('====================================');
    console.log(press2, 'press2');
    console.log('====================================');
  };
  const onPress3 = () => {
    setPress3(true);
    setPress2(false);
    setPress1(false);
    console.log('====================================');
    console.log(press3, 'press3');
    console.log('====================================');
  };

  const name = async () => {
    const uid = await AsyncStorage.getItem('UID');
    // console.log('====================================');
    // console.log(uid);
    // console.log('====================================');
    await firestore()
      .collection('User_Details')
      .doc(`${uid}`)
      .get()
      .then(user => {
        // console.log('UID---->', user);
        setUserName(user._data.userName);
      });
  };
  const onLogout = async () => {
    await AsyncStorage.clear().then(() => {
      console.log('logout success');
    });
    navigation.navigate('Login');
  };

  return (
    <LinearGradient
      colors={['#FAF0FA', '#EFFAF4', '#EDF6FF']}
      style={styles.linearGradient}>
      <SafeAreaView>
        <View style={styles.headerStyle}>
          <HeaderBar
            name={'Profile'}
            headerFontStyle={styles.headerFontStyle}
          />
          <TouchableOpacity onPress={onLogout} style={styles.logoutStyle}>
            <Text style={styles.logoutFontStyle}>Logout</Text>
            <Image
              source={icon.logout}
              resizeMode="contain"
              style={styles.imageStyle1}
            />
          </TouchableOpacity>
        </View>
        <View>
          <View style={styles.profileViewStyle}>
            <View style={styles.followerStyle}>
              <Text style={styles.followCountStyle}>46K</Text>
              <Text style={styles.followtextStyle}>Followers</Text>
            </View>
            <ProfilePic imageStyle={styles.imageStyle} />
            <View style={styles.followerStyle}>
              <Text style={styles.followCountStyle}>46</Text>
              <Text style={styles.followtextStyle}>Followings</Text>
            </View>
          </View>
          <View style={styles.userNameStyle}>
            <Text style={styles.nameFontStyle}>{userName}</Text>
          </View>
        </View>
        <View style={styles.buttonViewStyle}>
          <TouchableOpacity
            onPress={() => navigation.navigate('AllUser')}
            style={styles.followButtonstyle}>
            <Text style={styles.followButtonfontStyle}>Follow more</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Edit')}
            style={styles.editButtonStyle}>
            <Text>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.postButtonStyle}>
          <View>
            <TouchableOpacity
              onPress={() => {
                setPress1(true);
                setPress2(false), setPress3(false);
                console.log('press1', press1);
              }}>
              <Text
                style={
                  press1 === true
                    ? styles.gallaryfontStyle1
                    : styles.gallaryfontStyle
                }>
                All
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={onPress2}>
              <Text
                style={
                  press2 == true
                    ? styles.gallaryfontStyle1
                    : styles.gallaryfontStyle
                }>
                Photo
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={onPress3}>
              <Text
                style={
                  press3 == true
                    ? styles.gallaryfontStyle1
                    : styles.gallaryfontStyle
                }>
                Video
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {press1 ? (
          <View style={styles.photosStyle}>
            <All />
          </View>
        ) : press2 ? (
          <View style={styles.photosStyle}>
            <Photos />
          </View>
        ) : (
          <View style={styles.photosStyle}>
            <Videos />
          </View>
        )}

        {/* {press1? (
          <View style={styles.photosStyle}>
            <All />
          </View> ? (
            press2
          ) : (
            <View style={styles.photosStyle}>
              <Photos />
            </View>
          )
        ) : (
          <View style={styles.photosStyle}>
            <Videos />
          </View>
        )} */}
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  gallaryfontStyle: {
    fontSize: fs(20, 812),
    color: 'grey',
    fontWeight: 'bold',
  },
  gallaryfontStyle1: {
    fontSize: fs(20, 812),
    fontWeight: 'bold',
    color: '#A975FF',
  },
  nameFontStyle: {
    fontSize: fs(20, 812),
    fontWeight: 'bold',
  },
  imageStyle: {
    height: hp(10.31),
    width: hp(10.31),
    alignSelf: 'stretch',
    borderRadius: 100,
    // marginVertical: hp(12.31),
  },
  imageStyle1: {
    height: 20,
    width: 20,
  },
  logoutStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    left: wp(61.33),
    marginTop: 10,
  },
  logoutFontStyle: {
    fontSize: fs(20, 812),
    fontWeight: 'bold',
  },
  headerStyle: {
    flexDirection: 'row',
  },
  headerFontStyle: {
    fontSize: fs(22, 812),
    fontWeight: 'bold',
    left: 160,
  },
  profileViewStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(13),
    marginTop: hp(6),
  },
  followerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
  },
  followCountStyle: {
    fontSize: fs(17, 812),
    fontWeight: 'bold',
  },
  followtextStyle: {
    fontSize: fs(17, 812),
    color: 'grey',
  },
  userNameStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(0.9),
  },
  buttonViewStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(3),
  },
  followButtonstyle: {
    height: 40,
    width: '40%',
    backgroundColor: '#A975FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginHorizontal: 15,
  },
  followButtonfontStyle: {
    color: 'white',
    fontSize: fs(17, 812),
    fontWeight: 'bold',
  },
  editButtonStyle: {
    height: 40,
    width: '40%',
    borderColor: '#A975FF',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginHorizontal: 15,
  },
  postButtonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: hp(4),
  },
  photosStyle: {
    marginTop: hp(3),
  },
});
