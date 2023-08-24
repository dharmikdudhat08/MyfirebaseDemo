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
import Video from 'react-native-video';
import auth from '@react-native-firebase/auth';

const All = () => {
  const [firebaseImageData, setfirebaseImageData] = useState([]);
  useEffect(() => {
    imageData();
  }, []);
  const imageData = () => {
    const uid = auth().currentUser.uid;
    firestore()
      .collection('Post')
      .onSnapshot(conso => {
        const items = [];
        conso.forEach(documentSnapshot => {
          if (documentSnapshot._data.uid == auth().currentUser.uid) {
            items.push({
              id: documentSnapshot.id,
              ...documentSnapshot.data(),
            });
          }
        });
        setfirebaseImageData(items);
      });
  };
  const Item = ({item}) => {
    return (
      <TouchableOpacity>
        {item.mediaType ? (
          <Image
            source={{uri: item.url}}
            style={styles.imageStyle}
            resizeMode="stretch"
          />
        ) : (
          <Video
            source={{uri: item.url}}
            style={styles.imageStyle}
            resizeMode="stretch"
          />
        )}
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.viewStyle}>
      <View>
        <FlatList
          data={firebaseImageData}
          renderItem={({item}) => <Item item={item} />}
          keyExtractor={item => item.id}
          numColumns={3}
        />
      </View>
    </View>
  );
};

export default All;

const styles = StyleSheet.create({
  imageStyle: {
    height: hp(13.5),
    width: hp(13.5),
    borderRadius: 10,
    marginVertical: hp(0.6),
    marginHorizontal: wp(1.3),
  },
  viewStyle: {
    marginHorizontal: wp(2),
  },
});
