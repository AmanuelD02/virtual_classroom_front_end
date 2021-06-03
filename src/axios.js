import axios from 'axios';
const token = localStorage.getItem('REACT_TOKEN_AUTH') || '';
const baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:51044/api';
const instance = axios.create({
	baseURL: baseUrl,
	headers: {
		Accept: 'application/json',
		Authorization: `Bearer ${token}`
	}
});

export default instance;
