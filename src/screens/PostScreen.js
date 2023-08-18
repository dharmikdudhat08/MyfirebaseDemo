import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {HeaderBar, Profile, ProfilePic} from '../components';
import {fs, hp, wp} from '../helpers/GlobalFunction';
import {icon} from '../helpers/ImageHelper';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';
import Video from 'react-native-video';
import {utils} from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
import {generateUUID} from '../helpers/RandomIdGenerator';
import TimeAgo from '@andordavoti/react-native-timeago';

const PostScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [imageData, setImageData] = useState('');
  const [imageDataFileName, setImageDataFileName] = useState('');
  const [videoData, setVideoData] = useState('');
  const [location, setLocation] = useState('');
  const [caption, setCaption] = useState('');
  const [uidValue, setUidValue] = useState('');
  const [count, setCount] = useState(0);
  const [imageName, setImageName] = useState();
  const [filename, setFilename] = useState();
  const [path, setPath] = useState();
  const [imageurl, setImageurl] = useState({});
  const [videourl, setVideourl] = useState({});

  useEffect(() => {
    getUid();
  });

  const getUid = async () => {
    const userId = await AsyncStorage.getItem('UID');
    // console.log('uid=======>>>>', userId);
    setUidValue(userId);

    // console.log(userId, 'hellohellohello');
    await firestore()
      .collection('User_Details')
      .doc(userId)
      .get()
      .then(res => {
        // console.log('====================================');
        // console.log(res);
        // console.log('====================================');
        // console.log(res._data.name);
        // console.log(res._data.userName);
        setName(res._data.name);
        setUserName(res._data.userName);
        setPhoneNo(res._data.phoneNo);
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
                  userName: userName,
                  ProfilePic: profilePic,
                  caption: caption,
                  url: res,
                  location: location,
                  uid: uidValue,
                  isLikedUser: [],
                  commentData: [],
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
                  userName: userName,
                  ProfilePic: profilePic,
                  caption: caption,
                  isLikedUser: [],
                  commentData: [],
                  url: res,
                  location: location,
                  uid: uidValue,
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
        <View>
          <HeaderBar
            name={'Create new post'}
            headerFontStyle={styles.headerFontStyle}
          />
        </View>

        <Profile
          profilePicViewStyle={styles.profilePicViewStyle}
          profileImageStyle={styles.imageStyle}
          userNameFontStyle={styles.fontStyle}
          nameFontStyle={styles.fontStyle1}
        />
        <View style={styles.inputStyle}>
          <Image
            source={icon.location}
            style={styles.inputIconStyle}
            resizeMode="contain"
          />
          <TextInput
            placeholder="Add location"
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor={'#D3D3D3'}
            fontSize={fs(17, 812)}
            style={{marginLeft: wp(3)}}
            onChangeText={txt => setLocation(txt)}
          />
        </View>
        <View style={styles.inputStyle}>
          <Image
            source={icon.hashtag}
            style={styles.inputIconStyle}
            resizeMode="contain"
          />
          <TextInput
            placeholder="Caption"
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor={'#D3D3D3'}
            fontSize={fs(17, 812)}
            style={{marginLeft: wp(3)}}
            onChangeText={txt => setCaption(txt)}
          />
        </View>
        {imageData ? (
          <View style={styles.uploadViewStyle}>
            <TouchableOpacity onPress={openImageGallary}>
              <Image
                source={{uri: imageData}}
                resizeMode="stretch"
                style={styles.uploadImageStyle}
              />
            </TouchableOpacity>
          </View>
        ) : videoData ? (
          <View style={styles.uploadViewStyle}>
            <Video
              source={{uri: videoData}}
              style={styles.uploadImageStyle}
              controls={true}
              resizeMode="stretch"
            />
          </View>
        ) : (
          <View style={styles.uploadViewStyle}>
            <TouchableOpacity
              onPress={openImageGallary}
              style={styles.selectPostStyle}>
              <Image
                source={icon.add}
                style={styles.inputIconStyle1}
                resizeMode="contain"
              />
              <Text style={styles.selectedFontStyle}>Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => openVideoGallary()}
              style={styles.selectPostStyle}>
              <Image
                source={icon.add}
                style={styles.inputIconStyle1}
                resizeMode="contain"
              />
              <Text style={styles.selectedFontStyle}>Video</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.buttonViewStyle}>
          <TouchableOpacity onPress={onCancel} style={styles.cancelButtonStyle}>
            <Text>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onPostPress}
            style={styles.postButtonStyle}>
            <Text style={styles.postButtonTextStyle}>Post</Text>
          </TouchableOpacity>
          {/* <TimeAgo style={{ fontWeight: 'bold', color: '#00000060' ,fontSize: 12}} dateTo={64045030} /> */}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default PostScreen;

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
  },
  fontStyle1: {
    fontSize: fs(17, 812),
    marginHorizontal: 15,
    color: 'grey',
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
  inputIconStyle1: {
    height: hp(3.07),
    width: hp(3.07),
    tintColor: 'grey',
    marginHorizontal: wp(3),
  },

  selectPostStyle: {
    flexDirection: 'row',
    marginHorizontal: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'grey',
    height: hp(4),
  },
  selectedFontStyle: {
    fontSize: fs(15, 812),
    fontWeight: 'bold',
    marginRight: wp(3),
    color: 'grey',
  },
  headerFontStyle: {
    fontSize: fs(22, 812),
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  uploadViewStyle: {
    height: hp(30),
    width: wp(90),
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  uploadImageStyle: {
    height: hp(30),
    width: wp(90),
    borderRadius: 16,
  },
  buttonViewStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(4),
  },
  cancelButtonStyle: {
    height: 40,
    width: '35%',
    borderColor: '#A975FF',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginHorizontal: 15,
  },
  postButtonStyle: {
    height: 40,
    width: '35%',
    backgroundColor: '#A975FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginHorizontal: 15,
  },
  postButtonTextStyle: {
    color: 'white',
    fontSize: fs(17, 812),
    fontWeight: 'bold',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: 16,
  },
});
