import { legacy_createStore } from "redux";

const initialState = {
    usersDetails: [],
    chatUserValue : [],
  };
  const userReducer = (state = initialState, action) => {
    const data = action?.payload;
    switch (action.type) {
      case 'USER_DATA':
        return {...state, usersDetails: [...state?.usersDetails,action?.payload]};
      case 'CHAT_USER':
        return {...state, chatUserValue: [action?.payload]};
      default:
        return state;
    }
  };
  export default userReducer;