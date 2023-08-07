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

GoogleSignin.configure({
  webClientId:
    '813840073005-3rjtb28mik46bpobh25aldbnfe9ron6o.apps.googleusercontent.com',
});

const LoginScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // console.log(email,password);

  const name = useSelector(state => state.users);
  const userName = useSelector(state => state.userName);
  const phoneNo = useSelector(state => state.phoneNumber);
  const signup = useSelector(state => state.signup);

  const onGoogleButtonPress = async () => {
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth()
      .signInWithCredential(googleCredential)
      .then(async res => {
        console.log('res', res.user.uid);
        dispatch({
          type: 'ID_TOKEN',
          payload: `${res.user.uid}`,
        });
        await firestore()
          .collection('User_Details')
          .doc(`${res.user.uid}`)
          .get()
          .then(async userid => {
            console.log(userid, 'hellohellogheoooj');
            console.log(userid._data);
            if (userid._data) {
              // navigation.navigate('Detail');
              navigation.navigate('Bottom');
            } else {
              navigation.navigate('Detail');
            }
            await firestore()
              .collection('User_Details')
              .doc(`${res.user.uid}`)
              .update({
                uid: `${res.user.uid}`,
              });
            await AsyncStorage.setItem('UID', `${res.user.uid}`);
            console.log('====================================');
            console.log(res.user.uid);
            console.log('====================================');
          });
      });
  };

  const onLogin = async () => {
    try {
      await auth()
        .signInWithEmailAndPassword(`${email}`, `${password}`)
        .then(
          async res => {
            console.log('====================================');
            console.log(res.user);
            console.log('====================================');
            console.log(res.user.uid, 'hello');
            if (signup) {
              firestore()
                .collection('User_Details')
                .doc(`${res.user.uid}`)
                .set({
                  name: `${name}`,
                  userName: `${userName}`,
                  phoneNo: `${phoneNo}`,
                  uid: `${res.user.uid}`,
                })
                .then(async () => {
                  try {
                    await AsyncStorage.setItem('UID', res.user.uid);
                    console.log('saved to asyncStorage');
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
                    console.log('saved to asyncStorage');
                    navigation.navigate('Bottom');
                  } catch (e) {
                    console.log(e);
                  }
                });
            }
          },

          // console.log("user logged in")
        );

      // storeData();
      // navigation.navigate('Home')
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
          style={{
            height: hp(12.31),
            width: hp(12.31),
            marginVertical: hp(12.31),
            alignSelf: 'center',
          }}
          resizeMode="contain"
        />
      </View>
      <View style={styles.inputStyle}>
        <Image
          source={icon.mail}
          style={styles.inputIconStyle}
          resizeMode="contain"
        />
        <TextInput
          style={{marginLeft: wp(4)}}
          placeholder="Email Address"
          autoCapitalize="none"
          autoCorrect={false}
          fontSize={fs(17, 812)}
          placeholderTextColor={'#D3D3D3'}
          onChangeText={txt => setEmail(txt)}
        />
      </View>
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
      <TouchableOpacity
        style={styles.buttonStyle}
        // onPress={() => navigation.navigate('Bottom')}
        onPress={onLogin}>
        <Text style={{fontSize: fs(20, 812), color: 'white'}}>Log in</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{marginVertical: wp(2)}}
        onPress={() => navigation.navigate('SignUp')}>
        <Text style={{fontSize: fs(17, 812), textDecorationLine: 'underline'}}>
          Create new account
        </Text>
      </TouchableOpacity>
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 30}}>
        <View style={styles.lineStyle}></View>
        <Text style={{fontSize: fs(17, 812), color: 'grey'}}>OR</Text>
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
          style={{fontSize: fs(17, 812), color: '#0164E1', marginLeft: wp(14)}}>
          Sign With Google
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.authStyle, {bottom: 35}]}
        // onPress={generateRandomId}
      >
        <Image
          source={icon.facebook}
          resizeMode="contain"
          style={styles.iconStyle}
        />
        <Text
          style={{fontSize: fs(17, 812), color: '#0164E1', marginLeft: wp(14)}}>
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
    marginHorizontal: 10,
  },
});
