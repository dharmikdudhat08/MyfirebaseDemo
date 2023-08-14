import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
  } from 'react-native'
  import React, { useState } from 'react'
import { fs, hp, wp } from '../../helpers/GlobalFunction';
import { icon, image } from '../../helpers/ImageHelper';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfilePic = ({imageStyle}) => {
    const [imageData, setImageData] = useState('');

  const openGallary = () => {
    try {
      ImagePicker.openPicker({
        mediaType: "photo",
        width: 300,
        height: 400,
        cropping: true
      }).then(async image => {
        console.log(image, "-=-=-=-=-=--=-");
        setImageData(image.path)
        await AsyncStorage.setItem('PROFILE_PIC', `${image.path}`);
      });

    } catch (error) {
      console.log(error);
    }
  }
  return (
    <TouchableOpacity onPress={openGallary}>
    {!imageData ?
      <Image source={icon.account} style={imageStyle} resizeMode='stretch'/>
      :
      <Image source={{uri : imageData}} style={imageStyle} resizeMode='stretch' />
    }
  </TouchableOpacity>
  )
}

export default ProfilePic

const styles = StyleSheet.create({})