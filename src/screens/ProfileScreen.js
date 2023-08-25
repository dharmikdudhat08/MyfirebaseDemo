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
import auth from '@react-native-firebase/auth';

const ProfileScreen = ({navigation}) => {
  useEffect(() => {
    name();
  }),
    [];

  const [press1, setPress1] = useState(true);
  const [press2, setPress2] = useState(false);
  const [press3, setPress3] = useState(false);
  const [userName, setUserName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [followersCount, setFollowersCount] = useState();
  const [followingCount, setFollowingCount] = useState();
  const onPress2 = () => {
    setPress2(true);
    setPress1(false);
    setPress3(false);
  };
  const onPress3 = () => {
    setPress3(true);
    setPress2(false);
    setPress1(false);
  };
  const name = async () => {
    const uid = auth().currentUser.uid;
    await firestore()
      .collection('User_Details')
      .doc(`${uid}`)
      .get()
      .then(user => {
        setProfilePic(user._data.profilePic);
        setFollowersCount(user._data.followers.length);
        setFollowingCount(user._data.following.length);
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
            <TouchableOpacity style={styles.followerStyle}>
              <Text style={styles.followCountStyle}>{followersCount}</Text>
              <Text style={styles.followtextStyle}>Followers</Text>
            </TouchableOpacity>
            {!profilePic ? (
              <Image
                source={icon.account}
                style={styles.imageStyle}
                resizeMode="stretch"
              />
            ) : (
              <Image
                source={{uri: profilePic}}
                style={styles.imageStyle}
                resizeMode="stretch"
              />
            )}
            <TouchableOpacity style={styles.followerStyle}>
              <Text style={styles.followCountStyle}>{followingCount}</Text>
              <Text style={styles.followtextStyle}>Followings</Text>
            </TouchableOpacity>
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
  },
  imageStyle1: {
    height: hp(2.4),
    width: hp(2.4),
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
    left: wp(42.6),
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
    marginHorizontal: wp(8),
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
    height: hp(4.9),
    width: '40%',
    backgroundColor: '#A975FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginHorizontal: wp(4),
  },
  followButtonfontStyle: {
    color: 'white',
    fontSize: fs(17, 812),
    fontWeight: 'bold',
  },
  editButtonStyle: {
    height: hp(4.9),
    width: '40%',
    borderColor: '#A975FF',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginHorizontal: wp(4),
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
