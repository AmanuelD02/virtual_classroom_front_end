import axios from 'axios';
const token = localStorage.getItem('REACT_TOKEN_AUTH') || '';

const instance = axios.create({
	baseURL: 'http://localhost:51044/api',
	headers: {
		Accept: 'application/json',
		Authorization: `Bearer ${token}`
	}
});

export default instance;
