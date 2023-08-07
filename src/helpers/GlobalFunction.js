import {
    widthPercentageToDP,
    heightPercentageToDP,
  } from 'react-native-responsive-screen';
  import {RFValue} from 'react-native-responsive-fontsize';
  
  export const wp = val => widthPercentageToDP(val);
  
  export const hp = val => heightPercentageToDP(val);
  
  
  export const fs = val => RFValue(val, 812);
  