import React from 'react'
import { Image, StyleSheet, TouchableOpacity, Text, View } from 'react-native'
import { icon } from '../../helpers/ImageHelper'

const BottomBar = ({navigation}) => {
  return (    
    <View style={{
        height: '8%',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius:20,

    }}>
        <TouchableOpacity onPress={()=>navigation.navigate('Home')} >
            <Image source={icon.home} style={{ height: 28, width: 28, justifyContent:'center' }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate('Liked')}>
            <Image source={icon.save} style={{ height: 28, width: 28, justifyContent:'center' }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate('Post')}>
            <Image source={icon.add} style={{ height: 28, width: 28, justifyContent:'center' }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate('Profile')}>
            <Image source={icon.account1} style={{ height: 28, width: 28, justifyContent:'center' }} />
        </TouchableOpacity>
        
    </View>
    
  )
}

export default BottomBar

const styles = StyleSheet.create({})