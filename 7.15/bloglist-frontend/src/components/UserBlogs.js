import { useState, useEffect } from 'react';
import userService from '../services/user';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const UserBlogs = () => {
  const [user, setUser] = useState('');
  const loggedUser = useSelector((state) => state.loggeduser);

  const id = useParams().id;

  const getUsers = async () => {
    const data = await userService.getAll(JSON.parse(window.localStorage.getItem('loggedUser')).token);
    if (data.filter((user) => user.id === id).length !== 0) {
      setUser(data.filter((user) => user.id === id)[0]);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  if (user.length === 0) {
    return null;
  }

  if (!loggedUser.id) {
    return null;
  }

  return (
    <div>
      <h1>{user.username}</h1>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog._id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};
export default UserBlogs;
