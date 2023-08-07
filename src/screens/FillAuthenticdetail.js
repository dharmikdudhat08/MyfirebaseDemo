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
import {ProfilePic} from '../components';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';

const FillAuthenticdetail = ({navigation}) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNo, setPhoneNo] = useState();
  const uid = useSelector(state => state.idtoken);

  const onSubmit = () => {
    firestore()
      .collection('User_Details')
      .doc(`${uid}`)
      .set({
        name: `${name}`,
        userName: `${username}`,
        phoneNo: `${phoneNo}`,
        uid : `${uid}`,
      })
      .then(() => {
        console.log('User added!');
        navigation.navigate('Bottom');
      });
  };

  return (
    <LinearGradient
      colors={['#FAF0FA', '#EFFAF4', '#EDF6FF']}
      style={styles.linearGradient}>
      <View
        style={{
          marginVertical: hp(10.31),
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ProfilePic imageStyle={styles.imageStyle} />
        <Text style={{fontSize: fs(15, 812)}}>Add profic pic</Text>
      </View>
      <View style={styles.inputStyle}>
        <Image
          source={icon.name}
          style={styles.inputIconStyle}
          resizeMode="contain"
        />
        <TextInput
          style={{marginLeft: wp(4)}}
          placeholder="Name"
          autoCapitalize="none"
          autoCorrect={false}
          fontSize={fs(17, 812)}
          placeholderTextColor={'#D3D3D3'}
          onChangeText={txt => setName(txt)}
        />
      </View>
      <View style={styles.inputStyle}>
        <Image
          source={icon.mention}
          style={styles.inputIconStyle}
          resizeMode="contain"
        />
        <TextInput
          style={{marginLeft: wp(4)}}
          placeholder="user_name"
          autoCapitalize="none"
          autoCorrect={false}
          fontSize={fs(17, 812)}
          placeholderTextColor={'#D3D3D3'}
          onChangeText={txt => setUsername(txt)}
        />
      </View>
      <View style={styles.inputStyle}>
        <Image
          source={icon.telephone}
          style={styles.inputIconStyle}
          resizeMode="contain"
        />
        <TextInput
          style={{marginLeft: wp(4)}}
          placeholder="Mobile No."
          autoCapitalize="none"
          autoCorrect={false}
          fontSize={fs(17, 812)}
          placeholderTextColor={'#D3D3D3'}
          onChangeText={txt => setPhoneNo(txt)}
        />
      </View>

      <TouchableOpacity style={styles.buttonStyle} onPress={onSubmit}>
        <Text style={{fontSize: fs(20, 812), color: 'white'}}>Submit</Text>
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
    // marginVertical: hp(12.31),
  },
});
