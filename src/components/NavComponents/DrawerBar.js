import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ProfilePic from '../common/ProfilePic'

const DrawerBar = ({navigation}) => {
  return (
    <View>
        <View style={styles.profilePicStyle}>
            <ProfilePic/>
            <Text style={styles.profileFontStyle}>XYz ABC</Text>
            <Text style={styles.profileFontStyle1}>46K Followers</Text>
        </View>
        </View>
  )
}

export default DrawerBar

const styles = StyleSheet.create({
    profilePicStyle:{
        marginTop:60,
        marginLeft:10,
    },
    profileFontStyle:{
        fontSize:20,
        fontWeight:'bold',
    },
    profileFontStyle1:{
        color:'grey'
    }
    
})