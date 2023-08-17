import {useState} from 'react';
import {combineReducers, createStore} from 'redux';

const initialState = {
  users: [],
  userName: [],
  phoneNumber: [],
  signup: [],
  idtoken: [],
  chatUserName: '',
  profilePic:'',
  newUid:[],
  chatUserUid:[],
};
const userReducer = (state = initialState, action) => {
  const data = action?.payload;
  switch (action.type) {
    case 'USER_NAME':
      return {...state, userName: action.payload};
    case 'NAME':
      return {...state, users: action.payload};
    case 'PHONE_NUMBER':
      return {...state, phoneNumber: action.payload};
    case 'SIGNUP':
      return {...state, signup: action.payload};
    case 'ID_TOKEN':
      return {...state, idtoken: action.payload};
    case 'CHAT_USER_NAME':
      return {...state, chatUserName: action.payload};
    case 'PROFILEPIC':
      return {...state, profilePic: action.payload};
    case 'NEW_UID':
      return {...state, newUid: action.payload};
    case 'CHAT_USER_UID':
      return {...state, chatUserUid: action.payload};
    default:
      return state;
  }
};
export const store = createStore(userReducer);
