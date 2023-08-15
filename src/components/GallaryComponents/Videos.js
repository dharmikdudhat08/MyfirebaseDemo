import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {image} from '../../helpers/ImageHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import Video from 'react-native-video';
import { hp, wp } from '../../helpers/GlobalFunction';

const Videos = () => {
  const [firebaseImageData, setfirebaseImageData] = useState([]);
  useEffect(() => {
    imageData();
  }, []);

  const imageData = async () => {
    let tempData = [];
    const uid = await AsyncStorage.getItem('UID');
    console.log('====================================');
    console.log(uid);
    console.log('====================================');
    await firestore()
      .collection('User_Details')
      .doc(`${uid}`)
      .get()
      .then(user => {
        let tempData = [];
        for (let x in user._data.urldata) {
          console.log(user?._data?.urldata[x]?.postId, 'helo');
          firestore()
            .collection('Post')
            .doc(user?._data?.urldata[x]?.postId)
            .get()
            .then(res => {
              console.log(res?._data?.url, '90909009');
              if (!res?._data?.mediaType) {
                tempData.push({
                  postid: user?._data?.urldata[x]?.postId,
                  videourl: res._data.url,
                  profilepic: res._data.profilePic,
                  SavedUser: res._data.SavedUser,
                  isLikedUser: res._data.isLikedUser,
                  comment: res._data.commentData,
                  count: res._data.isLikedUser.length,
                  commentCount: res._data.commentData.length,
                  caption: res._data.caption,
                  location: res._data.location,
                  username: res._data.userName,
                  uidValue: res._data.uid,
                });
              }
              else{
                null
              }
              setfirebaseImageData(tempData);
            });
        }
      });
  };
  const Item = ({item}) => {
    console.log(item.item.videourl, '*****)(()()()()(');

    return (
      <TouchableOpacity>
        <Video
          source={{uri: item.item.videourl}}
          style={styles.imageStyle}
          resizeMode="stretch"
        />
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.viewStyle}>
      <View>
        <FlatList
          data={firebaseImageData}
          renderItem={item => <Item item={item} />}
          keyExtractor={item => item.id}
          numColumns={3}
        />
      </View>
    </View>
  );
};

export default Videos;

const styles = StyleSheet.create({
  imageStyle: {
    height: hp(13.5),
    width: hp(13.5),
    borderRadius: 10,
    marginVertical: hp(0.6),
    marginHorizontal: wp(1.3),
  },
  viewStyle: {
    marginHorizontal: wp(2),
  },
});
