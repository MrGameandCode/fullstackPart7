import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { likeBlog } from '../reducers/blogReducer';

const BlogDetails = () => {
  const id = useParams().id;
  const blog = useSelector((state) => state.blogs.find((n) => n._id === id));
  const dispatch = useDispatch();
  const user = useSelector((state) => state.loggeduser);

  const addLike = (blogId) => {
    dispatch(likeBlog(JSON.parse(window.localStorage.getItem('loggedUser')).token, blogId));
  };

  if (!user.id) {
    return null;
  }

  if (blog !== undefined) {
    return (
      <div>
        <h1>{blog.title}</h1>
        <div>
          <a href={blog.url}>{blog.url}</a>
        </div>
        <div>
          {blog.likes} likes
          <button onClick={() => addLike(blog._id)} id="buttonLike">
            Like
          </button>
        </div>
        <div>Added by {blog.user.username}</div>
      </div>
    );
  }
};

export default BlogDetails;
