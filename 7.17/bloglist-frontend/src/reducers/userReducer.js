import { createSlice } from '@reduxjs/toolkit';
import { setNotification } from '../reducers/notificationReducer';
import loginService from '../services/login';

const initialState = { id: null, name: null, token: null, username: null };

const userSlice = createSlice({
  name: 'loggedUser',
  initialState,
  reducers: {
    login(state, action) {
      return action.payload;
    },
    logout(state, action) {
      return { id: null, name: null, token: null, username: null };
    },
    refresh(state, action) {
      return action.payload;
    },
  },
});

const loginUser = (username, password) => {
  return async (dispatch) => {
    loginService
      .login({ username, password })
      .then((response) => {
        dispatch(login(response));
        window.localStorage.setItem('loggedUser', JSON.stringify(response));
      })
      .catch((error) => dispatch(setNotification({ message: `Wrong username or password`, type: 'error' }, 5)));
  };
};

const logoutUser = () => {
  return async (dispatch) => {
    dispatch(logout());
    window.localStorage.removeItem('loggedUser');
    dispatch(setNotification({ message: `Logged out successfully. See you soon!`, type: 'success' }, 5));
  };
};

const refreshUser = (user) => {
  return async (dispatch) => {
    dispatch(refresh(user));
  };
};

export const { login, logout, refresh } = userSlice.actions;
export { loginUser, logoutUser, refreshUser };
export default userSlice.reducer;
