import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {HeaderBar, HeaderBarDiff, Photos, ProfilePic} from '../components';
import {icon, image} from '../helpers/ImageHelper';
import {fs, hp, wp} from '../helpers/GlobalFunction';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {presets} from '../../babel.config';
import auth from '@react-native-firebase/auth';

const AlluserList = () => {
  const [userName, setUserName] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [allUserData, setAllUserData] = useState();
  const [count, setCount] = useState(null);
  const [followuid, setFollowuid] = useState('');
  const [following, setFollowing] = useState(false);
  const [perticularIndex, setPerticularIndex] = useState(null);
  const [updatedData, setUpdatedData] = useState([]);
  // const []

  useEffect(() => {
    name();
  }, [allUserData,updatedData]);

  const name = async () => {
    const user = await firestore().collection('User_Details').get();
    setAllUserData(user?.docs);
  };

  const onFollow = uId => {
    console.log(uId,"follow")
    const userId = auth().currentUser.uid;
    try {
      firestore()
        .collection('User_Details')
        .doc(uId)
        .get()
        .then(async res => {
          await firestore()
            .collection('User_Details')
            .doc(uId)
            .update({
              followers: [...res._data.followers, userId],
            });
        })
        .then(async () => {
          await firestore()
            .collection('User_Details')
            .doc(userId)
            .get()
            .then(async response => {
              await firestore()
                .collection('User_Details')
                .doc(userId)
                .update({
                  following: [...response._data.following, uId],
                });
            });
        });
    } catch (error) {
      console.log(error);
    }
  };
  const onUnFollow = uId => {
    const userId = auth().currentUser.uid;
    console.log(uId,"UnFollow");
    firestore()
      .collection('User_Details')
      .doc(uId)
      .get()
      .then(async res => {
        const D = await firestore().collection('User_Details').doc(uId).get();
        const filterData = D?._data?.followers?.filter(
          a => a !== auth().currentUser.uid,
        );
        console.log(filterData, '(*)(*)(*)(*)(*)(*)(*)');
        await firestore().collection('User_Details').doc(uId).update({
          followers: filterData,
        });
      })
      .then(async () => {
        await firestore()
          .collection('User_Details')
          .doc(userId)
          .get()
          .then(async response => {
            const filteredData = response._data.following.filter(
              a => a !== uId,
            );
            await firestore().collection('User_Details').doc(userId).update({
              following: filteredData,
            });
          });
      });
  };
  const handleSearch = text => {
    const formattedQuery = text.toLowerCase();
    // console.log(allUserData, '$$$$$$$%$%$%$%$%$%$%');
    let tempData = [];
    for (let x in allUserData) {
      tempData.push({
        profilePic: allUserData[x]._data.profilePic,
        userName: allUserData[x]._data.userName,
        name: allUserData[x]._data.name,
        uid: allUserData[x]._data.uid,
        following: allUserData[x]._data.following,
        followers: allUserData[x]._data.followers,
      });
    }
    const filteredData = tempData.filter(item =>
      item.userName.includes(formattedQuery),
    );
    console.log(filteredData);
    setUpdatedData(filteredData);
  };
  return (
    <LinearGradient
      colors={['#FAF0FA', '#EFFAF4', '#EDF6FF']}
      style={styles.linearGradient}>
      <SafeAreaView>
        <View>
          <HeaderBarDiff name={'Suggested people'} />
        </View>
        <View style={styles.inputStyle}>
          <Image
            source={icon.search}
            style={{height: 30, width: 30, tintColor: 'grey'}}
            resizeMode="contain"
          />
          <TextInput
            placeholder="Search"
            autoCapitalize="none"
            autoCorrect={false}
            fontSize={fs(20, 812)}
            placeholderTextColor={'#D3D3D3'}
            style={{marginHorizontal: 10, width: '70%'}}
            onChangeText={txt => handleSearch(txt)}
          />
        </View>
        <FlatList
          data={updatedData  ? updatedData : allUserData}
          renderItem={({item, index}) => {
            if (
              updatedData
                ? item?.uid != auth().currentUser.uid
                : item?._data?.uid != auth().currentUser.uid
            ) {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View style={styles.profilePicViewStyle}>
                    <ProfilePic imageStyle={styles.imageStyle} />
                    <View style={{marginBottom: hp(1.5)}}>
                      <Text style={styles.followingFontStyle}>
                        {updatedData ? item.userName : item?._data?.userName}
                      </Text>
                      <Text style={styles.followingFontStyle1}>
                        {updatedData ? item.name : item?._data?.name}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      updatedData
                        ? item?.followers.some(
                            a => a === auth().currentUser.uid,
                          ) === true
                          ? onUnFollow(item?.uid)
                          : onFollow(item?.uid)
                        : item?._data?.followers.some(
                            a => a === auth().currentUser.uid,
                          ) === true
                        ? onUnFollow(item?._data.uid)
                        : onFollow(item?._data.uid);
                    }}
                    style={
                      updatedData
                        ? item?.followers.some(
                            a => a === auth().currentUser.uid,
                          ) === true
                          ? styles.followbuttonStyle1
                          : styles.followbuttonStyle
                        : item?._data?.followers.some(
                            a => a === auth().currentUser.uid,
                          ) === true
                        ? styles.followbuttonStyle1
                        : styles.followbuttonStyle
                    }>
                    {updatedData ? (
                      item?.followers.some(
                        a => a === auth().currentUser.uid,
                      ) === true ? (
                        <Text style={styles.followButtonFontStyle1}>
                          Following
                        </Text>
                      ) : (
                        <Text style={styles.followButtonFontStyle}>Follow</Text>
                      )
                    ) : item?._data?.followers.some(
                        a => a === auth().currentUser.uid,
                      ) === true ? (
                      <Text style={styles.followButtonFontStyle1}>
                        Following
                      </Text>
                    ) : (
                      <Text style={styles.followButtonFontStyle}>Follow</Text>
                    )}
                  </TouchableOpacity>
                </View>
              );
            } else {
              null;
            }
          }}
          keyExtractor={item => item._data?.uid}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default AlluserList;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  imageStyle: {
    height: hp(5),
    width: hp(5),
    alignSelf: 'stretch',
    borderRadius: 100,
  },
  imageStyle1: {
    height: hp(5),
    width: hp(5),
    alignSelf: 'stretch',
    borderRadius: 100,
  },
  profilePicViewStyle: {
    marginTop: hp(4),
    marginHorizontal: wp(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePicViewStyle1: {
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
  followingFontStyle: {
    fontSize: fs(18, 812),
    marginHorizontal: wp(4),
    marginVertical: hp(0.61),
  },
  followingFontStyle1: {
    fontSize: fs(16, 812),
    marginHorizontal: 15,
    color: 'grey',
  },
  followbuttonStyle: {
    height: hp(3.5),
    width: wp(22),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(4),
    backgroundColor: '#A975FF',
    marginRight: wp(5.3),
  },
  followButtonFontStyle: {
    color: 'white',
    fontWeight: 'bold',
  },
  followButtonFontStyle1: {
    color: 'black',
    fontWeight: 'bold',
  },
  followbuttonStyle1: {
    height: hp(3.5),
    width: wp(22),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(4),
    borderWidth: 1,
    marginRight: wp(5.3),
  },
  followButtonFontStyle1: {
    fontWeight: 'bold',
  },
  inputStyle: {
    height: hp(5.38),
    width: '90%',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    paddingLeft: wp(5),
    marginTop: hp(3),
    flexDirection: 'row',
  },
});
