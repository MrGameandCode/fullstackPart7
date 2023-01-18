import Blog from './Blog';
import Togglable from '../components/Togglable';
import BlogsForm from '../components/BlogsForm';
import { useRef } from 'react';

import { useSelector } from 'react-redux';

const BlogList = ({ blogs, deleteBlog, createNewBlog }) => {
  const blogFormRef = useRef();

  const user = useSelector((state) => state.loggeduser);

  if (user.id === null) {
    return null;
  }

  return (
    <>
      <div className='container'>
      <h2>Blogs</h2>
      </div>
      <Togglable buttonLabel="Create Blog" ref={blogFormRef} idShow="displayForm" idCancel="hideForm">
        <BlogsForm onSubmit={createNewBlog}></BlogsForm>
      </Togglable>
      {blogs.map((blog) => (
        <Blog key={blog._id} blog={blog} removeBlog={deleteBlog} />
      ))}
    </>
  );
};

export default BlogList;
