import {
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  Notification,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {HeaderBar, ProfilePic} from '../components';
import {fs, hp, wp} from '../helpers/GlobalFunction';
import {icon} from '../helpers/ImageHelper';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore, {firebase} from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidStyle } from '@notifee/react-native';
import { AndroidColor } from '@notifee/react-native'; 

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
  // const showCallNotification = () => {
  //   if (Platform.OS === 'android') {
  //     const channelId = 'call_channel_id';
  //     const channelName = 'Call Notifications';
  //     const channelDescription = 'Incoming call notifications';

  //     Notification.createChannelAndroid({
  //       channelId,
  //       channelName,
  //       channelDescription,
  //     });

  //     Notification.localNotification({
  //       channelId,
  //       title: 'Incoming Call',
  //       message: 'John Doe is calling you',
  //       playSound: true,
  //       userInfo: {}, // Add any custom data here
  //     });
  //   }
  // };
  useEffect(() => {
    getToken();
  }, []);
  const displayNitifi=async ()=>{
    await notifee.requestPermission()

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    await notifee.displayNotification({
      title: 'Notification Title',
      body: 'Main body content of the notification',
      android: {
        channelId,
        input : true,
        style: {
          type: AndroidStyle.MESSAGING,
          person: {
            name: 'John Doe',
            icon: 'https://my-cdn.com/avatars/123.png',
          },
          messages: [
            {
              text: 'Hey, how are you?',
              timestamp: Date.now() - 600000, 
            },
            {
              text: 'Great thanks, food later?',
              timestamp: Date.now(),
              person: {
                name: 'Sarah Lane',
                icon: 'https://my-cdn.com/avatars/567.png',
              },
            },
          ],
        },
      },
    });
  }
  const getToken = async () => {
    try {
      const token = await firebase.messaging().getToken();
      console.log(token);
    } catch (error) {
      console.log(error);
    }
  };
  const sendPushNotification = async () => {
    const FIREBASE_API_KEY = 'xxxxxxxxxxxxx';
    const message = {
      registration_ids: [
        'eueP0VQeTj-kuft8GAsdS5:APA91bHFImCfK-TPf6D29iNfbVL_q_BZqQJ1xZEeZEVMPVOcoQuErYn6WUQv2d22NUVeWvApW1pIGDTMo4LlhSkqU3KQ3Ua2pzBcXx-2P_D4DwyWhR85No-ho7WUPKGE3DT5B1e_kRj8',
      ],
      notification: {
        title: 'india vs south africa test',
        body: 'IND chose to bat',
        vibrate: 1,
        sound: 1,
        show_in_foreground: true,
        priority: 'high',
        content_available: true,
      },
      data: {
        title: 'india vs south africa test',
        body: 'IND chose to bat',
        score: 50,
        wicket: 1,
      },
    };

    let headers = new Headers({
      'Content-Type': 'application/json',
      Authorization:
        'key=AAAAvXymAS0:APA91bGpvbCMeKl1QMverYNjDnaDMUWgwTT6oeCQ0OdMG2YJaOsdilp09QxAO4ouLB7frNHadpqIvJ1sBwBRfoTkhamtCVQgl3NIv5CarRBSMVlQc_6wMA7-vGWEoKiLMxgw11EpCe6M',
    });

    let response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers,
      body: JSON.stringify(message),
    });
    response = await response.json();
    console.log(response);

    await messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
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
          <TouchableOpacity onPress={displayNitifi} style={styles.followButtonstyle}>
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
    color: 'black',
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
    width: hp(1.8),
  },
  editInputStyle: {
    marginLeft: wp(3),
  },
});
