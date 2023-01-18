import axios from 'axios';
const baseUrl = '/api/users';

const getAll = async (credentials) => {
  const response = await axios.get(baseUrl, credentials);
  return response.data;
};

export default { getAll };
