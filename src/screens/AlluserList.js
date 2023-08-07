import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {HeaderBar, HeaderBarDiff, Photos, ProfilePic} from '../components';
import {image} from '../helpers/ImageHelper';
import {fs, hp, wp} from '../helpers/GlobalFunction';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {presets} from '../../babel.config';

const AlluserList = () => {
  const [userName, setUserName] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [allUserData, setAllUserData] = useState();
  const [userID, setUserID] = useState();
  const [count, setCount] = useState(null);
  const [followuid, setFollowuid] = useState('');
  const [following, setFollowing] = useState(false);
  const [perticularIndex,setPerticularIndex] = useState(null)


  //   const update=(items)=>{
  //     // console.log("1111111",items);
  //   allUserData.map((item)=>{
  //     console.log("fadeqdfeqwffafa",item._data.uid);
  //     const a=items==item._data.uid
  //     // console.log("555555",a);
  //     if(a){
  //       setFollowing(true)
  //     }

  //   })
  // }

  useEffect(() => {
    name();
  }, []);

  const name = async () => {
    const users = await firestore().collection('User_Details').get();
    console.log('====================================');
    console.log('=-=-=--=-=-=-', users?.docs);
    setAllUserData(users?.docs);
    console.log('====================================');
    const uid = await AsyncStorage.getItem('UID');
    const user = await firestore()
      .collection('User_Details')
      .doc(`${uid}`)
      .get();
    console.log('UID---->', user);
    setUserName(user._data.userName);
    setOriginalName(user._data.name);
    setUserID(user._data.uid);
  };

  return (
    <LinearGradient
      colors={['#FAF0FA', '#EFFAF4', '#EDF6FF']}
      style={styles.linearGradient}>
      <SafeAreaView>
        <View>
          <HeaderBarDiff name={'Suggested people'} />
        </View>
        <View style={styles.profilePicViewStyle1}>
          <ProfilePic imageStyle={styles.imageStyle1} />
          <View style={{marginBottom: hp(1.5)}}>
            <Text style={styles.fontStyle}>{userName}</Text>
            <Text style={styles.fontStyle1}>{originalName}</Text>
          </View>
        </View>
        <FlatList
          data={allUserData}
          renderItem={({item, index}) => {
           
            if (item?._data?.uid != userID) {
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
                        {item?._data?.userName}
                      </Text>
                      <Text style={styles.followingFontStyle1}>
                        {item?._data?.name}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                  
                    onPress={
                      async () => {
                        console.log('====================================');
                        console.log(item);
                        console.log('====================================');
                      // setPerticularIndex(index)
                      // console.log(
                      //   '====================================',
                      //   index,
                      // );
                      // console.log(
                      //   '=====-=-=-===-=-=-=-=-=-=-=>>>>>>>>',
                      //   item._data.uid,
                      // );
                      // if( index == perticularIndex){
                      //   setAllUserData([...allUserData,])
                      // }

                      // if (following) {
                      //   // setCount(count - 1);

                      //   setFollowing(false);
                      //   // await firestore()
                      //   //   .collection('User_Details')
                      //   //   .doc(`${item._data.uid}`)
                      //   //   .update({
                      //   //     followers: count,
                      //   //   });
                      // } else {
                      //   // setCount(count + 1);

                      //   setFollowing(true);
                      //   // await firestore()
                      //   //   .collection('User_Details')
                      //   //   .doc(`${item._data.uid}`)
                      //   //   .update({
                      //   //     followers: count,
                      //   //   });
                      // }
                    }}
                    
                    style={
                    //  index == perticularIndex
                    item?._data?.Fuid
                     ? styles.followbuttonStyle1
                        : styles.followbuttonStyle
                    }>
                    {index == perticularIndex ? (
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
          keyExtractor={item => item._data.uid}
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
  followbuttonStyle1: {
    height: hp(3.5),
    width: wp(22),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(4),
    borderWidth: 1,
    marginRight: wp(5.3),
    backgroundColor:"red"
  },
  followButtonFontStyle1: {
    fontWeight: 'bold',
  },
});
