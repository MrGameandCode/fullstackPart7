import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { likeBlog, createComment } from '../reducers/blogReducer';
import { useState } from 'react';

const BlogDetails = () => {
  const id = useParams().id;
  const blog = useSelector((state) => state.blogs.find((n) => n._id === id));
  const dispatch = useDispatch();
  const [comment, setComment] = useState('');
  const user = useSelector((state) => state.loggeduser);

  const addLike = (blogId) => {
    dispatch(likeBlog(JSON.parse(window.localStorage.getItem('loggedUser')).token, blogId));
  };

  const submitComment = async (event) => {
    event.preventDefault();
    dispatch(createComment(JSON.parse(window.localStorage.getItem('loggedUser')).token, id, comment));
    setComment('');
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
        <h2> comments </h2>
        <form onSubmit={submitComment}>
          <input type="text" value={comment} name="comment" onChange={({ target }) => setComment(target.value)} />
          <button type="submit" id="createComment">
            add comment
          </button>
        </form>
        <ul>
          {blog.comments.map((comment) => (
            <li key={comment._id}> {comment.comment}</li>
          ))}
        </ul>
      </div>
    );
  }
};

export default BlogDetails;
