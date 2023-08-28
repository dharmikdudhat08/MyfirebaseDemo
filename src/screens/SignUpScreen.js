import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {fs, hp, wp} from '../helpers/GlobalFunction';
import {icon, image} from '../helpers/ImageHelper';
import ImagePicker from 'react-native-image-crop-picker';
import {ProfilePic, TextInputBar} from '../components';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {UserNameValue} from '../redux/action/action';

const SignUpScreen = ({navigation}) => {
  const [press, setPress] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNo, setPhoneNo] = useState();
  const [isSignup, setIssignup] = useState(false);
  const [imageData, setImageData] = useState('');

  const dispatch = useDispatch();
  const openGallary = () => {
    try {
      ImagePicker.openPicker({
        mediaType: 'photo',
        width: 300,
        height: 400,
        cropping: true,
      }).then(async image => {
        console.log("tejani tejani ",image)
        setImageData(image.path)

        await AsyncStorage.setItem('PROFILE_PIC', `${image.path}`);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const setEmailPassword = async () => {
    try {
      await auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          console.log('User account created & signed in!');
          navigation.navigate('Login');
        });
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('You already have an account');
      }

      if (error.code === 'auth/invalid-email') {
        Alert.alert('You email is invalid');
      }
      if (error.code === 'auth/weak-password') {
        Alert.alert('Your password is very weak make a strong password');
      }
      console.error(error);
    }
  };
  const onSignup = () => {
    if (name && phoneNo && username) {
      if (imageData) {
        setEmailPassword();
        const data = {
          name: name,
          phoneNo: phoneNo,
          username: username,
          isSignup: true,
          imageData: imageData,
          email: email,
        };
        dispatch(UserNameValue(data));
      } else {
        Alert.alert('Please Choose a profile!!');
      }
    } else {
      Alert.alert('Please Fill all details!!!');
    }
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
      <View style={styles.inputStyle}>
        <TouchableOpacity
          onPress={() => {
            setPress(!press);
            return false;
          }}>
          <Image
            source={press == false ? icon.eye_off : icon.eye}
            style={styles.inputIconStyle}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TextInput
          style={styles.tetxInputStyle}
          placeholder="Set password"
          autoCapitalize="none"
          autoCorrect={false}
          fontSize={fs(17, 812)}
          placeholderTextColor={'#D3D3D3'}
          secureTextEntry={press == false ? true : false}
          value={password}
          onChangeText={txt => setPassword(txt)}
        />
      </View>
      <TouchableOpacity style={styles.buttonStyle} onPress={onSignup}>
        <Text style={styles.signUpButtonStyle}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.textStyleAccountClick}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.textStyleAccount}>Already have an account ?</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    alignItems: 'center',
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
    alignSelf: 'stretch',
    borderRadius: 100,
    alignSelf: 'center',
  },
  profilePicTextStyle: {
    fontSize: fs(17, 812),
    alignSelf: 'center',
    marginTop: hp(1.2),
  },
  tetxInputStyle: {
    marginLeft: wp(4),
  },
  signUpButtonStyle: {
    fontSize: fs(20, 812),
    color: 'white',
  },
  textStyleAccount: {
    fontSize: fs(17, 812),
    textDecorationLine: 'underline',
  },
  profileViewStyle: {
    marginVertical: hp(10.31),
  },
  textStyleAccountClick: {
    marginVertical: wp(2),
  },
});
