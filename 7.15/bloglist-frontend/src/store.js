import { configureStore } from '@reduxjs/toolkit';

import notificationReducer from './reducers/notificationReducer';
import blogReducer from './reducers/blogReducer';
import userReducer from './reducers/userReducer';

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer,
    loggeduser: userReducer,
  },
});

export default store;
