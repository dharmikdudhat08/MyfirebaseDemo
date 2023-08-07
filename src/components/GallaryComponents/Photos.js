import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {image} from '../../helpers/ImageHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {hp, wp} from '../../helpers/GlobalFunction';

const Photos = () => {
  const [firebaseImageData, setfirebaseImageData] = useState([]);
  useEffect(() => {
    imageData();
    // Item()
  }, []);

  const imageData = async () => {
    let tempData = [];
    const uid = await AsyncStorage.getItem('UID');
    console.log('====================================');
    console.log(uid);
    console.log('====================================');
    await firestore()
      .collection('User_Details')
      .doc(`${uid}`)
      .get()
      .then(res => {
        for (let it in res._data.urldata) {
         if(res._data.urldata[it].imageurl){
          console.log(res._data.urldata[it].imageurl.url,"+_+_+_+_+_+_+_+_+_+_+_+_")
           tempData.push({
            //  like: res._data.urldata[it].imageurl.like,
             path: res._data.urldata[it].imageurl.url,
             id: it,
           });
         }
          setfirebaseImageData(tempData);
        }
      });
  };

  const Item = ({item}) => {
    console.log(item.item.path, '*****)(()()()()(');

    return (
      <TouchableOpacity>
        <Image
          source={{uri: item.item.path}}
          style={styles.imageStyle}
          resizeMode="stretch"
        />
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.viewStyle}>
      <View>
        <FlatList
          data={firebaseImageData}
          renderItem={item => <Item item={item} />}
          keyExtractor={item => item.id}
          numColumns={3}
        />
      </View>
    </View>
  );
};

export default Photos;

const styles = StyleSheet.create({
  imageStyle: {
    height: hp(13.5),
    width: hp(13.5),
    borderRadius: 10,
    marginVertical: hp(0.6),
    marginHorizontal: wp(1.3),
  },
  viewStyle:{
    marginHorizontal: wp(2)
  }
});
