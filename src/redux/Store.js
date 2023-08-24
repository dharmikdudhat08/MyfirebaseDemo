import {useState} from 'react';
import {applyMiddleware, createStore} from 'redux';
import userReducer from './reducer/userReducer';
import thunk from 'redux-thunk';
export const store = createStore(userReducer,applyMiddleware(thunk));
