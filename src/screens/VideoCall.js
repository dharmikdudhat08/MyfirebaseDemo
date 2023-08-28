import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import {icon} from '../helpers/ImageHelper';
import {mediaDevices, RTCView} from 'react-native-webrtc';

const VideoCall = () => {
  const [stream, setStream] = useState(null);
  const start = async () => {
    console.log('start');
    if (!stream) {
      let s;
      try {
        s = await mediaDevices.getUserMedia({video: true});
        setStream(s);
      } catch (e) {
        console.error(e);
      }
    }
  };
  const stop = () => {
    console.log('stop');
    if (stream) {
      stream.release();
      setStream(null);
    }
  };
  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {stream && <RTCView streamURL={stream.toURL()} style={styles.stream} />}
      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <TouchableOpacity
        onPress={start}
          style={{
            padding: 5,
            borderRadius: 100,
            backgroundColor: 'green',
            marginHorizontal: 20,
          }}>
          <Image
            source={icon.telephone}
            style={{height: 50, width: 50}}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity
        onPress={stop}
          style={{
            padding: 5,
            borderRadius: 100,
            backgroundColor: 'red',
            marginHorizontal: 20,
          }}>
          <Image
            source={icon.telephone}
            style={{height: 50, width: 50}}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VideoCall;

const styles = StyleSheet.create({
  stream: {
    flex: 1,
  },
});
