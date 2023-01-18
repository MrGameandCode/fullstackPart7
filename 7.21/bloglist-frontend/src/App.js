import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { initializeBlogs, createBlog, eraseBlog } from './reducers/blogReducer';
import { loginUser, logoutUser, refreshUser } from './reducers/userReducer';
import Users from './components/Users';
import UserBlogs from './components/UserBlogs';
import BlogList from './components/BlogList';
import BlogDetails from './components/BlogDetails';

const App = () => {
  const blogs = useSelector((state) => state.blogs);
  const message = useSelector((state) => state.notification);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const user = useSelector((state) => state.loggeduser);

  const dispatch = useDispatch();

  const marginRight = {
    marginRight: 10,
  };

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
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link to="/blogs" className="navbar-collapse">
          blogs
        </Link>
        <Link to="/users" className="navbar-collapse">
          users
        </Link>
        <span style={marginRight}>{user.name} logged in </span>
        <input type="button" value="logout" onClick={logout} id="logout" className="btn btn-secondary" />
      </nav>
    </div>
  );

  const loginForm = () => (
    <div className="container">
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">username</label>
          <input
            type="text"
            value={username}
            name="Username"
            id="username"
            onChange={({ target }) => setUsername(target.value)}
            className="form-control"
          />
        </div>
        <div>
        <label htmlFor="password">password</label>
          <input
            type="password"
            value={password}
            name="Password"
            id="password"
            onChange={({ target }) => setPassword(target.value)}
            className="form-control"
          />
        </div>
        <button type="submit" id="login" className="btn btn-primary">
          login
        </button>
      </form>
    </div>
  );

  return (
    <Router>
      <div>
        <div className="container-fluid">
          <h2>blogs</h2>
          <Notification message={message}></Notification>
          {user.id === null && loginForm()}
          {user.id !== null && blogsForm()}
        </div>
      </div>
      <div className="container-fluid">
        <Routes>
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserBlogs />} />
          <Route
            path="/"
            element={
              <>
                <BlogList blogs={blogs} deleteBlog={deleteBlog} createNewBlog={createNewBlog}></BlogList>
              </>
            }
          />
          <Route
            path="/blogs"
            element={
              <>
                <BlogList blogs={blogs} deleteBlog={deleteBlog} createNewBlog={createNewBlog}></BlogList>
              </>
            }
          />
          <Route path="/blogs/:id" element={<BlogDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
