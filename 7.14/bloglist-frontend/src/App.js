import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Blog from './components/Blog';
import Togglable from './components/Togglable';
import BlogsForm from './components/BlogsForm';
import './App.css';
import { initializeBlogs, createBlog, likeBlog, eraseBlog } from './reducers/blogReducer';
import { loginUser, logoutUser, refreshUser } from './reducers/userReducer';
import Users from './components/Users';

const App = () => {
  const blogs = useSelector((state) => state.blogs);
  const message = useSelector((state) => state.notification);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const user = useSelector((state) => state.loggeduser);

  const blogFormRef = useRef();

  const dispatch = useDispatch();

  useEffect(() => {
    if (user.id !== null) {
      dispatch(initializeBlogs(user.token));
      setUsername('');
      setPassword('');
    } else {
      const loggedUserJSON = window.localStorage.getItem('loggedUser');
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON);
        dispatch(refreshUser(user));
      }
    }
  }, [user]);

  const handleLogin = async (event) => {
    event.preventDefault();
    dispatch(loginUser(username, password));
  };

  const logout = () => {
    dispatch(logoutUser());
  };

  const createNewBlog = async (blog) => {
    dispatch(createBlog(user.token, blog));
  };

  const updateBlogLikes = async (blogId) => {
    dispatch(likeBlog(user.token, blogId));
  };

  const deleteBlog = async (blogId, blogname) => {
    if (window.confirm(`Are you sure you want to delete ${blogname}?`)) {
      dispatch(eraseBlog(user.token, blogId, blogname));
    }
  };

  const Notification = ({ message }) => {
    if (!message.message) {
      return null;
    }
    if (message.type === 'success') {
      return <div className="success">{message.message}</div>;
    } else {
      return <div className="error">{message.message}</div>;
    }
  };

  const blogsForm = () => (
    <div>
      <p>
        {user.name} logged in <input type="button" value="logout" onClick={logout} id="logout" />
      </p>
      <Togglable buttonLabel="Create Blog" ref={blogFormRef}>
        <BlogsForm onSubmit={createNewBlog}></BlogsForm>
      </Togglable>
      <Routes>
        <Route path="/users" element={<Users />} />
        <Route
          path="/"
          element={blogs.map((blog) => (
            <Blog key={blog._id} blog={blog} updateLikes={updateBlogLikes} removeBlog={deleteBlog} />
          ))}
        />
      </Routes>
    </div>
  );

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          id="username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          id="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit" id="login">
        login
      </button>
    </form>
  );

  return (
    <Router>
      <div>
        <h2>blogs</h2>
        <Notification message={message}></Notification>
        {user.id === null && loginForm()}
        {user.id !== null && blogsForm()}
      </div>
    </Router>
  );
};

export default App;
