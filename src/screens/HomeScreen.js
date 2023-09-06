import {
  FlatList,
  Image,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useId, useMemo, useState} from 'react';
import {icon, image} from '../helpers/ImageHelper';
import LinearGradient from 'react-native-linear-gradient';
import {fs, hp, wp} from '../helpers/GlobalFunction';
import {HeaderBar, Profile} from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import Video from 'react-native-video';
import database, {firebase} from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {FlashList} from '@shopify/flash-list';
import Modal from 'react-native-modal';
import {useIsFocused, useNavigation} from '@react-navigation/native';

const HomeScreen = ({navigation}) => {
  const isFocused = useIsFocused();
  const [likeIs, setLikeIs] = useState('');
  const [save, setSave] = useState(false);
  const [postid, setPostid] = useState();
  const [firebaseImageData, setfirebaseImageData] = useState([]);
  const [videoData, setVideoData] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [comment, setComment] = useState('');
  const [userId, setUserId] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [profilepic, setProfilePic] = useState('');
  const [firebaseCommentData, setFirebaseCommentData] = useState([]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  useEffect(() => {
    imageData();
  }, []);

  const imageData = () => {
    firestore()
      .collection('Post')
      .onSnapshot(conso => {
        const items = [];
        conso.forEach(documentSnapshot => {
          items.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });

        setfirebaseImageData(items);
      });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  const onSave = async postId => {
    const userId = auth().currentUser.uid;
    await firestore()
      .collection('Post')
      .doc(postId)
      .get()
      .then(async res => {
        await firestore()
          .collection('Post')
          .doc(postId)
          .update({
            SavedUser: [...res._data.SavedUser, userId],
          })
          .then(() => {
            firestore()
              .collection('User_Details')
              .doc(userId)
              .update({
                SavedPost: firestore.FieldValue.arrayUnion({
                  savedPost: postId,
                }),
              });
          });
      });
  };
  const onUnSave = async postId => {
    const userId = auth().currentUser.uid;
    const D = await firestore().collection('Post').doc(postId).get();
    const filteredData = D._data.SavedUser.filter(
      a => a !== auth().currentUser.uid,
    );
    await firestore()
      .collection('Post')
      .doc(postId)
      .update({
        SavedUser: filteredData,
      })
      .then(() => {
        firestore()
          .collection('User_Details')
          .doc(userId)
          .update({
            SavedPost: firestore.FieldValue.arrayRemove({
              savedPost: postId,
            }),
          });
      });
  };
  const onLike = async postId => {
    const userId = auth().currentUser.uid;
    await firestore()
      .collection('Post')
      .doc(postId)
      .get()
      .then(async res => {
        await firestore()
          .collection('Post')
          .doc(postId)
          .update({
            isLikedUser: [...res._data.isLikedUser, userId],
          });
      });
  };
  const UnLike = async postId => {
    const D = await firestore().collection('Post').doc(postId).get();
    const filterData = D._data.isLikedUser.filter(
      a => a !== auth().currentUser.uid,
    );
    await firestore().collection('Post').doc(postId).update({
      isLikedUser: filterData,
    });
  };
  const onComment = async () => {
    if (comment) {
      try {
        await firestore()
          .collection('Post')
          .doc(postid)
          .update({
            commentData: firestore.FieldValue.arrayUnion({
              userName: userName,
              comment: comment,
              profilePic: profilepic,
            }),
          });
      } catch (error) {
        console.log(error);
      }
    }
  };
  const getCommentData = async postId => {
    try {
      const userId = auth().currentUser.uid;
      await firestore()
        .collection('User_Details')
        .doc(userId)
        .get()
        .then(res => {
          setName(res._data.name);
          setProfilePic(res._data.profilePic);
          setUserName(res._data.userName);
        });
      setPostid(postId);
      firestore()
        .collection('Post')
        .doc(postId)
        .get()
        .then(data => {
          const commentItem = [];
          for (let x in data._data.commentData) {
            commentItem.push({
              comment: data._data.commentData[x].comment,
              userName: data._data.commentData[x].userName,
              profilepic: data._data.commentData[x].profilePic,
            });
          }
          setFirebaseCommentData(commentItem);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <LinearGradient
      colors={['#FAF0FA', '#EFFAF4', '#EDF6FF']}
      style={styles.linearGradient}>
      <SafeAreaView>
        <View>
          <HeaderBar
            name={'Feed'}
            headerFontStyle={styles.headerFontStyle}
            onPress={() => {
              navigation.openDrawer();
            }}
          />
        </View>
        <TouchableOpacity
          style={styles.messageButtonStyle}
          onPress={() => navigation.navigate('Message')}>
          <Image
            source={icon.chat}
            style={styles.messageIconStyle}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <ScrollView
          style={styles.ScrollViewStyle}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <FlatList
            data={firebaseImageData}
            renderItem={({item}) => {
              return (
                <View style={styles.flatListViewStyle}>
                  <View style={styles.userDetailsStyle}>
                    <Image
                      source={
                        item.ProfilePic ? {uri: item.ProfilePic} : icon.account
                      }
                      style={styles.ProfileStyle}
                      resizeMode="stretch"
                    />
                    <Text style={styles.nameTextStyle}>
                      {item.userName}
                      {'\n'}
                      <Text style={styles.locationStyle}>{item.location}</Text>
                    </Text>
                  </View>
                  {item.mediaType == 'image' ? (
                    <Image
                      source={{uri: item.url}}
                      style={styles.postStyle}
                      resizeMode="stretch"
                    />
                  ) : (
                    <Video
                      source={{uri: item.url}}
                      style={styles.postStyle}
                      resizeMode="stretch"
                    />
                  )}
                  <View style={styles.buttonViewStyle}>
                    <View style={styles.likeCommentStyle}>
                      <TouchableOpacity
                        onPress={() => {
                          item.isLikedUser.some(
                            a => a === auth().currentUser.uid,
                          ) === true
                            ? UnLike(item.id)
                            : onLike(item.id);
                        }}>
                        <Image
                          source={
                            item.isLikedUser.some(
                              a => a === auth().currentUser.uid,
                            ) === true
                              ? icon.fill_heart
                              : icon.heart
                          }
                          style={styles.likeButtonStyle}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                      <Text style={styles.likeCountStyle}>
                        {item.isLikedUser.length}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          toggleModal();
                          getCommentData(item.id);
                        }}>
                        <Image
                          source={icon.comment}
                          style={styles.buttonStyle1}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                      <Text style={styles.commentCountStyle}>
                        {item.commentData.length}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.savedPostStyle}
                      onPress={() => {
                        item?.SavedUser?.some(
                          a => a === auth().currentUser.uid,
                        ) === true
                          ? onUnSave(item.id)
                          : onSave(item.id);
                      }}>
                      <Image
                        source={
                          item?.SavedUser?.some(
                            a => a === auth().currentUser.uid,
                          ) === true
                            ? icon.fill_save
                            : icon.save
                        }
                        style={styles.buttonStyle}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
            keyExtractor={item => item.postId}
          />
        </ScrollView>
        <View style={{flex: 1}}>
          <Modal
            isVisible={isModalVisible}
            onBackdropPress={() => {
              toggleModal();
            }}
            swipeDirection={['down']}
            style={styles.modalStyle}>
            <View style={styles.commentViewStyle}>
              <Profile
                profilePicViewStyle={styles.profilePicViewStyle}
                profileImageStyle={styles.imageStyle}
                userNameFontStyle={styles.fontStyle}
                nameFontStyle={styles.fontStyle1}
              />
              <View style={{flexDirection: 'row'}}>
                <View style={styles.inputStyle}>
                  <Image
                    source={icon.comment}
                    style={styles.inputIconStyle}
                    resizeMode="contain"
                  />
                  <TextInput
                    placeholder="Add Comment here"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor={'#D3D3D3'}
                    fontSize={fs(17, 812)}
                    style={{marginLeft: wp(3)}}
                    onChangeText={txt => setComment(txt)}
                  />
                </View>
                <TouchableOpacity
                  style={styles.modalCloseButtonStyle}
                  onPress={() => {
                    toggleModal();
                    onComment();
                  }}>
                  <Image
                    source={icon.send}
                    style={styles.commentSendStyle}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              <View>
                <FlatList
                  data={firebaseCommentData}
                  renderItem={({item, index}) => {
                    return (
                      <View style={styles.commentProfilePic}>
                        <Image
                          source={
                            item.profilepic
                              ? {uri: item.profilepic}
                              : icon.account
                          }
                          style={styles.ProfileStyle1}
                          resizeMode="stretch"
                        />
                        <View>
                          <Text style={styles.commentUserNameStyle}>
                            {item.userName}
                          </Text>
                          <Text style={styles.commentNameStyle}>
                            {item.comment}
                          </Text>
                        </View>
                      </View>
                    );
                  }}
                />
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  commentNameStyle: {
    fontWeight: 'normal',
    marginHorizontal: wp(1.33),
    color:'black',
  },
  commentUserNameStyle: {
    fontWeight: '600',
    marginHorizontal: wp(1.33),
    marginBottom: hp(0.6),
    color:'black',
  },
  commentProfilePic: {
    flexDirection: 'row',
    width: '90%',
    marginVertical: hp(0.6),
  },
  commentSendStyle: {
    height: hp(3.07),
    width: hp(3.07),
    marginTop: hp(0.35),
    marginRight: wp(0.8),
  },
  commentViewStyle: {
    backgroundColor: 'white',
    padding: hp(1.2),
    height: hp(61.5),
    borderRadius: 12,
  },
  modalStyle: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  flatListViewStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: hp(3.4),
  },
  ProfileStyle: {
    height: hp(5.14),
    width: wp(11),
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
    color:'black',
  },
  buttonViewStyle: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'flex-start',
  },
  buttonStyle1: {
    height: hp(2.85),
    width: wp(6.6),
    marginHorizontal: wp(1.8),
  },
  buttonStyle: {
    height: hp(2.85),
    width: wp(6.6),
  },
  postStyle: {
    height: hp(22.85),
    width: '90%',
    borderRadius: 16,
    marginVertical: wp(4),
  },
  headerFontStyle: {
    fontSize: fs(22, 812),
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  savedPostStyle: {
    left: wp(59.5),
  },
  likeCommentStyle: {
    flexDirection: 'row',
  },
  modalView: {
    margin: hp(2.4),
    backgroundColor: 'white',
    borderRadius: 20,
    padding: hp(4.3),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: hp(1.2),
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: hp(1.7),
    textAlign: 'center',
    color:'black',
  },
  likeButtonStyle: {
    height: hp(3.4),
    width: wp(8),
  },
  ScrollViewStyle: {
    marginTop: hp(2.2),
  },
  modalCloseButtonStyle: {
    height: hp(4.9),
    width: hp(4.9),
    backgroundColor: '#A975FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    marginLeft: -hp(2.4),
    marginTop: hp(1.2),
  },
  modalCloseButtonTextStyle: {
    color: 'white',
    fontSize: fs(14, 812),
    fontWeight: 'bold',
  },
  inputStyle: {
    borderBottomWidth: 3,
    width: '90%',
    borderBottomStartRadius: 16,
    borderBottomEndRadius: 16,
    borderColor: '#D3D3D3',
    flexDirection: 'row',
    marginLeft: wp(4),
    marginVertical: hp(3),
  },
  inputIconStyle: {
    height: hp(3.07),
    width: hp(3.07),
    tintColor: 'grey',
  },
  imageStyle: {
    height: hp(5),
    width: hp(5),
    alignSelf: 'stretch',
    borderRadius: 100,
  },
  profilePicViewStyle: {
    marginTop: hp(2),
    marginHorizontal: wp(4),
    flexDirection: 'row',
    alignItems: 'center',
  },
  fontStyle: {
    fontSize: fs(18, 812),
    marginHorizontal: wp(4),
    marginVertical: hp(0.61),
    color:'black',
  },
  fontStyle1: {
    fontSize: fs(15, 812),
    marginHorizontal: wp(4),
    color: 'grey',
  },
  messageButtonStyle: {
    left: wp(90.6),
    marginTop: Platform.OS == 'android' ? hp(2) : hp(7),
    position: 'absolute',
  },
  messageIconStyle: {
    height: hp(3.6),
    width: hp(3.6),
  },
  userDetailsStyle: {
    flexDirection: 'row',
    width: '90%',
  },
  locationStyle: {
    fontWeight: 'normal',
    color: 'grey',
  },
  likeCountStyle: {
    fontWeight: 'normal',
    color: 'grey',
    fontSize: fs(20, 812),
    marginTop: hp(0.2),
    marginLeft: wp(0.7),
  },
  commentCountStyle: {
    fontWeight: 'normal',
    color: 'grey',
    fontSize: fs(20, 812),
    marginTop: hp(0.08),
  },
});
