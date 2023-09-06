import {
  Alert,
  AppRegistry,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
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
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import {generateUUID} from '../helpers/RandomIdGenerator';
import Video from 'react-native-video';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidStyle } from '@notifee/react-native';
import { AndroidColor } from '@notifee/react-native'; 


const ChatScreen = () => {
  const isFocused = useIsFocused();
  const data = useSelector(state => state.chatUserValue);
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
  const [videoData, setVideoData] = useState('');
  const [imageurl, setImageurl] = useState(null);
  const [videourl, setVideourl] = useState(null);

  const newDate = new Date();
  const updatedDate = moment(newDate).format('DD-MM-YYYY');
  const currentDate = updatedDate.toString().split('-');


  const CustomComponent=()=> {
    navigation.navigate('Chat')
  }
  
  AppRegistry.registerComponent('custom-component', () => CustomComponent);




  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  useEffect(() => {
    getUserDetails();
    showIncommineNotification();
    notifee.onForegroundEvent(({ type, detail }) => {
      if (type === 'press') {
        console.log('Notification pressed:', detail.notification);
        navigation.navigate('VideoCall')
      }
    });
    
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === 'press') {
        navigation.navigate('VideoCall')
        console.log('Notification pressed while app is in background:', detail.notification);
      }
    });
  }, []);
  const showIncommineNotification = async()=>{
    await messaging().onMessage(async remoteMessage => {
      if(remoteMessage){
        displayNitifi()
      }
    });
  }
  const sendPushNotification = async () => {
    const FIREBASE_API_KEY = 'AIzaSyB0-bQqF3aNRZh4z4ss-sz4uf3Q2nv3eZU';
    const message = {
      registration_ids: [
       data[0].fcmToken,
      ],
      notification: {
        title: 'Video Call',
        body: `${userIdName} is calling you`,
        vibrate: 1,
        sound: 1,
        show_in_foreground: true,
        show_in_background: true,
        priority: 'high',
        content_available: true,
        
      },
      data: {
        title: 'Video Call',
        body: `${userIdName} is calling you`,
      },
    };

    let headers = new Headers({
      'Content-Type': 'application/json',
      Authorization:
        'key=AAAAvXymAS0:APA91bGpvbCMeKl1QMverYNjDnaDMUWgwTT6oeCQ0OdMG2YJaOsdilp09QxAO4ouLB7frNHadpqIvJ1sBwBRfoTkhamtCVQgl3NIv5CarRBSMVlQc_6wMA7-vGWEoKiLMxgw11EpCe6M',
    });

    let response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers,
      body: JSON.stringify(message),
    });
    response = await response.json();
    console.log(response.success);
  };
  const displayNitifi=async ()=>{
    await notifee.requestPermission()

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });
    await notifee.displayNotification({
      title: 'Video Call',
      body: `${userIdName} is calling you`,
      android: {
        sound: 'hollow',
        channelId,
        actions: [
          {
            title: 'Open',
            pressAction: {
              id: 'custom-component',
              launchActivity: 'default',
            },
          },
        ],
        input : true,
        // style: {
        //   type: AndroidStyle.MESSAGING,
        //   person: {
        //     name: 'John Doe',
        //     icon: 'https://my-cdn.com/avatars/123.png',
        //   },
        //   messages: [
        //     {
        //       text: 'Hey, how are you?',
        //       timestamp: Date.now() - 600000, 
        //     },
        //     {
        //       text: 'Great thanks, food later?',
        //       timestamp: Date.now(),
        //       person: {
        //         name: 'Sarah Lane',
        //         icon: 'https://my-cdn.com/avatars/567.png',
        //       },
        //     },
        //   ],
        // },
      },
    });
  }
  const getUserDetails = async () => {
    const userId = auth().currentUser.uid;
    const docId =
      auth().currentUser.uid > data[0].uid
        ? data[0].uid + ' - ' + auth().currentUser.uid
        : auth().currentUser.uid + ' - ' + data[0].uid;
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
                receiverUserName: data[0].userName,
                avatar: data[0].profilePic,
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
                receiverUserName: data[0].userName,
                avatar: data[0].profilePic,
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
            receiverUserName: data[0].userName,
            avatar: data[0].profilePic,
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
        if(Platform.OS ==  'android'){
          setFilename(image.path.split('/').pop());
        }
        else{
          setFilename(JSON.stringify(image.filename));
        }
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
        if(Platform.OS ==  'android'){
          setFilename(video.path.split('/').pop());
        }
        else{
          setFilename(JSON.stringify(video.filename));
        }
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
              source={
                data[0].profilePic ? {uri: data[0].profilePic} : icon.account
              }
              style={styles.ProfileStyle}
              resizeMode="stretch"
            />
            <Text style={styles.nameTextStyle}>{data[0].userName}</Text>
            <View style={{position:'absolute',left:wp(70)}}>
              <TouchableOpacity onPress={()=>{
                navigation.navigate('VideoCall')
                sendPushNotification()
              }}>
                <Image
                  source={icon.videoCall}
                  style={{height: hp(6.15), width: hp(6.15)}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
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
                        source={
                          data[0].profilePic
                            ? {uri: data[0].profilePic}
                            : icon.account
                        }
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
                style={styles.inputTextStyle}
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
            swipeDirection={['down']}
            style={styles.modalStyle}>
            <View
              style={[
                styles.modalViewStyle,
                {height: imageData || videoData ? hp(61.5) : hp(24.6)},
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
    right: wp(83.33),
  },
  ProfileStyle1: {
    height: hp(3.8),
    width: hp(3.8),
    borderRadius: 100,
    marginTop: hp(0.9),
  },
  nameTextStyle: {
    fontWeight: 'bold',
    fontSize: fs(17, 812),
    marginHorizontal: wp(21.33),
    marginBottom: hp(0.6),
    color:'black',
  },
  inputStyle: {
    backgroundColor: '#FFFEFE',
    height: hp(5.38),
    width: '93%',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 15,
    position: 'absolute',
    top: Platform.OS == 'android' ? hp(85): hp(81),
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
    height: hp(4.9),
    width: '40%',
    backgroundColor: '#A975FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginHorizontal: wp(4),
  },
  postCancelButtonStyle: {
    height: hp(4.9),
    width: '40%',
    borderColor: '#A975FF',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginHorizontal: wp(4),
  },
  ButtonfontStyle: {
    color: 'white',
    fontSize: fs(17, 812),
    fontWeight: 'bold',
  },
  cancelButtonStyle: {
    height: hp(4.9),
    width: '40%',
    borderColor: '#A975FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginHorizontal: wp(4),
    borderWidth: 2,
    alignSelf: 'center',
    marginVertical: hp(4.9),
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
    marginVertical: hp(1.2),
  },
  backButtonTouchStyle: {
    marginTop: hp(0.7),
    marginLeft: wp(5.3),
  },
  headerProfileStyle: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  flatlistViewStyle: {
    width: '100%',
    alignSelf: 'center',
    height: hp(80.8),
  },
  messageContainerViewStyle: {
    borderRadius: 4,
    marginVertical: hp(0.35),
    padding: hp(0.49),
    flexDirection: 'row',
  },
  messageViewStyle: {
    borderWidth: 1,
    marginHorizontal: wp(1.3),
    padding: hp(0.49),
    borderRadius: 6,
  },
  messageMediaStyle: {
    height: hp(24.6),
    width: hp(24.6),
  },
  messageProfilePicStyle: {
    height: hp(3.6),
    width: hp(3.6),
    borderRadius: 100,
  },
  textMessageStyle: {
    fontSize: fs(18, 812),
    fontWeight: '600',
    color:'black',
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
    marginLeft: wp(2.6),
    marginRight: wp(2.6),
  },
  gallaryIconStyle: {
    height: hp(3.6),
    width: hp(3.6),
    tintColor: 'grey',
  },
  sendArrowButtonStyle: {
    marginTop: hp(0.8),
    marginRight: wp(2.6),
  },
  modalStyle: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalViewStyle: {
    backgroundColor: 'white',
    padding: hp(1.2),
    borderRadius: 12,
  },
  imageViewStyle: {
    alignSelf: 'center',
    padding: 4,
  },
  modalMediaStyle: {
    height: hp(40.6),
    width: wp(100),
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
  photovideoButtonStyle: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  inputTextStyle:{
    color:'black'
  }
});
