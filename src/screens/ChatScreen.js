import {
  Alert,
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
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import {generateUUID} from '../helpers/RandomIdGenerator';
import Video from 'react-native-video';

const ChatScreen = () => {
  const isFocused = useIsFocused();
  const userName = useSelector(state => state.chatUserName);

  const ProfilePic = useSelector(state => state.profilePic);

  const chatUserUid = useSelector(state => state.chatUserUid);
  const navigation = useNavigation();

  const [messages, setMessages] = useState([]);
  const [userIdName, setUserIdName] = useState();
  const [currentUserProfilePic, setCurrentUserProfilePic] = useState();
  const [newUid, setNewUid] = useState('');

  const [nweMessage, setNewMessage] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [imageData, setImageData] = useState('');
  const [filename, setFilename] = useState();
  const [path, setPath] = useState();
  const [imageDataFileName, setImageDataFileName] = useState('');
  const [videoData, setVideoData] = useState('');
  const [location, setLocation] = useState('');
  const [caption, setCaption] = useState('');
  const [imageurl, setImageurl] = useState(null);
  const [videourl, setVideourl] = useState(null);

  const newDate = new Date();
  const updatedDate = moment(newDate).format('DD-MM-YYYY');
  const currentDate = updatedDate.toString().split('-');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  useEffect(() => {
    getUserDetails();
  }, []);
  const getUserDetails = async () => {
    const userId = auth().currentUser.uid;
    const docId =
      auth().currentUser.uid > chatUserUid
        ? chatUserUid + ' - ' + auth().currentUser.uid
        : auth().currentUser.uid + ' - ' + chatUserUid;
    setNewUid(docId);
    await firestore()
      .collection('User_Details')
      .doc(userId)
      .get()
      .then(res => {
        setUserIdName(res._data.userName);
        setCurrentUserProfilePic(res._data.profilePic);
      })
      .then(async () => {
        await firestore()
          .collection('Chat')
          .doc(docId)
          .collection('Messages')
          .orderBy('createdAt', 'asc')
          .onSnapshot(querySnapshot => {
            const data = querySnapshot._docs.map(doc => ({
              ...doc.data(),
              createdAt: doc.data().createdAt.toDate(),
            }));
            setMessages(data);
          });
      });
  };
  const onSend = async () => {
    try {
      if (imageData) {
        await storage().ref(filename).putFile(path);
        await storage()
          .ref(filename)
          .getDownloadURL()
          .then(async res => {
            await firestore()
              .collection('Chat')
              .doc(newUid)
              .collection('Messages')
              .add({
                createdAt: firestore.Timestamp.fromDate(new Date()),
                user: auth().currentUser.uid,
                senderUserName: userIdName,
                receiverUserName: userName,
                avatar: ProfilePic,
                image: res,
              })
              .then(() => {
                console.log('done!');
                setImageurl(null);
                setVideourl(null);
                setImageData(null);
                setVideoData(null);
                setNewMessage(null);
              });
          });
      } else if (videoData) {
        console.log('avvo');
        await storage().ref(filename).putFile(path);
        await storage()
          .ref(filename)
          .getDownloadURL()
          .then(async res => {
            await firestore()
              .collection('Chat')
              .doc(newUid)
              .collection('Messages')
              .add({
                createdAt: firestore.Timestamp.fromDate(new Date()),
                user: auth().currentUser.uid,
                senderUserName: userIdName,
                receiverUserName: userName,
                avatar: ProfilePic,
                video: res,
              })
              .then(() => {
                console.log('done!');
                setImageurl(null);
                setVideourl(null);
                setImageData(null);
                setVideoData(null);
                setNewMessage(null);
              });
          });
      } else if (nweMessage) {
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
          })
          .then(() => {
            console.log('done!');
            setImageurl(null);
            setVideourl(null);
            setImageData(null);
            setVideoData(null);
            setNewMessage(null);
          });
      } else {
        Alert.alert('Please type a message or send media!!!');
      }
    } catch (error) {
      console.log(error);
    }
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
        setFilename(JSON.stringify(video.filename));
        setPath(video.path);
        setVideoData(video.path);
        console.log(video.path);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const onCancel = () => {
    setImageData(null);
    setVideoData(null);
    setImageurl(null);
    setVideourl(null);
  };
  const onPostPress = async () => {};
  return (
    <LinearGradient
      colors={['#FAF0FA', '#EFFAF4', '#EDF6FF']}
      style={styles.linearGradient}>
      <SafeAreaView>
        <View style={styles.headerViewStyle}>
          <TouchableOpacity
            onPress={() => navigation.goBack('')}
            style={styles.backButtonTouchStyle}>
            <Image
              source={icon.back_arrow}
              style={{height: 25, width: 25}}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={styles.headerProfileStyle}>
            <Image
              source={ProfilePic ? {uri: ProfilePic} : icon.account}
              style={styles.ProfileStyle}
              resizeMode="stretch"
            />
            <Text style={styles.nameTextStyle}>{userName}</Text>
          </View>
        </View>

        <View style={styles.flatlistViewStyle}>
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
                    <Text style={styles.timeTextStyle}>Today</Text>
                  ) : (
                    <Text style={styles.timeTextStyle}>{formattedDate}</Text>
                  )}
                  {auth().currentUser.uid == item.item.user ? (
                    <View
                      style={[
                        styles.messageContainerViewStyle,
                        {
                          alignSelf:
                            auth().currentUser.uid == item.item.user
                              ? 'flex-end'
                              : 'flex-start',
                        },
                      ]}>
                      {item.item.image ? (
                        <View style={styles.messageViewStyle}>
                          <Image
                            source={{uri: item.item.image}}
                            style={styles.messageMediaStyle}
                            resizeMode="stretch"
                          />
                        </View>
                      ) : item.item.video ? (
                        <View style={styles.messageViewStyle}>
                          <Video
                            source={{uri: item.item.video}}
                            style={styles.messageMediaStyle}
                            controls={true}
                            resizeMode="stretch"
                          />
                        </View>
                      ) : (
                        <View style={styles.messageViewStyle}>
                          <Text style={styles.textMessageStyle}>
                            {item.item.text}
                          </Text>
                          <Text style={styles.textMessageTimeStyle}>
                            {formattedTime}
                          </Text>
                        </View>
                      )}
                      <Image
                        source={
                          currentUserProfilePic
                            ? {uri: currentUserProfilePic}
                            : icon.account
                        }
                        style={styles.messageProfilePicStyle}
                        resizeMode="stretch"
                      />
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.messageContainerViewStyle,
                        {
                          alignSelf:
                            auth().currentUser.uid == item.item.user
                              ? 'flex-end'
                              : 'flex-start',
                        },
                      ]}>
                      <Image
                        source={ProfilePic ? {uri: ProfilePic} : icon.account}
                        style={styles.messageProfilePicStyle}
                        resizeMode="stretch"
                      />
                      {item.item.image ? (
                        <View style={styles.messageViewStyle}>
                          <Image
                            source={{uri: item.item.image}}
                            style={styles.messageMediaStyle}
                            resizeMode="stretch"
                          />
                        </View>
                      ) : item.item.video ? (
                        <View style={styles.messageViewStyle}>
                          <Video
                            source={{uri: item.item.video}}
                            style={styles.messageMediaStyle}
                            controls={true}
                            resizeMode="stretch"
                          />
                        </View>
                      ) : (
                        <View style={styles.messageViewStyle}>
                          <Text style={styles.textMessageStyle}>
                            {item.item.text}
                          </Text>
                          <Text style={styles.textMessageTimeStyle}>
                            {formattedTime}
                          </Text>
                        </View>
                      )}
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
            <View style={styles.messageInputStyle}>
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
            <TouchableOpacity style={styles.gallaryStyle} onPress={toggleModal}>
              <Image
                source={icon.gallary}
                style={styles.gallaryIconStyle}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sendArrowButtonStyle}
              onPress={onSend}>
              <Image
                source={icon.send}
                style={[
                  styles.gallaryIconStyle,
                  {
                    transform: [{rotate: '25deg'}],
                  },
                ]}
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
            style={styles.modalStyle}>
            <View
              style={[
                styles.modalViewStyle,
                {height: imageData || videoData ? 500 : 200},
              ]}>
              {imageData || videoData ? (
                <View>
                  {imageData ? (
                    <View style={styles.imageViewStyle}>
                      <Image
                        source={{uri: imageData}}
                        style={styles.modalMediaStyle}
                        resizeMode="stretch"
                      />
                      <View style={styles.modalButtonStyle}>
                        <TouchableOpacity
                          style={styles.postCancelButtonStyle}
                          onPress={() => {
                            toggleModal();
                            onCancel();
                          }}>
                          <Text style={styles.cancelButtonFontStyle}>
                            Cancel
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.Buttonstyle}
                          onPress={() => {
                            onSend();
                            toggleModal();
                          }}>
                          <Text style={styles.ButtonfontStyle}>Send</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.imageViewStyle}>
                      <Video
                        source={{uri: videoData}}
                        style={styles.modalMediaStyle}
                        resizeMode="stretch"
                      />
                      <View style={styles.modalButtonStyle}>
                        <TouchableOpacity
                          style={styles.postCancelButtonStyle}
                          onPress={() => {
                            toggleModal();
                            onCancel();
                          }}>
                          <Text style={styles.cancelButtonFontStyle}>
                            Cancel
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.Buttonstyle}
                          onPress={() => {
                            onSend();
                            toggleModal();
                          }}>
                          <Text style={styles.ButtonfontStyle}>Send</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              ) : (
                <View>
                  <View style={styles.photovideoButtonStyle}>
                    <TouchableOpacity
                      style={styles.Buttonstyle}
                      onPress={openImageGallary}>
                      <Text style={styles.ButtonfontStyle}>Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.Buttonstyle}
                      onPress={openVideoGallary}>
                      <Text style={styles.ButtonfontStyle}>Video</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.cancelButtonStyle}
                    onPress={() => {
                      toggleModal();
                      onCancel();
                    }}>
                    <Text style={styles.cancelButtonFontStyle}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}
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
    right: 320,
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
    marginHorizontal: 80,
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
  postCancelButtonStyle: {
    height: 40,
    width: '40%',
    borderColor: '#A975FF',
    borderWidth: 2,
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
  timeTextStyle: {
    alignSelf: 'center',
    color: 'grey',
  },
  headerViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  backButtonTouchStyle: {
    marginTop: 6,
    marginLeft: 20,
  },
  headerProfileStyle: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    marginTop: 5,
  },
  flatlistViewStyle: {
    width: '100%',
    alignSelf: 'center',
    height: hp(80.8),
  },
  messageContainerViewStyle: {
    borderRadius: 4,
    marginVertical: 3,
    padding: 4,
    flexDirection: 'row',
  },
  messageViewStyle: {
    borderWidth: 1,
    marginHorizontal: 5,
    padding: 4,
    borderRadius: 6,
  },
  messageMediaStyle: {
    height: 200,
    width: 200,
  },
  messageProfilePicStyle: {
    height: 30,
    width: 30,
    borderRadius: 100,
  },
  textMessageStyle: {
    fontSize: fs(18, 812),
    fontWeight: '600',
  },
  textMessageTimeStyle: {
    color: 'grey',
    fontSize: fs(12, 812),
  },
  messageInputStyle: {
    width: wp(55),
    marginLeft: wp(4),
    justifyContent: 'center',
  },
  gallaryStyle: {
    marginTop: hp(0.8),
    marginLeft: 10,
    marginRight: 10,
  },
  gallaryIconStyle: {
    height: 30,
    width: 30,
    tintColor: 'grey',
  },
  sendArrowButtonStyle: {
    marginTop: hp(0.8),
    marginRight: 10,
  },
  modalStyle: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalViewStyle: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 12,
  },
  imageViewStyle: {
    alignSelf: 'center',
    padding: 4,
  },
  modalMediaStyle: {
    height: 330,
    width: 375,
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: 'center',
  },
  modalButtonStyle: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: hp(7),
    alignSelf: 'center',
  },
  photovideoButtonStyle:{
    flexDirection: 'row', 
    alignSelf: 'center'
  }
});
