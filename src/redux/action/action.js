export const UserNameValue = userDetails => async dispatch => {
    dispatch({type: 'USER_DATA', payload: userDetails});
  };
export const ChatUidDataValue =  chatUserValue => async dispatch => {
    dispatch({type: 'CHAT_USER', payload:  chatUserValue});
  };