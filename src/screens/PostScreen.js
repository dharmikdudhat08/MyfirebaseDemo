import {
  Alert,
  Image,
  Platform,
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
import auth from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';
import Video from 'react-native-video';
import {utils} from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
import {generateUUID} from '../helpers/RandomIdGenerator';
import TimeAgo from '@andordavoti/react-native-timeago';
import { request, PERMISSIONS } from 'react-native-permissions';

const PostScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [imageData, setImageData] = useState('');
  const [videoData, setVideoData] = useState('');
  const [location, setLocation] = useState('');
  const [caption, setCaption] = useState('');
  const [uidValue, setUidValue] = useState('');
  const [count, setCount] = useState(0);
  const [filename, setFilename] = useState();
  const [path, setPath] = useState();
  const [profilePic,setProfilePic] = useState();

  useEffect(() => {
    getUid();
  });

  const getUid = async () => {
    const userId = auth().currentUser.uid;
    setUidValue(userId);
    await firestore()
      .collection('User_Details')
      .doc(userId)
      .get()
      .then(res => {
        setName(res._data.name);
        setUserName(res._data.userName);
        setPhoneNo(res._data.phoneNo);
        setProfilePic(res._data.profilePic)
      });
  };

  const requestCameraPermission = async () => {
    try {
      const cameraStatus = await request(PERMISSIONS.ANDROID.CAMERA);
      console.log('Camera Permission Status:', cameraStatus);
    } catch (error) {
      console.error('Error requesting camera permission:', error);
    }
  };




  const openImageGallary = async() => {
   
      // try {
      //   const storageStatus = await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
      //   console.log('Storage Permission Status:', storageStatus);
      // } catch (error) {
      //   console.error('Error requesting storage permission:', error);
      // }
    
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
        if(Platform.OS ==  'android'){
          setFilename(image.path.split('/').pop());
        }
        else{
          setFilename(JSON.stringify(image.filename));
        }
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
                  SavedUser:[],
                  isLikedUser: [],
                  commentData: [],
                  mediaType: 'image',
                });
                setImageData(null);
                setCaption(null);
                setLocation(null);
              });
          });
        setImageData(null);
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
                  SavedUser:[],
                  url: res,
                  location: location,
                  uid: uidValue,
                });
                console.log(response);
              });
          });
        setVideoData(null);
        setCaption(null);
        setLocation(null);
      } else {
        null;
      }
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
            value={location}
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
            value={caption}
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
    marginHorizontal: wp(4),
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
    height: hp(4.9),
    width: '35%',
    borderColor: '#A975FF',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginHorizontal: wp(4),
  },
  postButtonStyle: {
    height: hp(4.9),
    width: '35%',
    backgroundColor: '#A975FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginHorizontal: wp(4),
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
