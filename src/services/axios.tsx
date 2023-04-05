import axios, { AxiosInstance } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
    // Axios instance configuration options
  baseURL: 'https://api-b4school.shreekakajimasale.com/api'
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Do something with request error
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        // Do something with response data
        return response;
    },
    (error) => {
        if (error.response) {
            // The request was made and the server responded with a status code
            if (error.response.status === 401) {
                // Handle 401 status code
                // For example, redirect to the login page
                window.location.href = '/login';
            } else if (error.response.status === 500) {
                // Handle 500 status code
                // For example, show an error message
                console.error('Server error:', error);
                // Show an error message to the user
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response from server:', error.request);
            // Show an error message to the user
            //   jughk
        } else {
            // Something else happened in setting up the request that triggered an error
            console.error('Request error:', error.message);
            // Show an error message to the user
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
