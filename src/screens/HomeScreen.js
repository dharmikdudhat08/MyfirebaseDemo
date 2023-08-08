import {
  FlatList,
  Image,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {icon, image} from '../helpers/ImageHelper';
import LinearGradient from 'react-native-linear-gradient';
import {fs, hp, wp} from '../helpers/GlobalFunction';
import {HeaderBar} from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import Video from 'react-native-video';
import database, { firebase } from '@react-native-firebase/database';

const HomeScreen = ({navigation}) => {
  const [like, setLike] = useState('');
  const [save, setSave] = useState(false);
  const [postid,setPostid] = useState();
  const [firebaseImageData, setfirebaseImageData] = useState([]);
  const [videoData, setVideoData] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [comment, setComment] = useState('');
  const [userId,setUserId] = useState('')

  useEffect(() => {
    imageData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const imageData = async () => {
    const uid = await AsyncStorage.getItem('UID');
    setUserId(uid)
    let tempData = [];
    await firestore()
      .collection('User_Details')
      .get()
      .then(res => {
        console.log(res.docs, 'hellohellohelloo');
        for (let x in res.docs) {
          for (let y in res.docs[x]._data.urldata) {
            if (res.docs[x]._data.urldata[y].mediaType) {
              tempData.push({
                vidoPath: res.docs[x]._data.urldata[y].url,
                username: res.docs[x]._data.userName,
                postId: res.docs[x]._data.urldata[y].postId,
                // like: res._data.urldata[it].videourl.like,
                id: y,
              });
            } else {
              tempData.push({
                // like: res._data.urldata[it].imageurl.like,
                postId: res.docs[x]._data.urldata[y].postId,
                username: res.docs[x]._data.userName,
                path: res.docs[x]._data.urldata[y].url,
                id: y,
              });
            }
            setfirebaseImageData(tempData);
          }
        }
      });
  };
const onLike = ()=>{
  
}
  const RenderItem = ({item}) => {
    console.log(
      item.postId,
      'hsdfiuaghfiuhwfiuhfiujshfvfhik(*(*(*(*(*(*(*(*(*(*(*(*',
    );
    return (
      <View style={styles.flatListViewStyle}>
        <View style={{flexDirection: 'row', width: '90%'}}>
          <Image
            source={icon.account}
            style={styles.ProfileStyle}
            resizeMode="stretch"
          />
          <Text style={styles.nameTextStyle}>
            {item.username}
            {'\n'}
            <Text style={{fontWeight: 'normal', color: 'grey'}}>
              surat,india
            </Text>
          </Text>
        </View>
        {item.path ? (
          <Image
            source={{uri: item.path}}
            style={styles.postStyle}
            resizeMode="stretch"
          />
        ) : (
          <Video
            source={{uri: item.vidoPath}}
            style={styles.postStyle}
            controls={true}
            resizeMode="stretch"
          />
        )}
        <View style={styles.buttonViewStyle}>
          <View style={styles.likeCommentStyle}>
            <TouchableOpacity
              onPress={() => {
                console.log(item.postId);
                setPostid(item.postId);
                try {
                  const reference = firebase.app().database('https://myfirebasedemo-e68de-default-rtdb.firebaseio.com/').ref(`/Posts/Like/`);
                  return reference.transaction(currentLikes => {
                    if (currentLikes === null) return 1;
                    return currentLikes + 1;
                  });
                  // reference.transaction((currentLike)=>currentLike+1);
                } catch (error) {
                  console.log(error);
                }
              }}>
              <Image
                source={icon.heart}
                style={styles.likeButtonStyle}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Image
                source={icon.comment}
                style={styles.buttonStyle1}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.savedPostStyle} 
          onPress={async() => {
            setSave(!save)
            const savedData = await firestore().collection('User_Details').doc(userId).get();
            console.log(savedData._data.savedPost[0].postId,"$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
            for(let x in savedData._data.savedPost){
              if(savedData._data.savedPost[x] == item.postId){
               
              }else{
                setSave(false);
              }
            }

            // firestore().collection('User_Details').doc(userId).update({
            //   savedPost : firestore.FieldValue.arrayUnion({
            //     url : item.path,
            //     userName : item.username,
            //     savedPostId : item.postId,
            //   })
            // })
          }}
          
          >
            <Image
              source={ save ? icon.fill_save : icon.save}
              style={styles.buttonStyle}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#FAF0FA', '#EFFAF4', '#EDF6FF']}
      style={styles.linearGradient}>
      <SafeAreaView>
        <View>
          <HeaderBar
            name={'Feed'}
            headerFontStyle={styles.headerFontStyle}
            // drawerOpen={()=>navigation.openDrawer()}
          />
        </View>
        <ScrollView
          style={styles.ScrollViewStyle}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <FlatList
            data={firebaseImageData}
            renderItem={({item}) => <RenderItem item={item} />}
            // keyExtractor={item => item.id}
          />
        </ScrollView>
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 22,
                flex: 1,
              }}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Hello World!</Text>
                <TextInput
                  placeholder="input"
                  onChangeText={txt => setComment(txt)}
                />
                <Text>{comment}</Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(!modalVisible)}
                  style={[styles.button, styles.buttonClose]}>
                  <Text>Hide</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  flatListViewStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: hp(3.4),
  },
  ProfileStyle: {
    height: hp(5.14),
    width: wp(12),
    borderRadius: 100,
  },
  nameTextStyle: {
    fontWeight: 'bold',
    fontSize: fs(17, 812),
    marginHorizontal: 15,
  },
  buttonViewStyle: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'flex-start',
  },
  buttonStyle1: {
    height: hp(2.85),
    width: wp(6.6),
    marginHorizontal: 15,
  },
  buttonStyle: {
    height: hp(2.85),
    width: wp(6.6),
  },
  postStyle: {
    height: hp(22.85),
    width: '90%',
    borderRadius: 14,
    marginVertical: wp(4),
  },
  headerFontStyle: {
    fontSize: fs(22, 812),
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  savedPostStyle: {
    left: wp(61.5),
  },
  likeCommentStyle: {
    flexDirection: 'row',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: hp(1.7),
    textAlign: 'center',
  },
  likeButtonStyle: {
    height: hp(3.4),
    width: wp(8),
  },
  ScrollViewStyle: {
    marginTop: hp(2.2),
  },
});
