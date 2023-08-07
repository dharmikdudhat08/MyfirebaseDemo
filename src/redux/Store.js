import { useState } from 'react';
import { combineReducers, createStore } from 'redux';

const initialState = {
  users : [],
  userName : [],
  phoneNumber : [],
  signup: [],
  idtoken:[],  
    
  };
  const userReducer=(state = initialState, action)=> {
    const data = action?.payload
    switch (action.type) {
      case 'USER_NAME':
       return{...state,userName: action.payload}
      case 'NAME':
        return{...state,users : action.payload}
      case 'PHONE_NUMBER':
        return{...state,phoneNumber : action.payload}
      case 'SIGNUP':
        return{...state,signup : action.payload}
      case 'ID_TOKEN':
        return{...state,idtoken : action.payload}
      default:
        return state;
    }
  }
  export const store = createStore(userReducer);  