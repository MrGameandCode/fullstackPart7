import { createSlice } from '@reduxjs/toolkit';

const initialState = { message: '', type: 'success' };

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    changeNotification(state, action) {
      return action.payload;
    },
    currentNotification(state, action) {
      return state.message;
    },
  },
});

const setNotification = (message, seconds) => {
  return async (dispatch) => {
    dispatch(changeNotification(message));
    if (message.length !== 0) {
      setTimeout(() => {
        dispatch(changeNotification({ message: null, type: 'success' }));
      }, seconds * 1000);
    }
  };
};

export const { changeNotification, currentNotification } = notificationSlice.actions;
export { setNotification };
export default notificationSlice.reducer;
