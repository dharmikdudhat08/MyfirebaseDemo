import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
  View,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {fs, hp, wp} from '../helpers/GlobalFunction';
import {icon, image} from '../helpers/ImageHelper';
import ImagePicker from 'react-native-image-crop-picker';
import {ProfilePic, TextInputBar} from '../components';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

const FillAuthenticdetail = ({navigation}) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNo, setPhoneNo] = useState();
  const [imageData, setImageData] = useState();
  const [email, setEmail] = useState();
  const [filename, setFilename] = useState();
  const [path, setPath] = useState();
  const uid = auth().currentUser.uid;

  const openGallary = () => {
    try {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      }).then(async image => {
        console.log();
        setImageData(image.path);
        if (Platform.OS == 'android') {
          setFilename(image.path.split('/').pop());
        } else {
          setFilename(JSON.stringify(image.filename));
        }
        setPath(image.path);
        await AsyncStorage.setItem('PROFILE_PIC', `${image.path}`);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async () => {
    await storage().ref(filename).putFile(path);
    await storage()
      .ref(filename)
      .getDownloadURL()
      .then(async res => {
        await firestore()
          .collection('User_Details')
          .doc(`${uid}`)
          .set({
            name: `${name}`,
            userName: `${username}`,
            phoneNo: `${phoneNo}`,
            uid: `${uid}`,
            profilePic: res,
            SavedPost: [],
            followers: [],
            following: [],
            urldata: [],
          })
          .then(() => {
            console.log('User added!');
            navigation.navigate('Bottom');
          });
      });
  };

  return (
    <LinearGradient
      colors={['#FAF0FA', '#EFFAF4', '#EDF6FF']}
      style={styles.linearGradient}>
      <View style={styles.profileViewStyle}>
        <TouchableOpacity onPress={openGallary}>
          <Image
            source={imageData ? {uri: imageData} : icon.account}
            style={styles.imageStyle}
            resizeMode="stretch"
          />
        </TouchableOpacity>
        <Text style={styles.profilePicTextStyle}>Add Profile Picture</Text>
      </View>
      <TextInputBar
        source={icon.name}
        placeHolder={'Name'}
        onChangeText={txt => setName(txt)}
      />
      <TextInputBar
        source={icon.mention}
        placeHolder={'user_name'}
        onChangeText={txt => setUsername(txt)}
      />
      <TextInputBar
        source={icon.telephone}
        placeHolder={'Mobile No.'}
        onChangeText={txt => setPhoneNo(txt)}
      />
      <TextInputBar
        source={icon.mail}
        placeHolder={'Email Address'}
        onChangeText={txt => setEmail(txt)}
      />
      <TouchableOpacity style={styles.buttonStyle} onPress={onSubmit}>
        <Text style={styles.submitButtonStyle}>Submit</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default FillAuthenticdetail;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    alignItems: 'center',
  },
  submitButtonStyle: {
    fontSize: fs(20, 812),
    color: 'white',
  },
  inputStyle: {
    backgroundColor: '#FFFEFE',
    height: hp(7.38),
    width: '93%',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 7,
    alignItems: 'center',
    paddingLeft: wp(5),
    marginVertical: hp(1),
    flexDirection: 'row',
  },
  buttonStyle: {
    backgroundColor: '#0164E1',
    height: hp(7.38),
    width: '93%',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: hp(1),
  },
  iconStyle: {
    height: hp(4.3),
    width: wp(9.3),
    marginLeft: wp(5),
  },
  inputIconStyle: {
    height: hp(3.07),
    width: hp(3.07),
    tintColor: 'grey',
  },
  imageStyle: {
    height: hp(10.31),
    width: hp(10.31),
    alignSelf: 'center',
    borderRadius: 100,
  },
  profileViewStyle: {
    marginVertical: hp(10.31),
    justifyContent: 'center',
  },
  profilePicTextStyle: {
    fontSize: fs(17, 812),
    alignSelf: 'center',
    marginTop: hp(1.2),
    color: 'black',
  },
});
