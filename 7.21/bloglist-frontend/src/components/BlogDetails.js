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

  const marginRight = {
    marginRight: 5,
  };

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
      <div className="container">
        <div className="card">
          <div className="card-header">{blog.title}</div>
          <div className="card-body">
            <div>
              <a href={blog.url}>{blog.url}</a>
            </div>
            <div>
              <span style={marginRight}>{blog.likes} likes</span>
              <button onClick={() => addLike(blog._id)} id="buttonLike" className="btn btn-success">
                Like
              </button>
            </div>
            <div>Added by {blog.user.username}</div>
          </div>
        </div>
        <h2> comments </h2>
        <form onSubmit={submitComment}>
          <input type="text" value={comment} name="comment" onChange={({ target }) => setComment(target.value)} />
          <button type="submit" id="createComment" className="btn btn-primary">
            add comment
          </button>
        </form>
        <div className="container-fluid">
          <ul className="list-group list-group-flush">
            {blog.comments.map((comment) => (
              <li key={comment._id} className="list-group-item">
                {' '}
                {comment.comment}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
};

export default BlogDetails;
