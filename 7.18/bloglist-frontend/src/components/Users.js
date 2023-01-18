import { useState, useEffect } from 'react';
import userService from '../services/user';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Users = () => {
  const [users, setUsers] = useState([]);
  const user = useSelector((state) => state.loggeduser);

  const getUsers = async () => {
    if (window.localStorage.getItem('loggedUser')) {
      const data = await userService.getAll(JSON.parse(window.localStorage.getItem('loggedUser')).token);
      setUsers(data);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  if (users.length === 0) {
    return null;
  }

  if (!user.id) {
    return null;
  }

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <td>&nbsp;</td>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.username}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
