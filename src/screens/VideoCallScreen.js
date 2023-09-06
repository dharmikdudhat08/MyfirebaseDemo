import {PermissionsAndroid, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import AgoraUIKit from 'agora-rn-uikit';
import {useNavigation} from '@react-navigation/native';


const VideoCallScreen = () => {
  const [videoCall, setVideoCall] = useState(true);
  const navigation = useNavigation();
  
  const connectionData = {
    appId: '54b6365c7e40461ebc6bf0a7d9722408',
    channel: 'test',
    token:
      '007eJxTYHghI3RxSoPdkT/X7oaeWXxNsNrwrt1phxezjJ9/FVrM7XtGgcHUJMnM2Mw02TzVxMDEzDA1KdksKc0g0TzF0tzIyMTA4t7fbykNgYwM89/0sDIyQCCIz8JQklpcwsAAABkiIvI=',
  };
  const rtcCallbacks = {
    EndCall: () => setVideoCall(false),
  };
  const Naviagate = () => {
    navigation.navigate('Chat');
  };
  return videoCall ? (
    <AgoraUIKit connectionData={connectionData} rtcCallbacks={rtcCallbacks} />
  ) : (
    <Naviagate />
  );
};

export default VideoCallScreen;

const styles = StyleSheet.create({});
