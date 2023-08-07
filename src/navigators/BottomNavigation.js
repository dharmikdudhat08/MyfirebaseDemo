import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ProfileScreen from '../screens/ProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import LikedScreen from '../screens/LikedScreen';
import PostScreen from '../screens/PostScreen';
import {BottomBar} from '../components';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import DrawerNavigation from './DrawerNavigation';

const Bottom = createBottomTabNavigator();
const BottomNavigation = ({navigation}) => {
  return (
    <Bottom.Navigator
      initialRouteName="Home"
      screenOptions={() => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(255,255,255, 0.9)',
          height: '12%',
        },
      })}
      tabBar={props => <BottomBar {...props} />}>
      <Bottom.Screen name="Home" component={HomeScreen} />
      <Bottom.Screen name="Profile" component={ProfileScreen} />
      <Bottom.Screen name="Liked" component={LikedScreen} />
      <Bottom.Screen name="Post" component={PostScreen} />
      {/* <Bottom.Screen name='Drawer'
        component={DrawerNavigation}
    /> */}
    </Bottom.Navigator>
  );
};

export default BottomNavigation;

const styles = StyleSheet.create({});
