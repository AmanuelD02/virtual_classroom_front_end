import axios from 'axios';
const token = localStorage.getItem('REACT_TOKEN_AUTH') || '';
const baseUrl = process.env.REACT_APP_BASE_URL;
console.log(baseUrl);
const instance = axios.create({
	baseURL: baseUrl,
	headers: {
		Accept: 'application/json',
		Authorization: `Bearer ${token}`
	}
});

export default instance;