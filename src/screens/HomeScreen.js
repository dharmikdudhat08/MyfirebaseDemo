import {
  FlatList,
  Image,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useId, useState} from 'react';
import {icon, image} from '../helpers/ImageHelper';
import LinearGradient from 'react-native-linear-gradient';
import {fs, hp, wp} from '../helpers/GlobalFunction';
import {HeaderBar} from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import Video from 'react-native-video';
import database, {firebase} from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { FlashList } from "@shopify/flash-list";

const HomeScreen = ({navigation}) => {
  const [likeIs, setLikeIs] = useState('');
  const [save, setSave] = useState(false);
  const [postid, setPostid] = useState();
  const [firebaseImageData, setfirebaseImageData] = useState([]);
  const [videoData, setVideoData] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [comment, setComment] = useState('');
  const [userId, setUserId] = useState('');
  const [color, setColor] = useState('white');

  console.log(firebaseImageData);
  useEffect(() => {
    // imageData();
    const imageData = firestore()
      .collection('Post')
      .onSnapshot(querySnapshot => {
        const items = [];
        querySnapshot.forEach(documentSnapshot => {
          items.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });
        let tempData = [];
        const data = items.map(x => {
          console.log(x.mediaType);
          if (x.mediaType) {
            tempData.push({
              postid: x.id,
              path: x.url,
              isLikedUser: x.isLikedUser,
              commentData : x.comment,
              count: x.isLikedUser.length,
              caption: x.caption,
              location: x.location,
              username: x.userName,
              uidValue: x.uid,
            });
          } else {
            tempData.push({
              postid: x.id,
              vidoPath: x.url,
              caption: x.caption,
              location: x.location,
              username: x.userName,
              commentData : x.comment,
              count: x.isLikedUser.length,
              uidValue: x.uid,
              isLikedUser: x.isLikedUser,
            });
          }
          setfirebaseImageData(tempData);
        });
      });

    return () => imageData();
  }, []);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  const onLike = postId => {
    firestore()
      .collection('Post')
      .doc(postId)
      .get()
      .then(async res => {
        const userId = auth().currentUser.uid;
        await firestore()
          .collection('Post')
          .doc(postId)
          .update({
            isLikedUser: [...res._data.isLikedUser, userId],
          });
      });
  };
  const UnLike = postId => {
    firestore()
      .collection('Post')
      .doc(postId)
      .get()
      .then(async res => {
        const D = await firestore().collection('Post').doc(postId).get();
        const filteData = D._data.isLikedUser.filter(
          a => a !== auth().currentUser.uid,
        );
        await firestore().collection('Post').doc(postId).update({
          isLikedUser: filteData,
        });
      });
  };
const onComment = (postId,userName)=>{
    firestore().collection('Post').doc(postId).get().then(async res=>{
      const userId = auth().currentUser.uid;
      await firestore().collection('Post').doc(postId).update({
        commentData : firestore.FieldValue.arrayUnion({
              userName : userName,
              comment : comment
        })
      })
    })
}
  return (
    <LinearGradient
      colors={['#FAF0FA', '#EFFAF4', '#EDF6FF']}
      style={styles.linearGradient}>
      <SafeAreaView>
        <View>
          <HeaderBar
            name={'Feed'}
            headerFontStyle={styles.headerFontStyle}
            // drawerOpen={()=>navigation.openDrawer()}
          />
        </View>
        <ScrollView
          style={styles.ScrollViewStyle}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <FlatList
            data={firebaseImageData}
            renderItem={({item, index}) => {
              return (
                <View style={styles.flatListViewStyle}>
                  <View style={{flexDirection: 'row', width: '90%'}}>
                    <Image
                      source={icon.account}
                      style={styles.ProfileStyle}
                      resizeMode="stretch"
                    />
                    <Text style={styles.nameTextStyle}>
                      {item.username}
                      {'\n'}
                      <Text style={{fontWeight: 'normal', color: 'grey'}}>
                        {item.location}
                      </Text>
                    </Text>
                  </View>
                  {item.path ? (
                    <Image
                      source={{uri: item.path}}
                      style={styles.postStyle}
                      resizeMode="stretch"
                    />
                  ) : (
                    <Video
                      source={{uri: item.vidoPath}}
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
                            ? UnLike(item.postid)
                            : onLike(item.postid);
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
                            marginLeft: wp(0.7)
                          }}>
                          {item.count}
                        </Text>
                      <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Image
                          source={icon.comment}
                          style={styles.buttonStyle1}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      style={styles.savedPostStyle}
                      onPress={() => {}}>
                      <Image
                        source={save ? icon.fill_save : icon.save}
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
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
            style={{width:'90%'}}
            >
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 22,
                flex: 1,
              }}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Hello World!</Text>
                <TextInput
                  placeholder="input"
                  onChangeText={txt => setComment(txt)}
                />
                <Text>{comment}</Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(!modalVisible)}
                  style={[styles.button, styles.buttonClose]}>
                  <Text>Hide</Text>
                </TouchableOpacity>
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
    marginHorizontal: wp(2),
  },
  buttonStyle: {
    height: hp(2.85),
    width: wp(6.6),
  },
  postStyle: {
    height: hp(22.85),
    width: '90%',
    borderRadius: 14,
    marginVertical: wp(4),
  },
  headerFontStyle: {
    fontSize: fs(22, 812),
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  savedPostStyle: {
    left: wp(61.5),
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
  
});
