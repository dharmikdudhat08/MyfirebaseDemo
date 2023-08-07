import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import React, { useState } from 'react'
import LinearGradient from 'react-native-linear-gradient';
import { fs, hp, wp } from '../helpers/GlobalFunction';
import { icon, image } from '../helpers/ImageHelper';
import ImagePicker from 'react-native-image-crop-picker';
import { ProfilePic } from '../components';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';



const SignUpScreen = ({navigation}) => {
  const [press, setPress] = useState();
  const [email,setEmail]= useState('');
  const [password,setPassword] = useState('');
  const [name,setName] = useState('');
  const [username,setUsername] = useState('');
  const [phoneNo,setPhoneNo] =useState();
  const [isSignup,setIssignup] = useState(false);
  
  const dispatch = useDispatch()

  const storeData = async () => {
     
    try {
      dispatch({type:"USER_NAME", payload : `${username}`})
      dispatch({type:"NAME", payload : `${name}`})
      dispatch({type:"PHONE_NUMBER", payload : `${phoneNo}`})
      setIssignup(true);
      dispatch({type : "SIGNUP", payload: `${isSignup}`});
      navigation.navigate('Login')
      console.log("dispatch done");
    } catch (e) {
      console.log(e);
    }
  }

  const setEmailPassword = async() => {
    try {
     await auth()
        .createUserWithEmailAndPassword(`${email}`, `${password}`)
        .then(() => {
          console.log('User account created & signed in!');
        });
        // storeData();
        // navigation.navigate('Bottom');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert("You already have an account");
      }

      if (error.code === 'auth/invalid-email') {
        Alert.alert("You email is invalid")
      }
      if(error.code === 'auth/weak-password'){
        Alert.alert("Your password is very weak make a strong password")
      }
      console.error(error);
      
    }
   
  }
  const onSignup=()=>{
      setEmailPassword()
      storeData();
  }
  return (
    <LinearGradient colors={['#FAF0FA', '#EFFAF4', '#EDF6FF']} style={styles.linearGradient}>
      <View style={{marginVertical:hp(10.31)}}>
      <ProfilePic
      imageStyle={styles.imageStyle}
      />
      </View>
      <View style={styles.inputStyle}>
        <Image source={icon.name} style={styles.inputIconStyle} resizeMode='contain' />
        <TextInput
          style={{ marginLeft: wp(4) }}
          placeholder='Name'
          autoCapitalize='none'
          autoCorrect={false}
          fontSize={fs(17, 812)}
          placeholderTextColor={'#D3D3D3'}
          onChangeText={(txt)=>setName(txt)}

          
        />
      </View>
      <View style={styles.inputStyle}>
        <Image source={icon.mention} style={styles.inputIconStyle} resizeMode='contain' />
        <TextInput
          style={{ marginLeft: wp(4) }}
          placeholder='user_name'
          autoCapitalize='none'
          autoCorrect={false}
          fontSize={fs(17, 812)}
          placeholderTextColor={'#D3D3D3'}
          onChangeText={(txt)=>setUsername(txt)}

        />
      </View>
      <View style={styles.inputStyle}>
        <Image source={icon.telephone} style={styles.inputIconStyle} resizeMode='contain' />
        <TextInput
          style={{ marginLeft: wp(4) }}
          placeholder='Mobile No.'
          autoCapitalize='none'
          autoCorrect={false}
          fontSize={fs(17, 812)}
          placeholderTextColor={'#D3D3D3'}
          onChangeText={(txt)=>setPhoneNo(txt)}

        />
      </View>
      <View style={styles.inputStyle}>
        <Image source={icon.mail} style={styles.inputIconStyle} resizeMode='contain' />
        <TextInput
          style={{ marginLeft: wp(4) }}
          placeholder='Email Address'
          autoCapitalize='none'
          autoCorrect={false}
          fontSize={fs(17, 812)}
          placeholderTextColor={'#D3D3D3'}
          onChangeText={(txt)=>setEmail(txt)}
        />
      </View>
      <View style={styles.inputStyle}>
        <TouchableOpacity onPress={() => {
          setPress(!press)
          return (false)
        }
        }>
          <Image source={press == false ? icon.eye_off : icon.eye} style={styles.inputIconStyle} resizeMode='contain' />
        </TouchableOpacity>
        <TextInput
          style={{ marginLeft: wp(4) }}
          placeholder='Set password'
          autoCapitalize='none'
          autoCorrect={false}
          fontSize={fs(17, 812)}
          placeholderTextColor={'#D3D3D3'}
          secureTextEntry={press == false ? true : false}
          value={password}
          onChangeText={(txt)=>setPassword(txt)}

        />

      </View>
      <TouchableOpacity style={styles.buttonStyle} onPress={onSignup}>
        <Text style={{ fontSize: fs(20, 812), color: 'white' }}>
          Sign Up
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ marginVertical: wp(2) }} onPress={() => navigation.navigate('Login')}>
        <Text style={{ fontSize: fs(17, 812), textDecorationLine: 'underline' }}>
          Already have an account ?
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  )
}

export default SignUpScreen

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
    flexDirection: 'row'
  },
  buttonStyle: {
    backgroundColor: '#0164E1',
    height: hp(7.38),
    width: '93%',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: hp(1)
  },
  iconStyle: {
    height: hp(4.3),
    width: wp(9.3),
    marginLeft: wp(5)
  },
  inputIconStyle: {
    height: hp(3.07),
    width: hp(3.07),
    tintColor: 'grey'
  },
  imageStyle: {
    height: hp(10.31),
    width: hp(10.31),
    alignSelf: 'stretch',
    borderRadius: 100,
    // marginVertical: hp(12.31),
  },
})