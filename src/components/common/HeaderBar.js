import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { icon } from '../../helpers/ImageHelper'
import { fs } from '../../helpers/GlobalFunction'
import { DrawerActions, useNavigation } from '@react-navigation/native'

const HeaderBar = ({name,headerFontStyle}) => {
  const navigation = useNavigation();
  const drawerOpen =()=>{
    console.log("hiii");
    navigation?.dispatch(DrawerActions?.openDrawer());
    // navigation?.openDrawer();
  }
  return (
    <View style={styles.headerStyle}>
      <TouchableOpacity style={styles.drawerIconStyle} onPress={drawerOpen}>
        <Image source={icon.drawer} resizeMode='contain' style={styles.imageStyle} />
      </TouchableOpacity>
      <Text style={headerFontStyle}>{name}</Text>
    </View>
  )
}

export default HeaderBar;

const styles = StyleSheet.create({
  drawerIconStyle: {
    width: 45,
    height: 45,
    backgroundColor: '#fff1e6', 
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 20,
    shadowColor: '#d3d3d3',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 2,
    shadowRadius: 5,

  },
  headerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  
  },
  
  imageStyle:{
    height:20,
    width:20
  },
  
})