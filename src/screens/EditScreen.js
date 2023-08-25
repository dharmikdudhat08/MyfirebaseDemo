import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {HeaderBar, ProfilePic} from '../components';
import {fs, hp, wp} from '../helpers/GlobalFunction';
import {icon} from '../helpers/ImageHelper';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const EditScreen = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const navigation = useNavigation();
  const onSubmit = async () => {
    const uid = auth().currentUser.uid;
    await firestore().collection('User_Details').doc(uid).update({
      name: name,
      userName: username,
    });
  };
  return (
    <LinearGradient
      colors={['#FAF0FA', '#EFFAF4', '#EDF6FF']}
      style={styles.linearGradient}>
      <SafeAreaView>
        <View style={styles.headerStyle}>
          <TouchableOpacity
            style={styles.drawerIconStyle}
            onPress={() => navigation.goBack('')}>
            <Image
              source={icon.back}
              resizeMode="contain"
              style={styles.headerIconStyle}
            />
          </TouchableOpacity>
          <Text style={styles.headerFontStyle}>Edit Your Profile</Text>
        </View>
        <View style={styles.profileStyle}>
          <ProfilePic imageStyle={styles.imageStyle} />
        </View>
        <View style={styles.inputStyle}>
          <Image
            source={icon.name}
            style={styles.inputIconStyle}
            resizeMode="contain"
          />
          <TextInput
            placeholder="Name"
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor={'#D3D3D3'}
            fontSize={fs(17, 812)}
            style={styles.editInputStyle}
            onChangeText={txt => {
              setName(txt);
            }}
          />
        </View>
        <View style={styles.inputStyle}>
          <Image
            source={icon.mention}
            style={styles.inputIconStyle}
            resizeMode="contain"
          />
          <TextInput
            placeholder="Username"
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor={'#D3D3D3'}
            fontSize={fs(17, 812)}
            style={styles.editInputStyle}
            onChangeText={txt => {
              setUsername(txt);
            }}
          />
        </View>
        <View style={styles.buttonViewstyle}>
          <TouchableOpacity onPress={onSubmit} style={styles.followButtonstyle}>
            <Text style={styles.followButtonfontStyle}>Submit</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default EditScreen;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  drawerIconStyle: {
    width: hp(4.92),
    height: wp(10.66),
    backgroundColor: '#fff1e6',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: wp(5.3),
    shadowColor: '#d3d3d3',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 2,
    shadowRadius: 5,
  },
  headerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(1.23),
  },
  headerFontStyle: {
    fontSize: fs(22, 812),
    fontWeight: 'bold',
  },
  inputStyle: {
    borderBottomWidth: 3,
    width: '90%',
    borderBottomStartRadius: 16,
    borderBottomEndRadius: 16,
    borderColor: '#D3D3D3',
    flexDirection: 'row',
    marginLeft: wp(4),
    marginVertical: hp(2),
  },
  inputIconStyle: {
    height: hp(3.07),
    width: hp(3.07),
    tintColor: 'grey',
    marginVertical: 7,
  },
  imageStyle: {
    height: hp(10.31),
    width: hp(10.31),
    alignSelf: 'stretch',
    borderRadius: 100,
  },
  profileStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: hp(5),
  },
  followButtonstyle: {
    height: hp(4.9),
    width: '50%',
    backgroundColor: '#A975FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginHorizontal: wp(4),
  },
  followButtonfontStyle: {
    color: 'white',
    fontSize: fs(17, 812),
    fontWeight: 'bold',
  },
  buttonViewstyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: hp(1.8),
  },
  headerIconStyle: {
    height: hp(1.8),
    width:hp(1.8),
  },
  editInputStyle: {
    marginLeft: wp(3),
  },
});
