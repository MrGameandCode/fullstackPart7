import { Link } from 'react-router-dom';

const Blog = ({ blog, removeBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    paddingBottom: 10,
  };

  const deleteBlog = (blogId, blogname) => {
    removeBlog(blogId, blogname);
  };

  const data = window.localStorage.getItem('loggedUser') ? window.localStorage.getItem('loggedUser') : '{"id":0}';

  return (
    <div style={blogStyle} className="container">
      <div className="blogName">
        <Link to={`/blogs/${blog._id}`}>{blog.title}</Link>
      </div>
      <div>
        {blog.user.id === JSON.parse(data).id && (
          <button onClick={() => deleteBlog(blog._id, blog.title)} className="btn btn-warning">
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default Blog;
