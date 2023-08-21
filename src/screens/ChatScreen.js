import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';

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
  const [nweMessage, setNewMessage] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [imageData, setImageData] = useState('');
  const [imageDataFileName, setImageDataFileName] = useState('');
  const [videoData, setVideoData] = useState('');
  const [location, setLocation] = useState('');
  const [caption, setCaption] = useState('');

  const newDate = new Date();
  const updatedDate = moment(newDate).format('DD-MM-YYYY');
  const currentDate = updatedDate.toString().split('-');
  console.log(currentDate);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  useEffect(() => {
    const userId = auth().currentUser.uid;
    setSenderUid(senderUid);
    const docId =
      auth().currentUser.uid > chatUserUid
        ? chatUserUid + ' - ' + auth().currentUser.uid
        : auth().currentUser.uid + ' - ' + chatUserUid;
    setNewUid(docId);
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
  }, []);

  const chatGetFromFirebase = () => {
    console.log('call');
    try {
      console.log('call2');
      firestore()
        .collection('Chat')
        .doc(newUid)
        .collection('Messages')
        .orderBy('createdAt', 'asc')
        .onSnapshot(querySnapshot => {
          console.log('call3');
          console.log(querySnapshot);
          const data = querySnapshot._docs.map(doc => ({
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate(),
          }));
          setMessages(data);
          console.log(data, 'avvo aavo');
        });
    } catch (error) {
      console.log(error);
    }
  };
  const onSend = async () => {
    // setMessages(previousMessages => GiftedChat.append(previousMessages, chat));
    await firestore()
      .collection('Chat')
      .doc(newUid)
      .collection('Messages')
      .add({
        text: nweMessage,
        createdAt: firestore.Timestamp.fromDate(new Date()),
        user: auth().currentUser.uid,
        senderUserName: userIdName,
        receiverUserName: userName,
        avatar: ProfilePic,
        image: imageData,
        video: videoData,
      })
      .then(() => {
        console.log('done!');
        setNewMessage(null);
      });
  };
  const openImageGallary = () => {
    try {
      ImagePicker.openPicker({
        mediaType: 'photo',
        width: 300,
        height: 400,
        cropping: true,
      }).then(async image => {
        setFilename(JSON.stringify(image.filename));
        setPath(image.path);

        setImageData(image.path);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const openVideoGallary = () => {
    try {
      ImagePicker.openPicker({
        mediaType: 'video',
        cropping: false,
      }).then(async video => {
        console.log(video, '-=-=-=-=-=--=-');
        setFilename(JSON.stringify(video.filename));
        setPath(video.path);
        setVideoData(video.path);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const onCancel = () => {
    setImageData(null);
    setVideoData(null);
  };
  const onPostPress = async () => {
    setCount(count + 1);
    console.log('uid-----====----=-=-=-=-=-=>', uidValue);
    const profilePic = await AsyncStorage.getItem('PROFILE_PIC');
    try {
      if (imageData) {
        const now = new Date();
        console.log(now);
        await storage().ref(filename).putFile(path);
        await storage()
          .ref(filename)
          .getDownloadURL()
          .then(res => {
            const uuid = generateUUID(20);
            console.log('====================================');
            console.log(imageurl, '****(*(*(*(*(*(*(*(*(*(');
            console.log('====================================');

            firestore()
              .collection('User_Details')
              .doc(uidValue)
              .update({
                urldata: firestore.FieldValue.arrayUnion({
                  postId: uuid,
                }),
              })
              .then(response => {
                firestore().collection('Post').doc(uuid).set({
                  url: res,

                  mediaType: 'image',
                });
                console.log(response, 'fhwiefhiweur121243446723447634');
                setImageData(null);
              });
          });
        setImageData(null);
        console.log('====================================');
        console.log(imageData);
        console.log('====================================');
      } else if (videoData) {
        await storage().ref(filename).putFile(path);
        await storage()
          .ref(filename)
          .getDownloadURL()
          .then(res => {
            const uuid = generateUUID(20);

            firestore()
              .collection('User_Details')
              .doc(uidValue)
              .update({
                urldata: firestore.FieldValue.arrayUnion({
                  postId: uuid,
                }),
              })
              .then(response => {
                firestore().collection('Post').doc(uuid).set({
                  url: res,
                });
                console.log(response);
              });
          });
        console.log('file upload success!');
        setVideoData(null);
      } else {
        null;
      }
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    }
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

        <View style={{width: '100%', alignSelf: 'center', height: hp(80.8)}}>
          <FlatList
            data={messages}
            renderItem={item => {
              const formattedTime = moment(item.item.createdAt).format(
                'h:mm A',
              );
              const formattedDate = moment(item.item.createdAt).format(
                'DD-MM-YYYY',
              );
              const updatedformateDate = formattedDate.toString().split('-');

              return (
                <View style={{justifyContent: 'flex-end'}}>
                  {updatedformateDate[0] == currentDate[0] &&
                  updatedformateDate[1] == currentDate[1] &&
                  updatedformateDate[2] == currentDate[2] ? (
                    <Text style={{alignSelf: 'center'}}>Today</Text>
                  ) : (
                    <Text style={{alignSelf: 'center'}}>{formattedDate}</Text>
                  )}
                  {auth().currentUser.uid == item.item.user ? (
                    <View
                      style={{
                        borderRadius: 4,
                        marginVertical: 3,
                        padding: 4,
                        flexDirection: 'row',
                        alignSelf:
                          auth().currentUser.uid == item.item.user
                            ? 'flex-end'
                            : 'flex-start',
                      }}>
                      <View
                        style={{
                          borderWidth: 1,
                          marginHorizontal: 5,
                          padding: 4,
                          borderRadius: 6,
                          backgroundColor: '#AEE3F2',
                        }}>
                        <Text
                          style={{fontSize: fs(18, 812), fontWeight: '600'}}>
                          {item.item.text}
                        </Text>
                        <Text style={{color: 'grey', fontSize: fs(12, 812)}}>
                          {formattedTime}
                        </Text>
                      </View>
                      <Image
                        source={
                          item.item.avatar
                            ? {uri: item.item.avatar}
                            : icon.account
                        }
                        style={{height: 30, width: 30, borderRadius: 100}}
                        resizeMode="stretch"
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        borderRadius: 4,
                        marginVertical: 3,
                        padding: 4,
                        flexDirection: 'row',
                        alignSelf:
                          auth().currentUser.uid == item.item.user
                            ? 'flex-end'
                            : 'flex-start',
                      }}>
                      <Image
                        source={
                          item.item.avatar
                            ? {uri: item.item.avatar}
                            : icon.account
                        }
                        style={{height: 30, width: 30, borderRadius: 100}}
                        resizeMode="stretch"
                      />
                      <View
                        style={{
                          borderWidth: 1,
                          marginHorizontal: 5,
                          padding: 4,
                          borderRadius: 6,
                        }}>
                        <Text
                          style={{fontSize: fs(18, 812), fontWeight: '600'}}>
                          {item.item.text}
                        </Text>
                        <Text style={{color: 'grey', fontSize: fs(12, 812)}}>
                          {formattedTime}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              );
            }}
          />

          <View style={styles.inputStyle}>
            <Image
              source={icon.keyboard}
              style={styles.inputIconStyle}
              resizeMode="contain"
            />
            <View
              style={{
                width: wp(55),
                marginLeft: wp(4),
                justifyContent: 'center',
              }}>
              <TextInput
                placeholder="Type a message..."
                autoCapitalize="none"
                value={nweMessage}
                autoCorrect={false}
                fontSize={fs(19, 812)}
                placeholderTextColor={'#D3D3D3'}
                onChangeText={txt => setNewMessage(txt)}
              />
            </View>
            <TouchableOpacity
              style={{marginTop: hp(0.8), marginLeft: 10, marginRight: 10}}
              onPress={toggleModal}>
              <Image
                source={icon.gallary}
                style={{height: 30, width: 30, tintColor: 'grey'}}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{marginTop: hp(0.8), marginRight: 10}}
              onPress={onSend}>
              <Image
                source={icon.send}
                style={{
                  height: 30,
                  width: 30,
                  tintColor: 'grey',
                  transform: [{rotate: '25deg'}],
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Modal
            isVisible={isModalVisible}
            onBackdropPress={() => {
              toggleModal();
            }}
            swipeDirection={['down']} // Allow swiping down to close the modal
            style={{justifyContent: 'flex-end', margin: 0}}>
            <View
              style={{
                backgroundColor: 'white',
                padding: 10,
                height: 200,
                borderRadius: 12,
              }}>
              <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                <TouchableOpacity style={styles.Buttonstyle}>
                  <Text style={styles.ButtonfontStyle}>Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.Buttonstyle}>
                  <Text style={styles.ButtonfontStyle}>Video</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.cancelButtonStyle}
                onPress={toggleModal}>
                <Text style={styles.cancelButtonFontStyle}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Modal>
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
  inputStyle: {
    backgroundColor: '#FFFEFE',
    height: hp(5.38),
    width: '93%',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 15,
    position: 'absolute',
    // marginTop: 650,
    top: hp(80),
    alinItems: 'center',
    paddingLeft: wp(3.5),
    marginVertical: hp(1),
    flexDirection: 'row',
    alignSelf: 'center',
  },
  inputIconStyle: {
    height: hp(3.07),
    width: hp(3.07),
    marginTop: hp(1.11),
    tintColor: 'grey',
  },
  Buttonstyle: {
    height: 40,
    width: '40%',
    backgroundColor: '#A975FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginHorizontal: 15,
  },
  ButtonfontStyle: {
    color: 'white',
    fontSize: fs(17, 812),
    fontWeight: 'bold',
  },
  cancelButtonStyle: {
    height: 40,
    width: '40%',
    borderColor: '#A975FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginHorizontal: 15,
    borderWidth: 2,
    alignSelf: 'center',
    marginVertical: 40,
  },
  cancelButtonFontStyle: {
    color: '#A975FF',
    fontSize: fs(17, 812),
    fontWeight: 'bold',
  },
});
