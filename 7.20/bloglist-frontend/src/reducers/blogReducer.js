import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';
import { setNotification } from '../reducers/notificationReducer';

const getId = () => (100000 * Math.random()).toFixed(0);

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    addLike(state, action) {
      const id = action.payload;
      const blogToChange = state.find((n) => n._id === id);
      const blogChanged = {
        ...blogToChange,
        likes: blogToChange.likes + 1,
      };
      return state
        .map((blog) => (blog._id === id ? blogChanged : blog))
        .sort((prev, current) => current.likes - prev.likes);
    },
    addBlog(state, action) {
      const newBlog = {
        title: action.payload.title,
        url: action.payload.url,
        likes: action.payload.likes,
        author: action.payload.author,
        user: {
          id: action.payload.user,
        },
      };
      state.push(newBlog);
    },
    appendBlog(state, action) {
      state.push(action.payload);
    },
    setBlogs(state, action) {
      return action.payload;
    },
    removeBlog(state, action) {
      const id = action.payload;
      return state.filter((blog) => blog._id !== id).sort((prev, current) => current.likes - prev.likes);
    },
    replaceBlog(state, action) {
      console.log(action)
      return state
        .map((blog) => (blog._id === action.payload._id ? action.payload : blog))
        .sort((prev, current) => current.likes - prev.likes);
    },
  },
});

const initializeBlogs = (token) => {
  return async (dispatch) => {
    const blogs = await blogService.getAll(token);
    blogs.sort((prev, current) => current.likes - prev.likes);
    dispatch(setBlogs(blogs));
  };
};

const createBlog = (token, blog) => {
  return async (dispatch) => {
    blogService
      .createBlog(token, blog)
      .then((response) => {
        dispatch(appendBlog(response));
        dispatch(setNotification({ message: 'New blog added: ' + response.title, type: 'success' }, 10));
      })
      .catch((data) =>
        dispatch(setNotification({ message: `Error creating blog ${blog.title}` + data, type: 'error' }, 5))
      );
  };
};

const likeBlog = (token, id) => {
  return async (dispatch) => {
    blogService.getByID(token, id).then((blog) => {
      const newBlog = {
        ...blog,
        likes: blog.likes + 1,
      };
      blogService
        .updateBlog(token, newBlog, id)
        .then(() => {
          dispatch(addLike(id));
          dispatch(setNotification({ message: 'You liked ' + newBlog.title, type: 'success' }, 10));
        })
        .catch((data) =>
          dispatch(setNotification({ message: `Error updating blog ${blog.title}` + data, type: 'error' }, 5))
        );
    });
  };
};

const eraseBlog = (token, id, blogname) => {
  return async (dispatch) => {
    blogService
      .deleteBlog(token, id)
      .then((response) => {
        dispatch(removeBlog(id));
        dispatch(setNotification({ message: `${blogname} deleted`, type: 'success' }, 10));
      })
      .catch((data) => dispatch(setNotification({ message: `Error deleting blog ` + data, type: 'error' }, 5)));
  };
};

const createComment = (token, id, comment) => {
  return async (dispatch) => {
    blogService
      .addComment(token, comment, id)
      .then((response) => {
        dispatch(replaceBlog(response));
        dispatch(setNotification({ message: 'New comment added', type: 'success' }, 10));
      })
      .catch((data) =>
        dispatch(setNotification({ message: `Error adding comment` + data, type: 'error' }, 5))
      );
  };
};

export const { addLike, addBlog, appendBlog, setBlogs, removeBlog, replaceBlog } = blogSlice.actions;
export { getId, initializeBlogs, createBlog, likeBlog, eraseBlog, createComment };
export default blogSlice.reducer;
