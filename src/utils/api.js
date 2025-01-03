// frontend/utils/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000', // Update if your backend is deployed
});

export default api;

