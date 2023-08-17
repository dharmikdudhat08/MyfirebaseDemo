import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {HeaderBarDiff} from '../components';
import {icon} from '../helpers/ImageHelper';
import {fs, hp, wp} from '../helpers/GlobalFunction';
import {useSelector} from 'react-redux';
import {GiftedChat} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';

const ChatScreen = () => {
  const userName = useSelector(state => state.chatUserName);
  console.log(userName);
  const ProfilePic = useSelector(state => state.profilePic);
  console.log(ProfilePic);
  const newUid = useSelector(state => state.newUid);
  console.log(newUid, '()((_()()(()()(');
  const chatUserUid = useSelector(state => state.chatUserUid);
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [userIdName, setUserIdName] = useState();
  const [currentUserProfilePic, setCurrentUserProfilePic] = useState();

  useEffect(() => {
    const uid = auth().currentUser.uid;
    firestore()
      .collection('User_Details')
      .doc(uid)
      .get()
      .then(res => {
        // console.log(res)
        setUserIdName(res._data.userName);
        setCurrentUserProfilePic(res._data.ProfilePic);
      });
  }, []);
  const chatSendToFirebase = async () => {
    await firestore()
      .collection('Chat')
      .doc(newUid)
      .set({
        chat: firestore.FieldValue.arrayUnion({
          id: 'helllo',
        }),
      })
      .then(() => {
        console.log('done!');
      });
  };
  //  const chatGetFromFirebase = ()=>{
  //   firestore().collection('Chat').doc(newUid).onSnapshot((chat)=>{
  //     console.log(chat)
  //   })
  //  }
  const onSend = useCallback((chat = []) => {
    global.lastmessage = chat;
    setMessages(previousMessages => GiftedChat.append(previousMessages, chat));
    console.log(messages, 'hello');
    chatSendToFirebase();
  }, []);
  return (
    <LinearGradient
      colors={['#FAF0FA', '#EFFAF4', '#EDF6FF']}
      style={styles.linearGradient}>
      <SafeAreaView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <TouchableOpacity
            onPress={() => navigation.goBack('')}
            style={{
              position: 'absolute',
              marginTop: 9,
              left: 20,
              backgroundColor: 'red',
            }}>
            <Image
              source={icon.back}
              style={{height: 20, width: 20}}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              alignItems: 'center',
              // justifyContent: 'center',
              marginTop: 5,
            }}>
            <Image
              source={ProfilePic ? {uri: ProfilePic} : icon.account}
              style={styles.ProfileStyle}
              resizeMode="stretch"
            />
            <Text style={styles.nameTextStyle}>{userName}</Text>
          </View>
        </View>
        <View style={{height: hp(87), width: '100%', alignSelf: 'center'}}>
          <GiftedChat
            messages={messages}
            showAvatarForEveryMessage={true}
            onSend={messages => onSend(messages)}
            user={{
              _id: auth().currentUser.uid,
              name: userIdName,
              avatar: currentUserProfilePic,
            }}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  ProfileStyle: {
    height: hp(6.14),
    width: hp(6.14),
    borderRadius: 100,
    position: 'absolute',
    right: 290,
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
    marginHorizontal: 120,
    marginBottom: 5,
  },
});
