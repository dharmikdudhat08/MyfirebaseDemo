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
      });

    } catch (error) {
      console.log(error);
    }
  }
  return (
    <TouchableOpacity>
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