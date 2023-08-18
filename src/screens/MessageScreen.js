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

const MessageScreen = ({navigation}) => {
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState([]);
  const [userId, setUserId] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    const uid = auth().currentUser.uid;
    setUserId(uid);
    firestore()
      .collection('User_Details')
      .doc(uid)
      .get()
      .then(res => {
        let tempData = [];
        for (let x in res._data.following) {
          firestore()
            .collection('User_Details')
            .doc(res._data.following[x])
            .get()
            .then(user => {
              tempData.push({
                userName: user._data.userName,
                profilePic: user._data.profilePic,
                uid: user._data.uid,
              });
            });
        }
        setUserData(tempData);
      });
  }, []);
  const onChat = (userName, profilePic, uid) => {
    dispatch({
      type: 'CHAT_USER_NAME',
      payload: userName,
    });
    dispatch({
      type: 'PROFILEPIC',
      payload: profilePic,
    });
    dispatch({
      type: 'CHAT_USER_UID',
      payload: uid,
    });
    navigation.navigate('Chat');
  };

  return (
    <LinearGradient
      colors={['#FAF0FA', '#EFFAF4', '#EDF6FF']}
      style={styles.linearGradient}>
      <SafeAreaView>
        <HeaderBarDiff name={'Messages'} />
        <View style={{marginTop: hp(3.4)}}>
          <FlatList
            data={userData}
            renderItem={({item}) => {
              // console.log(item.profilePic)
              return (
                <View style={styles.flatListViewStyle}>
                  <TouchableOpacity
                    onPress={() =>
                      onChat(item.userName, item.profilePic, item.uid)
                    }
                    style={{
                      flexDirection: 'row',
                      width: '90%',
                      marginVertical: 10,
                    }}>
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
  ProfileStyle: {
    height: hp(5.14),
    width: hp(5.14),
    borderRadius: 100,
  },
  ProfileStyle1: {
    height: hp(3.8),
    width: hp(3.8),
    borderRadius: 100,
    marginTop: 8,
  },
  nameTextStyle: {
    fontWeight: 'bold',
    fontSize: fs(17, 812),
    marginHorizontal: 15,
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
