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
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getPathFromState} from '@react-navigation/native';
import {TextInputBar} from '../components';

GoogleSignin.configure({
  webClientId:
    '813840073005-3rjtb28mik46bpobh25aldbnfe9ron6o.apps.googleusercontent.com',
});

const LoginScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const data = useSelector(state => state.usersDetails);
  const onGoogleButtonPress = async () => {
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

    const {idToken} = await GoogleSignin.signIn();

    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    return auth()
      .signInWithCredential(googleCredential)
      .then(async res => {
        console.log("hello hello",res.user.uid)
        await firestore()
          .collection('User_Details')
          .doc(`${res.user.uid}`)
          .get()
          .then(async userid => {
            if (userid._data) {
              navigation.navigate('Bottom');
            } else {
              navigation.navigate('Detail');
            }
            await AsyncStorage.setItem('UID', `${res.user.uid}`);
          });
      });
  };

  const onLogin = async () => {
    const profilePic = await AsyncStorage.getItem('PROFILE_PIC');
    try {
      await auth()
        .signInWithEmailAndPassword(email, password)
        .then(async res => {
          if (signup) {
            firestore()
              .collection('User_Details')
              .doc(`${res.user.uid}`)
              .set({
                name: `${name}`,
                userName: `${userName}`,
                phoneNo: `${phoneNo}`,
                uid: `${res.user.uid}`,
                profilePic: profilePic,
              })
              .then(async () => {
                try {
                  await AsyncStorage.setItem('UID', res.user.uid);

                  navigation.navigate('Bottom');
                } catch (e) {
                  console.log(e);
                }
              });
          } else {
            firestore()
              .collection('User_Details')
              .doc(`${res.user.uid}`)
              .get()
              .then(async () => {
                try {
                  await AsyncStorage.setItem('UID', res.user.uid);

                  navigation.navigate('Bottom');
                } catch (e) {
                  console.log(e);
                }
              });
          }
        });
    } catch (error) {
      Alert.alert('Please Enter valid email or password');
    }
  };

  const [press, setPress] = useState();
  return (
    <LinearGradient
      colors={['#FAF0FA', '#EFFAF4', '#EDF6FF']}
      style={styles.linearGradient}>
      <View>
        <Image
          source={image.instagram}
          style={styles.appIconStyle}
          resizeMode="contain"
        />
      </View>
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
          style={{marginLeft: wp(4)}}
          placeholder="Password"
          autoCapitalize="none"
          autoCorrect={false}
          fontSize={fs(17, 812)}
          placeholderTextColor={'#D3D3D3'}
          secureTextEntry={press == false ? true : false}
          onChangeText={txt => {
            setPassword(txt);
          }}
        />
      </View>
      <TouchableOpacity style={styles.buttonStyle} onPress={onLogin}>
        <Text style={styles.loginButtonStyle}>Log in</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.creatAccountViewStyle}
        onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.creatAccountTextStyle}>
          Create new account
        </Text>
      </TouchableOpacity>
      <View style={styles.orViewStyle}>
        <View style={styles.lineStyle}></View>
        <Text style={styles.orStyle}>OR</Text>
        <View style={styles.lineStyle}></View>
      </View>
      <TouchableOpacity
        style={[styles.authStyle, {bottom: 110}]}
        onPress={onGoogleButtonPress}>
        <Image
          source={icon.google}
          resizeMode="contain"
          style={styles.iconStyle}
        />
        <Text
          style={styles.googleloginStyle}>
          Sign With Google
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.authStyle, {bottom: 35}]}>
        <Image
          source={icon.facebook}
          resizeMode="contain"
          style={styles.iconStyle}
        />
        <Text
          style={styles.facebookloginStyle}>
          Sign With Facebook
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    alignItems: 'center',
  },
  facebookloginStyle:{
    fontSize: fs(17, 812), 
    color: '#0164E1', 
    marginLeft: wp(14)
  },
  googleloginStyle:{
    fontSize: fs(17, 812),
     color: '#0164E1', 
     marginLeft: wp(14)
  },
  orStyle:{
    fontSize: fs(17, 812), 
    color: 'grey'
  },
  orViewStyle:{
    flexDirection: 'row', 
    alignItems: 'center',
     marginTop: hp(3.6)
  },
  loginButtonStyle:{
    fontSize: fs(20, 812), 
    color: 'white'
  },
  creatAccountViewStyle:{
    marginVertical: wp(2)
  }, 
  creatAccountTextStyle:{
    fontSize: fs(17, 812), 
    textDecorationLine: 'underline'
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
  authStyle: {
    borderColor: '#0164E1',
    borderWidth: 1,
    height: hp(7.38),
    width: '93%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 7,
    marginVertical: hp(1),
    position: 'absolute',
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
  lineStyle: {
    borderWidth: 1,
    width: '40%',
    borderColor: '#D3D3D3',
    height: '0%',
    marginHorizontal: wp(2.6),
  },
  appIconStyle: {
    height: hp(12.31),
    width: hp(12.31),
    marginVertical: hp(12.31),
    alignSelf: 'center',
  },
});
