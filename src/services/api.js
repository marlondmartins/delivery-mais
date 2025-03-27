import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8082'   //   <<---- MUDE AQUI PARA A SUA API... 
});

api.interceptors.request.use(req => {
    if (localStorage.getItem('sessionToken')) {
        req.headers.Authorization = `Bearer ${localStorage.getItem('sessionToken')}`;
    }

    return req;
},
(err) => {
    console.log(err);
});


api.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response.status === 401) {
        localStorage.removeItem('sessionToken');
        document.location = '/login';
    }
    return error;
});




export default api;