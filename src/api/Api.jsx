import axios from 'axios';
const token = JSON.parse(localStorage.getItem('access_token'))

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Backend server address
  headers: {
    'Authorization': `Bearer ${token}`, 
  },
});

export default api;
