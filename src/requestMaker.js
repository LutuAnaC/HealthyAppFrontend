import axios from 'axios';

const axiosRequestMaker = axios.create();

axiosRequestMaker.interceptors.response.use( (respnse) => {
    if (respnse.data.httpStatusCode === 401 || respnse.data.httpStatusCode === 403) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(
            new Error('You are not authorized to access this resource')
        );
    }
    return respnse;
})

export default axiosRequestMaker;