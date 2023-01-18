import Togglable from "./Togglable";
import { useRef } from "react";

const Blog = ({ blog, updateLikes, removeBlog }) => {
  const blogRef = useRef();

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const addLike = (blogId) => {
    updateLikes(blogId);
  };

  const deleteBlog = (blogId, blogname) => {
    removeBlog(blogId, blogname);
  };

  const data = window.localStorage.getItem("loggedUser")
    ? window.localStorage.getItem("loggedUser")
    : '{"id":0}';

  return (
    <div style={blogStyle}>
      <div className="blogName">{blog.title}</div>
      <div className="blogAuthor">{blog.author}</div>
      <Togglable buttonLabel="View" ref={blogRef}>
        <div className="blogUrl">{blog.url}</div>
        <div className="blogLikes">
          {blog.likes}
          <button onClick={() => addLike(blog._id)} id="buttonLike">
            Like
          </button>
        </div>
        <div>
          {blog.user.id === JSON.parse(data).id && (
            <button
              onClick={() => deleteBlog(blog._id, blog.title)}
              id="buttonDelete"
            >
              Delete
            </button>
          )}
        </div>
      </Togglable>
    </div>
  );
};

export default Blog;
