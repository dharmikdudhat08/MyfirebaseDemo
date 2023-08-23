import {
  FlatList,
  Image,
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
import {HeaderBar, Profile, ProfilePic} from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import Video from 'react-native-video';
import database, {firebase} from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {FlashList} from '@shopify/flash-list';
import Modal from 'react-native-modal';

const LikedScreen = () => {
  const [userName, setUserName] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [postData, setPostData] = useState([]);
  const [comment, setComment] = useState('');
  const [userId, setUserId] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [profilepic, setProfilePic] = useState('');
  const [firebaseCommentData, setFirebaseCommentData] = useState([]);
  const [firebaseImageData, setfirebaseImageData] = useState([]);
  const [likeIs, setLikeIs] = useState('');
  const [save, setSave] = useState(false);
  const [postid, setPostid] = useState();
  const [videoData, setVideoData] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    imageData();
  }, []);
  const imageData = () => {
    const uid = auth().currentUser.uid;
    firestore()
      .collection('User_Details')
      .doc(`${uid}`)
      .get()
      .then(async user => {
        setUserName(user._data.userName);
        setOriginalName(user._data.name);ð
      })
    //     const items = [];
    //     for (let x in user._data.SavedPost) {
    //       firestore()
    //         .collection('Post')
    //         .doc(user._data.SavedPost[x].savedPost)
    //         .onSnapshot(response => {
    //           console.log(user._data.SavedPost[x].savedPost)
    //           items.push({
    //             postId: user._data.SavedPost[x].savedPost,
    //             ...response.data(),
    //           });
    //         });
    //         setfirebaseImageData(items);
    //         console.log(items, '%^&^%&^%&^%&^%');
    //     }
    //   });
    firestore()
      .collection('Post')
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
          for (let y in items[x].SavedUser) {
            if (items[x].SavedUser[y] == auth().currentUser.uid) {
              tempData.push({
                profilePic: items[x].profilePic,
                userName: items[x].userName,
                url: items[x].url,
                mediaType: items[x].mediaType,
                location: items[x].location,
                isLikedUser: items[x].isLikedUser,
                commentData: items[x].commentData,
                SavedUser: items[x].SavedUser,
                postId: items[x].id,
              });
            }
          }
        }
        setfirebaseImageData(tempData);
        console.log(tempData);
      });
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  const onSave = async postId => {
    console.log(postId, '9090909099');
    const userId = auth().currentUser.uid;
    firestore()
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
    console.log(postId, 'unsave');
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
    console.log(postid, '&&&&&&&&');
    console.log(userName, '&&&&&&&&');
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
          })
          .then(() => {
            console.log('update done!!!');
            // setPostid(null)
          });
      } catch (error) {
        console.log(error);
      }
    }
  };
  const getCommentData = async postId => {
    try {
      const userId = await AsyncStorage.getItem('UID');
      await firestore()
        .collection('User_Details')
        .doc(userId)
        .get()
        .then(res => {
          setName(res._data.name);
          setProfilePic(res._data.profilePic);
          setUserName(res._data.userName);
        });
      console.log(postId, '**********');
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
            name={'Saved post'}
            headerFontStyle={styles.headerFontStyle}
          />
        </View>
        <View style={styles.profilePicViewStyle}>
          <ProfilePic imageStyle={styles.imageStyle} />
          <View style={{marginBottom: hp(1.5)}}>
            <Text style={styles.fontStyle}>{userName}</Text>
            <Text style={styles.fontStyle1}>{originalName}</Text>
          </View>
        </View>
        <ScrollView
          style={styles.ScrollViewStyle}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <FlatList
            data={firebaseImageData}
            renderItem={({item, index}) => {
              // console.log(item.SavedUser,"0909090909")

              console.log(item.postId);
              return (
                <View style={styles.flatListViewStyle}>
                  <View style={{flexDirection: 'row', width: '90%'}}>
                    <Image
                      source={
                        item.profilePic ? {uri: item.profilePic} : icon.account
                      }
                      style={styles.ProfileStyle}
                      resizeMode="stretch"
                    />
                    <Text style={styles.nameTextStyle}>
                      {item.userName}
                      {'\n'}
                      <Text style={{fontWeight: 'normal', color: 'grey'}}>
                        {item.location}
                      </Text>
                    </Text>
                  </View>
                  {item.mediaType ? (
                    <Image
                      source={{uri: item.url}}
                      style={styles.postStyle}
                      resizeMode="stretch"
                    />
                  ) : (
                    <Video
                      source={{uri: item.url}}
                      style={styles.postStyle}
                      controls={true}
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
                            ? UnLike(item.postId)
                            : onLike(item.postId);
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
                      <Text
                        style={{
                          fontWeight: 'normal',
                          color: 'grey',
                          fontSize: fs(20, 812),
                          marginTop: hp(0.2),
                          marginLeft: wp(0.7),
                        }}>
                        {item.isLikedUser.length}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          toggleModal();
                          getCommentData(item.postId);
                        }}>
                        <Image
                          source={icon.comment}
                          style={styles.buttonStyle1}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontWeight: 'normal',
                          color: 'grey',
                          fontSize: fs(20, 812),
                          marginTop: hp(0.08),
                          // marginLeft: wp(0.4),
                        }}>
                        {item.commentData.length}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.savedPostStyle}
                      onPress={() => {
                        item?.SavedUser?.some(
                          a => a === auth().currentUser.uid,
                        ) === true
                          ? onUnSave(item.postId)
                          : onSave(item.postId);
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
            swipeDirection={['down']} // Allow swiping down to close the modal
            style={{justifyContent: 'flex-end', margin: 0}}>
            <View
              style={{
                backgroundColor: 'white',
                padding: 10,
                height: 500,
                borderRadius: 12,
              }}>
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
                    style={{
                      height: 25,
                      width: 25,
                      marginTop: 3,
                      marginRight: 3,
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              <View>
                <FlatList
                  data={firebaseCommentData}
                  renderItem={({item, index}) => {
                    // console.log(item.comment,"hellojjskdjsdlfj");
                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '90%',
                          marginVertical: 5,
                        }}>
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
                          <Text
                            style={{
                              fontWeight: '600',
                              marginHorizontal: 5,
                              marginBottom: 5,
                            }}>
                            {item.userName}
                          </Text>
                          <Text
                            style={{fontWeight: 'normal', marginHorizontal: 5}}>
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

export default LikedScreen;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  imageStyle: {
    height: hp(7),
    width: hp(7),
    alignSelf: 'stretch',
    borderRadius: 100,
  },
  profilePicViewStyle: {
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
  flatListViewStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: hp(3.4),
  },
  ProfileStyle: {
    height: hp(5.14),
    width: wp(12),
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
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
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
    padding: 10,
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
  },
  likeButtonStyle: {
    height: hp(3.4),
    width: wp(8),
  },
  ScrollViewStyle: {
    marginTop: hp(2.2),
  },
  modalCloseButtonStyle: {
    height: 40,
    width: 40,
    backgroundColor: '#A975FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    marginLeft: -20,
    marginTop: 10,
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
  },
  fontStyle1: {
    fontSize: fs(15, 812),
    marginHorizontal: 15,
    color: 'grey',
  },
});
