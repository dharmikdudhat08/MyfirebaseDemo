import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import BottomNavigation from './BottomNavigation';
import DrawerNavigation from './DrawerNavigation';
import EditScreen from '../screens/EditScreen';
import FillAuthenticdetail from '../screens/FillAuthenticdetail';
import AlluserList from '../screens/AlluserList';
import SplashScreen from '../screens/SplashScreen';

const Stack = createNativeStackNavigator();


const StackNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}}>
        
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}

        />
        <Stack.Screen
          name="Bottom"
          component={BottomNavigation}
        />
        <Stack.Screen
         name="Profile" 
         component={ProfileScreen} 
         />
        <Stack.Screen
         name="Edit" 
         component={EditScreen} 
         />
        <Stack.Screen
         name="Detail" 
         component={FillAuthenticdetail} 
         />
        <Stack.Screen
         name="AllUser" 
         component={AlluserList} 
         />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigation