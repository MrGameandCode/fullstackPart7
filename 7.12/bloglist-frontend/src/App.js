import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Blog from "./components/Blog";
import loginService from "./services/login";
import Togglable from "./components/Togglable";
import BlogsForm from "./components/BlogsForm";
import "./App.css";
import { setNotification } from "./reducers/notificationReducer";
import { initializeBlogs, createBlog, likeBlog, eraseBlog } from "./reducers/blogReducer";

const App = () => {
  //const [blogs, setBlogs] = useState([]);
  const blogs = useSelector((state) => state.blogs);
  const message = useSelector((state) => state.notification);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const blogFormRef = useRef();

  const dispatch = useDispatch();

  useEffect(() => {
    if (user !== null) {
      dispatch(initializeBlogs(user.token))
    }
  }, [user]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      dispatch(
        setNotification(
          { message: `Wrong username or password`, type: "error" },
          5
        )
      );
    }
  };

  const logout = () => {
    window.localStorage.removeItem("loggedUser");
    setUser(null);
  };

  const createNewBlog = async (blog) => {
      dispatch(createBlog(user.token, blog))
  };

  const updateBlogLikes = async (blogId) => {
      dispatch(likeBlog(user.token, blogId))
  };

  const deleteBlog = async (blogId, blogname) => {
    if (window.confirm(`Are you sure you want to delete ${blogname}?`)) {
        dispatch(eraseBlog(user.token, blogId, blogname))
    }
  };

  const Notification = ({ message }) => {
    if (!message.message) {
      return null;
    }
    if (message.type === "success") {
      return <div className="success">{message.message}</div>;
    } else {
      return <div className="error">{message.message}</div>;
    }
  };

  const blogsForm = () => (
    <div>
      <p>
        {user.name} logged in{" "}
        <input type="button" value="logout" onClick={logout} id="logout" />
      </p>
      <Togglable buttonLabel="Create Blog" ref={blogFormRef}>
        <BlogsForm onSubmit={createNewBlog}></BlogsForm>
      </Togglable>
      {blogs.map((blog) => (
        <Blog
          key={blog._id}
          blog={blog}
          updateLikes={updateBlogLikes}
          removeBlog={deleteBlog}
        />
      ))}
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
    <div>
      <h2>blogs</h2>
      <Notification message={message}></Notification>
      {user === null && loginForm()}
      {user !== null && blogsForm()}
    </div>
  );
};

export default App;
