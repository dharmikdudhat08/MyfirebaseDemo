import { StyleSheet, Text, View, } from 'react-native'
import React from 'react'
import BottomNavigation from './BottomNavigation';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerBar } from '../components';
import HomeScreen from '../screens/HomeScreen';

const Drawer = createDrawerNavigator();
const DrawerNavigation = () => {
  return (
    <Drawer.Navigator initialRouteName="Home" 
    screenOptions={{
      drawerType:'front',
      headerShown:true,
      swipeEnabled:true
      
    }
    }
    drawerContent={(props)=><DrawerBar {...props}/>}
    >

   {/* <Drawer.Screen name="Home" component={HomeScreen} /> */}
   <Drawer.Screen name="Bottom" component={BottomNavigation} />
  </Drawer.Navigator>
  )
}

export default DrawerNavigation

const styles = StyleSheet.create({})