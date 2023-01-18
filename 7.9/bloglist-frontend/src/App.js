import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Togglable from "./components/Togglable";
import BlogsForm from "./components/BlogsForm";
import "./App.css";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [message, setMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const blogFormRef = useRef();

  useEffect(() => {
    if (user !== null) {
      blogService.getAll(user.token).then((blogs) => {
        blogs.sort((prev, current) => current.likes - prev.likes);
        setBlogs(blogs);
      });
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
      setErrorMessage("Wrong username or password");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const logout = () => {
    window.localStorage.removeItem("loggedUser");
    setUser(null);
  };

  const createNewBlog = async (blog) => {
    const response = await blogService.createBlog(user.token, blog);
    if (response.title) {
      setMessage(`${response.title} by ${response.author} added`);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
      console.log(response);
      blogFormRef.current.toggleVisibility();
      blogService.getAll(user.token).then((blogs) => setBlogs(blogs));
    } else {
      setErrorMessage(`Error creating blog ${blog.title}`);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const updateBlogLikes = async (blogId) => {
    const blog = await blogService.getByID(user.token, blogId);
    console.log(blog);
    const newBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user,
    };
    const response = await blogService.updateBlog(user.token, newBlog, blogId);
    if (response.title) {
      setMessage(`${response.title} by ${response.author} updated`);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
      console.log(response);
      blogFormRef.current.toggleVisibility();
      blogService.getAll(user.token).then((blogs) => setBlogs(blogs));
    } else {
      setErrorMessage(`Error updating blog ${blog.title}`);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const deleteBlog = async (blogId, blogname) => {
    if (window.confirm(`Are you sure you want to delete ${blogname}?`)) {
      const response = await blogService.deleteBlog(user.token, blogId);
      console.log(response);
      if (response === 204) {
        setMessage(`${blogname} deleted`);
        setTimeout(() => {
          setMessage(null);
        }, 5000);
        console.log(response);
        blogFormRef.current.toggleVisibility();
        blogService.getAll(user.token).then((blogs) => setBlogs(blogs));
      } else {
        setErrorMessage(`Error deleting blog ${blogname}`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      }
    }
  };

  const Notification = ({ message }) => {
    if (!message) {
      return null;
    }
    return <div className="success">{message}</div>;
  };

  const ErrorNotification = ({ message }) => {
    if (!message) {
      return null;
    }
    return <div className="error">{message}</div>;
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
      <ErrorNotification message={errorMessage}></ErrorNotification>
      {user === null && loginForm()}
      {user !== null && blogsForm()}
    </div>
  );
};

export default App;
