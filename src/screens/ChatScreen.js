import {
  FlatList,
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
import {Bubble, GiftedChat, InputToolbar} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';

const ChatScreen = () => {
  const userName = useSelector(state => state.chatUserName);
  // console.log(userName);
  const ProfilePic = useSelector(state => state.profilePic);
  // console.log(ProfilePic);
  const chatUserUid = useSelector(state => state.chatUserUid);
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [userIdName, setUserIdName] = useState();
  const [currentUserProfilePic, setCurrentUserProfilePic] = useState();
  const [newUid, setNewUid] = useState('');
  const [senderUid, setSenderUid] = useState('');

  useEffect(() => {
    const userId = auth().currentUser.uid;
    setSenderUid(senderUid);
    const docId =
      auth().currentUser.uid > chatUserUid
        ? chatUserUid + ' - ' + auth().currentUser.uid
        : auth().currentUser.uid + ' - ' + chatUserUid;
    setNewUid(docId);
    // firestore()
    //   .collection('Chat')
    //   .onSnapshot(user => {
    //     const items = [];
    //     console.log(user?._docs,"!@#$")
    //     if(user == []){
    //       console.log("true")
    //     }
    //     else{
    //       console.log("false")
    //     }
    //     if (user._metadata._metadata[0] == false) {
    //       setNewUid(chatUserUid + '+' + userId);
    //       console.log("always")
    //     } else {
    //       user.forEach(documentSnapshot => {
    //         const data = documentSnapshot.id.split('+');
    //         console.log(data, '8)()()()()(9');
    //         if (data[0] == chatUserUid && data[1] == userId) {
    //           setNewUid(documentSnapshot.id);
    //           console.log("1")
    //         } else if (data[0] == userId && data[1] == chatUserUid) {
    //           setNewUid(userId + '+' + chatUserUid);
    //           console.log("2")
    //         } else {
    //           setNewUid(chatUserUid + '+' + userId);
    //           console.log("false")
    //         }
    //       });
    //     }

    //   });
    // console.log(newUid, 'chat user');
    firestore()
      .collection('User_Details')
      .doc(userId)
      .get()
      .then(res => {
        // console.log(res)
        setUserIdName(res._data.userName);
        setCurrentUserProfilePic(res._data.ProfilePic);
      });
    chatGetFromFirebase();
  }, [newUid]);

  const chatGetFromFirebase = () => {
    const userId = auth().currentUser.uid;

    firestore()
      .collection('Chat')
      .doc(newUid)
      .collection('Messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const data = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
          _id: doc.data()._id,
        }));
        setMessages(data);
        // console.log(data, 'datatfromchat');
      });
  };
  const onSend = async (chat = []) => {
    global.lastmessage = chat;
    // setMessages(previousMessages => GiftedChat.append(previousMessages, chat));
    console.log(chat[0]);

    await firestore()
      .collection('Chat')
      .doc(newUid)
      .collection('Messages')
      .add({
        _id: chat[0]._id,
        text: chat[0].text,
        createdAt: chat[0].createdAt,
        user: chat[0].user._id,
        name: chat[0].user.name,
        avatar: ProfilePic,
      })
      .then(() => {
        console.log('done!');
      });
  };
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
            }}>
            <Image
              source={icon.back}
              style={{height: 25, width: 25}}
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
        <View style={{height: hp(48),width:'100%', alignSelf: 'center'}}>
          {/* <GiftedChat
            messages={messages}
            showAvatarForEveryMessage={true}
            isTyping={true}
            onSend={messages => onSend(messages)}
            user={{
              _id: '101helolo',
              name: userIdName,
              avatar: currentUserProfilePic,
              createdAt : firestore.FieldValue.serverTimestamp(),

            }}
            renderBubble={(props)=>{
              return <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor:"green",

                }
                
              }}
            />
          }}

          renderInputToolbar={(props)=>{
              return <InputToolbar {...props}
               containerStyle={{borderTopWidth: 1.5, borderTopColor: 'green'}} 
               textInputStyle={{ color: "black" }}
               />
          }}
          /> */}
          <FlatList
            data={messages}
            renderItem={item => {
              return (
                <View style={{justifyContent:'flex-end'}}>
                  <View style={{backgroundColor:'red',borderRadius:4,marginVertical:3,width:'50%',alignItems:'flex-end'}}>
                    <Text>helloxvdvdv</Text>
                    <Text>hekk</Text>
                  </View>
                </View>
              );
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
