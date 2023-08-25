import {
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {HeaderBarDiff} from '../components';
import {GiftedChat} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Modal from 'react-native-modal';
import {fs, hp, wp} from '../helpers/GlobalFunction';
import {icon} from '../helpers/ImageHelper';
import {useDispatch} from 'react-redux';
import { ChatUidDataValue } from '../redux/action/action';

const MessageScreen = ({navigation}) => {
  const [userData, setUserData] = useState([]);
  const [userId, setUserId] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    const uid = auth().currentUser.uid;
    setUserId(uid);
    followerData();
  }, []);
  const followerData = () => {
    firestore()
      .collection('User_Details')
      .onSnapshot(response => {
        console.log(response._docs._data, 'heyheyhye');
        const items = [];
        response.forEach(documentSnapshot => {
          items.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });
        const tempData = [];
        for (let x in items) {
          for (let y in items[x].followers) {
            if (items[x].followers[y] == auth().currentUser.uid) {
              tempData.push({
                profilePic: items[x].profilePic,
                userName: items[x].userName,
                uid: items[x].uid,
              });
            }
          }
        }
        console.log(tempData);
        setUserData(tempData);
      });
  };
  const onChat = (userName, profilePic, uid) => {
    const data ={userName :userName , profilePic : profilePic, uid : uid}
    dispatch(ChatUidDataValue(data))
    navigation.navigate('Chat');
  };

  return (
    <LinearGradient
      colors={['#FAF0FA', '#EFFAF4', '#EDF6FF']}
      style={styles.linearGradient}>
      <SafeAreaView>
        <HeaderBarDiff name={'Messages'} />
        <View style={styles.flatlistStyle}>
          <FlatList
            data={userData}
            renderItem={({item, index}) => {
              return (
                <View style={styles.flatListViewStyle}>
                  <TouchableOpacity
                    onPress={() =>
                      onChat(item.userName, item.profilePic, item.uid)
                    }
                    style={styles.profileViewStyle}>
                    <Image
                      source={
                        item.profilePic ? {uri: item.profilePic} : icon.account
                      }
                      style={styles.ProfileStyle}
                      resizeMode="stretch"
                    />
                    <Text style={styles.nameTextStyle}>{item.userName}</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
            keyExtractor={item => item.uid}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  flatlistStyle:{
    marginTop: hp(3.4)
  },
  profileViewStyle:{
    flexDirection: 'row',
    width: '90%',
    marginVertical: hp(1.2),
  },
  ProfileStyle: {
    height: hp(5.14),
    width: hp(5.14),
    borderRadius: 100,
  },
  ProfileStyle1: {
    height: hp(3.8),
    width: hp(3.8),
    borderRadius: 100,
    marginTop: hp(0.98),
  },
  nameTextStyle: {
    fontWeight: 'bold',
    fontSize: fs(17, 812),
    marginHorizontal: wp(4),
  },
  flatListViewStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: hp(1.4),
    borderBottomWidth: 0.5,
    borderColor: 'grey',
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
  },
});
